import type { Metadata } from "next";
import { AboutContent } from "@/components/about-content";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn more about ${siteConfig.name}, a ${siteConfig.role} from ${siteConfig.location} specializing in Django backends, REST APIs, cloud infrastructure, and AI/LLM-integrated solutions.`,
  keywords: [
    siteConfig.name,
    `About ${siteConfig.name}`,
    "Python Developer Pakistan",
    "Django Developer Pakistan",
    "Software Engineer Lahore",
    "Backend Developer Pakistan",
    "AI Engineer Pakistan",
    "RLHF Specialist",
    siteConfig.educationInstitution,
    siteConfig.role,
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: `About ${siteConfig.name}`,
    description: `Learn more about ${siteConfig.name}, a ${siteConfig.role} from ${siteConfig.location} with experience across Django backends, cloud infrastructure, and AI-enabled products.`,
    url: absoluteUrl("/about"),
    type: "profile",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${siteConfig.name}`,
    description: `Learn more about ${siteConfig.name}, a ${siteConfig.role} from ${siteConfig.location}.`,
    images: [siteConfig.ogImage],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntity: {
      "@type": "Person",
      name: siteConfig.name,
      jobTitle: siteConfig.role,
      description: siteConfig.description,
      url: absoluteUrl("/"),
      sameAs: siteConfig.sameAs,
      alumniOf: {
        "@type": "EducationalOrganization",
        name: siteConfig.educationInstitution,
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
        name: "About",
        item: absoluteUrl("/about"),
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
      <AboutContent />
    </>
  );
}
