/**
 * Seed script using raw SQL via RPC for page_types table
 * This bypasses schema restrictions by using PostgreSQL functions
 * Run with: node scripts/seed-page-types-rpc.mjs
 */

import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://qyjzqzqqjimittltttph.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5anpxenFxamltaXR0bHR0dHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTk5OTksImV4cCI6MjA3NjYzNTk5OX0.YQA0wSqdri73o6WW4-BZl0i8oKlMNcj702nAZvWkR9o'

// Create Supabase client (using public schema for RPC calls)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Page types to seed
const pageTypes = [
  { name: 'Product Page', slug: 'product', template: 'product', description: 'Individual product pages for modular buildings' },
  { name: 'Category Page', slug: 'category', template: 'category', description: 'Category and collection pages' },
  { name: 'Landing Page', slug: 'landing-page', template: 'landing', description: 'Marketing and promotional landing pages' },
  { name: 'Article', slug: 'article', template: 'article', description: 'Blog posts and news articles' },
  { name: 'FAQ Page', slug: 'faq-page', template: 'faq', description: 'Frequently asked questions pages' },
  { name: 'Contact Page', slug: 'contact', template: 'contact', description: 'Contact and inquiry pages' },
  { name: 'About Page', slug: 'about', template: 'about', description: 'Company information pages' },
  { name: 'Location Page', slug: 'location', template: 'location', description: 'Location-specific landing pages' },
  { name: 'Service Page', slug: 'service', template: 'service', description: 'Service offering pages' }
]

// Generate the SQL INSERT statement
function generateInsertSQL() {
  const values = pageTypes.map(pt =>
    `('${pt.name}', '${pt.slug}', '${pt.template}', '${pt.description}')`
  ).join(',\n  ')

  return `
INSERT INTO "Modular-buildings.co".page_types (name, slug, template, description)
VALUES
  ${values}
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  template = EXCLUDED.template,
  updated_at = now()
RETURNING id, name, slug, template, description;
`
}

async function seedPageTypes() {
  console.log('='.repeat(60))
  console.log('Seeding page_types via SQL')
  console.log('='.repeat(60))
  console.log('')

  const sql = generateInsertSQL()
  console.log('Generated SQL:')
  console.log(sql)
  console.log('')

  // Try using the exec_sql RPC function if it exists
  console.log('Attempting to execute SQL via RPC...')

  // First, try to call a custom function if it exists
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

  if (error) {
    console.log(`RPC exec_sql error: ${error.message}`)
    console.log('')
    console.log('The schema "Modular-buildings.co" is not exposed via the API.')
    console.log('')
    console.log('To fix this, you need to run this SQL in the Supabase SQL Editor:')
    console.log('')
    console.log('Option 1: Run the INSERT directly in Supabase SQL Editor:')
    console.log('-'.repeat(60))
    console.log(sql)
    console.log('-'.repeat(60))
    console.log('')
    console.log('Option 2: Expose the schema via API (in Supabase Dashboard):')
    console.log('1. Go to Project Settings > API')
    console.log('2. Under "Exposed schemas", add "Modular-buildings.co"')
    console.log('3. Re-run this script')
    console.log('')
    console.log('Option 3: Create an RPC function:')
    console.log('-'.repeat(60))
    console.log(`
CREATE OR REPLACE FUNCTION public.seed_page_types()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  INSERT INTO "Modular-buildings.co".page_types (name, slug, template, description)
  VALUES
    ('Product Page', 'product', 'product', 'Individual product pages for modular buildings'),
    ('Category Page', 'category', 'category', 'Category and collection pages'),
    ('Landing Page', 'landing-page', 'landing', 'Marketing and promotional landing pages'),
    ('Article', 'article', 'article', 'Blog posts and news articles'),
    ('FAQ Page', 'faq-page', 'faq', 'Frequently asked questions pages'),
    ('Contact Page', 'contact', 'contact', 'Contact and inquiry pages'),
    ('About Page', 'about', 'about', 'Company information pages'),
    ('Location Page', 'location', 'location', 'Location-specific landing pages'),
    ('Service Page', 'service', 'service', 'Service offering pages')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    template = EXCLUDED.template,
    updated_at = now();

  SELECT jsonb_agg(row_to_json(pt))
  INTO result
  FROM "Modular-buildings.co".page_types pt;

  RETURN result;
END;
$$;
`)
    console.log('-'.repeat(60))
    return { success: false, error: error.message }
  }

  console.log('SQL executed successfully!')
  console.log('Result:', JSON.stringify(data, null, 2))
  return { success: true, data }
}

// Run the seed
seedPageTypes()
  .then((result) => {
    process.exit(result.success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Seed script failed:', error)
    process.exit(1)
  })
