/**
 * TF-IDF Engine for Internal Linking
 *
 * Implements TF-IDF (Term Frequency-Inverse Document Frequency) algorithm
 * for calculating content similarity using cosine similarity of document vectors.
 *
 * Based on WordPress Semantic Internal Linking plugin architecture.
 */

import { supabaseAdmin } from '@/lib/supabase'
import { ContentProcessor, ProcessedContent } from './content-processor'

export interface SimilarityResult {
  contentId: string
  url: string
  title: string
  similarityScore: number
}

export interface IndexStats {
  totalDocuments: number
  totalTerms: number
  processedDocuments: number
  pendingDocuments: number
  averageWordCount: number
}

export class TfIdfEngine {
  private processor: ContentProcessor
  private batchSize: number

  constructor(batchSize: number = 10) {
    this.processor = new ContentProcessor()
    this.batchSize = batchSize
  }

  /**
   * Start indexing process for all pages
   */
  async startIndexing(): Promise<{ success: boolean; message: string }> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    try {
      // Fetch all published pages
      const { data: pages, error: fetchError } = await supabaseAdmin
        .from('pages')
        .select('id, slug, title, meta_title, meta_description, content')
        .eq('status', 'published')

      if (fetchError) throw fetchError

      if (!pages || pages.length === 0) {
        return { success: true, message: 'No pages to index' }
      }

      // Process each page and insert into internal_linking_content
      let indexed = 0
      let errors = 0

      for (const page of pages) {
        try {
          const processed = this.processor.processPageContent(page)

          const urlHash = this.hashUrl(processed.url)

          // Insert or update content record
          const { error: insertError } = await supabaseAdmin
            .from('internal_linking_content')
            .upsert({
              page_id: processed.pageId,
              url: processed.url,
              url_hash: urlHash,
              title: processed.title,
              content_hash: processed.contentHash,
              word_count: processed.wordCount,
              status: 'pending',
            }, {
              onConflict: 'url_hash'
            })

          if (insertError) {
            console.error(`Error indexing page ${page.slug}:`, insertError)
            errors++
          } else {
            indexed++
          }
        } catch (error) {
          console.error(`Error processing page ${page.slug}:`, error)
          errors++
        }
      }

      return {
        success: true,
        message: `Indexed ${indexed} pages (${errors} errors)`
      }
    } catch (error: any) {
      console.error('Error starting indexing:', error)
      return {
        success: false,
        message: error.message
      }
    }
  }

  /**
   * Process pending content in batches
   */
  async processBatch(): Promise<{ success: boolean; processed: number; remaining: number }> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    try {
      // Get pending content
      const { data: pendingContent, error: fetchError } = await supabaseAdmin
        .from('internal_linking_content')
        .select('*')
        .eq('status', 'pending')
        .limit(this.batchSize)

      if (fetchError) throw fetchError

      if (!pendingContent || pendingContent.length === 0) {
        return { success: true, processed: 0, remaining: 0 }
      }

      // Process each content item
      for (const content of pendingContent) {
        try {
          // Get page data to re-process tokens
          const { data: page, error: pageError } = await supabaseAdmin
            .from('pages')
            .select('id, slug, title, meta_title, meta_description, content')
            .eq('id', content.page_id)
            .single()

          if (pageError || !page) {
            console.error(`Page not found for content ${content.id}`)
            continue
          }

          const processed = this.processor.processPageContent(page)

          // Calculate TF-IDF scores for this document
          await this.calculateTfIdfForContent(content.id, processed.tokens)

          // Mark as indexed
          await supabaseAdmin
            .from('internal_linking_content')
            .update({
              status: 'indexed',
              processed_at: new Date().toISOString()
            })
            .eq('id', content.id)

        } catch (error) {
          console.error(`Error processing content ${content.id}:`, error)

          // Mark as error
          await supabaseAdmin
            .from('internal_linking_content')
            .update({
              status: 'error',
              processed_at: new Date().toISOString()
            })
            .eq('id', content.id)
        }
      }

      // Count remaining pending
      const { count: remainingCount } = await supabaseAdmin
        .from('internal_linking_content')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      return {
        success: true,
        processed: pendingContent.length,
        remaining: remainingCount || 0
      }
    } catch (error: any) {
      console.error('Error processing batch:', error)
      throw error
    }
  }

  /**
   * Calculate TF-IDF scores for a document
   */
  private async calculateTfIdfForContent(
    contentId: string,
    tokens: string[]
  ): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    // Calculate term frequencies
    const termFrequencies = this.processor.calculateTermFrequencies(tokens)

    // Get or create terms in the terms table
    const termIds = new Map<string, number>()

    for (const term of termFrequencies.keys()) {
      // Insert or get term
      const { data: existingTerm, error: selectError } = await supabaseAdmin
        .from('internal_linking_terms')
        .select('id')
        .eq('term', term)
        .single()

      if (existingTerm) {
        termIds.set(term, existingTerm.id)
      } else {
        const { data: newTerm, error: insertError } = await supabaseAdmin
          .from('internal_linking_terms')
          .insert({ term, document_frequency: 0, idf_score: 0 })
          .select('id')
          .single()

        if (newTerm) {
          termIds.set(term, newTerm.id)
        } else {
          console.error(`Error creating term ${term}:`, insertError)
        }
      }
    }

    // Get total document count
    const { count: totalDocs } = await supabaseAdmin
      .from('internal_linking_content')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'indexed')

    const totalDocuments = (totalDocs || 0) + 1 // +1 for current document

    // Calculate TF-IDF scores and insert
    const tfidfRecords = []
    let vectorNorm = 0

    for (const [term, tf] of termFrequencies.entries()) {
      const termId = termIds.get(term)
      if (!termId) continue

      // Get document frequency for this term
      const { count: docFreq } = await supabaseAdmin
        .from('internal_linking_tfidf')
        .select('content_id', { count: 'exact', head: true })
        .eq('term_id', termId)

      const documentFrequency = (docFreq || 0) + 1

      // Calculate IDF: log(total_docs / docs_with_term)
      const idf = Math.log(totalDocuments / documentFrequency)

      // Calculate TF-IDF
      const tfidfScore = tf * idf

      // Add to vector norm calculation
      vectorNorm += tfidfScore * tfidfScore

      tfidfRecords.push({
        content_id: contentId,
        term_id: termId,
        tfidf_score: tfidfScore
      })

      // Update term's document frequency and IDF
      await supabaseAdmin
        .from('internal_linking_terms')
        .update({
          document_frequency: documentFrequency,
          idf_score: idf
        })
        .eq('id', termId)
    }

    // Insert TF-IDF records
    if (tfidfRecords.length > 0) {
      await supabaseAdmin
        .from('internal_linking_tfidf')
        .upsert(tfidfRecords, {
          onConflict: 'content_id,term_id'
        })
    }

    // Calculate and store vector norm (L2 norm)
    vectorNorm = Math.sqrt(vectorNorm)

    await supabaseAdmin
      .from('internal_linking_content')
      .update({ vector_norm: vectorNorm })
      .eq('id', contentId)
  }

  /**
   * Recalculate IDF scores for all terms
   */
  async recalculateIdf(): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    // Get total document count
    const { count: totalDocs } = await supabaseAdmin
      .from('internal_linking_content')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'indexed')

    const totalDocuments = totalDocs || 0

    if (totalDocuments === 0) return

    // Get all terms
    const { data: terms, error: termsError } = await supabaseAdmin
      .from('internal_linking_terms')
      .select('id, term')

    if (termsError || !terms) return

    // Update IDF for each term
    for (const term of terms) {
      // Count documents containing this term
      const { count: docFreq } = await supabaseAdmin
        .from('internal_linking_tfidf')
        .select('content_id', { count: 'exact', head: true })
        .eq('term_id', term.id)

      const documentFrequency = docFreq || 0

      if (documentFrequency === 0) continue

      // Calculate IDF
      const idf = Math.log(totalDocuments / documentFrequency)

      // Update term
      await supabaseAdmin
        .from('internal_linking_terms')
        .update({
          document_frequency: documentFrequency,
          idf_score: idf
        })
        .eq('id', term.id)
    }
  }

  /**
   * Calculate similarity between all content pairs
   */
  async calculateAllSimilarities(): Promise<{ success: boolean; calculated: number }> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    try {
      // Get all indexed content
      const { data: allContent, error: contentError } = await supabaseAdmin
        .from('internal_linking_content')
        .select('id, url, title, vector_norm')
        .eq('status', 'indexed')

      if (contentError || !allContent || allContent.length === 0) {
        return { success: true, calculated: 0 }
      }

      let calculated = 0

      // Calculate similarity for each pair
      for (let i = 0; i < allContent.length; i++) {
        for (let j = i + 1; j < allContent.length; j++) {
          const contentA = allContent[i]
          const contentB = allContent[j]

          try {
            const similarity = await this.calculateCosineSimilarity(
              contentA.id,
              contentB.id,
              contentA.vector_norm,
              contentB.vector_norm
            )

            if (similarity > 0) {
              // Store similarity (store both directions for easier querying)
              await supabaseAdmin
                .from('internal_linking_similarity')
                .upsert([
                  {
                    content_id_a: contentA.id,
                    content_id_b: contentB.id,
                    similarity_score: similarity
                  },
                  {
                    content_id_a: contentB.id,
                    content_id_b: contentA.id,
                    similarity_score: similarity
                  }
                ], {
                  onConflict: 'content_id_a,content_id_b'
                })

              calculated++
            }
          } catch (error) {
            console.error(`Error calculating similarity between ${contentA.id} and ${contentB.id}:`, error)
          }
        }
      }

      return { success: true, calculated }
    } catch (error: any) {
      console.error('Error calculating similarities:', error)
      return { success: false, calculated: 0 }
    }
  }

  /**
   * Calculate cosine similarity between two documents
   */
  private async calculateCosineSimilarity(
    contentIdA: string,
    contentIdB: string,
    normA: number,
    normB: number
  ): Promise<number> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    // If either norm is 0, similarity is 0
    if (normA === 0 || normB === 0) return 0

    // Get TF-IDF vectors for both documents
    const { data: vectorA, error: errorA } = await supabaseAdmin
      .from('internal_linking_tfidf')
      .select('term_id, tfidf_score')
      .eq('content_id', contentIdA)

    const { data: vectorB, error: errorB } = await supabaseAdmin
      .from('internal_linking_tfidf')
      .select('term_id, tfidf_score')
      .eq('content_id', contentIdB)

    if (errorA || errorB || !vectorA || !vectorB) {
      return 0
    }

    // Create maps for efficient lookup
    const mapA = new Map(vectorA.map(v => [v.term_id, v.tfidf_score]))
    const mapB = new Map(vectorB.map(v => [v.term_id, v.tfidf_score]))

    // Calculate dot product
    let dotProduct = 0

    for (const [termId, scoreA] of mapA.entries()) {
      const scoreB = mapB.get(termId)
      if (scoreB !== undefined) {
        dotProduct += scoreA * scoreB
      }
    }

    // Calculate cosine similarity
    const similarity = dotProduct / (normA * normB)

    return Math.max(0, Math.min(1, similarity)) // Clamp between 0 and 1
  }

  /**
   * Get similar content for a given page
   */
  async getSimilarContent(
    pageId: string,
    limit: number = 5,
    minSimilarity: number = 0.3
  ): Promise<SimilarityResult[]> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    try {
      // Get content record for this page
      const { data: content, error: contentError } = await supabaseAdmin
        .from('internal_linking_content')
        .select('id')
        .eq('page_id', pageId)
        .eq('status', 'indexed')
        .single()

      if (contentError || !content) {
        return []
      }

      // Get similar content
      const { data: similarities, error: simError } = await supabaseAdmin
        .from('internal_linking_similarity')
        .select(`
          similarity_score,
          content:internal_linking_content!internal_linking_similarity_content_id_b_fkey(
            id,
            url,
            title,
            page_id
          )
        `)
        .eq('content_id_a', content.id)
        .gte('similarity_score', minSimilarity)
        .order('similarity_score', { ascending: false })
        .limit(limit)

      if (simError || !similarities) {
        return []
      }

      // Format results
      const results: SimilarityResult[] = similarities
        .filter((s: any) => s.content)
        .map((s: any) => ({
          contentId: s.content.id,
          url: s.content.url,
          title: s.content.title,
          similarityScore: s.similarity_score
        }))

      return results
    } catch (error) {
      console.error('Error getting similar content:', error)
      return []
    }
  }

  /**
   * Get indexing statistics
   */
  async getIndexStats(): Promise<IndexStats> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    try {
      // Get total documents
      const { count: totalDocs } = await supabaseAdmin
        .from('internal_linking_content')
        .select('*', { count: 'exact', head: true })

      // Get processed documents
      const { count: processedDocs } = await supabaseAdmin
        .from('internal_linking_content')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'indexed')

      // Get pending documents
      const { count: pendingDocs } = await supabaseAdmin
        .from('internal_linking_content')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Get total terms
      const { count: totalTerms } = await supabaseAdmin
        .from('internal_linking_terms')
        .select('*', { count: 'exact', head: true })

      // Get average word count
      const { data: avgData } = await supabaseAdmin
        .from('internal_linking_content')
        .select('word_count')
        .eq('status', 'indexed')

      const averageWordCount = avgData && avgData.length > 0
        ? avgData.reduce((sum, d) => sum + d.word_count, 0) / avgData.length
        : 0

      return {
        totalDocuments: totalDocs || 0,
        totalTerms: totalTerms || 0,
        processedDocuments: processedDocs || 0,
        pendingDocuments: pendingDocs || 0,
        averageWordCount: Math.round(averageWordCount)
      }
    } catch (error) {
      console.error('Error getting index stats:', error)
      return {
        totalDocuments: 0,
        totalTerms: 0,
        processedDocuments: 0,
        pendingDocuments: 0,
        averageWordCount: 0
      }
    }
  }

  /**
   * Hash URL for unique identification
   */
  private hashUrl(url: string): string {
    let hash = 0
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }

  /**
   * Clear all indexed content and start fresh
   */
  async clearIndex(): Promise<{ success: boolean; message: string }> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    try {
      // Delete in correct order due to foreign key constraints
      await supabaseAdmin.from('internal_linking_similarity').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabaseAdmin.from('internal_linking_tfidf').delete().neq('id', 0)
      await supabaseAdmin.from('internal_linking_content').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabaseAdmin.from('internal_linking_terms').delete().neq('id', 0)

      return {
        success: true,
        message: 'Index cleared successfully'
      }
    } catch (error: any) {
      console.error('Error clearing index:', error)
      return {
        success: false,
        message: error.message
      }
    }
  }
}
