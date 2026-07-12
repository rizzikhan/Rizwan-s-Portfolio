"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/section";
import portfolioData from "@/data/portfolio.json";
import { useI18n } from "@/lib/i18n";
import { Nav } from "@/components/nav";

export function AboutContent() {
  const { personalInfo, skills } = portfolioData;
  const { t } = useI18n();

  const skillCategories = [
    { name: "Frontend", skills: skills.frontend },
    { name: "Backend", skills: skills.backend },
    { name: "Cloud & DevOps", skills: skills.cloudDevOps },
    { name: "AI & ML", skills: skills.aiMl },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Subtle background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-background to-background" />
      </div>

      <Nav />

      <main>
        <Section className="pt-28 pb-20">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <p className="text-accent font-mono text-sm mb-3">
                {t("about.title")}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                About Me
              </h1>
            </motion.div>

            <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-8"
              >
                {/* Bio */}
                <div className="space-y-4 text-foreground/70 text-base leading-relaxed">
                  <p>
                    I&apos;m <span className="text-foreground font-medium">{personalInfo.name}</span>,
                    a Backend Developer & AI Engineer with expertise in building production-grade
                    Python/Django platforms and AI-powered products.
                  </p>
                  <p>
                    With over 2 years of professional experience, I specialize in
                    <span className="text-accent"> Django</span>, <span className="text-accent">Django REST Framework</span>,
                    and <span className="text-accent">FastAPI</span>, with deep expertise in
                    <span className="text-accent"> LLM integrations</span> using <span className="text-accent">LangChain</span>,
                    Retrieval-Augmented Generation (RAG), and OpenAI/Anthropic APIs.
                  </p>
                  <p>
                    Currently building AI-powered platforms at CRYMZEE Networks, with prior experience
                    as an RLHF specialist evaluating frontier LLMs (GPT, Claude, Llama, Gemini) and
                    shipping Django/AI products for e-commerce and SaaS clients.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-foreground/10">
                  {[
                    { value: "2+", label: "Years Experience" },
                    { value: "7+", label: "Projects" },
                    { value: "30+", label: "Technologies" },
                    { value: "5+", label: "AI Platforms Shipped" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</div>
                      <div className="text-xs text-foreground/50 mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Skills */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Skills & Technologies</h2>
                  <div className="space-y-5">
                    {skillCategories.map((category, catIndex) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + catIndex * 0.1 }}
                      >
                        <h3 className="text-sm font-medium text-foreground/60 mb-2">{category.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-foreground/10 text-sm text-foreground/70"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Sidebar with Image */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:sticky lg:top-28 space-y-6"
              >
                {/* Profile Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-foreground/5 border border-foreground/10">
                  <Image
                    src="/profile_picture.png"
                    alt={`Portrait of ${personalInfo.name} - Backend Developer & AI Engineer`}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Contact Info */}
                <div className="p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-foreground/70">Available for work</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {personalInfo.email}
                    </a>
                    <div className="flex items-center gap-2 text-foreground/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {personalInfo.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
