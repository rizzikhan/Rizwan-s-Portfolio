-- Add embeddings support for RAG-based chat
-- This migration adds the portfolio_documents table and vector search function

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Portfolio documents table for embeddings and semantic search
CREATE TABLE IF NOT EXISTS portfolio_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on embedding for faster similarity search
CREATE INDEX IF NOT EXISTS idx_portfolio_documents_embedding ON portfolio_documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Additional indexes for metadata search
CREATE INDEX IF NOT EXISTS idx_portfolio_documents_metadata ON portfolio_documents USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_portfolio_documents_created_at ON portfolio_documents(created_at DESC);

-- Function for semantic search using cosine similarity
CREATE OR REPLACE FUNCTION match_portfolio_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    portfolio_documents.id,
    portfolio_documents.content,
    portfolio_documents.metadata,
    1 - (portfolio_documents.embedding <=> query_embedding) as similarity
  FROM portfolio_documents
  WHERE 1 - (portfolio_documents.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on portfolio_documents
ALTER TABLE portfolio_documents ENABLE ROW LEVEL SECURITY;

-- Public read policy for all documents
CREATE POLICY "Public can read portfolio documents" ON portfolio_documents FOR SELECT USING (TRUE);

-- Service role can do everything
CREATE POLICY "Service role can do everything on portfolio_documents" ON portfolio_documents FOR ALL USING (auth.role() = 'service_role');
