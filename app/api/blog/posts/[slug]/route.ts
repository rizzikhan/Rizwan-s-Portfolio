import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

interface Params {
  slug: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { slug } = await context.params;

    // Get the blog post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Track page view (optional analytics)
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Increment view count and track view
    await Promise.allSettled([
      // Increment views count
      supabaseAdmin
        .from('blog_posts')
        .update({ views: post.views + 1 })
        .eq('id', post.id),
      
      // Track individual view for analytics
      supabaseAdmin
        .from('blog_post_views')
        .insert({
          post_id: post.id,
          ip_address: ip,
          user_agent: userAgent,
          referrer: request.headers.get('referer') || null
        })
    ]);

    return NextResponse.json({ post });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { slug } = await context.params;
    const { action } = await request.json();

    if (action === 'like') {
      // Increment like count
      const { data: post } = await supabase
        .from('blog_posts')
        .select('likes')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (!post) {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        );
      }

      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update({ likes: post.likes + 1 })
        .eq('slug', slug);

      if (error) {
        return NextResponse.json(
          { error: "Failed to update likes" },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        message: "Post liked successfully",
        likes: post.likes + 1
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}