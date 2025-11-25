import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/internal-linking/settings - Get settings
export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('internal_linking_settings')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in GET /api/admin/internal-linking/settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/admin/internal-linking/settings - Update settings
export async function PUT(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()

    const {
      enabled,
      max_recommendations,
      similarity_threshold,
      max_terms_per_doc,
      max_similar_per_doc,
      auto_index,
      display_position,
      heading_text
    } = body

    const updateData: any = {}

    if (enabled !== undefined) updateData.enabled = enabled
    if (max_recommendations !== undefined) updateData.max_recommendations = max_recommendations
    if (similarity_threshold !== undefined) updateData.similarity_threshold = similarity_threshold
    if (max_terms_per_doc !== undefined) updateData.max_terms_per_doc = max_terms_per_doc
    if (max_similar_per_doc !== undefined) updateData.max_similar_per_doc = max_similar_per_doc
    if (auto_index !== undefined) updateData.auto_index = auto_index
    if (display_position !== undefined) updateData.display_position = display_position
    if (heading_text !== undefined) updateData.heading_text = heading_text

    // Get the first (and only) settings record
    const { data: existingSettings } = await supabaseAdmin
      .from('internal_linking_settings')
      .select('id')
      .single()

    if (!existingSettings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('internal_linking_settings')
      .update(updateData)
      .eq('id', existingSettings.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in PUT /api/admin/internal-linking/settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
