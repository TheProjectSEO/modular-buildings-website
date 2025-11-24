import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint updates page slugs to include their parent path prefix
// Call: POST /api/admin/update-slugs

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with schema
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: 'Modular-buildings.co' } }
    )

    // Fetch all pages with parent_slug
    const { data: pages, error: fetchError } = await supabase
      .from('pages')
      .select('id, title, slug, parent_slug')
      .not('parent_slug', 'is', null)
      .order('slug')

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!pages || pages.length === 0) {
      return NextResponse.json({ message: 'No pages with parent_slug found', updated: 0 })
    }

    const updates: { id: string; title: string; oldSlug: string; newSlug: string; success: boolean; error?: string }[] = []

    for (const page of pages) {
      // Skip if already has full path
      if (page.slug.includes('/')) {
        updates.push({
          id: page.id,
          title: page.title,
          oldSlug: page.slug,
          newSlug: page.slug,
          success: true,
          error: 'Already has path - skipped'
        })
        continue
      }

      // Build new slug with parent prefix
      const newSlug = `${page.parent_slug}/${page.slug}`

      // Update the page
      const { error: updateError } = await supabase
        .from('pages')
        .update({ slug: newSlug, updated_at: new Date().toISOString() })
        .eq('id', page.id)

      updates.push({
        id: page.id,
        title: page.title,
        oldSlug: page.slug,
        newSlug: newSlug,
        success: !updateError,
        error: updateError?.message
      })
    }

    const successCount = updates.filter(u => u.success && !u.error?.includes('skipped')).length
    const skippedCount = updates.filter(u => u.error?.includes('skipped')).length
    const errorCount = updates.filter(u => !u.success).length

    return NextResponse.json({
      message: 'Slug update completed',
      summary: {
        total: updates.length,
        updated: successCount,
        skipped: skippedCount,
        errors: errorCount
      },
      updates
    })

  } catch (error) {
    console.error('Error updating slugs:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to update page slugs',
    description: 'Updates slugs to include parent path prefix (e.g., texas -> location/texas)'
  })
}
