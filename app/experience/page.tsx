import type { Metadata } from "next";
import { ExperienceContent } from "@/components/experience-content";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Experience",
  description: `Explore ${siteConfig.name}'s experience across ${siteConfig.currentCompany}, Hubble42, Piecyfer, and production projects spanning Django backends, AI/LLM integrations, RLHF model evaluation, and real-time systems.`,
  keywords: [
    `${siteConfig.name} Experience`,
    "CRYMZEE Networks Backend Engineer",
    "Hubble42 Python Developer",
    "Backend Developer Experience",
    "Django Developer Experience",
    "AI Engineer Experience",
    "Python Developer Experience",
    "RLHF Specialist Experience",
    "Software Engineer Pakistan",
    "Work Experience Lahore",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  alternates: {
    canonical: absoluteUrl("/experience"),
  },
  openGraph: {
    title: `${siteConfig.name} Experience`,
    description: `Professional experience from ${siteConfig.name} across Django backend engineering, AI/LLM integrations, and RLHF model evaluation.`,
    url: absoluteUrl("/experience"),
    type: "website",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Experience`,
    description: `See ${siteConfig.name}'s work across Python/Django backends, AI-powered products, and real-time systems.`,
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
