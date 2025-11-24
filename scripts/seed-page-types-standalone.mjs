/**
 * Standalone seed script for page_types table in Modular-buildings.co schema
 *
 * PREREQUISITE: Run scripts/setup-schema-api.sql in Supabase SQL Editor first!
 *
 * Run with: node scripts/seed-page-types-standalone.mjs
 */

import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://qyjzqzqqjimittltttph.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5anpxenFxamltaXR0bHR0dHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTk5OTksImV4cCI6MjA3NjYzNTk5OX0.YQA0wSqdri73o6WW4-BZl0i8oKlMNcj702nAZvWkR9o'

// Create Supabase client (public schema for RPC calls)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

async function seedPageTypes() {
  console.log('='.repeat(60))
  console.log('Seeding page_types table in Modular-buildings.co schema')
  console.log('='.repeat(60))
  console.log('')
  console.log(`Supabase URL: ${supabaseUrl}`)
  console.log(`Schema: Modular-buildings.co`)
  console.log(`Page types to seed: ${pageTypes.length}`)
  console.log('')

  // Try using the RPC function first (requires setup-schema-api.sql to be run)
  console.log('Attempting to seed via RPC function...')
  const { data: rpcData, error: rpcError } = await supabase.rpc('seed_modular_page_types')

  if (!rpcError && rpcData) {
    console.log('SUCCESS! Seeded via RPC function.')
    console.log('')
    console.log('Seeded page types:')
    rpcData.forEach(pt => {
      console.log(`  - ${pt.name} (slug: ${pt.slug}, template: ${pt.template})`)
    })
    return { success: rpcData, failed: [] }
  }

  console.log(`RPC function not available: ${rpcError?.message || 'Unknown error'}`)
  console.log('')
  console.log('Falling back to direct table access...')
  console.log('')

  const results = {
    success: [],
    failed: []
  }

  // Create a schema-specific client
  const supabaseSchema = createClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'Modular-buildings.co' }
  })

  // Insert each page type individually for better error handling
  for (const pageType of pageTypes) {
    console.log(`Seeding: ${pageType.name}...`)

    const { data, error } = await supabaseSchema
      .from('page_types')
      .upsert(pageType, {
        onConflict: 'slug',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (error) {
      console.log(`  ERROR: ${error.message}`)
      results.failed.push({ pageType, error: error.message })
    } else {
      console.log(`  SUCCESS: ${data.name} (ID: ${data.id})`)
      results.success.push(data)
    }
  }

  console.log('')
  console.log('='.repeat(60))
  console.log('SEED RESULTS')
  console.log('='.repeat(60))
  console.log(`Successfully seeded: ${results.success.length}/${pageTypes.length}`)
  console.log(`Failed: ${results.failed.length}/${pageTypes.length}`)

  if (results.success.length > 0) {
    console.log('')
    console.log('Successfully seeded page types:')
    results.success.forEach(pt => {
      console.log(`  - ${pt.name} (slug: ${pt.slug}, template: ${pt.template})`)
    })
  }

  if (results.failed.length > 0) {
    console.log('')
    console.log('Failed page types:')
    results.failed.forEach(f => {
      console.log(`  - ${f.pageType.name}: ${f.error}`)
    })
    console.log('')
    console.log('To fix this issue:')
    console.log('1. Open the Supabase SQL Editor')
    console.log('2. Run scripts/setup-schema-api.sql first')
    console.log('3. Then run scripts/seed-page-types.sql')
    console.log('')
    console.log('Or run scripts/seed-page-types.sql directly in the SQL Editor.')
  }

  // Verify by fetching all page types via RPC
  console.log('')
  console.log('Verifying seeded data...')
  const { data: allPageTypes, error: fetchError } = await supabase.rpc('get_modular_page_types')

  if (fetchError) {
    console.log(`Verification failed: ${fetchError.message}`)
  } else if (allPageTypes && allPageTypes.length > 0) {
    console.log(`Total page types in database: ${allPageTypes.length}`)
    console.log('')
    console.log('All page types in database:')
    allPageTypes.forEach(pt => {
      console.log(`  - ${pt.name} (${pt.slug}) - template: ${pt.template}`)
    })
  }

  return results
}

// Run the seed
seedPageTypes()
  .then((results) => {
    console.log('')
    console.log('='.repeat(60))
    console.log('SEED COMPLETE')
    console.log('='.repeat(60))
    process.exit(results.failed.length > 0 ? 1 : 0)
  })
  .catch((error) => {
    console.error('Seed script failed:', error)
    process.exit(1)
  })
