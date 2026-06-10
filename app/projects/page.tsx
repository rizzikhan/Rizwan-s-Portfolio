import type { Metadata } from "next";
import { ProjectsContent } from "@/components/projects-content";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description: `Explore projects by ${siteConfig.name}, including Nutrimode, an AI-powered HRM platform, AI Coupon Finder, IntelliFlow, and NexaCommerce, built with Python, Django, PostgreSQL, AWS, and AI/LLM tooling.`,
  keywords: [
    `${siteConfig.name} Projects`,
    "Nutrimode",
    "IntelliFlow",
    "NexaCommerce",
    "Backend Developer Projects",
    "Django Projects",
    "Python AI Projects",
    "AI Projects Pakistan",
    "RAG Chatbot Projects",
    "Multi-Tenant SaaS Projects",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  alternates: {
    canonical: absoluteUrl("/projects"),
  },
  openGraph: {
    title: `${siteConfig.name} Projects`,
    description: `Explore ${siteConfig.name}'s portfolio of Django backends, AI-powered platforms, and LLM-integrated products.`,
    url: absoluteUrl("/projects"),
    type: "website",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Projects`,
    description: `Browse ${siteConfig.name}'s work across Python/Django apps, AI platforms, and LLM-powered solutions.`,
    images: [siteConfig.ogImage],
  },
};

export default function ProjectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.name} - Projects Portfolio`,
    description: `Projects portfolio of ${siteConfig.name} featuring cloud-native apps, enterprise products, and AI-enabled solutions`,
    url: absoluteUrl("/projects"),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: absoluteUrl("/projects"),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectsContent />
    </>
  );
}
