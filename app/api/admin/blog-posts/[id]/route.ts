import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// GET - Get single blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select(`
        *,
        author:authors(*)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching blog post:', error)
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      )
    }

    return NextResponse.json({ post: data })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()

    const {
      title,
      slug,
      excerpt,
      content,
      author_id,
      category,
      featured_image,
      is_featured,
      is_published,
      published_at,
      read_time,
      seo_title,
      seo_description,
      faq_schema,
      custom_schema,
      callouts
    } = body

    // Get current post to check if it's being published for the first time
    const { data: currentPost } = await supabaseAdmin
      .from('blog_posts')
      .select('is_published, published_at')
      .eq('id', params.id)
      .single()

    // Set published_at if publishing for the first time
    let finalPublishedAt = published_at
    if (is_published && currentPost && !currentPost.is_published && !currentPost.published_at) {
      finalPublishedAt = new Date().toISOString()
    }

    // Check if slug already exists (excluding current post)
    if (slug) {
      const { data: existing } = await supabaseAdmin
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .neq('id', params.id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'A blog post with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (content !== undefined) updateData.content = content
    if (author_id !== undefined) updateData.author_id = author_id
    if (category !== undefined) updateData.category = category
    if (featured_image !== undefined) updateData.featured_image = featured_image
    if (is_featured !== undefined) updateData.is_featured = is_featured
    if (is_published !== undefined) updateData.is_published = is_published
    if (finalPublishedAt !== undefined) updateData.published_at = finalPublishedAt
    if (read_time !== undefined) updateData.read_time = read_time
    if (seo_title !== undefined) updateData.seo_title = seo_title
    if (seo_description !== undefined) updateData.seo_description = seo_description
    if (faq_schema !== undefined) updateData.faq_schema = faq_schema
    if (custom_schema !== undefined) updateData.custom_schema = custom_schema
    if (callouts !== undefined) updateData.callouts = callouts

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        author:authors(*)
      `)
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ post: data })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
