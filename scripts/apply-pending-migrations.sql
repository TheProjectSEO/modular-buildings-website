-- =====================================================
-- Apply Pending Migrations for Karmod Website
-- =====================================================
-- This script applies blog and internal linking migrations
-- to the Modular-buildings.co schema
--
-- To run this:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Paste this entire script
-- 4. Click "Run"
-- =====================================================

-- =====================================================
-- BLOG SYSTEM MIGRATION
-- =====================================================

-- Create authors table
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_id UUID REFERENCES "Modular-buildings.co".authors(id) ON DELETE SET NULL,
    category TEXT,
    featured_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_time INTEGER,
    seo_title TEXT,
    seo_description TEXT,
    faq_schema JSONB DEFAULT '[]',
    custom_schema JSONB DEFAULT '{}',
    callouts JSONB DEFAULT '[]'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON "Modular-buildings.co".blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON "Modular-buildings.co".blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON "Modular-buildings.co".blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON "Modular-buildings.co".blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON "Modular-buildings.co".blog_posts(published_at DESC);

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON "Modular-buildings.co".blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON "Modular-buildings.co".blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for authors
DROP TRIGGER IF EXISTS update_authors_updated_at ON "Modular-buildings.co".authors;
CREATE TRIGGER update_authors_updated_at
    BEFORE UPDATE ON "Modular-buildings.co".authors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "Modular-buildings.co".authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Authors are viewable by everyone" ON "Modular-buildings.co".authors;
DROP POLICY IF EXISTS "Authors are manageable by service role" ON "Modular-buildings.co".authors;
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON "Modular-buildings.co".blog_posts;
DROP POLICY IF EXISTS "Blog posts are manageable by service role" ON "Modular-buildings.co".blog_posts;

-- RLS Policies for authors
CREATE POLICY "Authors are viewable by everyone"
    ON "Modular-buildings.co".authors FOR SELECT
    USING (true);

CREATE POLICY "Authors are manageable by service role"
    ON "Modular-buildings.co".authors FOR ALL
    USING (auth.role() = 'service_role');

-- RLS Policies for blog_posts
CREATE POLICY "Published blog posts are viewable by everyone"
    ON "Modular-buildings.co".blog_posts FOR SELECT
    USING (is_published = true OR auth.role() = 'service_role');

CREATE POLICY "Blog posts are manageable by service role"
    ON "Modular-buildings.co".blog_posts FOR ALL
    USING (auth.role() = 'service_role');

-- Insert sample author
INSERT INTO "Modular-buildings.co".authors (name, email, avatar_url, bio, social_links)
VALUES (
    'Mehmet Johnson',
    'mehmet.johnson@karmod.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet',
    'Senior Construction Consultant with over 15 years of experience in modular and prefabricated building solutions.',
    '{"twitter": "https://twitter.com/mehmetj", "linkedin": "https://linkedin.com/in/mehmetjohnson"}'
)
ON CONFLICT (email) DO NOTHING;

-- Comments
COMMENT ON TABLE "Modular-buildings.co".authors IS 'Blog post authors with profile information';
COMMENT ON TABLE "Modular-buildings.co".blog_posts IS 'Blog posts with full content, SEO, and schema support';
COMMENT ON COLUMN "Modular-buildings.co".blog_posts.faq_schema IS 'JSON array of FAQ items for FAQPage schema';
COMMENT ON COLUMN "Modular-buildings.co".blog_posts.custom_schema IS 'Custom schema.org JSON-LD data';
COMMENT ON COLUMN "Modular-buildings.co".blog_posts.callouts IS 'Array of callout boxes to display in content';

-- =====================================================
-- INTERNAL LINKING SYSTEM MIGRATION
-- =====================================================

-- Content table
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".internal_linking_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES "Modular-buildings.co".pages(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    url_hash TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    word_count INTEGER NOT NULL DEFAULT 0,
    vector_norm FLOAT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'indexed', 'error')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ilc_page_id ON "Modular-buildings.co".internal_linking_content(page_id);
CREATE INDEX IF NOT EXISTS idx_ilc_url_hash ON "Modular-buildings.co".internal_linking_content(url_hash);
CREATE INDEX IF NOT EXISTS idx_ilc_status ON "Modular-buildings.co".internal_linking_content(status);

-- Terms table
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".internal_linking_terms (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL UNIQUE,
    document_frequency INTEGER NOT NULL DEFAULT 0,
    idf_score FLOAT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ilt_term ON "Modular-buildings.co".internal_linking_terms(term);
CREATE INDEX IF NOT EXISTS idx_ilt_doc_freq ON "Modular-buildings.co".internal_linking_terms(document_frequency DESC);

-- TF-IDF table
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".internal_linking_tfidf (
    id BIGSERIAL PRIMARY KEY,
    content_id UUID NOT NULL REFERENCES "Modular-buildings.co".internal_linking_content(id) ON DELETE CASCADE,
    term_id INTEGER NOT NULL REFERENCES "Modular-buildings.co".internal_linking_terms(id) ON DELETE CASCADE,
    tfidf_score FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id, term_id)
);

CREATE INDEX IF NOT EXISTS idx_iltf_content_id ON "Modular-buildings.co".internal_linking_tfidf(content_id);
CREATE INDEX IF NOT EXISTS idx_iltf_term_id ON "Modular-buildings.co".internal_linking_tfidf(term_id);
CREATE INDEX IF NOT EXISTS idx_iltf_score ON "Modular-buildings.co".internal_linking_tfidf(tfidf_score DESC);

-- Similarity table
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".internal_linking_similarity (
    id BIGSERIAL PRIMARY KEY,
    content_id_a UUID NOT NULL REFERENCES "Modular-buildings.co".internal_linking_content(id) ON DELETE CASCADE,
    content_id_b UUID NOT NULL REFERENCES "Modular-buildings.co".internal_linking_content(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id_a, content_id_b)
);

CREATE INDEX IF NOT EXISTS idx_ils_content_a ON "Modular-buildings.co".internal_linking_similarity(content_id_a, similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_ils_content_b ON "Modular-buildings.co".internal_linking_similarity(content_id_b, similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_ils_score ON "Modular-buildings.co".internal_linking_similarity(similarity_score DESC);

-- Settings table
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".internal_linking_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enabled BOOLEAN DEFAULT true,
    max_recommendations INTEGER DEFAULT 5 CHECK (max_recommendations BETWEEN 1 AND 20),
    similarity_threshold FLOAT DEFAULT 0.3 CHECK (similarity_threshold BETWEEN 0 AND 1),
    max_terms_per_doc INTEGER DEFAULT 100,
    max_similar_per_doc INTEGER DEFAULT 20,
    auto_index BOOLEAN DEFAULT false,
    display_position TEXT DEFAULT 'after_content' CHECK (display_position IN ('after_content', 'manual')),
    heading_text TEXT DEFAULT 'Related Articles',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT
);

-- Insert default settings
INSERT INTO "Modular-buildings.co".internal_linking_settings (id, enabled, max_recommendations, similarity_threshold)
VALUES (gen_random_uuid(), true, 5, 0.3)
ON CONFLICT DO NOTHING;

-- Rules table
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".internal_linking_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('exact', 'pattern', 'similarity')),
    match_text TEXT NOT NULL,
    target_page_id UUID REFERENCES "Modular-buildings.co".pages(id) ON DELETE CASCADE,
    target_url TEXT,
    anchor_text TEXT,
    is_case_sensitive BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    max_replacements INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ilr_rule_type ON "Modular-buildings.co".internal_linking_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_ilr_is_active ON "Modular-buildings.co".internal_linking_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_ilr_priority ON "Modular-buildings.co".internal_linking_rules(priority DESC);
CREATE INDEX IF NOT EXISTS idx_ilr_match_text ON "Modular-buildings.co".internal_linking_rules(match_text);

-- Helper function for triggers
CREATE OR REPLACE FUNCTION update_internal_linking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_internal_linking_content_updated_at ON "Modular-buildings.co".internal_linking_content;
CREATE TRIGGER update_internal_linking_content_updated_at
    BEFORE UPDATE ON "Modular-buildings.co".internal_linking_content
    FOR EACH ROW
    EXECUTE FUNCTION update_internal_linking_updated_at();

DROP TRIGGER IF EXISTS update_internal_linking_settings_updated_at ON "Modular-buildings.co".internal_linking_settings;
CREATE TRIGGER update_internal_linking_settings_updated_at
    BEFORE UPDATE ON "Modular-buildings.co".internal_linking_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_internal_linking_updated_at();

DROP TRIGGER IF EXISTS update_internal_linking_rules_updated_at ON "Modular-buildings.co".internal_linking_rules;
CREATE TRIGGER update_internal_linking_rules_updated_at
    BEFORE UPDATE ON "Modular-buildings.co".internal_linking_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_internal_linking_updated_at();

-- Enable RLS on all tables
ALTER TABLE "Modular-buildings.co".internal_linking_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".internal_linking_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".internal_linking_tfidf ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".internal_linking_similarity ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".internal_linking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Modular-buildings.co".internal_linking_rules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role has full access to content" ON "Modular-buildings.co".internal_linking_content;
DROP POLICY IF EXISTS "Service role has full access to terms" ON "Modular-buildings.co".internal_linking_terms;
DROP POLICY IF EXISTS "Service role has full access to tfidf" ON "Modular-buildings.co".internal_linking_tfidf;
DROP POLICY IF EXISTS "Service role has full access to similarity" ON "Modular-buildings.co".internal_linking_similarity;
DROP POLICY IF EXISTS "Service role has full access to settings" ON "Modular-buildings.co".internal_linking_settings;
DROP POLICY IF EXISTS "Service role has full access to rules" ON "Modular-buildings.co".internal_linking_rules;
DROP POLICY IF EXISTS "Anyone can read similarity data" ON "Modular-buildings.co".internal_linking_similarity;
DROP POLICY IF EXISTS "Anyone can read content metadata" ON "Modular-buildings.co".internal_linking_content;

-- Create RLS policies
CREATE POLICY "Service role has full access to content"
    ON "Modular-buildings.co".internal_linking_content FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to terms"
    ON "Modular-buildings.co".internal_linking_terms FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to tfidf"
    ON "Modular-buildings.co".internal_linking_tfidf FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to similarity"
    ON "Modular-buildings.co".internal_linking_similarity FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to settings"
    ON "Modular-buildings.co".internal_linking_settings FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to rules"
    ON "Modular-buildings.co".internal_linking_rules FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can read similarity data"
    ON "Modular-buildings.co".internal_linking_similarity FOR SELECT
    USING (true);

CREATE POLICY "Anyone can read content metadata"
    ON "Modular-buildings.co".internal_linking_content FOR SELECT
    USING (status = 'indexed');

-- Comments
COMMENT ON TABLE "Modular-buildings.co".internal_linking_content IS 'Stores indexed content with TF-IDF vectors for similarity calculation';
COMMENT ON TABLE "Modular-buildings.co".internal_linking_terms IS 'Dictionary of unique terms across all content with IDF scores';
COMMENT ON TABLE "Modular-buildings.co".internal_linking_tfidf IS 'TF-IDF scores for each term in each document';
COMMENT ON TABLE "Modular-buildings.co".internal_linking_similarity IS 'Pre-calculated cosine similarity scores between content pairs';
COMMENT ON TABLE "Modular-buildings.co".internal_linking_settings IS 'Global configuration for internal linking system';
COMMENT ON TABLE "Modular-buildings.co".internal_linking_rules IS 'Manual link insertion rules for exact matches and patterns';

COMMENT ON COLUMN "Modular-buildings.co".internal_linking_content.vector_norm IS 'L2 norm of TF-IDF vector for cosine similarity calculation';
COMMENT ON COLUMN "Modular-buildings.co".internal_linking_terms.idf_score IS 'IDF score: log(total_docs / docs_with_term)';
COMMENT ON COLUMN "Modular-buildings.co".internal_linking_tfidf.tfidf_score IS 'Combined TF * IDF score';
COMMENT ON COLUMN "Modular-buildings.co".internal_linking_similarity.similarity_score IS 'Cosine similarity score between 0 and 1';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Blog system and internal linking tables have been created
-- You can now run: npm run build
-- =====================================================
