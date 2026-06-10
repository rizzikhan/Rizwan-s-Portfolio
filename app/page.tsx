import { Metadata } from "next";
import { Desktop } from "@/components/os";
import { ClientOnly } from "@/components/client-only";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.role} | Python • Django • AI/LLM • AWS`,
  description: `${siteConfig.name} is a ${siteConfig.role} based in ${siteConfig.location} with ${siteConfig.yearsExperience} years of experience building scalable backend systems and AI-powered products with Python, Django, FastAPI, PostgreSQL, and AWS, including LLM integrations, RAG, and RLHF-based model evaluation.`,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: siteConfig.siteName,
    title: `${siteConfig.name} | ${siteConfig.role} | Python • Django • AI/LLM • AWS`,
    description: `${siteConfig.name} is a ${siteConfig.role} based in ${siteConfig.location}, building scalable Django backends, REST APIs, and AI/LLM-integrated products.`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.role} Portfolio`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.role} | Python • Django • AI/LLM • AWS`,
    description: `${siteConfig.name} is a ${siteConfig.role} specializing in Python/Django backend development and AI-powered applications.`,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    image: absoluteUrl(siteConfig.profileImage),
    jobTitle: siteConfig.role,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.currentCompany,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "Pakistan",
    },
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: siteConfig.sameAs,
    knowsAbout: [
      "Python",
      "Django",
      "FastAPI",
      "PostgreSQL",
      "AWS",
      "LangChain",
      "Retrieval-Augmented Generation (RAG)",
      "RLHF",
      "Backend Development",
      "AI Engineering",
    ],
    description: siteConfig.description,
    alumniOf: {
      "@type": "EducationalOrganization",
      name: siteConfig.educationInstitution,
    },
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.ogImage),
        width: 1200,
        height: 630,
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ClientOnly>
        <Desktop />
      </ClientOnly>
    </>
  );
}
