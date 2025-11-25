import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// GET - Get single author by ID
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
      .from('authors')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching author:', error)
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      )
    }

    // Get post count for this author
    const { count } = await supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', params.id)

    return NextResponse.json({
      author: data,
      post_count: count || 0
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch author' },
      { status: 500 }
    )
  }
}

// PUT - Update author
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
      name,
      email,
      avatar_url,
      bio,
      social_links
    } = body

    // Check if email already exists (excluding current author)
    if (email) {
      const { data: existing } = await supabaseAdmin
        .from('authors')
        .select('id')
        .eq('email', email)
        .neq('id', params.id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'An author with this email already exists' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    if (bio !== undefined) updateData.bio = bio
    if (social_links !== undefined) updateData.social_links = social_links

    const { data, error } = await supabaseAdmin
      .from('authors')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating author:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ author: data })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update author' },
      { status: 500 }
    )
  }
}

// DELETE - Delete author
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
    // Check if author has any blog posts
    const { count } = await supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', params.id)

    if (count && count > 0) {
      return NextResponse.json(
        { error: `Cannot delete author with ${count} blog post(s). Please reassign or delete the posts first.` },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('authors')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting author:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Author deleted successfully' })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete author' },
      { status: 500 }
    )
  }
}
