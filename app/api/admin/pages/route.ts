import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/pages - List all pages
export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageType = searchParams.get('page_type')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('pages')
      .select('*, page_type:page_types(name, slug)')
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (pageType) {
      query = query.eq('page_type_id', pageType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching pages:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ pages: data })
  } catch (error: any) {
    console.error('Error in GET /api/admin/pages:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/admin/pages - Create new page
export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { page_type_id, slug, meta_title, meta_description, content, status, title } = body

    if (!page_type_id || !slug) {
      return NextResponse.json(
        { error: 'page_type_id and slug are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('pages')
      .insert({
        page_type_id,
        slug,
        title: title || slug,
        meta_title,
        meta_description,
        content,
        status: status || 'draft',
        sort_order: 0,
        is_featured: false,
        view_count: 0
      })
      .select('*, page_type:page_types(name, slug)')
      .single()

    if (error) {
      console.error('Error creating page:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ page: data }, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/admin/pages:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
