"use client";
import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Taskbar } from "./taskbar";
import { DesktopIcon } from "./desktop-icon";
import { Window } from "./window";
import portfolioData from "@/data/portfolio.json";

import dynamic from "next/dynamic";

// Lazy load window content for better performance
const AboutContent = lazy(() => import("./windows/about-content").then(m => ({ default: m.AboutContent })));
const ProjectsContent = lazy(() => import("./windows/projects-content").then(m => ({ default: m.ProjectsContent })));
const ExperienceContent = lazy(() => import("./windows/experience-content").then(m => ({ default: m.ExperienceContent })));
const ContactContent = lazy(() => import("./windows/contact-content").then(m => ({ default: m.ContactContent })));

// Dynamic import with SSR disabled for 3D canvas
const ComputersCanvas = dynamic(() => import("@/components/canvas").then(m => ({ default: m.ComputersCanvas })), {
  ssr: false,
  loading: () => null,
});

export type WindowId = "about" | "projects" | "experience" | "contact";

interface WindowState {
  id: WindowId;
  isMinimized: boolean;
  zIndex: number;
}

const DESKTOP_ICONS: { id: WindowId; label: string; icon: string }[] = [
  { id: "about", label: "About Me", icon: "user" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "experience", label: "Experience", icon: "briefcase" },
  { id: "contact", label: "Contact", icon: "mail" },
];

const QUICK_LINKS = [
  { id: "github", label: "GitHub", icon: "github", url: portfolioData.socialLinks.github },
  { id: "linkedin", label: "LinkedIn", icon: "linkedin", url: portfolioData.socialLinks.linkedin },
];

export function Desktop() {
  const { personalInfo, highlights } = portfolioData;
  const heroTechStack = ["Python | Django", "FastAPI | DRF", "PostgreSQL | Redis", "AI/LLM", "LangChain", "Docker"];
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const [highestZ, setHighestZ] = useState(45);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [brightness, setBrightness] = useState(100);
  const [nightLight, setNightLight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Check for mobile and prefers-reduced-motion
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    // Defer initial state updates to avoid warnings
    setTimeout(checkMobile, 0);
    window.addEventListener("resize", checkMobile);

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setTimeout(() => setReduceMotion(mediaQuery.matches), 0);

    const handleMotionChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkMobile);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === id);
      if (exists) {
        return prev.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: highestZ + 1 } : w
        );
      }
      return [...prev, { id, isMinimized: false, zIndex: highestZ + 1 }];
    });
    setHighestZ((z) => z + 1);
    setActiveWindow(id);
    setShowStartMenu(false);
  }, [highestZ]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: highestZ + 1 } : w))
    );
    setHighestZ((z) => z + 1);
    setActiveWindow(id);
  }, [highestZ]);

  const handleTaskbarWindowClick = useCallback((id: WindowId) => {
    const window = windows.find((w) => w.id === id);
    if (window?.isMinimized) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: highestZ + 1 } : w
        )
      );
      setHighestZ((z) => z + 1);
      setActiveWindow(id);
    } else if (activeWindow === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  }, [windows, activeWindow, highestZ, minimizeWindow, focusWindow]);

  const showDesktop = useCallback(() => {
    setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })));
    setActiveWindow(null);
    setShowStartMenu(false);
  }, []);

  const getWindowContent = (id: string) => {
    const content = (() => {
      switch (id) {
        case "about": return <AboutContent />;
        case "projects": return <ProjectsContent />;
        case "experience": return <ExperienceContent />;
        case "contact": return <ContactContent />;
        default: return <div className="p-4">Content not found</div>;
      }
    })();

    return (
      <Suspense fallback={<WindowContentLoading />}>
        {content}
      </Suspense>
    );
  };

  const getWindowTitle = (id: string) => {
    const titles: Record<string, string> = {
      about: "About Me",
      projects: "Projects",
      experience: "Experience",
      contact: "Contact",
    };
    return titles[id] || id;
  };

  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setShowStartMenu(false);
  };

  // Handle external window triggers (e.g., from Navbar search)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOpenWindow = (event: any) => {
      if (event.detail?.windowId) {
        openWindow(event.detail.windowId);
        setShowStartMenu(false);
      }
    };

    window.addEventListener("open-os-window", handleOpenWindow);
    return () => window.removeEventListener("open-os-window", handleOpenWindow);
  }, [openWindow]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: WindowId; label: string; icon: string; keywords: string[] }[]>([]);
  const heroStats = [
    { label: "Core Skills", value: "Backend & AI" },
    { label: "Experience", value: highlights.yearsExperience || "2+" },
    { label: "Projects", value: highlights.projectsCompleted || "7+" },
  ];

  // Focus search input when start menu opens
  useEffect(() => {
    if (showStartMenu) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setTimeout(() => {
        setSearchQuery("");
        setSearchResults([]);
      }, 0);
    }
  }, [showStartMenu]);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Comprehensive search mapping
    const searchMap = [
      { id: "about" as WindowId, label: "About Me", icon: "user", keywords: ["bio", "profile", "skills", "tech", "python", "django", "ai", "rlhf"] },
      { id: "projects" as WindowId, label: "Projects", icon: "folder", keywords: ["work", "portfolio", "apps", "code", "nutrimode", "intelliflow", "nexacommerce"] },
      { id: "experience" as WindowId, label: "Experience", icon: "briefcase", keywords: ["jobs", "history", "career", "crymzee", "hubble42", "piecyfer"] },
      { id: "contact" as WindowId, label: "Contact", icon: "mail", keywords: ["email", "touch", "hire", "talk", "social", "phone"] },
    ];

    const filtered = searchMap.filter(item => 
      item.label.toLowerCase().includes(lowerQuery) || 
      item.keywords.some(k => lowerQuery.includes(k)) ||
      item.id.toLowerCase().includes(lowerQuery)
    );

    setSearchResults(filtered);
  };

  const onSearchResultClick = (id: WindowId) => {
    openWindow(id);
    setShowStartMenu(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none transition-all duration-500"
      style={{
        filter: `brightness(${brightness}%) ${nightLight ? 'sepia(30%) saturate(120%) hue-rotate(-15deg)' : 'sepia(30%) saturate(120%) hue-rotate(0deg)' }`
      }}
    >
      {/* Professional Mesh Gradient Background - Optimized */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Base Layer */}
        <div className="absolute inset-0 bg-os-desktop-bg transition-colors duration-1000" />

        {/* Optimized Animated Blooms - Reduced from 3 to 2, simplified animations */}
        <motion.div
          initial={false}
          animate={reduceMotion ? {} : {
            scale: [1, 1.15, 1],
          }}
          transition={reduceMotion ? {} : { duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-[#38bdf8]/15 blur-[120px] z-0"
        />
        <motion.div
          initial={false}
          animate={reduceMotion ? {} : {
            scale: [1, 1.1, 1],
          }}
          transition={reduceMotion ? {} : { duration: 35, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full bg-[#818cf8]/12 blur-[100px] z-0"
        />

        {/* Glass Overlay - with pointer-events-none to allow interaction with canvas */}
        <div className="absolute inset-0 z-10 bg-background/2 pointer-events-none" />
      </div>

      {/* 3D Computer Canvas - moved outside for proper z-index */}
      {!isMobile && (
        <ComputersCanvas
          reduceMotion={reduceMotion}
          isVisible={windows.length === 0}
        />
      )}

      {/* Desktop Icons - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block absolute top-4 left-4 md:top-6 md:left-6 z-40">
        <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-2">
          {DESKTOP_ICONS.map((item) => (
            <DesktopIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => openWindow(item.id)}
            />
          ))}
          {/* Social links as desktop icons */}
          {QUICK_LINKS.map((item) => (
            <DesktopIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => openExternalLink(item.url)}
            />
          ))}
        </div>
      </div>

      {/* Identity Block - Centered */}
      {windows.length === 0 && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 20, padding: isMobile ? '3.75rem 1.5rem 6.5rem' : '0 1.5rem', paddingBottom: isMobile ? '6.5rem' : '54vh' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: isMobile ? '1.25rem' : '0rem', width: '100%', maxWidth: isMobile ? '420px' : 'none' }}
          >
            {/* Logo and Name in a Row */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? '1rem' : '2rem' }}>
              {/* Profile Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2, type: "spring" }}
                style={{ width: isMobile ? '80px' : '140px', height: isMobile ? '80px' : '140px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #38bdf8, #818cf8, #c084fc)', padding: '2px' }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#0f172a', border: '4px solid #1e293b', overflow: 'hidden' }}>
                  <Image
                    src="/profile_picture.png"
                    alt={personalInfo.name}
                    fill
                    sizes={isMobile ? "80px" : "140px"}
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    priority
                  />
                </div>
              </motion.div>

              {/* Name */}
              <h1 style={{ fontSize: isMobile ? '2.5rem' : '5rem', fontWeight: 900, color: 'var(--os-text-primary)', letterSpacing: '-0.05em', margin: 0, lineHeight: isMobile ? 1.05 : 1 }}>
                {personalInfo.name}
              </h1>
            </div>

            {/* Role and Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0rem' }}>
              <div style={{ height: '3px', width: '80px', background: 'linear-gradient(to right, transparent, #38bdf8, transparent)', opacity: 0.5, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: isMobile ? '1.1rem' : '1.6rem', color: 'var(--os-text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                {personalInfo.role.split("|")[0].trim()}
              </p>
              
              {/* Availability - Now directly under role */}
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1.2rem', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} className="animate-pulse" />
                  {personalInfo.availability}
                </div>
              </div>
            </div>

            {isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginTop: '0.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem', width: '100%' }}>
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: '0.9rem 0.75rem',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(15, 23, 42, 0.4)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--os-text-primary)', lineHeight: 1.1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--os-text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.35rem' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', width: '100%' }}>
                  {heroTechStack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '0.72rem',
                        fontWeight: 'bold',
                        color: 'var(--os-text-secondary)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Stats Sidebar - Right Aligned Independent of Center Padding */}
      {windows.length === 0 && !isMobile && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3rem' }}
          >
            {/* Impact Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'flex-end' }}>
              {heroStats.map((stat, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--os-text-primary)', lineHeight: 1 }}>{stat.value}</span>
                  <span style={{ fontSize: '11px', color: 'var(--os-text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Tech Pills - Aligned Right */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '0.75rem', maxWidth: '280px' }}>
              {heroTechStack.map((tech) => (
                <span
                  key={tech}
                  style={{ padding: '0.4rem 1rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--os-text-secondary)', transition: 'all 0.2s' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer Hint */}
      {windows.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ position: 'fixed', bottom: isMobile ? '4.25rem' : '3rem', left: '50%', transform: 'translateX(-50%)', color: 'var(--os-text-secondary)', opacity: 0.4, fontStyle: 'italic', zIndex: 20, pointerEvents: 'none', textAlign: 'center', maxWidth: isMobile ? 'calc(100vw - 1.5rem)' : 'none' }}
        >
          <p style={{ margin: 0, fontSize: isMobile ? '0.7rem' : '0.75rem', whiteSpace: 'nowrap' }}>
            Explore my work via the taskbar or desktop icons
          </p>
          {isMobile && (
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.62rem', whiteSpace: 'nowrap' }}>
              For better user experience, open portfolio on Desktop
            </p>
          )}
        </motion.div>
      )}

      {/* Windows */}
      {windows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={getWindowTitle(window.id)}
          isMinimized={window.isMinimized}
          zIndex={window.zIndex}
          isActive={activeWindow === window.id}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
        >
          {getWindowContent(window.id)}
        </Window>
      ))}

      {/* Start Menu - Windows 11 Style with Animation from Bottom */}
      <AnimatePresence>
        {showStartMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowStartMenu(false)}
            />

            {/* Start Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`fixed z-50 ${
                isMobile
                  ? "bottom-14 left-1 right-1"
                  : "bottom-14 left-1/2 -translate-x-1/2"
              }`}
              style={{
                width: isMobile ? "auto" : "600px",
                maxWidth: isMobile ? "calc(100vw - 8px)" : "calc(100vw - 32px)",
              }}
            >
              <div
                className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 transition-colors duration-300"
                style={{
                  backgroundColor: "var(--os-start-menu-bg)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                }}
              >
                {/* Search Bar */}
                <div className="p-4 md:p-6">
                  <div className="relative">
                    <div className="flex items-center gap-3 px-4 py-3 bg-os-window rounded-full border border-black/10 dark:border-white/10 focus-within:ring-2 focus-within:ring-accent/50 transition-all">
                      <svg className="w-4 h-4 text-os-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Type to search content..."
                        className="w-full bg-transparent border-none outline-none text-sm text-os-text-primary placeholder:text-os-text-secondary"
                      />
                    </div>
                  </div>
                </div>

                {/* Search Results or Pinned Apps */}
                <div className="px-4 md:px-6 pb-4 min-h-[300px]">
                  {searchQuery ? (
                    <div className="space-y-2">
                       <span className="text-sm font-semibold text-os-text-primary px-2">Search Results</span>
                       <div className="mt-2 space-y-1">
                         {searchResults.length > 0 ? (
                           searchResults.map((result) => (
                             <button
                               key={result.id}
                               onClick={() => onSearchResultClick(result.id)}
                               className="w-full flex items-center gap-4 p-2 rounded-lg hover:bg-os-window-header transition-colors group text-left"
                             >
                               <div className="w-10 h-10 flex items-center justify-center">
                                 <StartMenuIcon name={result.icon} />
                               </div>
                               <div>
                                 <div className="text-sm font-medium text-os-text-primary">{result.label}</div>
                                 <div className="text-xs text-os-text-secondary opacity-70">System app</div>
                               </div>
                             </button>
                           ))
                         ) : (
                           <div className="p-8 text-center text-os-text-secondary italic text-sm">
                             No results found for &quot;{searchQuery}&quot;
                           </div>
                         )}
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4 mt-2">
                        <span className="text-sm font-semibold text-os-text-primary px-2">Pinned</span>
                        <button className="text-xs text-os-text-secondary hover:text-os-text-primary transition-colors px-2 py-1 rounded hover:bg-foreground/10">
                          All apps →
                        </button>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {DESKTOP_ICONS.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => openWindow(item.id)}
                            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-foreground/5 transition-colors"
                          >
                            <StartMenuIcon name={item.icon} />
                            <span className="text-[10px] md:text-xs text-os-text-primary text-center leading-tight">
                              {item.label}
                            </span>
                          </button>
                        ))}
                        {QUICK_LINKS.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => openExternalLink(item.url)}
                            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-foreground/5 transition-colors"
                          >
                            <StartMenuIcon name={item.icon} />
                            <span className="text-[10px] md:text-xs text-os-text-primary text-center leading-tight">
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* User Profile Footer */}
                <div
                  className="flex items-center justify-between px-4 md:px-6 py-3 border-t border-black/5 dark:border-white/5 bg-foreground/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#8b5cf6] flex items-center justify-center">
                      <span className="text-white font-bold text-xs md:text-sm">
                        {personalInfo.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-os-text-primary">{personalInfo.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-os-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {personalInfo.availability}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStartMenu(false)}
                    className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
                    title="Close"
                  >
                    <svg className="w-5 h-5 text-os-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar
        openWindows={windows.map((w) => w.id)}
        activeWindow={activeWindow}
        onWindowClick={handleTaskbarWindowClick}
        onStartClick={() => setShowStartMenu(!showStartMenu)}
        onShowDesktop={showDesktop}
        brightness={brightness}
        setBrightness={setBrightness}
        nightLight={nightLight}
        setNightLight={setNightLight}
        highlightStartButton={windows.length === 0 && !showStartMenu}
      />
    </div>
  );
}

// Small icons for start menu
function StartMenuIcon({ name }: { name: string }) {
  const iconStyles = "w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center";

  const icons: Record<string, React.ReactNode> = {
    user: (
      <div className={`${iconStyles} bg-gradient-to-br from-blue-500 to-blue-700`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    ),
    folder: (
      <div className={`${iconStyles} bg-gradient-to-br from-amber-400 to-amber-600`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
    ),
    briefcase: (
      <div className={`${iconStyles} bg-gradient-to-br from-indigo-500 to-indigo-700`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    ),
    mail: (
      <div className={`${iconStyles} bg-gradient-to-br from-emerald-500 to-emerald-700`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    ),
    github: (
      <div className={`${iconStyles} bg-gradient-to-br from-gray-600 to-gray-800`}>
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
        </svg>
      </div>
    ),
    linkedin: (
      <div className={`${iconStyles} bg-gradient-to-br from-[#0077b5] to-[#005885]`}>
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </div>
    ),
    resume: (
      <div className={`${iconStyles} bg-gradient-to-br from-red-500 to-red-700`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    ),
  };

  return <>{icons[name] || icons.folder}</>;
}

// Loading fallback for lazy-loaded window content
function WindowContentLoading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px] p-8">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
        />
        <p className="text-sm text-os-text-secondary">Loading...</p>
      </div>
    </div>
  );
}
