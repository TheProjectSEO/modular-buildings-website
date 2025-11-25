/**
 * Content Processor for Internal Linking
 *
 * Handles text extraction, tokenization, and preprocessing
 * for TF-IDF-based content similarity calculation.
 */

// English stopwords list
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
  'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it',
  'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t',
  'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some',
  'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were',
  'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
  'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would',
  'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours',
  'yourself', 'yourselves',
  // Additional common words
  'also', 'just', 'like', 'now', 'get', 'got', 'can', 'will', 'make', 'made',
  'one', 'two', 'first', 'new', 'way', 'may', 'well', 'back', 'even', 'want',
  'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave',
  'call', 'keep', 'let', 'begin', 'seem', 'help', 'show', 'hear', 'play', 'run',
  'move', 'live', 'believe', 'hold', 'bring', 'happen', 'write', 'provide', 'sit',
  'stand', 'lose', 'pay', 'meet', 'include', 'continue', 'set', 'learn', 'change',
  'lead', 'understand', 'watch', 'follow', 'stop', 'create', 'speak', 'read',
  'allow', 'add', 'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember',
  'love', 'consider', 'appear', 'buy', 'wait', 'serve', 'die', 'send', 'expect',
  'build', 'stay', 'fall', 'cut', 'reach', 'kill', 'remain', 'click', 'please',
  'website', 'page', 'post', 'article', 'read', 'share', 'comment', 'comments',
])

const MIN_WORD_LENGTH = 3
const MAX_WORD_LENGTH = 50

export interface ProcessedContent {
  url: string
  pageId: string | null
  title: string
  tokens: string[]
  wordCount: number
  contentHash: string
}

export class ContentProcessor {
  /**
   * Process content from a page object
   */
  processPageContent(page: {
    id: string
    slug: string
    title: string
    meta_title?: string
    meta_description?: string
    content?: any
  }): ProcessedContent {
    const parts: string[] = []

    // Add title (weighted more by including multiple times)
    const title = page.meta_title || page.title
    parts.push(title, title)

    // Add meta description
    if (page.meta_description) {
      parts.push(page.meta_description)
    }

    // Add main content
    if (page.content) {
      const contentText = this.extractTextFromContent(page.content)
      parts.push(contentText)
    }

    const combinedText = parts.join(' ')
    const tokens = this.preprocessText(combinedText)
    const contentHash = this.calculateContentHash(combinedText)

    return {
      url: `/${page.slug}`,
      pageId: page.id,
      title,
      tokens,
      wordCount: tokens.length,
      contentHash,
    }
  }

  /**
   * Extract text from content (handles HTML, JSON, or plain text)
   */
  private extractTextFromContent(content: any): string {
    if (typeof content === 'string') {
      return this.stripHtml(content)
    }

    if (typeof content === 'object' && content !== null) {
      // Handle JSON/structured content
      return this.extractTextFromObject(content)
    }

    return ''
  }

  /**
   * Extract text from nested object structures
   */
  private extractTextFromObject(obj: any): string {
    const texts: string[] = []

    const extract = (value: any) => {
      if (typeof value === 'string') {
        texts.push(value)
      } else if (Array.isArray(value)) {
        value.forEach(extract)
      } else if (typeof value === 'object' && value !== null) {
        Object.values(value).forEach(extract)
      }
    }

    extract(obj)
    return texts.join(' ')
  }

  /**
   * Strip HTML tags from text
   */
  private stripHtml(html: string): string {
    // Remove script and style tags
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

    // Remove all HTML tags
    text = text.replace(/<[^>]+>/g, ' ')

    // Decode HTML entities
    text = this.decodeHtmlEntities(text)

    return text
  }

  /**
   * Decode HTML entities
   */
  private decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
    }

    return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity)
  }

  /**
   * Preprocess text into tokens
   */
  preprocessText(text: string): string[] {
    // Convert to lowercase
    text = text.toLowerCase()

    // Decode HTML entities
    text = this.decodeHtmlEntities(text)

    // Remove URLs
    text = text.replace(/https?:\/\/[^\s]+/g, '')

    // Remove email addresses
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')

    // Remove standalone numbers
    text = text.replace(/\b\d+\b/g, '')

    // Remove special characters, keep only letters and spaces
    text = text.replace(/[^a-z\s]/g, ' ')

    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim()

    // Tokenize
    const tokens = text.split(' ')

    // Filter and validate tokens
    const validTokens = tokens
      .filter(token => this.isValidToken(token))
      .filter(token => !STOPWORDS.has(token))

    return validTokens
  }

  /**
   * Check if a token is valid
   */
  private isValidToken(token: string): boolean {
    if (token.length < MIN_WORD_LENGTH) return false
    if (token.length > MAX_WORD_LENGTH) return false
    if (!/[a-z]/.test(token)) return false
    return true
  }

  /**
   * Calculate content hash for change detection
   */
  calculateContentHash(content: string): string {
    // Normalize content before hashing
    const normalized = content.toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()

    // Simple hash function (for Node.js we'd use crypto)
    return this.simpleHash(normalized)
  }

  /**
   * Simple hash function
   */
  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  }

  /**
   * Calculate term frequencies
   */
  calculateTermFrequencies(tokens: string[]): Map<string, number> {
    const frequencies = new Map<string, number>()
    const totalTerms = tokens.length

    tokens.forEach(token => {
      frequencies.set(token, (frequencies.get(token) || 0) + 1)
    })

    // Normalize to term frequency (TF)
    frequencies.forEach((count, term) => {
      frequencies.set(term, count / totalTerms)
    })

    return frequencies
  }

  /**
   * Get top N terms by frequency
   */
  getTopTerms(tokens: string[], limit: number = 100): Map<string, number> {
    const termFrequencies = this.calculateTermFrequencies(tokens)

    // Convert to array and sort by frequency
    const sorted = Array.from(termFrequencies.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)

    return new Map(sorted)
  }
}
