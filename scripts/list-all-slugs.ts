/**
 * List all page slugs to verify the updates
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

async function listSlugs() {
  const { data, error } = await supabase
    .from('pages')
    .select('title, slug, parent_slug, page_type:page_types(slug, name)')
    .order('slug')

  if (error) {
    console.error('Error:', error.message)
    return
  }

  console.log('\n=== ALL PAGE SLUGS (Raw from Database) ===\n')
  console.log('SLUG'.padEnd(50) + ' | TITLE')
  console.log('-'.repeat(100))

  for (const page of data!) {
    const pageType = (page.page_type as any)?.slug || 'unknown'
    console.log(`${page.slug.padEnd(50)} | ${page.title} [${pageType}]`)
  }

  console.log('\n' + '='.repeat(100))
  console.log(`Total pages: ${data!.length}`)

  // Count pages with path separators
  const withPath = data!.filter(p => p.slug.includes('/'))
  console.log(`Pages with full path: ${withPath.length}`)
  console.log(`Pages without path: ${data!.length - withPath.length}`)
}

listSlugs()
