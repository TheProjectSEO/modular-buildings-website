import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/content-sections - List all content sections
export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('page_id')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('content_sections')
      .select('*, page:pages(id, slug, meta_title)')
      .order('order_index', { ascending: true })
      .range(offset, offset + limit - 1)

    if (pageId) {
      query = query.eq('page_id', pageId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching content sections:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sections: data })
  } catch (error: any) {
    console.error('Error in GET /api/admin/content-sections:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/admin/content-sections - Create new content section
export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { page_id, section_type, title, content, order_index, is_active } = body

    if (!page_id || !section_type) {
      return NextResponse.json(
        { error: 'page_id and section_type are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('content_sections')
      .insert({
        page_id,
        section_type,
        title,
        content,
        order_index: order_index ?? 0,
        is_active: is_active ?? true,
      })
      .select('*, page:pages(id, slug, meta_title)')
      .single()

    if (error) {
      console.error('Error creating content section:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ section: data }, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/admin/content-sections:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
