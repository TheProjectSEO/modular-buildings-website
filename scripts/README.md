# Page Types Seed Scripts

This directory contains scripts for seeding the default page types into the Supabase database for the Modular Buildings CMS.

## Schema Information

- **Schema Name**: `Modular-buildings.co` (with capital M - this is critical!)
- **Supabase Project**: `qyjzqzqqjimittltttph`
- **Dashboard**: https://supabase.com/dashboard/project/qyjzqzqqjimittltttph

## Page Types to Seed

| Name | Slug | Template | Description |
|------|------|----------|-------------|
| Product Page | product | product | Individual product pages for modular buildings |
| Category Page | category | category | Category and collection pages |
| Landing Page | landing-page | landing | Marketing and promotional landing pages |
| Article | article | article | Blog posts and news articles |
| FAQ Page | faq-page | faq | Frequently asked questions pages |
| Contact Page | contact | contact | Contact and inquiry pages |
| About Page | about | about | Company information pages |
| Location Page | location | location | Location-specific landing pages |
| Service Page | service | service | Service offering pages |

## Quick Start (Recommended)

### Option 1: Run SQL directly in Supabase SQL Editor

1. Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/qyjzqzqqjimittltttph/sql/new)

2. Copy and paste the contents of `seed-page-types.sql`:

```sql
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

-- Verify the seeded data
SELECT id, name, slug, template, description FROM "Modular-buildings.co".page_types ORDER BY name;
```

3. Click "Run" to execute

### Option 2: Use Node.js Script (Requires Setup)

1. First, run the setup script in the SQL Editor to enable API access:
   - Open `setup-schema-api.sql`
   - Run it in the [Supabase SQL Editor](https://supabase.com/dashboard/project/qyjzqzqqjimittltttph/sql/new)

2. Then run the Node.js script:
   ```bash
   node scripts/seed-page-types-standalone.mjs
   ```

### Option 3: Use API Route (When Server is Running)

1. Start the Next.js dev server:
   ```bash
   npm run dev
   ```

2. Call the seed API:
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed-page-types
   ```

## Files

| File | Description |
|------|-------------|
| `seed-page-types.sql` | Direct SQL INSERT statement - run in Supabase SQL Editor |
| `setup-schema-api.sql` | Grants API access to the schema and creates RPC functions |
| `seed-page-types-standalone.mjs` | Node.js script that uses the Supabase client |
| `seed-page-types-rpc.mjs` | Node.js script that generates SQL for manual execution |
| `seed-page-types.ts` | TypeScript version for use with ts-node |

## Troubleshooting

### Error: "The schema must be one of the following: public, graphql_public"

This means the `Modular-buildings.co` schema is not exposed via the Supabase API.

**Solution**: Run `setup-schema-api.sql` in the Supabase SQL Editor first, OR use `seed-page-types.sql` directly in the SQL Editor.

### Error: "relation 'page_types' does not exist"

The `page_types` table hasn't been created yet.

**Solution**: Run the database migration to create the table first. Check the `supabase/migrations` directory.

### Error: "Could not find the function public.seed_modular_page_types"

The RPC functions haven't been created.

**Solution**: Run `setup-schema-api.sql` in the Supabase SQL Editor.
