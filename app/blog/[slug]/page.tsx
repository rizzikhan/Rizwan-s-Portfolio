import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarIcon, ClockIcon, TagIcon, EyeIcon, HeartIcon, ArrowLeftIcon, ShareIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  tags: string[];
  featured: boolean;
  published_at: string;
  views: number;
  likes: number;
  reading_time: number | null;
  meta_title: string | null;
  meta_description: string | null;
}

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !post) {
      return null;
    }

    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found - Rizwan Ahmed",
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      publishedTime: post.published_at,
      authors: ["Rizwan Ahmed"],
      images: post.cover_image ? [post.cover_image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  // This would need client-side functionality for the like button
  // For now, we'll just display the count
  return (
    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
      <HeartIcon className="w-4 h-4" />
      <span>{initialLikes}</span>
    </div>
  );
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-4xl py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>
        </nav>

        {/* Article */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Cover Image */}
          {post.cover_image && (
            <div className="relative h-64 md:h-96">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Header */}
            <header className="mb-8">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <CalendarIcon className="w-4 h-4" />
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at)}
                </time>
                {post.reading_time && (
                  <>
                    <span>•</span>
                    <ClockIcon className="w-4 h-4" />
                    <span>{post.reading_time} min read</span>
                  </>
                )}
                <span>•</span>
                <EyeIcon className="w-4 h-4" />
                <span>{post.views} views</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  {post.excerpt}
                </p>
              )}

              {/* Tags and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      <TagIcon className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <LikeButton postId={post.id} initialLikes={post.likes} />
                  <button
                    className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: post.title,
                          text: post.excerpt || "",
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    <ShareIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-p:text-gray-700 dark:prose-p:text-gray-300
                prose-a:text-blue-600 dark:prose-a:text-blue-400
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-code:text-blue-600 dark:prose-code:text-blue-400
                prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                prose-blockquote:border-l-blue-600 dark:prose-blockquote:border-l-blue-400"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Author Bio */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              RA
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Rizwan Ahmed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Backend Developer & AI Engineer with 2+ years of experience building production-grade Python/Django platforms and AI-powered products.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/contact"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Get in touch
                </Link>
                <Link
                  href="/projects"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  View projects
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation to other posts could go here */}
      </div>
    </div>
  );
}