/**
 * Authenticated Slug Update Script
 *
 * This script authenticates as an admin user before updating slugs,
 * which is required to pass RLS (Row Level Security) policies.
 *
 * Run with: npx tsx scripts/authenticated-update-slugs.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Admin credentials
const ADMIN_EMAIL = 'admin@modular-buildings.co'
const ADMIN_PASSWORD = 'ModularAdmin2024!'

async function authenticatedUpdateSlugs() {
  console.log('='.repeat(60))
  console.log('Authenticated Slug Update Script')
  console.log('='.repeat(60))
  console.log('')

  // Create Supabase client with custom schema
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'Modular-buildings.co' }
  })

  // Step 1: Authenticate as admin
  console.log('Step 1: Authenticating as admin...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  })

  if (authError) {
    console.error('Authentication failed:', authError.message)
    console.log('')
    console.log('Alternative: Run the SQL migration directly in Supabase SQL Editor')
    console.log('File: database/migrations/003_update_page_slugs.sql')
    process.exit(1)
  }

  console.log(`Authenticated as: ${authData.user?.email}`)
  console.log(`User ID: ${authData.user?.id}`)
  console.log('')

  // Step 2: Verify admin role
  console.log('Step 2: Verifying admin role...')
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', authData.user?.id)
    .single()

  if (profileError) {
    console.log('Could not verify admin profile:', profileError.message)
    console.log('Continuing anyway - RLS will enforce permissions...')
  } else {
    console.log(`User role: ${profile?.role}`)
  }
  console.log('')

  // Step 3: Fetch pages that need updates
  console.log('Step 3: Fetching pages with parent_slug...')
  const { data: pages, error: fetchError } = await supabase
    .from('pages')
    .select('id, title, slug, parent_slug')
    .not('parent_slug', 'is', null)
    .order('slug')

  if (fetchError) {
    console.error('Failed to fetch pages:', fetchError.message)
    process.exit(1)
  }

  if (!pages || pages.length === 0) {
    console.log('No pages with parent_slug found.')
    process.exit(0)
  }

  console.log(`Found ${pages.length} pages with parent_slug`)
  console.log('')

  // Step 4: Update slugs
  console.log('Step 4: Updating slugs...')
  console.log('-'.repeat(60))

  let successCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const page of pages) {
    // Skip if already has full path
    if (page.slug.includes('/')) {
      console.log(`SKIP: "${page.title}" - already has path (${page.slug})`)
      skippedCount++
      continue
    }

    const newSlug = `${page.parent_slug}/${page.slug}`

    const { error: updateError } = await supabase
      .from('pages')
      .update({
        slug: newSlug,
        updated_at: new Date().toISOString()
      })
      .eq('id', page.id)

    if (updateError) {
      console.log(`ERROR: "${page.title}" - ${updateError.message}`)
      errorCount++
    } else {
      console.log(`OK: "${page.title}" - ${page.slug} -> ${newSlug}`)
      successCount++
    }
  }

  // Step 5: Verify updates
  console.log('')
  console.log('Step 5: Verifying updates...')
  console.log('-'.repeat(60))

  const { data: verifyPages, error: verifyError } = await supabase
    .from('pages')
    .select('title, slug, parent_slug')
    .not('parent_slug', 'is', null)
    .order('slug')

  if (verifyError) {
    console.log('Verification query failed:', verifyError.message)
  } else {
    console.log('')
    console.log('Current slugs after update:')
    for (const page of verifyPages!) {
      const hasPath = page.slug.includes('/') ? '[OK]' : '[NOT UPDATED]'
      console.log(`  ${hasPath} /${page.slug} - "${page.title}"`)
    }
  }

  // Summary
  console.log('')
  console.log('='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`  Total processed: ${pages.length}`)
  console.log(`  Updated:         ${successCount}`)
  console.log(`  Skipped:         ${skippedCount}`)
  console.log(`  Errors:          ${errorCount}`)
  console.log('')

  // Sign out
  await supabase.auth.signOut()
  console.log('Signed out.')
}

authenticatedUpdateSlugs()
  .then(() => {
    console.log('Script completed.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
