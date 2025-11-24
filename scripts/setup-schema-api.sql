-- ============================================
-- Setup Modular-buildings.co Schema for API Access
-- ============================================
-- Run this SQL in the Supabase SQL Editor BEFORE running seed-page-types.sql
-- Dashboard: https://supabase.com/dashboard/project/qyjzqzqqjimittltttph/sql/new
-- ============================================

-- Step 1: Grant usage on the schema to the roles
GRANT USAGE ON SCHEMA "Modular-buildings.co" TO anon;
GRANT USAGE ON SCHEMA "Modular-buildings.co" TO authenticated;
GRANT USAGE ON SCHEMA "Modular-buildings.co" TO service_role;

-- Step 2: Grant permissions on all tables in the schema
GRANT ALL ON ALL TABLES IN SCHEMA "Modular-buildings.co" TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA "Modular-buildings.co" TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA "Modular-buildings.co" TO service_role;

-- Step 3: Grant permissions on all sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA "Modular-buildings.co" TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA "Modular-buildings.co" TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA "Modular-buildings.co" TO service_role;

-- Step 4: Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA "Modular-buildings.co"
GRANT ALL ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA "Modular-buildings.co"
GRANT ALL ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA "Modular-buildings.co"
GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA "Modular-buildings.co"
GRANT ALL ON SEQUENCES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA "Modular-buildings.co"
GRANT ALL ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA "Modular-buildings.co"
GRANT ALL ON SEQUENCES TO service_role;

-- Step 5: Create RPC function to seed page types (accessible from client)
CREATE OR REPLACE FUNCTION public.seed_modular_page_types()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  SELECT jsonb_agg(
    jsonb_build_object(
      'id', pt.id,
      'name', pt.name,
      'slug', pt.slug,
      'template', pt.template,
      'description', pt.description
    )
  )
  INTO result
  FROM "Modular-buildings.co".page_types pt
  ORDER BY pt.name;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Step 6: Grant execute permission on the RPC function
GRANT EXECUTE ON FUNCTION public.seed_modular_page_types() TO anon;
GRANT EXECUTE ON FUNCTION public.seed_modular_page_types() TO authenticated;
GRANT EXECUTE ON FUNCTION public.seed_modular_page_types() TO service_role;

-- Step 7: Create a function to get page types (for API access)
CREATE OR REPLACE FUNCTION public.get_modular_page_types()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', pt.id,
      'name', pt.name,
      'slug', pt.slug,
      'template', pt.template,
      'description', pt.description,
      'created_at', pt.created_at,
      'updated_at', pt.updated_at
    )
  )
  INTO result
  FROM "Modular-buildings.co".page_types pt
  ORDER BY pt.name;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_modular_page_types() TO anon;
GRANT EXECUTE ON FUNCTION public.get_modular_page_types() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_modular_page_types() TO service_role;

-- Verify setup
SELECT 'Schema permissions granted and RPC functions created successfully!' AS status;
