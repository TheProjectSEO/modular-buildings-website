/**
 * Script to update page slugs to match frontend route expectations
 *
 * Changes:
 * - Location pages: `texas` -> `location/texas`
 * - Industry pages: `construction` -> `industries/construction`
 * - Modular office pages: `single-wide` -> `modular-office-building/single-wide`
 * - Modular classroom pages: `single` -> `modular-classrooms/single`
 *
 * Run with: npx tsx scripts/update-page-slugs.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

// Create Supabase client with the custom schema
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'Modular-buildings.co'
  }
})

interface Page {
  id: string
  title: string
  slug: string
  parent_slug: string | null
  page_type: {
    id: string
    slug: string
    name: string
  } | null
}

interface UpdateResult {
  id: string
  title: string
  oldSlug: string
  newSlug: string
  status: 'success' | 'error' | 'skipped'
  message?: string
}

async function updatePageSlugs() {
  console.log('='.repeat(60))
  console.log('Modular Buildings CMS - Slug Update Script')
  console.log('='.repeat(60))
  console.log('')

  // Fetch all pages with their page types
  const { data: pages, error: fetchError } = await supabase
    .from('pages')
    .select(`
      id,
      title,
      slug,
      parent_slug,
      page_type:page_types(id, slug, name)
    `)
    .order('slug')

  if (fetchError) {
    console.error('Error fetching pages:', fetchError.message)
    process.exit(1)
  }

  if (!pages || pages.length === 0) {
    console.log('No pages found in the database.')
    process.exit(0)
  }

  console.log(`Found ${pages.length} pages to process\n`)

  const results: UpdateResult[] = []

  // Define slug prefix mappings based on page type
  const prefixMap: Record<string, string> = {
    'location': 'location',
    'industries': 'industries',
    'modular-office-building': 'modular-office-building',
    'modular-classrooms': 'modular-classrooms',
    'static': '', // Static pages keep their slug as-is (about, contact, etc.)
    'products': '', // Product pages may need special handling
  }

  for (const page of pages as Page[]) {
    const pageTypeSlug = page.page_type?.slug || ''
    const currentSlug = page.slug

    // Determine the new slug
    let newSlug = currentSlug

    // Skip if slug already has a prefix (already updated)
    if (currentSlug.includes('/')) {
      results.push({
        id: page.id,
        title: page.title,
        oldSlug: currentSlug,
        newSlug: currentSlug,
        status: 'skipped',
        message: 'Slug already contains path separator'
      })
      continue
    }

    // Check if this is a child page (has parent_slug)
    if (page.parent_slug) {
      // Child pages: prefix with parent_slug
      newSlug = `${page.parent_slug}/${currentSlug}`
    } else if (prefixMap[pageTypeSlug] && currentSlug !== pageTypeSlug) {
      // Parent pages that match their page type slug stay the same
      // E.g., 'location' page type with slug 'location' stays as 'location'
      // But a location page with slug 'texas' becomes 'location/texas'

      // This handles the main category pages
      if (currentSlug === prefixMap[pageTypeSlug]) {
        // This is the main page (e.g., /location, /industries, etc.)
        // Keep as-is
        results.push({
          id: page.id,
          title: page.title,
          oldSlug: currentSlug,
          newSlug: currentSlug,
          status: 'skipped',
          message: 'Main category page - keeping slug as-is'
        })
        continue
      }
    }

    // Handle special cases for homepage
    if (currentSlug === '/' || currentSlug === 'home') {
      newSlug = 'home'
    }

    // Skip if no change needed
    if (newSlug === currentSlug) {
      results.push({
        id: page.id,
        title: page.title,
        oldSlug: currentSlug,
        newSlug: currentSlug,
        status: 'skipped',
        message: 'No change needed'
      })
      continue
    }

    // Update the slug
    const { error: updateError } = await supabase
      .from('pages')
      .update({
        slug: newSlug,
        updated_at: new Date().toISOString()
      })
      .eq('id', page.id)

    if (updateError) {
      results.push({
        id: page.id,
        title: page.title,
        oldSlug: currentSlug,
        newSlug: newSlug,
        status: 'error',
        message: updateError.message
      })
    } else {
      results.push({
        id: page.id,
        title: page.title,
        oldSlug: currentSlug,
        newSlug: newSlug,
        status: 'success'
      })
    }
  }

  // Print results
  console.log('\n' + '='.repeat(60))
  console.log('UPDATE RESULTS')
  console.log('='.repeat(60) + '\n')

  const successUpdates = results.filter(r => r.status === 'success')
  const skippedUpdates = results.filter(r => r.status === 'skipped')
  const errorUpdates = results.filter(r => r.status === 'error')

  if (successUpdates.length > 0) {
    console.log('SUCCESSFULLY UPDATED:')
    console.log('-'.repeat(40))
    for (const result of successUpdates) {
      console.log(`  "${result.title}"`)
      console.log(`    ${result.oldSlug} -> ${result.newSlug}`)
    }
    console.log('')
  }

  if (skippedUpdates.length > 0) {
    console.log('SKIPPED:')
    console.log('-'.repeat(40))
    for (const result of skippedUpdates) {
      console.log(`  "${result.title}" (${result.oldSlug})`)
      console.log(`    Reason: ${result.message}`)
    }
    console.log('')
  }

  if (errorUpdates.length > 0) {
    console.log('ERRORS:')
    console.log('-'.repeat(40))
    for (const result of errorUpdates) {
      console.log(`  "${result.title}" (${result.oldSlug} -> ${result.newSlug})`)
      console.log(`    Error: ${result.message}`)
    }
    console.log('')
  }

  console.log('='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`  Total pages:     ${results.length}`)
  console.log(`  Updated:         ${successUpdates.length}`)
  console.log(`  Skipped:         ${skippedUpdates.length}`)
  console.log(`  Errors:          ${errorUpdates.length}`)
  console.log('')
}

// Run the script
updatePageSlugs()
  .then(() => {
    console.log('Script completed.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
