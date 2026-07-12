-- Portfolio Database Schema
-- This migration creates all tables needed for the portfolio CMS

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CONTACT SYSTEM
-- ============================================================================

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'spam')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for admin dashboard
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- ============================================================================
-- BLOG SYSTEM
-- ============================================================================

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- MDX content
  cover_image TEXT, -- URL to image
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  reading_time INTEGER, -- estimated reading time in minutes
  meta_title TEXT, -- SEO title override
  meta_description TEXT, -- SEO description override
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for blog performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC) WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = TRUE;

-- Blog post views tracking (optional analytics)
CREATE TABLE IF NOT EXISTS blog_post_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_post_views_post_id ON blog_post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_created_at ON blog_post_views(created_at DESC);

-- ============================================================================
-- PORTFOLIO CMS SYSTEM
-- ============================================================================

-- Projects (migrated from portfolio.json)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  technologies TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  type TEXT DEFAULT 'personal' CHECK (type IN ('personal', 'freelance', 'company', 'open_source')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  started_date DATE,
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published, sort_order) WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);

-- Experience entries
CREATE TABLE IF NOT EXISTS experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  description TEXT,
  duration_start DATE NOT NULL,
  duration_end DATE, -- NULL for current position
  is_current BOOLEAN DEFAULT FALSE,
  company_url TEXT,
  company_logo TEXT,
  achievements TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experience_published ON experience(published, sort_order) WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_experience_current ON experience(is_current) WHERE is_current = TRUE;

-- Skills categories and items
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT, -- Icon name or URL
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  proficiency INTEGER DEFAULT 3 CHECK (proficiency >= 1 AND proficiency <= 5),
  years_experience INTEGER,
  icon TEXT, -- Icon name or URL
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_published ON skills(published) WHERE published = TRUE;

-- Education entries
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE, -- NULL for ongoing
  grade TEXT, -- GPA, percentage, classification
  description TEXT,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_education_published ON education(published, sort_order) WHERE published = TRUE;

-- Certificates and awards
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE, -- NULL if no expiry
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  skills TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificates_published ON certificates(published, sort_order) WHERE published = TRUE;

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  linkedin_url TEXT,
  project_relation TEXT, -- which project this testimonial is for
  approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved, sort_order) WHERE approved = TRUE;
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured) WHERE featured = TRUE;

-- ============================================================================
-- NOW PAGE SYSTEM
-- ============================================================================

-- What I'm doing now (single record, versioned)
CREATE TABLE IF NOT EXISTS now_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content JSONB NOT NULL, -- Structured content sections
  location TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_current BOOLEAN DEFAULT FALSE, -- Only one record should be current
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure only one current record
CREATE UNIQUE INDEX IF NOT EXISTS idx_now_updates_current ON now_updates(is_current) WHERE is_current = TRUE;

-- ============================================================================
-- PERSONAL INFO & SETTINGS
-- ============================================================================

-- Site settings and personal info (single record)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_title TEXT DEFAULT 'Rizwan Ahmed',
  site_description TEXT DEFAULT 'Full Stack Developer Portfolio',
  personal_info JSONB NOT NULL DEFAULT '{}', -- All personal info as JSON
  social_links JSONB NOT NULL DEFAULT '{}', -- Social media links
  contact_email TEXT,
  resume_url TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (personal_info, social_links) 
VALUES ('{}', '{}') 
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ANALYTICS & TRACKING
-- ============================================================================

-- Simple page views tracking
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  referrer TEXT,
  ip_address INET,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);

-- Chat sessions for analytics
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  messages_count INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  response_time INTEGER, -- milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, created_at);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE OR REPLACE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one current now_update
CREATE OR REPLACE FUNCTION ensure_single_current_now_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_current = TRUE THEN
        UPDATE now_updates SET is_current = FALSE WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER ensure_single_current_now_update_trigger 
    BEFORE INSERT OR UPDATE ON now_updates 
    FOR EACH ROW EXECUTE FUNCTION ensure_single_current_now_update();

-- Function to calculate reading time for blog posts
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
    word_count INTEGER;
    reading_time INTEGER;
BEGIN
    -- Estimate word count (rough calculation)
    word_count := array_length(string_to_array(regexp_replace(content, '<[^>]+>', '', 'g'), ' '), 1);
    -- Average reading speed: 200 words per minute
    reading_time := GREATEST(1, CEIL(word_count::DECIMAL / 200));
    RETURN reading_time;
END;
$$ language 'plpgsql';

-- Trigger to auto-calculate reading time for blog posts
CREATE OR REPLACE FUNCTION update_blog_post_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reading_time := calculate_reading_time(NEW.content);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_blog_post_reading_time_trigger 
    BEFORE INSERT OR UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_blog_post_reading_time();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE now_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
CREATE POLICY "Public can read published blog posts" ON blog_posts FOR SELECT USING (published = TRUE);
CREATE POLICY "Public can read published projects" ON projects FOR SELECT USING (published = TRUE);
CREATE POLICY "Public can read published experience" ON experience FOR SELECT USING (published = TRUE);
CREATE POLICY "Public can read published skills" ON skills FOR SELECT USING (published = TRUE);
CREATE POLICY "Public can read published skill categories" ON skill_categories FOR SELECT USING (published = TRUE);
CREATE POLICY "Public can read published education" ON education FOR SELECT USING (published = TRUE);
CREATE POLICY "Public can read published certificates" ON certificates FOR SELECT USING (published = TRUE);
CREATE POLICY "Public can read approved testimonials" ON testimonials FOR SELECT USING (approved = TRUE);
CREATE POLICY "Public can read current now updates" ON now_updates FOR SELECT USING (is_current = TRUE);
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (TRUE);

-- Public insert policies for user-generated content
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can track page views" ON page_views FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can track blog views" ON blog_post_views FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can create chat sessions" ON chat_sessions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can add chat messages" ON chat_messages FOR INSERT WITH CHECK (TRUE);

-- Service role (admin) policies - full access
CREATE POLICY "Service role can do everything on contact_submissions" ON contact_submissions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on projects" ON projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on experience" ON experience FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on skills" ON skills FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on skill_categories" ON skill_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on education" ON education FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on certificates" ON certificates FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on testimonials" ON testimonials FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on now_updates" ON now_updates FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on site_settings" ON site_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can read analytics" ON page_views FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role can read chat analytics" ON chat_sessions FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role can read chat messages" ON chat_messages FOR SELECT USING (auth.role() = 'service_role');

-- Note: After setting up Supabase Auth, replace service_role checks with proper user authentication
-- Example: auth.uid() = 'admin-user-uuid' for a single admin user