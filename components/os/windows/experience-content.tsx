"use client";
import React, { useState } from "react";
import portfolioData from "@/data/portfolio.json";

export function ExperienceContent() {
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const experience = Array.isArray(portfolioData.experience) ? portfolioData.experience : [];
  const education = Array.isArray(portfolioData.education) ? portfolioData.education : [];

  const toggleJob = (index: number) => {
    setExpandedJob(expandedJob === index ? null : index);
  };

  const toggleProject = (projectKey: string) => {
    setExpandedProject(expandedProject === projectKey ? null : projectKey);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Work Experience */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-sm font-mono text-[var(--os-cyan)] uppercase tracking-wider">
          {"<WorkExperience />"}
        </h2>

        <div className="space-y-3 md:space-y-4">
          {experience.map((job, index) => {
            const jobProjects = Array.isArray(job.projects) ? job.projects : [];
            const isExpanded = expandedJob === index;

            return (
              <div
                key={index}
                className="p-3 md:p-4 rounded-lg bg-foreground/5 border border-foreground/10"
              >
                {/* Job Header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  onClick={() => jobProjects.length > 0 && toggleJob(index)}
                  style={{ cursor: jobProjects.length > 0 ? 'pointer' : 'default' }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm md:text-base truncate">
                        {job.position}
                      </h3>
                      {jobProjects.length > 0 && (
                        <svg
                          className={`w-4 h-4 text-foreground/50 transition-transform sm:hidden ${
                            isExpanded ? 'rotate-180' : ''
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
                      )}
                    </div>
                    <p className="text-[var(--os-cyan)] text-xs md:text-sm truncate">
                      {job.company}
                    </p>
                  </div>
                  <div className="text-xs text-foreground/60 font-mono text-right flex-shrink-0">
                    <div className="truncate sm:whitespace-normal">{job.duration}</div>
                    <div className="truncate sm:whitespace-normal hidden sm:block">
                      {job.location}
                    </div>
                  </div>
                </div>

                {/* Projects - Collapsible on Mobile */}
                <div
                  className={`mt-3 space-y-2 md:space-y-3 overflow-hidden transition-all duration-300 ${
                    isExpanded || jobProjects.length === 0
                      ? 'max-h-[2000px] opacity-100'
                      : 'max-h-0 opacity-0 md:max-h-[2000px] md:opacity-100'
                  }`}
                >
                  {jobProjects.map((project, pIndex) => {
                    const projectKey = `${index}-${pIndex}`;
                    const isProjectExpanded = expandedProject === projectKey;
                    const projectAchievements = Array.isArray(project.achievements)
                      ? project.achievements
                      : [];
                    const projectTechnologies = Array.isArray(project.technologies)
                      ? project.technologies
                      : [];

                    return (
                      <div
                        key={pIndex}
                        className="pl-2 md:pl-3 border-l-2 border-[var(--os-cyan)]/30"
                      >
                        {/* Project Header - Always visible */}
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                          <h4 className="text-xs md:text-sm font-medium text-foreground/90 truncate">
                            {project.name}
                          </h4>
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
                          {(project.description || projectAchievements.length > 0 || projectTechnologies.length > 0) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleProject(projectKey);
                              }}
                              className="md:hidden p-1 rounded hover:bg-foreground/10 transition-colors flex-shrink-0"
                              aria-label={isProjectExpanded ? 'Collapse' : 'Expand'}
                            >
                              <svg
                                className={`w-3 h-3 text-foreground/50 transition-transform ${
                                  isProjectExpanded ? 'rotate-180' : ''
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
                          )}
                        </div>

                        {/* Project Details - Collapsible on Mobile */}
                        <div
                          className={`space-y-2 overflow-hidden transition-all duration-300 ${
                            isProjectExpanded
                              ? 'max-h-[1000px] opacity-100'
                              : 'max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100'
                          }`}
                        >
                          {project.duration && (
                            <p className="text-xs text-foreground/50">
                              {project.duration}
                            </p>
                          )}
                          {project.description && (
                            <p className="text-xs text-foreground/70 italic line-clamp-2 md:line-clamp-none">
                              {project.description}
                            </p>
                          )}
                          {projectAchievements.length > 0 && (
                            <ul className="space-y-1">
                              {projectAchievements.map((achievement, aIndex) => (
                                <li
                                  key={aIndex}
                                  className="text-xs text-foreground/60 flex items-start gap-2"
                                >
                                  <span className="text-[var(--os-cyan)] flex-shrink-0">
                                    ▹
                                  </span>
                                  <span className="line-clamp-2 md:line-clamp-none">
                                    {achievement}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {projectTechnologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {projectTechnologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-0.5 text-[10px] font-medium bg-foreground/10 text-foreground/70 rounded"
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Education */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-sm font-mono text-[var(--os-cyan)] uppercase tracking-wider">
          {"<Education />"}
        </h2>

        <div className="space-y-2 md:space-y-3">
          {education.map((edu, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-foreground/5 border border-foreground/10 flex items-start gap-3"
            >
              <span className="text-xl md:text-2xl flex-shrink-0">🎓</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-foreground text-sm md:text-base truncate">
                  {edu.degree}
                </h3>
                <p className="text-xs md:text-sm text-foreground/60 truncate">
                  {edu.institution}
                </p>
                {edu.location && (
                  <p className="text-xs text-foreground/50">📍 {edu.location}</p>
                )}
                {edu.focus && (
                  <p className="text-xs text-foreground/70 italic mt-1 line-clamp-2">
                    Focus: {edu.focus}
                  </p>
                )}
                <p className="text-xs text-[var(--os-cyan)] font-mono mt-1">
                  {edu.duration} • {edu.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
