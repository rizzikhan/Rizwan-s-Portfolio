import type { Metadata } from "next";
import { ExperienceContent } from "@/components/experience-content";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Experience",
  description: `Explore ${siteConfig.name}'s experience across ${siteConfig.currentCompany}, Mercury Sols, and production projects spanning microservices, cloud architecture, real-time systems, and full-stack product development.`,
  keywords: [
    `${siteConfig.name} Experience`,
    "Hashlogics Software Engineer",
    "Mercury Sols Software Engineer",
    "Full Stack Developer Experience",
    "AWS Developer Experience",
    "Python Developer Experience",
    "Next.js Developer Experience",
    "Software Engineer Pakistan",
    "Work Experience Lahore",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  alternates: {
    canonical: absoluteUrl("/experience"),
  },
  openGraph: {
    title: `${siteConfig.name} Experience`,
    description: `Professional experience from ${siteConfig.name} across full-stack engineering, cloud systems, and scalable application delivery.`,
    url: absoluteUrl("/experience"),
    type: "website",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Experience`,
    description: `See ${siteConfig.name}'s work across microservices, cloud infrastructure, and modern web product development.`,
    images: [siteConfig.ogImage],
  },
};

export default function ExperiencePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.name} - Professional Experience`,
    description: `Professional experience of ${siteConfig.name} as a ${siteConfig.role}`,
    url: absoluteUrl("/experience"),
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
        name: "Experience",
        item: absoluteUrl("/experience"),
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
      <ExperienceContent />
    </>
  );
}
