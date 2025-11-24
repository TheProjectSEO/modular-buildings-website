/**
 * Seed script for page_types table in Modular-buildings.co schema
 *
 * Run with: npx ts-node --esm scripts/seed-page-types.ts
 * Or via API: POST /api/admin/seed-page-types
 */

import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

// Create Supabase client configured to use Modular-buildings.co schema
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: 'Modular-buildings.co'
  }
})

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
  console.log('Starting page types seed...')
  console.log(`Supabase URL: ${supabaseUrl}`)
  console.log(`Schema: Modular-buildings.co`)
  console.log(`Seeding ${pageTypes.length} page types...`)

  // Try upsert approach (insert or update on conflict)
  const { data, error } = await supabase
    .from('page_types')
    .upsert(pageTypes, {
      onConflict: 'slug',
      ignoreDuplicates: false
    })
    .select()

  if (error) {
    console.error('Error seeding page types:', error)

    // If upsert fails, try individual inserts
    console.log('\nTrying individual inserts...')
    const results = []

    for (const pageType of pageTypes) {
      const { data: insertData, error: insertError } = await supabase
        .from('page_types')
        .upsert(pageType, { onConflict: 'slug' })
        .select()
        .single()

      if (insertError) {
        console.error(`  Failed to insert "${pageType.name}":`, insertError.message)
      } else {
        console.log(`  Inserted/Updated: ${pageType.name}`)
        results.push(insertData)
      }
    }

    console.log(`\nSeeded ${results.length}/${pageTypes.length} page types`)
    return results
  }

  console.log('\nSuccessfully seeded page types:')
  data?.forEach(pt => {
    console.log(`  - ${pt.name} (${pt.slug})`)
  })

  return data
}

// Run if executed directly
seedPageTypes()
  .then((data) => {
    console.log('\nSeed completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })

export { seedPageTypes, pageTypes }
