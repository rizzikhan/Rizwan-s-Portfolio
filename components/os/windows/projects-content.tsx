"use client";
import React, { useState } from "react";
import portfolioData from "@/data/portfolio.json";

export function ProjectsContent() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // Safely get data with fallbacks
  const experience = Array.isArray(portfolioData.experience) ? portfolioData.experience : [];
  const freelanceProjects = Array.isArray(portfolioData.freelanceProjects)
    ? portfolioData.freelanceProjects
    : [];

  // Safely build all projects array
  const allProjects = React.useMemo(() => {
    const workProjects = experience.flatMap((exp) => {
      const expProjects = Array.isArray(exp.projects) ? exp.projects : [];
      return expProjects.map((p: any) => ({
        name: p.name || "Unnamed Project",
        duration: p.duration || "",
        url: p.url || "",
        description: p.description || "",
        achievements: Array.isArray(p.achievements) ? p.achievements : [],
        technologies: Array.isArray(p.technologies) ? p.technologies : [],
        company: exp.company || "Unknown Company",
        type: "Work" as const,
      }));
    });

    const freelance = freelanceProjects.map((p: any) => ({
      name: p.name || "Unnamed Project",
      duration: p.duration || "",
      url: p.url || "",
      description: p.description || "",
      achievements: Array.isArray(p.achievements) ? p.achievements : [],
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      company: "Freelance",
      type: "Freelance" as const,
    }));

    return [...workProjects, ...freelance];
  }, [experience, freelanceProjects]);

  const toggleExpand = (projectName: string) => {
    setExpandedProject(expandedProject === projectName ? null : projectName);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h2 className="text-sm font-mono text-[var(--os-cyan)] uppercase tracking-wider">
        {"<Projects />"}
      </h2>

      {allProjects.length === 0 ? (
        <div className="text-center py-8 text-foreground/50 text-sm">
          No projects found
        </div>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {allProjects.map((project, index) => {
            const isExpanded = expandedProject === project.name + index;
            return (
              <div
                key={project.name + index}
                className="p-3 md:p-4 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-[var(--os-cyan)]/30 transition-colors"
              >
                {/* Header - Always Visible */}
                <div className="flex items-start justify-between gap-2 md:gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm md:text-base truncate">
                        {project.name}
                      </h3>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--os-cyan)] hover:underline flex-shrink-0"
                          title="View Project"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🔗
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-foreground/60 truncate">
                      {project.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 text-xs rounded whitespace-nowrap ${
                        project.type === "Work"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {project.type}
                    </span>
                    {/* Expand/Collapse Button - Mobile */}
                    <button
                      onClick={() => toggleExpand(project.name + index)}
                      className="md:hidden p-1 rounded hover:bg-foreground/10 transition-colors"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      <svg
                        className={`w-4 h-4 text-foreground/70 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Collapsible Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"
                  }`}
                >
                  {project.description && (
                    <p className="text-xs md:text-sm text-foreground/70 mb-3">
                      {project.description}
                    </p>
                  )}

                  {project.achievements && project.achievements.length > 0 && (
                    <ul className="mb-3 space-y-1 md:space-y-1.5">
                      {project.achievements.map((achievement: string, aIndex: number) => (
                        <li
                          key={aIndex}
                          className="text-xs text-foreground/60 flex items-start gap-2"
                        >
                          <span className="text-[var(--os-cyan)] flex-shrink-0 mt-0.5">▹</span>
                          <span className="line-clamp-2 md:line-clamp-none">
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 md:gap-1.5">
                      {project.technologies.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[10px] md:text-xs font-mono bg-[var(--os-cyan)]/10 text-[var(--os-cyan)] rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
