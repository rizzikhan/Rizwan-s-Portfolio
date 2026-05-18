"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/section";
import { Nav } from "@/components/nav";
import { ProjectCard } from "@/components/project-card";
import portfolioData from "@/data/portfolio.json";
import { useI18n } from "@/lib/i18n";

export function ProjectsContent() {
  const experience = Array.isArray(portfolioData.experience) ? portfolioData.experience : [];
  const freelanceProjects = Array.isArray(portfolioData.freelanceProjects)
    ? portfolioData.freelanceProjects
    : [];
  const { t } = useI18n();
  const [filter, setFilter] = useState<"all" | "work" | "freelance">("all");

  const allProjects = useMemo(
    () => [
      ...experience.flatMap((exp) =>
        (exp.projects || []).map((p) => ({ ...p, type: "Work" as const }))
      ),
      ...freelanceProjects.map((p) => ({ ...p, type: "Freelance" as const })),
    ],
    [experience, freelanceProjects]
  );

  const filteredProjects = useMemo(() => {
    if (filter === "all") return allProjects;
    return allProjects.filter(p => p.type.toLowerCase() === filter);
  }, [allProjects, filter]);

  const filterTabs = [
    { label: "All", value: "all" as const, count: allProjects.length },
    { label: "Work", value: "work" as const, count: allProjects.filter(p => p.type === "Work").length },
    { label: "Freelance", value: "freelance" as const, count: allProjects.filter(p => p.type === "Freelance").length }
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
              className="mb-12"
            >
              <p className="text-accent font-mono text-sm mb-3">
                {t("projects.title")}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Featured Projects
              </h1>
              <p className="text-foreground/60 text-lg max-w-2xl">
                A collection of projects I&apos;ve worked on, from production applications to experimental interfaces.
              </p>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap items-center gap-2 mb-10"
            >
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === tab.value
                      ? "bg-accent text-white"
                      : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 text-xs ${filter === tab.value ? "text-white/70" : "text-foreground/50"}`}>
                    ({tab.count})
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.name + index} project={project} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-foreground/50">No projects found in this category.</p>
              </motion.div>
            )}
          </div>
        </Section>
      </main>
    </div>
  );
}
