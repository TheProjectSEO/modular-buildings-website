-- Internal Linking System Database Schema
-- Based on WordPress Semantic Internal Linking plugin architecture
-- Implements TF-IDF algorithm for content similarity detection

-- ==================================================
-- CONTENT TABLE
-- ==================================================
-- Stores indexed content with metadata
CREATE TABLE IF NOT EXISTS internal_linking_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_ilc_page_id ON internal_linking_content(page_id);
CREATE INDEX IF NOT EXISTS idx_ilc_url_hash ON internal_linking_content(url_hash);
CREATE INDEX IF NOT EXISTS idx_ilc_status ON internal_linking_content(status);

-- ==================================================
-- TERMS TABLE
-- ==================================================
-- Stores unique terms (words) from all content
CREATE TABLE IF NOT EXISTS internal_linking_terms (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL UNIQUE,
    document_frequency INTEGER NOT NULL DEFAULT 0,
    idf_score FLOAT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ilt_term ON internal_linking_terms(term);
CREATE INDEX IF NOT EXISTS idx_ilt_doc_freq ON internal_linking_terms(document_frequency DESC);

-- ==================================================
-- TF-IDF TABLE
-- ==================================================
-- Stores TF-IDF scores for term-document pairs
CREATE TABLE IF NOT EXISTS internal_linking_tfidf (
    id BIGSERIAL PRIMARY KEY,
    content_id UUID NOT NULL REFERENCES internal_linking_content(id) ON DELETE CASCADE,
    term_id INTEGER NOT NULL REFERENCES internal_linking_terms(id) ON DELETE CASCADE,
    tfidf_score FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id, term_id)
);

CREATE INDEX IF NOT EXISTS idx_iltf_content_id ON internal_linking_tfidf(content_id);
CREATE INDEX IF NOT EXISTS idx_iltf_term_id ON internal_linking_tfidf(term_id);
CREATE INDEX IF NOT EXISTS idx_iltf_score ON internal_linking_tfidf(tfidf_score DESC);

-- ==================================================
-- SIMILARITY TABLE
-- ==================================================
-- Stores pre-calculated similarity scores between content pairs
CREATE TABLE IF NOT EXISTS internal_linking_similarity (
    id BIGSERIAL PRIMARY KEY,
    content_id_a UUID NOT NULL REFERENCES internal_linking_content(id) ON DELETE CASCADE,
    content_id_b UUID NOT NULL REFERENCES internal_linking_content(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id_a, content_id_b)
);

CREATE INDEX IF NOT EXISTS idx_ils_content_a ON internal_linking_similarity(content_id_a, similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_ils_content_b ON internal_linking_similarity(content_id_b, similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_ils_score ON internal_linking_similarity(similarity_score DESC);

-- ==================================================
-- INTERNAL LINKING SETTINGS TABLE
-- ==================================================
-- Stores configuration for the internal linking system
CREATE TABLE IF NOT EXISTS internal_linking_settings (
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
INSERT INTO internal_linking_settings (id, enabled, max_recommendations, similarity_threshold)
VALUES (gen_random_uuid(), true, 5, 0.3)
ON CONFLICT DO NOTHING;

-- ==================================================
-- INTERNAL LINKING RULES TABLE
-- ==================================================
-- Stores manual link rules (exact match and pattern-based)
CREATE TABLE IF NOT EXISTS internal_linking_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('exact', 'pattern', 'similarity')),
    match_text TEXT NOT NULL,
    target_page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    target_url TEXT,
    anchor_text TEXT,
    is_case_sensitive BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    max_replacements INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ilr_rule_type ON internal_linking_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_ilr_is_active ON internal_linking_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_ilr_priority ON internal_linking_rules(priority DESC);
CREATE INDEX IF NOT EXISTS idx_ilr_match_text ON internal_linking_rules(match_text);

-- ==================================================
-- HELPER FUNCTIONS
-- ==================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_internal_linking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_internal_linking_content_updated_at
    BEFORE UPDATE ON internal_linking_content
    FOR EACH ROW
    EXECUTE FUNCTION update_internal_linking_updated_at();

CREATE TRIGGER update_internal_linking_settings_updated_at
    BEFORE UPDATE ON internal_linking_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_internal_linking_updated_at();

CREATE TRIGGER update_internal_linking_rules_updated_at
    BEFORE UPDATE ON internal_linking_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_internal_linking_updated_at();

-- ==================================================
-- RLS POLICIES
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE internal_linking_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_linking_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_linking_tfidf ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_linking_similarity ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_linking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_linking_rules ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for admin API)
CREATE POLICY "Service role has full access to content"
    ON internal_linking_content FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to terms"
    ON internal_linking_terms FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to tfidf"
    ON internal_linking_tfidf FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to similarity"
    ON internal_linking_similarity FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to settings"
    ON internal_linking_settings FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to rules"
    ON internal_linking_rules FOR ALL
    USING (auth.role() = 'service_role');

-- Allow anonymous read access to similarity data (for public recommendation display)
CREATE POLICY "Anyone can read similarity data"
    ON internal_linking_similarity FOR SELECT
    USING (true);

CREATE POLICY "Anyone can read content metadata"
    ON internal_linking_content FOR SELECT
    USING (status = 'indexed');

-- ==================================================
-- COMMENTS
-- ==================================================

COMMENT ON TABLE internal_linking_content IS 'Stores indexed content with TF-IDF vectors for similarity calculation';
COMMENT ON TABLE internal_linking_terms IS 'Dictionary of unique terms across all content with IDF scores';
COMMENT ON TABLE internal_linking_tfidf IS 'TF-IDF scores for each term in each document';
COMMENT ON TABLE internal_linking_similarity IS 'Pre-calculated cosine similarity scores between content pairs';
COMMENT ON TABLE internal_linking_settings IS 'Global configuration for internal linking system';
COMMENT ON TABLE internal_linking_rules IS 'Manual link insertion rules for exact matches and patterns';

COMMENT ON COLUMN internal_linking_content.vector_norm IS 'L2 norm of TF-IDF vector for cosine similarity calculation';
COMMENT ON COLUMN internal_linking_terms.idf_score IS 'IDF score: log(total_docs / docs_with_term)';
COMMENT ON COLUMN internal_linking_tfidf.tfidf_score IS 'Combined TF * IDF score';
COMMENT ON COLUMN internal_linking_similarity.similarity_score IS 'Cosine similarity score between 0 and 1';
