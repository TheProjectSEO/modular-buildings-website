-- =====================================================
-- Migration: Update Page Slugs to Match Frontend Routes
-- Schema: Modular-buildings.co
-- =====================================================
-- This migration updates slugs to include their full path prefix
-- Run this in Supabase SQL Editor (with Service Role access)
-- =====================================================

-- Start transaction
BEGIN;

-- =====================================================
-- UPDATE LOCATION PAGES
-- Change: texas -> location/texas
-- =====================================================

UPDATE "Modular-buildings.co".pages
SET slug = 'location/texas', updated_at = NOW()
WHERE slug = 'texas' AND parent_slug = 'location';

UPDATE "Modular-buildings.co".pages
SET slug = 'location/california', updated_at = NOW()
WHERE slug = 'california' AND parent_slug = 'location';

UPDATE "Modular-buildings.co".pages
SET slug = 'location/florida', updated_at = NOW()
WHERE slug = 'florida' AND parent_slug = 'location';

UPDATE "Modular-buildings.co".pages
SET slug = 'location/new-york', updated_at = NOW()
WHERE slug = 'new-york' AND parent_slug = 'location';

UPDATE "Modular-buildings.co".pages
SET slug = 'location/ohio', updated_at = NOW()
WHERE slug = 'ohio' AND parent_slug = 'location';

UPDATE "Modular-buildings.co".pages
SET slug = 'location/pennsylvania', updated_at = NOW()
WHERE slug = 'pennsylvania' AND parent_slug = 'location';

UPDATE "Modular-buildings.co".pages
SET slug = 'location/illinois', updated_at = NOW()
WHERE slug = 'illinois' AND parent_slug = 'location';

UPDATE "Modular-buildings.co".pages
SET slug = 'location/georgia', updated_at = NOW()
WHERE slug = 'georgia' AND parent_slug = 'location';

UPDATE "Modular-buildings.co".pages
SET slug = 'location/north-carolina', updated_at = NOW()
WHERE slug = 'north-carolina' AND parent_slug = 'location';

UPDATE "Modular-buildings.co".pages
SET slug = 'location/michigan', updated_at = NOW()
WHERE slug = 'michigan' AND parent_slug = 'location';

-- =====================================================
-- UPDATE INDUSTRY PAGES
-- Change: construction -> industries/construction
-- =====================================================

UPDATE "Modular-buildings.co".pages
SET slug = 'industries/construction', updated_at = NOW()
WHERE slug = 'construction' AND parent_slug = 'industries';

UPDATE "Modular-buildings.co".pages
SET slug = 'industries/medical', updated_at = NOW()
WHERE slug = 'medical' AND parent_slug = 'industries';

UPDATE "Modular-buildings.co".pages
SET slug = 'industries/government', updated_at = NOW()
WHERE slug = 'government' AND parent_slug = 'industries';

UPDATE "Modular-buildings.co".pages
SET slug = 'industries/education', updated_at = NOW()
WHERE slug = 'education' AND parent_slug = 'industries';

UPDATE "Modular-buildings.co".pages
SET slug = 'industries/religion', updated_at = NOW()
WHERE slug = 'religion' AND parent_slug = 'industries';

-- =====================================================
-- UPDATE MODULAR OFFICE BUILDING PAGES
-- Change: single-wide -> modular-office-building/single-wide
-- =====================================================

UPDATE "Modular-buildings.co".pages
SET slug = 'modular-office-building/single-wide', updated_at = NOW()
WHERE slug = 'single-wide' AND parent_slug = 'modular-office-building';

UPDATE "Modular-buildings.co".pages
SET slug = 'modular-office-building/double-wide', updated_at = NOW()
WHERE slug = 'double-wide' AND parent_slug = 'modular-office-building';

UPDATE "Modular-buildings.co".pages
SET slug = 'modular-office-building/multi-complexes', updated_at = NOW()
WHERE slug = 'multi-complexes' AND parent_slug = 'modular-office-building';

UPDATE "Modular-buildings.co".pages
SET slug = 'modular-office-building/sales-offices', updated_at = NOW()
WHERE slug = 'sales-offices' AND parent_slug = 'modular-office-building';

-- =====================================================
-- UPDATE MODULAR CLASSROOM PAGES
-- Change: single -> modular-classrooms/single
-- =====================================================

UPDATE "Modular-buildings.co".pages
SET slug = 'modular-classrooms/single', updated_at = NOW()
WHERE slug = 'single' AND parent_slug = 'modular-classrooms';

UPDATE "Modular-buildings.co".pages
SET slug = 'modular-classrooms/double-wide', updated_at = NOW()
WHERE slug = 'double-wide' AND parent_slug = 'modular-classrooms';

UPDATE "Modular-buildings.co".pages
SET slug = 'modular-classrooms/multi-complexes', updated_at = NOW()
WHERE slug = 'multi-complexes' AND parent_slug = 'modular-classrooms';

UPDATE "Modular-buildings.co".pages
SET slug = 'modular-classrooms/restrooms', updated_at = NOW()
WHERE slug = 'restrooms' AND parent_slug = 'modular-classrooms';

UPDATE "Modular-buildings.co".pages
SET slug = 'modular-classrooms/kitchens', updated_at = NOW()
WHERE slug = 'kitchens' AND parent_slug = 'modular-classrooms';

-- =====================================================
-- UPDATE HOMEPAGE
-- Change: / -> home (if needed)
-- =====================================================

-- Keep homepage as '/' or update to 'home' based on frontend needs
-- Uncomment one of the following:

-- Option 1: Keep as '/'
-- (No action needed)

-- Option 2: Change to 'home'
-- UPDATE "Modular-buildings.co".pages
-- SET slug = 'home', updated_at = NOW()
-- WHERE slug = '/';

-- =====================================================
-- VERIFICATION: Show updated slugs
-- =====================================================

-- Commit the transaction
COMMIT;

-- Display updated pages for verification
SELECT
    title,
    slug,
    parent_slug,
    pt.name as page_type
FROM "Modular-buildings.co".pages p
LEFT JOIN "Modular-buildings.co".page_types pt ON p.page_type_id = pt.id
WHERE slug LIKE '%/%'
ORDER BY slug;
