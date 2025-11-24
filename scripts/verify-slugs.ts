/**
 * Script to verify page slugs after update
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

async function verify() {
  const { data, error } = await supabase
    .from('pages')
    .select('title, slug, parent_slug, page_type:page_types(slug, name)')
    .order('slug')

  if (error) {
    console.error('Error:', error.message)
    return
  }

  console.log('\n=== CURRENT PAGE SLUGS ===\n')

  // Group by page type
  const grouped: Record<string, any[]> = {}
  for (const page of data) {
    const type = (page.page_type as any)?.slug || 'unknown'
    if (!grouped[type]) {
      grouped[type] = []
    }
    grouped[type].push(page)
  }

  for (const [type, pages] of Object.entries(grouped)) {
    console.log('\n' + type.toUpperCase() + ':')
    console.log('-'.repeat(60))
    for (const page of pages) {
      const parentInfo = page.parent_slug ? ` (parent: ${page.parent_slug})` : ''
      console.log(`  /${page.slug}${parentInfo}`)
      console.log(`    -> ${page.title}`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`Total pages: ${data.length}`)
}

verify()
