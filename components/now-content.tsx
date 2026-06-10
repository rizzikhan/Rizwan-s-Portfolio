"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Code, Target, MapPin, Mail, Github } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

export function NowContent() {
  const { personalInfo, socialLinks } = portfolioData;
  const lastUpdated = "June 2026";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-foreground/10">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What I'm Doing Now
            </h1>
            <p className="text-lg text-foreground/70">
              A snapshot of my current focus, projects, and goals
            </p>
            <p className="text-sm text-foreground/50 mt-4">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Currently Learning */}
        <Section
          icon={<BookOpen className="w-6 h-6" />}
          title="Currently Learning"
          delay={0.1}
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                AI Engineering & RLHF
              </h3>
              <p className="text-foreground/70 mb-3">
                Deepening my skills in LLM-based product development and model evaluation
              </p>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>RLHF workflows and prompt-based evaluation across GPT, Claude, Llama, and Gemini</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Advanced RAG architectures and vector search with LangChain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>LLM fine-tuning and AI safety/model evaluation techniques</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Technical Deep Dives
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "RAG pipelines",
                  "Prompt engineering",
                  "Vector databases",
                  "Django Channels & WebSockets",
                  "Multi-tenant SaaS architecture",
                  "AI agent frameworks",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-sm font-mono text-accent"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Currently Building */}
        <Section
          icon={<Code className="w-6 h-6" />}
          title="Currently Building"
          delay={0.2}
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                At CRYMZEE Networks
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Building Nutrimode, an AI-powered nutrition & fitness platform with OpenAI and DALL·E</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Developing an AI-powered HR management platform with real-time features via Django Channels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Building an AI coupon finder & promo code aggregator with Django REST Framework and Celery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Deploying and scaling services with Docker, AWS, Stripe, and Firebase</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Open Source & Side Projects
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Maintaining IntelliFlow, an AI-powered multi-tenant SaaS platform on GitHub</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Exploring RAG-based chatbots and LangChain tooling for e-commerce</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Current Goals */}
        <Section
          icon={<Target className="w-6 h-6" />}
          title="Current Goals"
          delay={0.3}
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                2026 Goals
              </h3>
              <div className="grid gap-3">
                {[
                  "Ship 2+ more AI-powered platforms at CRYMZEE Networks",
                  "Deepen expertise in LLM fine-tuning and AI safety evaluation",
                  "Contribute to open-source LangChain & RAG tooling",
                  "Grow into a senior backend/AI engineering role",
                ].map((goal, i) => (
                  <motion.div
                    key={goal}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-foreground/5 border border-foreground/10"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-foreground/80">{goal}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Career
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Take on more ownership of AI/LLM features end-to-end</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Mentor junior Python/Django developers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Share technical writing on Django + AI integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▹</span>
                  <span>Expand my professional network in the AI/LLM space</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Currently Based */}
        <Section
          icon={<MapPin className="w-6 h-6" />}
          title="Currently Based"
          delay={0.4}
        >
          <div className="space-y-4">
            <p className="text-xl font-semibold text-foreground">
              Lahore, Pakistan 🇵🇰
            </p>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">▹</span>
                <span>Open to remote opportunities globally</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">▹</span>
                <span>Available for backend & AI freelance projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">▹</span>
                <span>Interested in AI/LLM startups</span>
              </li>
            </ul>
          </div>
        </Section>

        {/* Let's Connect */}
        <Section
          icon={<Mail className="w-6 h-6" />}
          title="Let's Connect"
          delay={0.5}
        >
          <div className="space-y-4">
            <p className="text-foreground/80">
              Working on something interesting? Let's chat!
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${personalInfo.email}`}
                className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/50 transition-all"
              >
                Send Email
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-foreground/10 border border-foreground/20 rounded-lg font-semibold hover:bg-foreground/20 transition-all"
              >
                LinkedIn
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-foreground/10 border border-foreground/20 rounded-lg font-semibold hover:bg-foreground/20 transition-all inline-flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}

// Section Component
function Section({
  icon,
  title,
  children,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-foreground/10">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="pl-0 md:pl-11">
        {children}
      </div>
    </motion.section>
  );
}
