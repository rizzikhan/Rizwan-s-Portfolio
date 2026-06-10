"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { throttle } from "@/lib/utils";

import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

const accents = [
  { name: "Visionary", value: "visionary", color: "#FF6B6B" },
  { name: "Depth Seeker", value: "depth-seeker", color: "#00ADB5" },
  { name: "Subtle Luxe", value: "subtle-luxe", color: "#B388FF" },
  { name: "Ocean Breeze", value: "ocean-breeze", color: "#3B82F6" },
  { name: "Sunset Glow", value: "sunset-glow", color: "#F97316" },
  { name: "Forest Zen", value: "forest-zen", color: "#10B981" },
  { name: "Royal Purple", value: "royal-purple", color: "#8B5CF6" },
  { name: "Coral Dream", value: "coral-dream", color: "#FB7185" },
  { name: "Midnight Sky", value: "midnight-sky", color: "#1E40AF" },
  { name: "Cherry Blossom", value: "cherry-blossom", color: "#EC4899" },
  { name: "Amber Glow", value: "amber-glow", color: "#F59E0B" },
  { name: "Mint Fresh", value: "mint-fresh", color: "#14B8A6" },
  { name: "Lavender Dream", value: "lavender-dream", color: "#A855F7" },
  { name: "Crimson Fire", value: "crimson-fire", color: "#DC2626" },
  { name: "Electric Cyan", value: "electric-cyan", color: "#06B6D4" },
];

// NavLink component with optimized magnetic hover effect (memoized for performance)
const NavLink = React.memo(function NavLink({ link, isActive, onClick }: { link: { name: string; href: string; sectionId: string }; isActive: boolean; onClick: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Simplified spring config for better performance
  const springConfig = { stiffness: 300, damping: 25, mass: 0.2 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current || reduceMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Reduced magnetic effect intensity (from 0.3 to 0.15)
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={link.href}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-300 group"
      style={{ x: reduceMotion ? 0 : xSpring, y: reduceMotion ? 0 : ySpring }}
    >
      {link.name}

      {/* Hover Background */}
      <motion.span
        className="absolute inset-0 bg-foreground/5 rounded-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
      />

      {/* Active Indicator - Simplified (removed glow and particles) */}
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </motion.a>
  );
});

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollActiveSection, setScrollActiveSection] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [accentDropdownOpen, setAccentDropdownOpen] = useState(false);
  const [activeAccent, setActiveAccent] = useState("visionary");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Define links with page routes and section IDs
  const links = [
    { name: t("nav.home"), href: "/", sectionId: "home" },
    { name: t("nav.about"), href: "/about", sectionId: "about" },
    { name: t("nav.experience"), href: "/experience", sectionId: "experience" },
    { name: t("nav.projects"), href: "/projects", sectionId: "projects" },
    { name: t("nav.contact"), href: "/contact", sectionId: "contact" },
  ];

  // Determine active link based on pathname or scroll position (on homepage)
  const getActiveLink = () => {
    // On homepage, use scroll-based active section if available
    if (pathname === "/" && scrollActiveSection) {
      return scrollActiveSection;
    }
    // Otherwise, determine by pathname
    if (pathname === "/") return "home";
    // Match pathname to link (e.g., /about -> about)
    const matchedLink = links.find((link) => link.href === pathname);
    return matchedLink?.sectionId || "home";
  };

  const activeLink = getActiveLink();

  useEffect(() => {
    setMounted(true);
    const savedAccent = localStorage.getItem("accent") || "visionary";
    setActiveAccent(savedAccent);
    document.body.setAttribute("data-accent", savedAccent);

    // Time-based theming logic
    const checkTimeBasedTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      // Only apply time-based theme if user hasn't manually set a preference (or explicitly set to system)
      if (!savedTheme || savedTheme === "system") {
        const hour = new Date().getHours();
        // Dark mode from 6 PM (18:00) to 9 AM (09:00)
        const isDarkTime = hour >= 18 || hour < 9;
        setTheme(isDarkTime ? "dark" : "light");
      }
    };

    checkTimeBasedTheme();

    // Throttled scroll handler for better performance
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const throttledScroll = throttle(handleScroll, 100);

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [setTheme]);

  // Scroll Spy - Track active section (only on homepage)
  useEffect(() => {
    // Only enable scroll spy on the homepage
    if (pathname !== "/") {
      setScrollActiveSection(null);
      return;
    }

    // Set default to "home" when entering the homepage
    setScrollActiveSection("home");

    // Small delay to let the page render before observing
    const timeoutId = setTimeout(() => {
      const sectionIds = links.map((link) => link.sectionId);
      const sections = sectionIds.map((id) => document.getElementById(id));

      const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -70% 0px", // Trigger when section is in middle of viewport
        threshold: 0,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setScrollActiveSection(id);
          }
        });
      }, observerOptions);

      sections.forEach((section) => {
        if (section) observer.observe(section);
      });

      // Store observer reference for cleanup
      (window as any).__navObserver = observer;
      (window as any).__navSections = sections;
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const observer = (window as any).__navObserver;
      const sections = (window as any).__navSections;
      if (observer && sections) {
        sections.forEach((section: Element | null) => {
          if (section) observer.unobserve(section);
        });
      }
    };
  }, [pathname]);

  const handleAccentChange = (accent: string) => {
    setActiveAccent(accent);
    localStorage.setItem("accent", accent);
    document.body.setAttribute("data-accent", accent);
    setAccentDropdownOpen(false);
  };

  // Handle navigation - always navigate to the page
  const handleNavClick = (link: { href: string; sectionId: string }) => {
    // If clicking Home while already on homepage, scroll to top
    if (link.href === "/" && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setScrollActiveSection("home");
      return;
    }
    // Navigate to the page
    router.push(link.href);
    // If navigating to home, scroll to top after navigation
    if (link.href === "/") {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const executeSearch = (windowId: string) => {
    const event = new CustomEvent("open-os-window", {
      detail: { windowId }
    });
    window.dispatchEvent(event);
    setSearchQuery("");
    setShowSearchResults(false);
    
    // If not on homepage, go home first since Desktop is there
    if (pathname !== "/") {
      router.push("/");
    }
  };

  if (!mounted) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border-b border-foreground/10 shadow-lg shadow-accent/5"
            : "md:bg-transparent bg-background/80 md:backdrop-blur-none backdrop-blur-xl md:border-b-0 border-b border-foreground/10"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="/"
              className="relative z-50 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <span className="text-2xl font-bold bg-gradient-to-r from-accent via-accent/80 to-accent/50 bg-clip-text text-transparent">
                  AB
                </span>
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  layoutId="logo-glow"
                />
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 relative px-6 py-2 bg-foreground/5 rounded-2xl border border-foreground/10 mx-4">
              <div className="flex items-center gap-1">
                {links.map((link) => (
                  <NavLink
                    key={link.sectionId}
                    link={link}
                    isActive={activeLink === link.sectionId}
                    onClick={() => handleNavClick(link)}
                  />
                ))}
              </div>
              
              <div className="w-px h-6 bg-foreground/10 mx-2" />
              
              {/* Navbar Search */}
              <div className="relative group">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-os-window rounded-xl border border-black/10 dark:border-white/10 focus-within:border-accent/30 transition-all w-48 lg:w-64">
                  <svg className="w-4 h-4 text-foreground/40 group-focus-within:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={t("nav.searchPlaceholder") || "Search portfolio..."}
                    className="w-full bg-transparent border-none outline-none text-xs text-foreground placeholder:text-foreground/30"
                  />
                </div>
                
                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showSearchResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-os-window border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-2"
                    >
                      {(() => {
                        const query = searchQuery.toLowerCase();
                        const results = [
                          { id: "about", label: "About Me", icon: "👤", keywords: ["skills", "bio", "education", "tech", "python", "django", "ai"] },
                          { id: "projects", label: "Projects", icon: "🚀", keywords: ["work", "apps", "code", "portfolio", "nutrimode", "intelliflow", "nexacommerce"] },
                          { id: "experience", label: "Experience", icon: "💼", keywords: ["jobs", "history", "crymzee", "hubble42", "piecyfer", "career"] },
                          { id: "contact", label: "Contact", icon: "✉️", keywords: ["email", "hire", "talk", "social", "phone", "location"] },
                        ];

                        // Filter results by checking if query matches label, keywords or if we should open a specific window based on more data
                        const filtered = results.filter(item => 
                          item.label.toLowerCase().includes(query) ||
                          item.keywords.some(k => k.includes(query))
                        );

                        if (filtered.length === 0) {
                          return <p className="p-4 text-xs text-foreground/40 text-center">No matches found</p>;
                        }

                        return filtered.map(result => (
                          <button
                            key={result.id}
                            onClick={() => executeSearch(result.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/10 text-foreground text-sm transition-colors group"
                          >
                            <span className="text-lg">{result.icon}</span>
                            <div className="text-left">
                              <p className="font-medium group-hover:text-accent transition-colors">{result.label}</p>
                              <p className="text-[10px] text-foreground/40 italic">Open in OS Window</p>
                            </div>
                          </button>
                        ));
                      })()}
                      
                      {searchQuery.length > 0 && (
                        <div className="p-2 border-t border-foreground/5 mt-1">
                          <p className="text-[10px] text-foreground/30 text-center">Searching through portfolio.json...</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Button & Theme Controls */}
            <div className="hidden md:flex items-center gap-3">
              {/* Accent Switcher */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAccentDropdownOpen(!accentDropdownOpen)}
                  className="p-2 rounded-lg bg-os-window border border-black/10 dark:border-white/10 hover:bg-os-window-header transition-all duration-300 text-os-text-primary"
                  aria-label="Change accent color"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-current" style={{ backgroundColor: accents.find(a => a.value === activeAccent)?.color }}></div>
                </motion.button>

                <AnimatePresence>
                  {accentDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-foreground/10 bg-background/90 backdrop-blur-xl p-2 shadow-xl"
                    >
                      {accents.map((accent) => (
                        <button
                          key={accent.value}
                          onClick={() => handleAccentChange(accent.value)}
                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-foreground/5 ${
                            activeAccent === accent.value ? "bg-accent/10 text-accent font-medium" : "text-foreground/70"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="h-3 w-3 rounded-full shadow-[0_0_10px_currentColor]"
                              style={{ backgroundColor: accent.color, color: accent.color }}
                            />
                            {accent.name}
                          </div>
                          {activeAccent === accent.value && (
                             <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </motion.svg>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />



              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 rounded-lg bg-foreground/5 backdrop-blur-sm border border-foreground/10 hover:bg-foreground/10 transition-all duration-300 text-foreground/70 hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </motion.button>


              {/* Resume/CTA Button */}
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 py-2.5 bg-accent rounded-lg text-white font-semibold text-sm overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t("nav.resume")}
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative z-50 p-2 rounded-lg bg-foreground/5 backdrop-blur-sm border border-foreground/10 text-foreground"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current rounded-full"
                />
                <motion.span
                  animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-current rounded-full"
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current rounded-full"
                />
              </div>
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-background/95 backdrop-blur-xl border-l border-foreground/10 md:hidden"
              >
                <div className="flex flex-col h-full p-8 pt-24">
                  {/* Mobile Links */}
                  <div className="flex flex-col gap-2">
                    {links.map((link, index) => (
                      <motion.a
                        key={link.sectionId}
                        href={link.href}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          handleNavClick(link);
                        }}
                        className="group relative px-6 py-4 text-lg font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 rounded-xl overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-between">
                          {link.name}
                          <motion.svg
                            className="w-5 h-5"
                            initial={{ x: -5, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </motion.svg>
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-accent/10"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        {activeLink === link.sectionId && (
                          <motion.div
                            layoutId="mobile-active"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-accent"
                          />
                        )}
                      </motion.a>
                    ))}
                  </div>

                  {/* Mobile Controls */}
                  <div className="mt-auto space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/80 hover:bg-foreground/10 transition-colors"
                      >
                        {theme === "light" ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            <span className="text-xs">Light</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            <span className="text-xs">Dark</span>
                          </>
                        )}
                      </button>
                      
                      {/* Mobile Accent Toggle (Simplified) */}
                      <button
                        onClick={() => {
                          const nextIndex = (accents.findIndex(a => a.value === activeAccent) + 1) % accents.length;
                          handleAccentChange(accents[nextIndex].value);
                        }}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/80 hover:bg-foreground/10 transition-colors"
                      >
                         <span
                            className="h-5 w-5 rounded-full shadow-[0_0_10px_currentColor]"
                            style={{ backgroundColor: accents.find(a => a.value === activeAccent)?.color, color: accents.find(a => a.value === activeAccent)?.color }}
                          />
                        <span className="text-xs">Color</span>
                      </button>


                    </div>

                    <motion.a
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-6 py-4 bg-accent rounded-xl text-white font-semibold text-center hover:shadow-lg hover:shadow-accent/50 transition-all duration-300"
                    >
                      Download Resume
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
}