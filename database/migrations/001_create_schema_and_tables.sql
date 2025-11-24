-- =====================================================
-- Modular Buildings CMS Database Schema
-- Schema: modular-buildings.co
-- =====================================================

-- Create the schema
CREATE SCHEMA IF NOT EXISTS "Modular-buildings.co";

-- Grant permissions
GRANT USAGE ON SCHEMA "Modular-buildings.co" TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA "Modular-buildings.co" TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA "Modular-buildings.co" TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA "Modular-buildings.co" GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA "Modular-buildings.co" GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- =====================================================
-- 1. PAGE TYPES TABLE
-- Defines the different types of pages in the system
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".page_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    parent_type_id UUID REFERENCES "Modular-buildings.co".page_types(id),
    has_location_pages BOOLEAN DEFAULT false,
    url_pattern VARCHAR(255), -- e.g., '/{slug}', '/{parent}/{slug}', '/{slug}/{location}'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default page types
INSERT INTO "Modular-buildings.co".page_types (name, slug, description, has_location_pages, url_pattern) VALUES
    ('Modular Office Building', 'modular-office-building', 'Modular office building pages', true, '/modular-office-building/{type}/{location}'),
    ('Modular Classrooms', 'modular-classrooms', 'Modular classroom pages', true, '/modular-classrooms/{type}/{location}'),
    ('Industries', 'industries', 'Industry-specific pages', true, '/industries/{slug}/{location}'),
    ('Locations', 'location', 'Location-based pages', false, '/location/{state}/{city}'),
    ('Products', 'products', 'Product pages', true, '/{slug}/{location}'),
    ('Static Pages', 'static', 'Static content pages like About, Contact, etc.', false, '/{slug}')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 2. PAGES TABLE
-- Main pages table with common fields for all page types
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Info
    page_type_id UUID NOT NULL REFERENCES "Modular-buildings.co".page_types(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    parent_slug VARCHAR(255), -- For nested pages like /modular-office-building/single-wide
    location_slug VARCHAR(100), -- For location-specific pages like /texas

    -- Content
    excerpt TEXT,
    content TEXT, -- Main content (can be HTML or Markdown)
    hero_title VARCHAR(255),
    hero_subtitle TEXT,
    hero_image_url TEXT,

    -- SEO Fields
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    canonical_url TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_url TEXT,

    -- Publishing
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'scheduled')),
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,

    -- Custom Fields (JSON for type-specific data)
    custom_fields JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique constraint for slug combination
    UNIQUE(page_type_id, slug, parent_slug, location_slug)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pages_page_type ON "Modular-buildings.co".pages(page_type_id);
CREATE INDEX IF NOT EXISTS idx_pages_status ON "Modular-buildings.co".pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON "Modular-buildings.co".pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_parent_slug ON "Modular-buildings.co".pages(parent_slug);
CREATE INDEX IF NOT EXISTS idx_pages_location_slug ON "Modular-buildings.co".pages(location_slug);
CREATE INDEX IF NOT EXISTS idx_pages_published_at ON "Modular-buildings.co".pages(published_at);

-- =====================================================
-- 3. FAQs TABLE
-- Frequently Asked Questions for pages
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES "Modular-buildings.co".pages(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_page_id ON "Modular-buildings.co".faqs(page_id);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON "Modular-buildings.co".faqs(page_id, order_index);

-- =====================================================
-- 4. INTERNAL LINKS TABLE
-- Internal linking for pages
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".internal_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES "Modular-buildings.co".pages(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_internal_links_page_id ON "Modular-buildings.co".internal_links(page_id);

-- =====================================================
-- 5. STRUCTURED DATA TABLE (Schema.org)
-- JSON-LD structured data for SEO
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".structured_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES "Modular-buildings.co".pages(id) ON DELETE CASCADE,
    schema_type VARCHAR(100) NOT NULL, -- e.g., 'Product', 'LocalBusiness', 'FAQPage', 'Organization'
    json_ld JSONB NOT NULL, -- The actual JSON-LD data
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_structured_data_page_id ON "Modular-buildings.co".structured_data(page_id);
CREATE INDEX IF NOT EXISTS idx_structured_data_type ON "Modular-buildings.co".structured_data(schema_type);

-- =====================================================
-- 6. CONTENT SECTIONS TABLE
-- Reusable content sections/blocks for pages
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".content_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES "Modular-buildings.co".pages(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL, -- e.g., 'features', 'benefits', 'specifications', 'gallery', 'cta'
    title VARCHAR(255),
    content TEXT,
    data JSONB DEFAULT '{}', -- Section-specific data
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_sections_page_id ON "Modular-buildings.co".content_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_content_sections_type ON "Modular-buildings.co".content_sections(section_type);

-- =====================================================
-- 7. MEDIA/IMAGES TABLE
-- Images and media for pages
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES "Modular-buildings.co".pages(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50), -- 'image', 'video', 'document'
    alt_text VARCHAR(255),
    caption TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_page_id ON "Modular-buildings.co".media(page_id);

-- =====================================================
-- 8. PAGE RELATIONSHIPS TABLE
-- For linking related pages
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".page_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_page_id UUID NOT NULL REFERENCES "Modular-buildings.co".pages(id) ON DELETE CASCADE,
    target_page_id UUID NOT NULL REFERENCES "Modular-buildings.co".pages(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL, -- 'related', 'child', 'parent', 'cross-sell'
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(source_page_id, target_page_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS idx_page_relationships_source ON "Modular-buildings.co".page_relationships(source_page_id);
CREATE INDEX IF NOT EXISTS idx_page_relationships_target ON "Modular-buildings.co".page_relationships(target_page_id);

-- =====================================================
-- 9. SPECIFICATIONS TABLE
-- Product specifications for modular buildings
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES "Modular-buildings.co".pages(id) ON DELETE CASCADE,
    spec_name VARCHAR(100) NOT NULL,
    spec_value TEXT NOT NULL,
    spec_unit VARCHAR(50),
    spec_group VARCHAR(100), -- e.g., 'Dimensions', 'Features', 'Materials'
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_specifications_page_id ON "Modular-buildings.co".specifications(page_id);

-- =====================================================
-- 10. URL REDIRECTS TABLE
-- For managing URL redirects
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_url TEXT NOT NULL UNIQUE,
    target_url TEXT NOT NULL,
    redirect_type INTEGER DEFAULT 301, -- 301 or 302
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. USER PROFILES TABLE (for admin)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    display_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION "Modular-buildings.co".update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'modular-buildings.co'
        AND table_name NOT IN ('page_types')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON "Modular-buildings.co".%I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON "Modular-buildings.co".%I
                FOR EACH ROW
                EXECUTE FUNCTION "Modular-buildings.co".update_updated_at_column();
        ', tbl, tbl, tbl, tbl);
    END LOOP;
END $$;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE "Modular-buildings.co".pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".internal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".structured_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".media ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".specifications ENABLE ROW LEVEL SECURITY;

-- Public read access for published pages
CREATE POLICY "Public read access for published pages" ON "Modular-buildings.co".pages
    FOR SELECT USING (status = 'published');

-- Admin full access
CREATE POLICY "Admin full access to pages" ON "Modular-buildings.co".pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Modular-buildings.co".user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Public read access for FAQs of published pages
CREATE POLICY "Public read access for faqs" ON "Modular-buildings.co".faqs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "Modular-buildings.co".pages
            WHERE id = page_id AND status = 'published'
        )
    );

-- Admin full access to FAQs
CREATE POLICY "Admin full access to faqs" ON "Modular-buildings.co".faqs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Modular-buildings.co".user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Similar policies for other tables...
CREATE POLICY "Public read for internal_links" ON "Modular-buildings.co".internal_links
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access to internal_links" ON "Modular-buildings.co".internal_links
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Modular-buildings.co".user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Public read for structured_data" ON "Modular-buildings.co".structured_data
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access to structured_data" ON "Modular-buildings.co".structured_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Modular-buildings.co".user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Public read for content_sections" ON "Modular-buildings.co".content_sections
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access to content_sections" ON "Modular-buildings.co".content_sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Modular-buildings.co".user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Public read for media" ON "Modular-buildings.co".media
    FOR SELECT USING (true);

CREATE POLICY "Admin full access to media" ON "Modular-buildings.co".media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Modular-buildings.co".user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Public read for specifications" ON "Modular-buildings.co".specifications
    FOR SELECT USING (true);

CREATE POLICY "Admin full access to specifications" ON "Modular-buildings.co".specifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Modular-buildings.co".user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'Database schema "Modular-buildings.co" created successfully!';
    RAISE NOTICE 'Tables created: page_types, pages, faqs, internal_links, structured_data, content_sections, media, page_relationships, specifications, redirects, user_profiles';
END $$;
