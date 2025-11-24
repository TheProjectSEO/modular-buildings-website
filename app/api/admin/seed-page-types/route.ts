import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Page types to seed
const pageTypes = [
  {
    name: 'Product Page',
    slug: 'product',
    template: 'product',
    description: 'Individual product pages for modular buildings'
  },
  {
    name: 'Category Page',
    slug: 'category',
    template: 'category',
    description: 'Category and collection pages'
  },
  {
    name: 'Landing Page',
    slug: 'landing-page',
    template: 'landing',
    description: 'Marketing and promotional landing pages'
  },
  {
    name: 'Article',
    slug: 'article',
    template: 'article',
    description: 'Blog posts and news articles'
  },
  {
    name: 'FAQ Page',
    slug: 'faq-page',
    template: 'faq',
    description: 'Frequently asked questions pages'
  },
  {
    name: 'Contact Page',
    slug: 'contact',
    template: 'contact',
    description: 'Contact and inquiry pages'
  },
  {
    name: 'About Page',
    slug: 'about',
    template: 'about',
    description: 'Company information pages'
  },
  {
    name: 'Location Page',
    slug: 'location',
    template: 'location',
    description: 'Location-specific landing pages'
  },
  {
    name: 'Service Page',
    slug: 'service',
    template: 'service',
    description: 'Service offering pages'
  }
]

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    // Create Supabase client configured to use Modular-buildings.co schema
    const supabase = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: 'Modular-buildings.co'
      }
    })

    // Upsert page types (insert or update on conflict)
    const { data, error } = await supabase
      .from('page_types')
      .upsert(pageTypes, {
        onConflict: 'slug',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.error('Error seeding page types:', error)
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${data?.length || 0} page types`,
      data
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

// GET method to check current page types
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    // Create Supabase client configured to use Modular-buildings.co schema
    const supabase = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: 'Modular-buildings.co'
      }
    })

    const { data, error } = await supabase
      .from('page_types')
      .select('*')
      .order('name')

    if (error) {
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      count: data?.length || 0,
      pageTypes: data,
      expectedTypes: pageTypes.map(pt => pt.slug)
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
