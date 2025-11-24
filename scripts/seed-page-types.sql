-- ============================================
-- Seed Page Types for Modular-buildings.co Schema
-- ============================================
-- Run this SQL in the Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/qyjzqzqqjimittltttph/sql/new
-- ============================================

-- Insert default page types
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
SELECT id, name, slug, template, description, created_at, updated_at
FROM "Modular-buildings.co".page_types
ORDER BY name;
