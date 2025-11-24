/**
 * Script to fix page slugs to match frontend route expectations
 *
 * This script updates slugs to include their full path:
 * - Location pages: `california` -> `location/california`
 * - Industry pages: `construction` -> `industries/construction`
 * - Modular office pages: `single-wide` -> `modular-office-building/single-wide`
 * - Modular classroom pages: `single` -> `modular-classrooms/single`
 *
 * Run with: npx tsx scripts/fix-page-slugs.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: 'Modular-buildings.co' } }
)

interface UpdateResult {
  title: string
  oldSlug: string
  newSlug: string
  status: 'success' | 'error' | 'skipped'
  message?: string
}

async function fixPageSlugs() {
  console.log('='.repeat(60))
  console.log('Modular Buildings CMS - Fix Page Slugs')
  console.log('='.repeat(60))
  console.log('')

  const { data: pages, error: fetchError } = await supabase
    .from('pages')
    .select('id, title, slug, parent_slug, page_type:page_types(slug)')
    .order('slug')

  if (fetchError) {
    console.error('Error fetching pages:', fetchError.message)
    process.exit(1)
  }

  if (!pages) {
    console.log('No pages found.')
    process.exit(0)
  }

  console.log(`Found ${pages.length} pages to process\n`)

  const results: UpdateResult[] = []

  for (const page of pages) {
    const currentSlug = page.slug
    const parentSlug = page.parent_slug
    let newSlug = currentSlug

    // Skip if already has a path (contains /)
    if (currentSlug.includes('/')) {
      results.push({
        title: page.title,
        oldSlug: currentSlug,
        newSlug: currentSlug,
        status: 'skipped',
        message: 'Already has path separator'
      })
      continue
    }

    // If page has a parent_slug, prefix with parent
    if (parentSlug && currentSlug !== parentSlug) {
      newSlug = `${parentSlug}/${currentSlug}`
    }

    // Skip if no change
    if (newSlug === currentSlug) {
      results.push({
        title: page.title,
        oldSlug: currentSlug,
        newSlug: currentSlug,
        status: 'skipped',
        message: 'No parent_slug or is main category page'
      })
      continue
    }

    // Update the slug
    const { error: updateError } = await supabase
      .from('pages')
      .update({ slug: newSlug, updated_at: new Date().toISOString() })
      .eq('id', page.id)

    if (updateError) {
      results.push({
        title: page.title,
        oldSlug: currentSlug,
        newSlug: newSlug,
        status: 'error',
        message: updateError.message
      })
    } else {
      results.push({
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
    console.log('-'.repeat(50))
    for (const result of successUpdates) {
      console.log(`  "${result.title}"`)
      console.log(`    /${result.oldSlug} -> /${result.newSlug}`)
    }
    console.log('')
  }

  if (skippedUpdates.length > 0) {
    console.log('SKIPPED:')
    console.log('-'.repeat(50))
    for (const result of skippedUpdates) {
      console.log(`  "${result.title}" (/${result.oldSlug})`)
      console.log(`    Reason: ${result.message}`)
    }
    console.log('')
  }

  if (errorUpdates.length > 0) {
    console.log('ERRORS:')
    console.log('-'.repeat(50))
    for (const result of errorUpdates) {
      console.log(`  "${result.title}"`)
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

fixPageSlugs()
  .then(() => {
    console.log('Script completed.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
