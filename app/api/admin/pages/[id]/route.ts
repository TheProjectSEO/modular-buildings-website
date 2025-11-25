import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/pages/[id] - Get single page
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
      .from('pages')
      .select('*, page_type:page_types(name, slug)')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching page:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({ page: data })
  } catch (error: any) {
    console.error('Error in GET /api/admin/pages/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/admin/pages/[id] - Update page
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
    const { page_type_id, slug, title, meta_title, meta_description, content, status } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (page_type_id !== undefined) updateData.page_type_id = page_type_id
    if (slug !== undefined) updateData.slug = slug
    if (title !== undefined) updateData.title = title
    if (meta_title !== undefined) updateData.meta_title = meta_title
    if (meta_description !== undefined) updateData.meta_description = meta_description
    if (content !== undefined) updateData.content = content
    if (status !== undefined) updateData.status = status

    const { data, error } = await supabaseAdmin
      .from('pages')
      .update(updateData)
      .eq('id', params.id)
      .select('*, page_type:page_types(name, slug)')
      .single()

    if (error) {
      console.error('Error updating page:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ page: data })
  } catch (error: any) {
    console.error('Error in PUT /api/admin/pages/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/pages/[id] - Delete page
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
      .from('pages')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting page:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/pages/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
