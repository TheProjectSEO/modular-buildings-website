import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all blog posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const isPublished = searchParams.get('is_published')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query = supabaseAdmin
      .from('blog_posts')
      .select(`
        *,
        author:authors(*)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (isPublished !== null) {
      query = query.eq('is_published', isPublished === 'true')
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching blog posts:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      posts: data || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
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
      is_featured = false,
      is_published = false,
      published_at,
      read_time,
      seo_title,
      seo_description,
      faq_schema = [],
      custom_schema = {},
      callouts = []
    } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existing } = await supabaseAdmin
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      )
    }

    // Set published_at if publishing for the first time
    const finalPublishedAt = is_published && !published_at
      ? new Date().toISOString()
      : published_at

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        author_id,
        category,
        featured_image,
        is_featured,
        is_published,
        published_at: finalPublishedAt,
        read_time,
        seo_title: seo_title || title,
        seo_description: seo_description || excerpt,
        faq_schema,
        custom_schema,
        callouts
      })
      .select(`
        *,
        author:authors(*)
      `)
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ post: data })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
