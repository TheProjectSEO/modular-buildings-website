import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/redirects - List all redirects
export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('is_active')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('redirects')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching redirects:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ redirects: data })
  } catch (error: any) {
    console.error('Error in GET /api/admin/redirects:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/admin/redirects - Create new redirect
export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { source_path, target_path, redirect_type, is_active } = body

    if (!source_path || !target_path) {
      return NextResponse.json(
        { error: 'source_path and target_path are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('redirects')
      .insert({
        source_path,
        target_path,
        redirect_type: redirect_type || '301',
        is_active: is_active ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating redirect:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ redirect: data }, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/admin/redirects:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
