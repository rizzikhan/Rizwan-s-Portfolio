"use client";
import React, { useMemo, Suspense, lazy } from "react";
import Image from "next/image";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { motion } from "framer-motion";
import portfolioData from "../data/portfolio.json";
import { useI18n } from "@/lib/i18n";
import {
  ProjectCardSkeleton,
  ContactFormSkeleton,
} from "@/components/loading-skeleton";

const ProjectCard = lazy(() =>
  import("@/components/project-card").then((mod) => ({
    default: mod.ProjectCard,
  })),
);
const ContactForm = lazy(() =>
  import("@/components/contact-form").then((mod) => ({
    default: mod.ContactForm,
  })),
);

export function HomeContent() {
  const { personalInfo, skills, socialLinks } = portfolioData;
  const experience = Array.isArray(portfolioData.experience)
    ? portfolioData.experience
    : [];
  const freelanceProjects = Array.isArray(portfolioData.freelanceProjects)
    ? portfolioData.freelanceProjects
    : [];
  const { t } = useI18n();

  const allProjects = useMemo(() => {
    const defaultProject = {
      name: "",
      description: "",
      technologies: [] as string[],
      achievements: [] as string[],
    };

    return [
      ...experience.flatMap((exp) =>
        (Array.isArray(exp.projects) ? exp.projects : []).map((p) => {
          const project =
            typeof p === "object" && p !== null ? p : defaultProject;
          return {
            ...defaultProject,
            ...project,
            type: "Work",
          };
        }),
      ),
      ...freelanceProjects.map((p) => {
        const project =
          typeof p === "object" && p !== null ? p : defaultProject;
        return {
          ...defaultProject,
          ...project,
          type: "Freelance",
        };
      }),
    ];
  }, [experience, freelanceProjects]);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* Simple Background */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-background to-background" />
      </div>

      <Nav />

      <main>
        <Hero />

        {/* About Section */}
        <Section id="about">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid gap-12 lg:grid-cols-2 items-center"
          >
            {/* Left Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-accent text-lg">01.</span>
                  <div className="h-px flex-1 bg-foreground/10" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  {t("about.title")}
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-foreground/70 leading-relaxed">
                  Hello! I&apos;m{" "}
                  <span className="text-accent font-medium">
                    {personalInfo.name}
                  </span>
                  , a {personalInfo.role.split("|")[0].trim()} based in{" "}
                  {personalInfo.location}. I specialize in building scalable web
                  applications and AI-powered solutions.
                </p>

                {/* What I Do */}
                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-accent uppercase tracking-wider">
                    What I Do
                  </h3>
                  <div className="grid gap-3">
                    {[
                      {
                        title: "Full Stack Development",
                        desc: "Next.js, React, Python, Node.js",
                      },
                      {
                        title: "Cloud Architecture",
                        desc: "AWS serverless, Terraform, microservices",
                      },
                      {
                        title: "AI Integration",
                        desc: "LangChain, OpenAI, LLM workflows",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg hover:border-accent/30 transition-colors"
                      >
                        <h4 className="font-medium text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-sm text-foreground/60 mt-1">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-3">
                  <h3 className="text-sm font-mono text-accent uppercase tracking-wider">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...skills.frontend.slice(0, 4),
                      ...skills.backend.slice(0, 3),
                      ...skills.cloudDevOps.slice(0, 3),
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded text-accent text-sm font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  More About Me
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative aspect-square w-full max-w-[380px] mx-auto">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-foreground/10 bg-foreground/5">
                  <Image
                    src="/profile_picture.jpg"
                    alt={personalInfo.name}
                    width={380}
                    height={380}
                    priority
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Available Badge */}
                <div className="absolute -bottom-3 -right-3 bg-accent text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Available for work
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Section>

        {/* Experience Section */}
        <Section id="experience">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="mb-12 space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-accent text-lg">02.</span>
                <div className="h-px flex-1 bg-foreground/10" />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  {t("experience.title")}
                </h2>
                <a
                  href="/experience"
                  className="text-sm font-mono text-accent hover:underline flex items-center gap-1"
                >
                  View All
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-4 top-0 bottom-0 w-px bg-foreground/10" />

              <div className="space-y-10">
                {experience.slice(0, 2).map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 md:pl-12"
                  >
                    {/* Timeline Node */}
                    <div className="absolute left-0 md:left-4 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-background" />

                    {/* Experience Card */}
                    <div className="p-6 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-accent/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            {job.position}{" "}
                            <span className="text-accent">@ {job.company}</span>
                          </h3>
                          <div className="flex items-center gap-3 font-mono text-sm text-foreground/60 mt-1">
                            <span>{job.duration}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium whitespace-nowrap">
                          {job.projects.length}{" "}
                          {job.projects.length === 1 ? "Project" : "Projects"}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {job.projects.map((project, pIndex) => (
                          <div key={pIndex} className="space-y-2">
                            <h4 className="font-medium text-foreground/90 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                              {project.name}
                            </h4>
                            <ul className="space-y-1 pl-4">
                              {project.achievements
                                .slice(0, 2)
                                .map((point, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-foreground/70 text-sm"
                                  >
                                    <span className="text-accent mt-1.5 text-xs">
                                      ▹
                                    </span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                            </ul>
                            {project.technologies && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                {project.technologies
                                  .slice(0, 5)
                                  .map((tech) => (
                                    <span
                                      key={tech}
                                      className="px-2 py-0.5 bg-accent/5 border border-accent/20 rounded text-accent text-xs font-mono"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </Section>

        {/* Projects Section */}
        <Section id="projects">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-12">
              <h2 className="flex items-center text-3xl md:text-4xl font-bold text-foreground">
                <span className="mr-3 font-mono text-accent text-lg">03.</span>
                {t("projects.title")}
              </h2>
              <a
                href="/projects"
                className="text-sm font-mono text-accent hover:underline flex items-center gap-1"
              >
                View All
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allProjects.slice(0, 6).map((project, index) => (
                <Suspense
                  key={project.name + index}
                  fallback={<ProjectCardSkeleton />}
                >
                  <ProjectCard project={project} index={index} />
                </Suspense>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* Contact Section */}
        <Section id="contact">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-foreground/10" />
                <span className="font-mono text-accent text-sm uppercase tracking-wider">
                  04. {t("contact.sectionPrefix")}
                </span>
                <div className="h-px w-12 bg-foreground/10" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                {t("contact.title")}
              </h2>

              <p className="text-lg text-foreground/60 max-w-xl mx-auto">
                {t("contact.subtitle")}
              </p>
            </div>

            {/* Contact Form */}
            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 md:p-8">
              <Suspense fallback={<ContactFormSkeleton />}>
                <ContactForm />
              </Suspense>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground/70 hover:text-accent hover:border-accent/30 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground/70 hover:text-accent hover:border-accent/30 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Me
              </a>
            </div>
          </motion.div>
        </Section>
      </main>
    </div>
  );
}
