"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import portfolioData from "@/data/portfolio.json";

export function ContactContent() {
  const { personalInfo, socialLinks } = portfolioData;
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <h2 className="text-sm font-mono text-[var(--os-cyan)] uppercase tracking-wider">
        {"<Contact />"}
      </h2>

      {/* Contact Info - Responsive Grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-2">
        {[
          {
            icon: "📧",
            label: "Email",
            value: personalInfo.email,
            href: `mailto:${personalInfo.email}`,
          },
          {
            icon: "💼",
            label: "LinkedIn",
            value: "Connect",
            href: socialLinks.linkedin,
          },
          {
            icon: "👨‍💻",
            label: "GitHub",
            value: "View Code",
            href: socialLinks.github,
          },
          {
            icon: "📱",
            label: "Phone",
            value: personalInfo.phone,
            href: `tel:${personalInfo.phone?.replace(/\s/g, "")}`,
          },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.label !== "Email" && item.label !== "Phone" ? "_blank" : undefined}
            rel={item.label !== "Email" && item.label !== "Phone" ? "noopener noreferrer" : undefined}
            className="p-2 md:p-3 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-[var(--os-cyan)]/30 transition-colors flex items-center gap-2 md:gap-3 group"
          >
            <span className="text-lg md:text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-foreground/60">{item.label}</p>
              <p className="text-xs md:text-sm text-foreground truncate">
                {item.value}
              </p>
            </div>
          </a>
        ))}

        {/* Location - Not a link */}
        <div className="p-2 md:p-3 rounded-lg bg-foreground/5 border border-foreground/10 flex items-center gap-2 md:gap-3 col-span-2 sm:col-span-1">
          <span className="text-lg md:text-xl flex-shrink-0">📍</span>
          <div className="min-w-0">
            <p className="text-[10px] md:text-xs text-foreground/60">Location</p>
            <p className="text-xs md:text-sm text-foreground truncate">
              {personalInfo.location}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono text-foreground/70">// Send a message</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm bg-foreground/5 border border-foreground/10 rounded-lg focus:outline-none focus:border-[var(--os-cyan)]/50 text-foreground placeholder:text-foreground/40 transition-colors"
            />
            <input
              type="email"
              placeholder="Your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm bg-foreground/5 border border-foreground/10 rounded-lg focus:outline-none focus:border-[var(--os-cyan)]/50 text-foreground placeholder:text-foreground/40 transition-colors"
            />
          </div>
          <textarea
            placeholder="Your message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            rows={4}
            className="w-full px-3 py-2 text-sm bg-foreground/5 border border-foreground/10 rounded-lg focus:outline-none focus:border-[var(--os-cyan)]/50 text-foreground placeholder:text-foreground/40 resize-none transition-colors"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium bg-[var(--os-cyan)] text-white rounded-lg hover:bg-[var(--os-cyan)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </span>
            ) : status === "sent" ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sent!
              </span>
            ) : (
              "Send Message"
            )}
          </button>
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Failed to send. Please try again.
            </motion.p>
          )}
        </form>
      </div>
    </div>
  );
}
