# Chat API Fix & Setup Guide

## Issues Fixed

Your chat API had two main issues:

1. **Deprecated Gemini Model** ❌ → ✅
   - Old: `gemini-2.5-flash-lite` (no longer available)
   - New: `gemini-2.0-flash` (latest available model)
   - Updated in: `.env` and `.env.example`

2. **Missing Vector Search Infrastructure** ❌ → ✅
   - The chat API was trying to call `match_portfolio_documents()` function that didn't exist
   - Fixed by creating new migration: `002_add_embeddings_support.sql`

## What You Need to Do

### 1. Update Supabase Database

Go to your Supabase Dashboard and run the new migration:

**URL**: https://supabase.com/dashboard/project/udavirtfoorxejeqcvvb/sql/new

**Step 1**: Run this migration to add embeddings support:

Copy the entire content from: `supabase/migrations/002_add_embeddings_support.sql`

This creates:
- `portfolio_documents` table with vector embeddings
- `pgvector` extension for similarity search
- `match_portfolio_documents()` RPC function for semantic search
- Indexes and security policies

### 2. Verify the Setup

After running the migration, verify everything is working:

```bash
npm run dev
```

Then go to `http://localhost:3000` and test the chat feature. It should now:
- ✅ Use the new `gemini-2.0-flash` model
- ✅ Successfully call the vector search function
- ✅ Provide contextual responses based on embeddings

## How the Chat System Works

1. **User sends a message** to `/api/chat`
2. **Embedding generated** using Google's embedding model
3. **Semantic search** executed using PostgreSQL vector similarity
4. **Context retrieved** from matching portfolio documents
5. **AI response generated** using Gemini with the relevant context

## Next Steps (Optional)

### Populate Embeddings Table

If you want the chat to have better context from your portfolio:

```bash
npm run seed:embeddings
```

This script will:
1. Read your portfolio data from `portfolio.json`
2. Generate embeddings for skills, experience, projects, etc.
3. Store them in the `portfolio_documents` table
4. Make your chat much smarter and more contextual

### Monitor Embeddings

You can query your embeddings in Supabase:

```sql
SELECT id, content, metadata, created_at 
FROM portfolio_documents 
ORDER BY created_at DESC 
LIMIT 10;
```

## Troubleshooting

### "Could not find the function public.match_portfolio_documents"

**Solution**: Make sure you ran the second migration (`002_add_embeddings_support.sql`) in your Supabase dashboard.

### "This model gemini-2.0-flash is not available"

**Solution**: Check if `GEMINI_CHAT_MODEL` in your `.env` is set to a valid model. Use:
- `gemini-2.0-flash` (recommended)
- `gemini-2.0-flash-lite`
- `gemini-1.5-pro`

### Chat responses are generic

**Solution**: Populate the embeddings table by running the seed script, which will give the AI access to your portfolio context.

## Migration Files

- `001_create_portfolio_schema.sql` - Main schema (tables, policies, triggers)
- `002_add_embeddings_support.sql` - Vector search infrastructure (NEW)
- `seed.sql` - Sample portfolio data
