import type { Metadata } from "next";
import { ContactContent } from "@/components/contact-content";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name}, ${siteConfig.role} based in ${siteConfig.location}. Available for full-stack, cloud, and AI-focused projects. Email: ${siteConfig.email}.`,
  keywords: [
    `Contact ${siteConfig.name}`,
    "Hire Full Stack Developer",
    "Hire Next.js Developer",
    "Hire Python Developer",
    "Hire AWS Developer",
    "Hire AI Engineer",
    "Software Engineer for Hire",
    "Freelance Developer Pakistan",
    `Hire ${siteConfig.role}`,
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
  openGraph: {
    title: `Contact ${siteConfig.name}`,
    description: `Get in touch with ${siteConfig.name} for web, cloud, and AI-focused development work.`,
    url: absoluteUrl("/contact"),
    type: "website",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact ${siteConfig.name}`,
    description: `Reach ${siteConfig.name} for full-stack, cloud, and AI collaboration.`,
    images: [siteConfig.ogImage],
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "Person",
      name: siteConfig.name,
      jobTitle: siteConfig.role,
      email: siteConfig.email,
      telephone: siteConfig.phone,
      url: absoluteUrl("/"),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lahore",
        addressCountry: "Pakistan",
      },
      sameAs: siteConfig.sameAs,
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
        name: "Contact",
        item: absoluteUrl("/contact"),
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
      <ContactContent />
    </>
  );
}
