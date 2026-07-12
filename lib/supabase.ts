import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Legacy client for backwards compatibility
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)

// Browser client for client-side operations
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server client for server-side operations with SSR support
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Database types (to be generated later with supabase gen types)
export interface Database {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          status: 'unread' | 'read' | 'replied' | 'spam'
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          status?: 'unread' | 'read' | 'replied' | 'spam'
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          status?: 'unread' | 'read' | 'replied' | 'spam'
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string
          cover_image: string | null
          tags: string[]
          featured: boolean
          published: boolean
          published_at: string | null
          views: number
          likes: number
          reading_time: number | null
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string | null
          content: string
          cover_image?: string | null
          tags?: string[]
          featured?: boolean
          published?: boolean
          published_at?: string | null
          views?: number
          likes?: number
          reading_time?: number | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string | null
          content?: string
          cover_image?: string | null
          tags?: string[]
          featured?: boolean
          published?: boolean
          published_at?: string | null
          views?: number
          likes?: number
          reading_time?: number | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          detailed_description: string | null
          technologies: string[]
          achievements: string[]
          github_url: string | null
          live_url: string | null
          image_url: string | null
          type: 'personal' | 'freelance' | 'company' | 'open_source'
          status: 'completed' | 'in_progress' | 'archived'
          featured: boolean
          sort_order: number
          published: boolean
          started_date: string | null
          completed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          detailed_description?: string | null
          technologies?: string[]
          achievements?: string[]
          github_url?: string | null
          live_url?: string | null
          image_url?: string | null
          type?: 'personal' | 'freelance' | 'company' | 'open_source'
          status?: 'completed' | 'in_progress' | 'archived'
          featured?: boolean
          sort_order?: number
          published?: boolean
          started_date?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          detailed_description?: string | null
          technologies?: string[]
          achievements?: string[]
          github_url?: string | null
          live_url?: string | null
          image_url?: string | null
          type?: 'personal' | 'freelance' | 'company' | 'open_source'
          status?: 'completed' | 'in_progress' | 'archived'
          featured?: boolean
          sort_order?: number
          published?: boolean
          started_date?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add more table types as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_portfolio_documents: {
        Args: {
          query_embedding: number[]
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          content: string
          metadata: Record<string, any>
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}