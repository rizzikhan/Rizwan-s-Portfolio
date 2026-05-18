import portfolioData from "@/data/portfolio.json";

const { personalInfo, socialLinks, experience, education, highlights, skills } =
  portfolioData;

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  personalInfo.portfolio ||
  "http://localhost:3000";

const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

export const siteConfig = {
  name: personalInfo.name,
  role: personalInfo.role,
  description: personalInfo.description,
  location: personalInfo.location,
  email: personalInfo.email,
  phone: personalInfo.phone,
  siteUrl: normalizeUrl(configuredSiteUrl),
  siteName: `${personalInfo.name} Portfolio`,
  githubUrl: socialLinks.github,
  linkedinUrl: socialLinks.linkedin,
  ogImage: "/og-image.png",
  profileImage: "/profile_picture.jpg",
  currentCompany:
    Array.isArray(experience) && experience.length > 0
      ? experience[0]?.company || ""
      : "",
  educationInstitution:
    Array.isArray(education) && education.length > 0
      ? education[0]?.institution || ""
      : "",
  yearsExperience: highlights?.yearsExperience || "",
  keywords: [
    personalInfo.name,
    personalInfo.role,
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "TypeScript Developer",
    "Python Developer",
    "AWS Developer",
    "Terraform Developer",
    "Software Engineer",
    "Lahore Developer",
    "Pakistan Developer",
    ...(Array.isArray(skills?.frontend) ? skills.frontend.slice(0, 4) : []),
    ...(Array.isArray(skills?.backend) ? skills.backend.slice(0, 4) : []),
    ...(Array.isArray(skills?.cloudDevOps)
      ? skills.cloudDevOps.slice(0, 4)
      : []),
  ],
  sameAs: [socialLinks.github, socialLinks.linkedin].filter(Boolean),
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${siteConfig.siteUrl}${path === "/" ? "" : path}`;
}
