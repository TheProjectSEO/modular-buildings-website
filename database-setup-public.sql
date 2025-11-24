-- Karmod Website Database Setup for PUBLIC SCHEMA
-- Run this in Supabase SQL Editor to create tables in public schema
-- This enables the website to access data via the anon API key

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PRODUCT CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    parent_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    description TEXT,
    banner_image_url TEXT,
    icon_svg TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    total_area NUMERIC,
    area_unit VARCHAR(10) DEFAULT 'm²',
    floor_count INTEGER,
    completion_days INTEGER,
    specifications JSONB,
    features TEXT[],
    images JSONB,
    price_range VARCHAR(100),
    meta_title VARCHAR(200),
    meta_description TEXT,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    category VARCHAR(100),
    location VARCHAR(200),
    country VARCHAR(100),
    city VARCHAR(100),
    completion_date DATE,
    completion_days INTEGER,
    total_area NUMERIC,
    description TEXT,
    features TEXT[],
    images JSONB,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONTACT SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(200),
    message TEXT NOT NULL,
    product_interest UUID REFERENCES public.products(id) ON DELETE SET NULL,
    source_page VARCHAR(200),
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.product_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Product Categories
INSERT INTO public.product_categories (name, slug, description, sort_order, is_active) VALUES
('Containers', 'containers', 'Container solutions for various applications', 1, true),
('Kiosks', 'kiosks', 'Modular kiosk structures', 2, true),
('Modular Homes', 'modular-homes', 'Residential modular buildings', 3, true),
('Prefabricated Buildings', 'prefabricated-buildings', 'Complete prefab building solutions', 4, true),
('Steel Frame Houses', 'steel-frame-houses', 'Light gauge steel frame structures', 5, true),
('Modular Cabins', 'modular-cabins', 'Cabin structures for various uses', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Sample Products
INSERT INTO public.products (
    title, slug, category, subcategory, description, total_area,
    floor_count, completion_days, specifications, features, is_published, is_featured
) VALUES
(
    'Prefabricated Office 560 m²',
    'prefabricated-office-560-m2',
    'prefabricated-buildings',
    'prefabricated-offices',
    '2-storey prefabricated office with high quality standards',
    560, 2, 32,
    '{"total_area": "560 m²", "floor_count": 2, "ceiling_height": "3m", "type": "Office Building"}',
    ARRAY['High quality construction', 'Fast installation', 'Energy efficient', 'Customizable layout'],
    true, true
),
(
    'Modular School Buildings 1840 m²',
    'modular-school-buildings-1840-m2',
    'prefabricated-buildings',
    'modular-school-buildings',
    'Pre-fabricated Medical Faculty Building – Fast and Reliable Education Solutions',
    1840, 2, 45,
    '{"total_area": "1840 m²", "classrooms": 14, "students": 900, "laboratories": 4, "floor_count": 2}',
    ARRAY['14 classrooms', '900 student capacity', '4 laboratories', 'Administrative facilities', 'Safety certified'],
    true, true
),
(
    'Container Office 20ft',
    'container-office-20ft',
    'containers',
    NULL,
    'Portable container office solution with modern amenities',
    14, 1, 5,
    '{"length": "6m", "width": "2.4m", "height": "2.6m"}',
    ARRAY['Portable', 'Quick installation', 'Durable', 'Weatherproof'],
    true, true
),
(
    'Modular Cabin for Construction Sites',
    'modular-cabin-construction',
    'modular-cabins',
    NULL,
    'Durable modular cabin perfect for construction site offices',
    18, 1, 3,
    '{"length": "6m", "width": "3m", "height": "2.8m"}',
    ARRAY['Weather resistant', 'Insulated', 'Quick setup', 'Mobile'],
    true, false
)
ON CONFLICT (slug) DO NOTHING;

-- Sample Project
INSERT INTO public.projects (
    title, slug, category, location, country, city,
    completion_days, total_area, description, features,
    is_featured, is_published
) VALUES
(
    'Prefabricated Office - Arnavutköy Project',
    'prefabricated-office-arnavutkoy',
    'Office Buildings',
    'Arnavutköy, Istanbul', 'Turkey', 'Istanbul',
    32, 560,
    '2-storey prefabricated office building completed in Arnavutköy, Istanbul',
    ARRAY['560 m² total area', '2 floors', 'Completed in 32 days', 'Modern design', 'Energy efficient'],
    true, true
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - Allow public read access
-- =====================================================

-- Product Categories - Allow all to read
CREATE POLICY "Public read access for product_categories"
    ON public.product_categories FOR SELECT
    USING (true);

-- Products - Allow reading published products
CREATE POLICY "Public read access for published products"
    ON public.products FOR SELECT
    USING (is_published = true);

-- Projects - Allow reading published projects
CREATE POLICY "Public read access for published projects"
    ON public.projects FOR SELECT
    USING (is_published = true);

-- Contact Submissions - Allow anyone to insert
CREATE POLICY "Public insert access for contact_submissions"
    ON public.contact_submissions FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database setup complete!';
    RAISE NOTICE 'Tables created in public schema:';
    RAISE NOTICE '  - product_categories';
    RAISE NOTICE '  - products';
    RAISE NOTICE '  - projects';
    RAISE NOTICE '  - contact_submissions';
    RAISE NOTICE '';
    RAISE NOTICE 'Sample data inserted:';
    RAISE NOTICE '  - 6 product categories';
    RAISE NOTICE '  - 4 products';
    RAISE NOTICE '  - 1 project';
    RAISE NOTICE '';
    RAISE NOTICE 'Next: Refresh your Next.js website at http://localhost:3004';
END $$;
