# Supabase Database Setup Guide

This guide will help you set up the complete database schema and populate it with your portfolio data.

## 🎯 Quick Setup (Recommended)

### Step 1: Update Environment Variables

Your `.env` file should already have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://udavirtfoorxejeqcvvb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PcWdlusXnjhRmWysPLVxYA_zkmHzTEP
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyCkfP3cvH51vftYgO35Uq0Oc4wah9pnPg0
```

**⚠️ IMPORTANT**: Add your service role key:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get your service role key from: [Supabase Dashboard > Settings > API Keys](https://supabase.com/dashboard/project/udavirtfoorxejeqcvvb/settings/api)

### Step 2: Run Database Migration

1. **Open Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/udavirtfoorxejeqcvvb/sql/new
   
2. **Run the Migrations** in order:
   
   **First Migration** (Main schema):
   - Copy the entire content from `supabase/migrations/001_create_portfolio_schema.sql`
   - Paste it in the SQL Editor
   - Click "Run" to create all tables, indexes, and policies
   
   **Second Migration** (Embeddings and vector search):
   - Copy the entire content from `supabase/migrations/002_add_embeddings_support.sql`
   - Paste it in a new SQL Editor tab
   - Click "Run" to set up embeddings infrastructure

3. **Populate with Data**:
   - Copy the entire content from `supabase/seed.sql`
   - Paste it in a new SQL Editor tab
   - Click "Run" to populate tables with your portfolio data

### Step 3: Verify Setup

Run the verification script:
```bash
npm run db:setup
```

## 📊 What Gets Created

### Core Tables

| Table | Purpose | Records |
|-------|---------|---------|
| `contact_submissions` | Store contact form submissions | 0 (starts empty) |
| `blog_posts` | Blog articles with SEO metadata | 3 sample posts |
| `projects` | Portfolio projects from portfolio.json | 5 projects |
| `experience` | Work experience entries | 3 positions |
| `skills` & `skill_categories` | Categorized skills | 50+ skills in 10 categories |
| `education` | Academic background | 1 degree |
| `certificates` | Certifications and achievements | 1 certificate |
| `testimonials` | Client testimonials | 1 sample testimonial |
| `now_updates` | "What I'm doing now" content | 1 current update |
| `site_settings` | Personal info and social links | 1 settings record |

### Analytics Tables

| Table | Purpose |
|-------|---------|
| `page_views` | Track page visits |
| `blog_post_views` | Track blog post views |
| `chat_sessions` & `chat_messages` | Chatbot analytics |

### Features Enabled

✅ **Contact Form**: Now stores submissions in database + sends emails  
✅ **Blog System**: Full blog with SEO, tags, analytics  
✅ **Projects API**: Fetch projects from database  
✅ **Experience API**: Fetch work history from database  
✅ **Skills API**: Categorized skills with proficiency levels  
✅ **Analytics**: Page views and engagement tracking  
✅ **Row Level Security**: Public read, admin write access
✅ **AI Chat with RAG**: Semantic search using embeddings for contextual responses  

## 🔒 Security & Access

### Public Access (No Auth Required)
- Read published blog posts, projects, experience, skills
- Submit contact forms
- Track page views for analytics

### Admin Access (Service Role Required)
- Full CRUD on all tables
- View contact submissions
- Publish/unpublish content
- Access analytics data

## 🚀 API Endpoints

Your portfolio now includes these API endpoints:

### Blog System
- `GET /api/blog/posts` - List blog posts (with pagination, filters)
- `GET /api/blog/posts/[slug]` - Get single post (tracks views)
- `POST /api/blog/posts/[slug]` - Like a post

### Portfolio Data
- `GET /api/projects` - List projects (with filters)
- `GET /api/experience` - List work experience
- `GET /api/skills` - List categorized skills

### Contact
- `POST /api/contact` - Submit contact form (saves to DB + sends email)

### AI Chat (RAG-based)
- `POST /api/chat` - Chat with portfolio AI that uses semantic search for context

## 📱 Frontend Integration

### Blog Pages
- `/blog` - Blog listing page ✅ Created
- `/blog/[slug]` - Individual blog post ✅ Created

### Existing Components
- `LatestBlogPosts` component now works with real data
- Contact forms now persist submissions to database
- All portfolio data can be migrated from JSON to database

## 🎨 Admin Dashboard (Next Phase)

The database is ready for an admin dashboard with these capabilities:

### Content Management
- Create/edit/delete blog posts
- Manage projects and experience
- Update skills and categories
- Moderate testimonials

### Analytics Dashboard
- Page view statistics
- Blog post performance
- Contact form submissions
- Chatbot usage analytics

### Settings Management
- Update personal info
- Manage social links
- Configure site settings

## 🔧 Advanced Features

### Supabase Storage (Optional)
Ready to configure for:
- Blog post cover images
- Project screenshots
- Resume PDFs
- Avatar images

### Real-time Features (Optional)
Database triggers can enable:
- Live notifications for new contact submissions
- Real-time "now" page updates
- Live chat message streaming

### Search & Filtering
Full-text search capabilities:
- Search blog posts by content
- Filter projects by technology
- Search skills and experience

## 📝 Manual Steps Required

Since automated database setup has limitations, you need to:

1. **Copy SQL files to Supabase Dashboard**
   - Migration: `supabase/migrations/001_create_portfolio_schema.sql`
   - Seed data: `supabase/seed.sql`

2. **Add Service Role Key** to your `.env` file

3. **Test the Features**:
   - Submit a contact form to test database storage
   - Visit `/blog` to see the blog posts
   - Check the API endpoints work correctly

## 🎉 What's Next

Your portfolio now has a complete database backend! You can:

1. **Start using the blog** - Write new posts via Supabase dashboard
2. **Collect contact submissions** - Review them in the database
3. **Track analytics** - Monitor page views and engagement
4. **Build an admin dashboard** - Full CMS capabilities
5. **Add authentication** - Secure admin access with Supabase Auth

The foundation is set for a modern, data-driven portfolio with CMS capabilities!

## 🆘 Troubleshooting

### Common Issues

**Database connection fails**:
- Check your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Verify the URL matches your project

**Tables not found**:
- Ensure you ran the migration SQL completely
- Check for any SQL errors in Supabase logs

**Contact form not saving**:
- Verify service role key has write permissions
- Check API route logs for database errors

**Blog pages not loading**:
- Ensure seed data was inserted successfully
- Check that blog posts have `published = true`

### Need Help?

1. Check Supabase Dashboard logs
2. Run `npm run db:verify` to test connection
3. Review the SQL files for any missed steps
4. Contact support if needed

Your database is now production-ready! 🚀