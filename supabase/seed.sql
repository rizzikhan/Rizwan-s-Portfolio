-- Seed data for portfolio database
-- This script populates the database with existing portfolio.json data

-- ============================================================================
-- SITE SETTINGS AND PERSONAL INFO
-- ============================================================================

UPDATE site_settings SET 
  site_title = 'Rizwan Ahmed - Backend Developer & AI Engineer',
  site_description = 'Backend Developer & AI Engineer with 2+ years of experience building production-grade Python/Django platforms and AI-powered products.',
  personal_info = '{
    "name": "Rizwan Ahmed",
    "role": "Backend Developer & AI Engineer",
    "description": "Backend Developer & AI Engineer with 2+ years of experience building production-grade Python/Django platforms and AI-powered products. Specialized in REST APIs, LLM integrations (OpenAI, LangChain, RAG), and RLHF-based model evaluation for leading AI labs. Experienced with real-time systems using Django Channels, Celery, and Redis, multi-tenant SaaS architecture, and cloud deployment with Docker and AWS. Strong communicator with a track record of shipping cross-platform AI products end-to-end.",
    "availability": "Available for new projects",
    "location": "Lahore, Pakistan",
    "phone": "+92-300-8645286",
    "portfolio": ""
  }',
  social_links = '{
    "github": "https://github.com/rizzikhan",
    "linkedin": "http://www.linkedin.com/in/rizwanahmed66",
    "portfolio": ""
  }',
  contact_email = 'rizzikhan66@gmail.com';

-- ============================================================================
-- SKILL CATEGORIES AND SKILLS
-- ============================================================================

-- Insert skill categories
INSERT INTO skill_categories (name, icon, sort_order) VALUES
('Frontend', '🎨', 1),
('Backend', '⚙️', 2),
('Database', '🗄️', 3),
('Cloud & DevOps', '☁️', 4),
('Integration', '🔗', 5),
('AI & ML', '🤖', 6),
('Testing', '🧪', 7),
('Tools', '🛠️', 8),
('Languages', '💻', 9),
('Methodologies', '📋', 10)
ON CONFLICT (name) DO UPDATE SET 
  icon = EXCLUDED.icon, 
  sort_order = EXCLUDED.sort_order;

-- Get category IDs for inserting skills
DO $$
DECLARE
  frontend_id UUID;
  backend_id UUID;
  database_id UUID;
  cloud_id UUID;
  integration_id UUID;
  ai_id UUID;
  testing_id UUID;
  tools_id UUID;
  languages_id UUID;
  methodologies_id UUID;
BEGIN
  SELECT id INTO frontend_id FROM skill_categories WHERE name = 'Frontend';
  SELECT id INTO backend_id FROM skill_categories WHERE name = 'Backend';
  SELECT id INTO database_id FROM skill_categories WHERE name = 'Database';
  SELECT id INTO cloud_id FROM skill_categories WHERE name = 'Cloud & DevOps';
  SELECT id INTO integration_id FROM skill_categories WHERE name = 'Integration';
  SELECT id INTO ai_id FROM skill_categories WHERE name = 'AI & ML';
  SELECT id INTO testing_id FROM skill_categories WHERE name = 'Testing';
  SELECT id INTO tools_id FROM skill_categories WHERE name = 'Tools';
  SELECT id INTO languages_id FROM skill_categories WHERE name = 'Languages';
  SELECT id INTO methodologies_id FROM skill_categories WHERE name = 'Methodologies';

  -- Insert skills
  -- Frontend skills
  INSERT INTO skills (name, category_id, proficiency, sort_order) VALUES
  ('HTML/CSS', frontend_id, 4, 1),
  ('JavaScript', frontend_id, 4, 2),
  ('TypeScript', frontend_id, 4, 3),
  ('Tailwind CSS', frontend_id, 4, 4);

  -- Backend skills
  INSERT INTO skills (name, category_id, proficiency, sort_order) VALUES
  ('Python', backend_id, 5, 1),
  ('Django', backend_id, 5, 2),
  ('Django REST Framework', backend_id, 5, 3),
  ('FastAPI', backend_id, 4, 4),
  ('Flask', backend_id, 4, 5),
  ('Django Channels', backend_id, 4, 6),
  ('Celery', backend_id, 4, 7),
  ('GraphQL', backend_id, 4, 8),
  ('REST APIs', backend_id, 5, 9);

  -- Database skills
  INSERT INTO skills (name, category_id, proficiency, sort_order) VALUES
  ('PostgreSQL', database_id, 5, 1),
  ('MySQL', database_id, 4, 2),
  ('SQLite', database_id, 4, 3),
  ('Redis', database_id, 4, 4);

  -- Cloud & DevOps skills
  INSERT INTO skills (name, category_id, proficiency, sort_order) VALUES
  ('AWS', cloud_id, 4, 1),
  ('Docker', cloud_id, 4, 2),
  ('GitHub Actions', cloud_id, 4, 3),
  ('CI/CD Pipelines', cloud_id, 4, 4),
  ('Ngrok', cloud_id, 3, 5);

  -- Integration skills
  INSERT INTO skills (name, category_id, proficiency, sort_order) VALUES
  ('OpenAI Function Calling', integration_id, 5, 1),
  ('Stripe Integration', integration_id, 4, 2),
  ('Twilio SMS/Email', integration_id, 4, 3),
  ('Firebase', integration_id, 4, 4),
  ('Web Scraping (Selenium)', integration_id, 4, 5),
  ('WebSockets', integration_id, 4, 6),
  ('Swagger/OpenAPI', integration_id, 4, 7);

  -- AI & ML skills
  INSERT INTO skills (name, category_id, proficiency, sort_order) VALUES
  ('RLHF (Reinforcement Learning from Human Feedback)', ai_id, 5, 1),
  ('LangChain', ai_id, 5, 2),
  ('Retrieval-Augmented Generation (RAG)', ai_id, 5, 3),
  ('Prompt Engineering', ai_id, 5, 4),
  ('LLM Fine-tuning', ai_id, 4, 5),
  ('AI Safety & Model Evaluation', ai_id, 4, 6),
  ('OpenAI GPT', ai_id, 5, 7),
  ('Anthropic Claude', ai_id, 4, 8),
  ('Meta Llama', ai_id, 4, 9),
  ('Google Gemini', ai_id, 4, 10),
  ('Qwen', ai_id, 3, 11),
  ('DALL·E', ai_id, 4, 12);

  -- Testing skills
  INSERT INTO skills (name, category_id, proficiency, sort_order) VALUES
  ('Pytest', testing_id, 4, 1),
  ('Unit Testing', testing_id, 4, 2);

  -- Tools skills
  INSERT INTO skills (name, category_id, proficiency, sort_order) VALUES
  ('VS Code', tools_id, 5, 1),
  ('Git', tools_id, 5, 2),
  ('GitHub', tools_id, 5, 3),
  ('Eclipse', tools_id, 3, 4),
  ('Android Studio', tools_id, 3, 5),
  ('Cursor AI', tools_id, 5, 6),
  ('Marsecode', tools_id, 4, 7);

  -- Languages skills
  INSERT INTO skills (name, category_id, proficiency, sort_order) VALUES
  ('Python', languages_id, 5, 1),
  ('Java', languages_id, 3, 2),
  ('C++', languages_id, 3, 3),
  ('JavaScript', languages_id, 4, 4),
  ('TypeScript', languages_id, 4, 5),
  ('SQL', languages_id, 4, 6);

  -- Methodologies skills
  INSERT INTO skills (name, category_id, proficiency, sort_order) VALUES
  ('Agile Methodologies', methodologies_id, 4, 1),
  ('Jira', methodologies_id, 4, 2),
  ('Microservices', methodologies_id, 4, 3),
  ('Multi-Tenant SaaS Architecture', methodologies_id, 5, 4),
  ('RBAC (Role-Based Access Control)', methodologies_id, 4, 5);
END $$;

-- ============================================================================
-- EXPERIENCE
-- ============================================================================

-- Insert experience entries
INSERT INTO experience (company, position, location, duration_start, duration_end, is_current, achievements, technologies, sort_order) VALUES
('CRYMZEE Networks', 'Python Django Developer | Backend & AI Engineer', 'Lahore, Pakistan', '2025-08-01', NULL, TRUE, 
ARRAY[
  'Developed cross-platform AI-driven nutrition and fitness app (Web, Android, iOS) helping users manage health goals through personalized meal and exercise plans',
  'Built AI-powered HRM platform enabling intelligent employee performance evaluation, employer ratings, and dispute management workflows',
  'Created AI-powered coupon aggregation platform that discovers, verifies, and delivers real-time working promo codes',
  'Implemented RBAC systems, secure REST APIs with JWT authentication, and scalable backend architecture using Django and PostgreSQL',
  'Integrated real-time communication using Django Channels, WebSockets, Redis, and Firebase for seamless collaboration'
],
ARRAY['Python', 'Django', 'OpenAI', 'DALL·E', 'Celery', 'Redis', 'Docker', 'AWS', 'Stripe', 'Firebase', 'PostgreSQL', 'Django Channels', 'WebSockets', 'JWT'],
1),

('Hubble42', 'Python Django Developer | RLHF Specialist (Contractor via Turing)', 'Lahore, Pakistan', '2025-01-01', '2025-08-01', FALSE,
ARRAY[
  'Provided RLHF training for leading AI companies, evaluating multiple large language models (GPT, Claude, Llama, Gemini) and improving AI alignment, safety, and performance',
  'Architected production-grade multi-tenant SaaS platform using Python with Django monolith, with real-time event streaming via Redis',
  'Designed and implemented dynamic AI-powered chatbot using Retrieval-Augmented Generation (RAG) and LangChain',
  'Built comprehensive API ecosystem with Django REST Framework, GraphQL APIs, and WebSockets integration via Django Channels'
],
ARRAY['Python', 'Django', 'RLHF', 'Prompt Engineering', 'Model Evaluation', 'AI Safety', 'GPT', 'Claude', 'Llama', 'Gemini', 'Redis', 'LangChain', 'RAG', 'GraphQL', 'Django Channels', 'PostgreSQL', 'pytest'],
2),

('Piecyfer', 'Python Intern & Associate Software Engineer', 'Lahore, Pakistan', '2024-03-01', '2025-01-01', FALSE,
ARRAY[
  'Built comprehensive e-commerce platform using Python, Django, REST APIs, and Stripe payment integration',
  'Developed RAG-based AI chatbot with LangChain for real-time customer support and dynamic user interaction',
  'Implemented multi-role system architecture with Admin, Merchant, and Consumer access levels',
  'Integrated Twilio for SMS authentication and email processing, enabling secure product listing and purchasing',
  'Gained hands-on experience with Selenium for web scraping and automation'
],
ARRAY['Python', 'Django', 'JavaScript', 'LangChain', 'Tailwind CSS', 'REST APIs', 'Stripe', 'Twilio', 'RAG', 'Selenium'],
3);

-- ============================================================================
-- PROJECTS
-- ============================================================================

-- Insert featured projects from experience
INSERT INTO projects (name, description, detailed_description, technologies, achievements, live_url, github_url, type, status, featured, sort_order, started_date, completed_date) VALUES
('Nutrimode – AI-Powered Nutrition & Fitness Platform', 
'Cross-platform AI-driven nutrition and fitness app (Web, Android, iOS) helping users manage health goals through personalized meal and exercise plans.',
'Comprehensive fitness and nutrition platform that leverages AI to provide personalized meal planning and exercise routines. Features interactive dashboards, AI-generated meal visualizations using DALL·E, virtual appointments, subscription plans, and real-time notifications.',
ARRAY['Python', 'Django', 'OpenAI', 'DALL·E', 'Celery', 'Redis', 'Docker', 'AWS', 'Stripe', 'Firebase'],
ARRAY[
  'Developed cross-platform AI-driven nutrition and fitness app (Web, Android, iOS)',
  'Built interactive dashboards for tracking nutrition targets and integrated AI-based meal generation',
  'Added virtual appointments via Google Meet and subscription plans with Stripe',
  'Implemented Celery with Redis for background tasks and deployed using Docker and AWS'
],
'https://nutrimode.dev.crymzee.com/',
'',
'company',
'completed',
TRUE,
1,
'2025-09-01',
'2025-09-30'),

('AI-Powered Human Resource Management (HRM) Platform',
'Cross-platform AI-powered HRM platform (Web, Android, iOS) enabling intelligent employee performance evaluation, employer ratings, and dispute management workflows.',
'Advanced HRM system with AI-powered features for performance evaluation, rating systems, and automated dispute resolution. Includes multi-role architecture, real-time communication, and comprehensive payment processing.',
ARRAY['Python', 'Django', 'PostgreSQL', 'Django Channels', 'WebSockets', 'Redis', 'JWT', 'Stripe', 'Firebase'],
ARRAY[
  'Developed cross-platform AI-powered HRM platform with intelligent performance evaluation',
  'Implemented RBAC (Employee, Employer, Admin, Dispute Manager) with secure REST APIs',
  'Built real-time communication using Django Channels and WebSockets',
  'Integrated Stripe subscriptions and webhook automation for billing management'
],
'',
'',
'company',
'completed',
TRUE,
2,
'2025-10-01',
'2025-10-31'),

('AI Coupon Finder & Promo Code Aggregator',
'AI-powered coupon aggregation platform that discovers, verifies, and delivers real-time working promo codes.',
'Intelligent coupon discovery system using OpenAI Web Search Function Calling to find and verify promotional codes. Features user validation, rating system, and advanced tracking capabilities for both logged and anonymous users.',
ARRAY['Python', 'Django REST Framework', 'PostgreSQL', 'Celery', 'Redis', 'OpenAI', 'Docker', 'AWS', 'Swagger'],
ARRAY[
  'Developed AI-powered coupon aggregation platform using OpenAI Web Search Function Calling',
  'Built scalable backend with Django REST Framework and asynchronous automation',
  'Integrated Firebase for real-time updates and Docker/AWS for deployment',
  'Documented complete API with Swagger for easy integration and testing'
],
'https://ai-coupon-finder.dev.crymzee.com/',
'',
'company',
'completed',
TRUE,
3,
'2025-08-01',
'2025-08-31'),

('IntelliFlow - AI-Powered Multi-Tenant SaaS Platform',
'Production-grade multi-tenant SaaS platform with real-time event streaming and an AI-powered RAG chatbot.',
'Enterprise-level multi-tenant SaaS architecture featuring real-time event streaming, comprehensive API ecosystem, and advanced AI-powered customer support through RAG implementation.',
ARRAY['Python', 'Django', 'Redis', 'LangChain', 'RAG', 'GraphQL', 'Django Channels', 'PostgreSQL', 'pytest'],
ARRAY[
  'Architected production-grade multi-tenant SaaS platform using Django monolith',
  'Designed dynamic AI-powered chatbot using RAG and LangChain',
  'Built comprehensive API ecosystem with REST, GraphQL, and WebSockets',
  'Integrated enterprise-grade monitoring with multi-tenant data isolation'
],
'',
'https://github.com/rizzikhan',
'personal',
'completed',
TRUE,
4,
'2025-03-01',
'2025-03-31'),

('NexaCommerce Store',
'Comprehensive e-commerce platform with a RAG-based AI chatbot and multi-role access system.',
'Full-featured e-commerce solution with advanced AI customer support, secure payment processing, and sophisticated role-based access control for different user types.',
ARRAY['Python', 'Django', 'JavaScript', 'LangChain', 'Tailwind CSS', 'REST APIs', 'Stripe', 'Twilio'],
ARRAY[
  'Built comprehensive e-commerce platform with Stripe payment integration',
  'Implemented RAG-based AI chatbot with LangChain for real-time customer support',
  'Created multi-role system with Admin, Merchant, and Consumer access levels',
  'Integrated Twilio for SMS authentication and email processing'
],
'',
'https://github.com/rizzikhan/NexaCommerce',
'personal',
'completed',
FALSE,
5,
'2025-01-01',
'2025-01-31');

-- ============================================================================
-- EDUCATION
-- ============================================================================

INSERT INTO education (institution, degree, field_of_study, location, start_date, end_date, description, sort_order) VALUES
('Khawaja Fareed University of Engineering and Technology (KFUEIT)', 
'Bachelor of Science in Computer Science', 
'Computer Science',
'Rahim Yar Khan, Pakistan', 
'2020-02-01', 
'2024-02-01',
'Relevant coursework: Data Structures, Algorithms Analysis, Software Methodology, Database Management, Problem Solving, Internet Technology, Computer Architecture',
1);

-- ============================================================================
-- CERTIFICATES
-- ============================================================================

INSERT INTO certificates (name, issuer, issue_date, skills, sort_order) VALUES
('AMAL - Career-Prep Fellowship',
'Amal Academy (Stanford-funded)',
'2021-12-01',
ARRAY['Communication', 'Leadership', 'Problem-Solving', 'Career Advancement'],
1);

-- ============================================================================
-- TESTIMONIALS (Sample)
-- ============================================================================

INSERT INTO testimonials (name, position, company, content, rating, approved, featured, sort_order) VALUES
('Client Testimonial', 'Tech Lead', 'CRYMZEE Networks', 
'Rizwan consistently delivers high-quality AI-powered solutions. His expertise in Django, AI integrations, and system architecture makes him an invaluable team member.',
5, TRUE, TRUE, 1);

-- ============================================================================
-- NOW PAGE
-- ============================================================================

INSERT INTO now_updates (content, location, is_current) VALUES
('{
  "status": "Available for new projects",
  "current_focus": [
    "Building AI-powered SaaS platforms with Django and Python",
    "Exploring advanced RAG implementations and LLM fine-tuning",
    "Developing cross-platform applications with real-time features"
  ],
  "technologies": [
    "Django", "Python", "OpenAI", "LangChain", "PostgreSQL", "Redis", "Docker", "AWS"
  ],
  "interests": [
    "AI Safety and RLHF research",
    "Multi-tenant SaaS architecture patterns",
    "Real-time systems with WebSockets"
  ],
  "last_updated": "2026-07-12"
}', 'Lahore, Pakistan', TRUE);

-- ============================================================================
-- SAMPLE BLOG POSTS
-- ============================================================================

INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, tags, featured, published, published_at, meta_title, meta_description) VALUES
('building-ai-powered-django-applications',
'Building AI-Powered Django Applications with OpenAI and LangChain',
'Learn how to integrate OpenAI APIs and LangChain into Django applications to create intelligent, AI-powered features that enhance user experience.',
'# Building AI-Powered Django Applications

In this comprehensive guide, we''ll explore how to integrate AI capabilities into Django applications using OpenAI APIs and LangChain.

## Getting Started

First, let''s set up our Django project with the necessary AI dependencies...

## OpenAI Integration

Here''s how to implement OpenAI function calling in your Django views...

## LangChain for RAG

Retrieval-Augmented Generation (RAG) can significantly enhance your application''s intelligence...

## Best Practices

When building AI-powered applications, consider these important factors...

## Conclusion

AI integration in Django opens up countless possibilities for creating intelligent applications.',
'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
ARRAY['Django', 'AI', 'OpenAI', 'LangChain', 'Python', 'RAG'],
TRUE,
TRUE,
'2026-07-01 10:00:00',
'Building AI-Powered Django Applications - Complete Guide',
'Learn to integrate OpenAI APIs and LangChain into Django apps for intelligent features. Complete tutorial with code examples.'
),

('multi-tenant-saas-django-architecture',
'Multi-Tenant SaaS Architecture with Django: A Complete Guide',
'Discover how to build scalable multi-tenant SaaS applications using Django, PostgreSQL, and modern architecture patterns.',
'# Multi-Tenant SaaS Architecture with Django

Building a multi-tenant SaaS application requires careful planning and robust architecture. In this guide, we''ll cover everything you need to know.

## Architecture Overview

A well-designed multi-tenant architecture provides...

## Database Design

When designing for multi-tenancy, consider these patterns...

## Security Considerations

Multi-tenant applications require special attention to security...

## Scaling Strategies

As your SaaS grows, you''ll need to implement these scaling techniques...

## Conclusion

Multi-tenant SaaS architecture is complex but rewarding when done right.',
'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
ARRAY['Django', 'SaaS', 'Multi-tenant', 'Architecture', 'PostgreSQL', 'Scaling'],
TRUE,
TRUE,
'2026-06-15 14:30:00',
'Multi-Tenant SaaS with Django - Complete Architecture Guide',
'Build scalable multi-tenant SaaS applications with Django. Learn database design, security, and scaling strategies.'
),

('rlhf-ai-model-training-guide',
'RLHF: Reinforcement Learning from Human Feedback in AI Model Training',
'An in-depth look at RLHF techniques used to train and align large language models, based on real-world experience.',
'# RLHF: Reinforcement Learning from Human Feedback

Having worked extensively with RLHF training for leading AI companies, I''ll share insights into this crucial AI alignment technique.

## What is RLHF?

Reinforcement Learning from Human Feedback is a method used to align AI models with human preferences...

## The Training Process

The RLHF training process involves several key stages...

## Real-World Applications

In my experience training models like GPT, Claude, and Llama, I''ve observed...

## Challenges and Solutions

Common challenges in RLHF training and how to overcome them...

## Future of RLHF

The evolution of human feedback in AI training continues to advance...',
'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
ARRAY['AI', 'RLHF', 'Machine Learning', 'Model Training', 'AI Safety'],
FALSE,
TRUE,
'2026-05-20 16:45:00',
'RLHF Guide: Reinforcement Learning from Human Feedback',
'Learn RLHF techniques for AI model training and alignment. Real-world insights from training GPT, Claude, and Llama models.'
);