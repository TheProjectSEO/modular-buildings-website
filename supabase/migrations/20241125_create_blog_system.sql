-- Create authors table
CREATE TABLE IF NOT EXISTS public.authors (
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
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
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
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blog_posts
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for authors
CREATE TRIGGER update_authors_updated_at
    BEFORE UPDATE ON public.authors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authors (read-only for public, full access for service role)
CREATE POLICY "Authors are viewable by everyone"
    ON public.authors FOR SELECT
    USING (true);

CREATE POLICY "Authors are manageable by service role"
    ON public.authors FOR ALL
    USING (auth.role() = 'service_role');

-- RLS Policies for blog_posts
CREATE POLICY "Published blog posts are viewable by everyone"
    ON public.blog_posts FOR SELECT
    USING (is_published = true OR auth.role() = 'service_role');

CREATE POLICY "Blog posts are manageable by service role"
    ON public.blog_posts FOR ALL
    USING (auth.role() = 'service_role');

-- Insert sample author
INSERT INTO public.authors (name, email, avatar_url, bio, social_links)
VALUES (
    'Mehmet Johnson',
    'mehmet.johnson@karmod.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet',
    'Senior Construction Consultant with over 15 years of experience in modular and prefabricated building solutions.',
    '{"twitter": "https://twitter.com/mehmetj", "linkedin": "https://linkedin.com/in/mehmetjohnson"}'
)
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE public.authors IS 'Blog post authors with profile information';
COMMENT ON TABLE public.blog_posts IS 'Blog posts with full content, SEO, and schema support';
COMMENT ON COLUMN public.blog_posts.faq_schema IS 'JSON array of FAQ items for FAQPage schema';
COMMENT ON COLUMN public.blog_posts.custom_schema IS 'Custom schema.org JSON-LD data';
COMMENT ON COLUMN public.blog_posts.callouts IS 'Array of callout boxes to display in content';
