import { Metadata } from "next";
import { Desktop } from "@/components/os";
import { ClientOnly } from "@/components/client-only";

export const metadata: Metadata = {
  metadataBase: new URL("https://aliburhan.com"),
  title: "Ali Burhan | Full Stack Architect | Next.js • Python • AWS • AI",
  description:
    "Ali Burhan is a Full Stack Developer & Architect with 3+ years experience. Expert in Next.js, React, Python, AWS & AI. Building scalable solutions serving 1000+ sites globally from Lahore, Pakistan.",
  keywords: [
    "Ali Burhan",
    "Full Stack Developer",
    "Full Stack Architect",
    "Next.js Developer",
    "React Developer",
    "Python Developer",
    "AWS Developer",
    "AI Engineer",
    "LangChain",
    "RAG Developer",
    "LLM Developer",
    "Serverless Architect",
    "Software Engineer",
    "Lahore Developer",
    "Pakistan Developer",
    "Web Developer",
    "Cloud Architect",
  ],
  authors: [{ name: "Ali Burhan", url: "https://aliburhan.com" }],
  creator: "Ali Burhan",
  publisher: "Ali Burhan",
  alternates: {
    canonical: "https://aliburhan.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aliburhan.com",
    siteName: "Ali Burhan Portfolio",
    title: "Ali Burhan | Full Stack Architect | Next.js • Python • AWS • AI",
    description:
      "Ali Burhan is a Full Stack Developer & Architect with 3+ years experience. Expert in Next.js, React, Python, AWS & AI. Building scalable solutions serving 1000+ sites globally.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ali Burhan - Full Stack Developer & Architect Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aliburhan_dev",
    creator: "@aliburhan_dev",
    title: "Ali Burhan | Full Stack Architect | Next.js • Python • AWS • AI",
    description:
      "Ali Burhan is a Full Stack Developer & Architect with 3+ years experience. Expert in Next.js, React, Python, AWS & AI.",
    images: ["/og-image.png"],
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
    name: "Ali Burhan",
    url: "https://aliofficial.vercel.app",
    image: "https://aliofficial.vercel.app/ali-pic.png",
    jobTitle: "Full Stack Architect",
    worksFor: {
      "@type": "Organization",
      name: "Hashlogics",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "Pakistan",
    },
    email: "aliburhan.dev.ai@gmail.com",
    telephone: "+92-300-1499488",
    sameAs: [
      "https://github.com/Ali-Burhan",
      "https://www.linkedin.com/in/ali-burhan-9076b42b6/",
    ],
    knowsAbout: [
      "Next.js",
      "React",
      "Python",
      "AWS",
      "LangChain",
      "AI Development",
      "Full Stack Development",
      "Cloud Architecture",
    ],
    description:
      "Ali Burhan is a Full Stack Developer specializing in Next.js, React, Python, AWS, and AI-powered applications. Building scalable web applications and enterprise solutions.",
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "University of Engineering and Technology (UET) Lahore",
    },
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ali Burhan Portfolio",
    url: "https://aliburhan.com",
    description: "Full Stack Developer & Architect specializing in Next.js, React, Python, AWS & AI",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://aliburhan.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Ali Burhan",
      url: "https://aliburhan.com",
      logo: {
        "@type": "ImageObject",
        url: "https://aliburhan.com/og-image.png",
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
        item: "https://aliburhan.com",
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
