import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/redirects/[id] - Get single redirect
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
      .from('redirects')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching redirect:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Redirect not found' }, { status: 404 })
    }

    return NextResponse.json({ redirect: data })
  } catch (error: any) {
    console.error('Error in GET /api/admin/redirects/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/admin/redirects/[id] - Update redirect
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
    const { source_path, target_path, redirect_type, is_active } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (source_path !== undefined) updateData.source_path = source_path
    if (target_path !== undefined) updateData.target_path = target_path
    if (redirect_type !== undefined) updateData.redirect_type = redirect_type
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await supabaseAdmin
      .from('redirects')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating redirect:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ redirect: data })
  } catch (error: any) {
    console.error('Error in PUT /api/admin/redirects/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/redirects/[id] - Delete redirect
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
      .from('redirects')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting redirect:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/redirects/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
