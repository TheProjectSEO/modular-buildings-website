import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/content-sections/[id] - Get single content section
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('content_sections')
      .select('*, page:pages(id, slug, meta_title)')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching content section:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Content section not found' }, { status: 404 })
    }

    return NextResponse.json({ section: data })
  } catch (error: any) {
    console.error('Error in GET /api/admin/content-sections/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/admin/content-sections/[id] - Update content section
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { page_id, section_type, title, content, order_index, is_active } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (page_id !== undefined) updateData.page_id = page_id
    if (section_type !== undefined) updateData.section_type = section_type
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (order_index !== undefined) updateData.order_index = order_index
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await supabaseAdmin
      .from('content_sections')
      .update(updateData)
      .eq('id', params.id)
      .select('*, page:pages(id, slug, meta_title)')
      .single()

    if (error) {
      console.error('Error updating content section:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ section: data })
  } catch (error: any) {
    console.error('Error in PUT /api/admin/content-sections/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/content-sections/[id] - Delete content section
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const { error } = await supabaseAdmin
      .from('content_sections')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting content section:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/content-sections/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
