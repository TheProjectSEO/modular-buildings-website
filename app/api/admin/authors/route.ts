import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all authors
export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')

    let query = supabaseAdmin
      .from('authors')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,bio.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching authors:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      authors: data || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch authors' },
      { status: 500 }
    )
  }
}

// POST - Create new author
export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()

    const {
      name,
      email,
      avatar_url,
      bio,
      social_links = {}
    } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('authors')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'An author with this email already exists' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('authors')
      .insert({
        name,
        email,
        avatar_url,
        bio,
        social_links
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating author:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ author: data })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create author' },
      { status: 500 }
    )
  }
}
