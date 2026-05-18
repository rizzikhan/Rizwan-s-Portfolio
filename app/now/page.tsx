import { Metadata } from "next";
import { NowContent } from "@/components/now-content";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Now",
  description: `What ${siteConfig.name} is focused on now: building production systems at ${siteConfig.currentCompany}, sharpening cloud and automation skills, and exploring AI-enabled product experiences.`,
  keywords: [
    `${siteConfig.name} Now`,
    "What I'm doing now",
    "Current Projects",
    "Learning Full Stack",
    "Hashlogics Work",
    "AWS Learning",
    "Terraform Projects",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  alternates: {
    canonical: absoluteUrl("/now"),
  },
  openGraph: {
    title: `${siteConfig.name} Now`,
    description: `A snapshot of what ${siteConfig.name} is currently building, learning, and exploring.`,
    url: absoluteUrl("/now"),
    type: "website",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Now`,
    description: `See what ${siteConfig.name} is working on now across engineering, cloud, and AI.`,
    images: [siteConfig.ogImage],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `What ${siteConfig.name} Is Doing Now`,
  description: `Current activities and priorities from ${siteConfig.name} across product engineering, cloud systems, and AI-enabled work.`,
  datePublished: "2026-05-18",
  dateModified: "2026-05-18",
  author: {
    "@type": "Person",
    name: siteConfig.name,
    url: absoluteUrl("/"),
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.siteName,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(siteConfig.ogImage),
    },
  },
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
      name: "Now",
      item: absoluteUrl("/now"),
    },
  ],
};

export default function NowPage() {
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
      <NowContent />
    </>
  );
}
