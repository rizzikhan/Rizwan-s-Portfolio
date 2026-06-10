"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, CheckCircle2 } from "lucide-react";

interface DownloadResumeButtonProps {
  resumeUrl?: string;
  fileName?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: Error) => void;
}

export function DownloadResumeButton({
  resumeUrl = "/resume.pdf",
  fileName = "Rizwan_Ahmed_Resume.pdf",
  variant = "primary",
  size = "md",
  className = "",
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
}: DownloadResumeButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      onDownloadStart?.();

      // Fetch the file
      const response = await fetch(resumeUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      // Get the blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success state
      setDownloadComplete(true);
      onDownloadComplete?.();

      // Reset success state after 3 seconds
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
    } catch (error) {
      console.error("Download failed:", error);
      onDownloadError?.(error as Error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Variant styles
  const variantStyles = {
    primary: "bg-accent text-white hover:shadow-lg hover:shadow-accent/50 border-accent",
    secondary: "bg-foreground/10 text-foreground hover:bg-foreground/20 border-foreground/20",
    outline: "bg-transparent text-foreground border-foreground/30 hover:bg-foreground/5",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={isDownloading || downloadComplete}
      whileHover={{ scale: isDownloading || downloadComplete ? 1 : 1.05 }}
      whileTap={{ scale: isDownloading || downloadComplete ? 1 : 0.95 }}
      className={`
        group relative inline-flex items-center justify-center gap-2 
        rounded-lg font-semibold border-2 
        transition-all duration-300 
        disabled:opacity-70 disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-accent/20
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      aria-label={
        downloadComplete
          ? "Resume downloaded successfully"
          : isDownloading
          ? "Downloading resume"
          : "Download resume"
      }
      aria-busy={isDownloading}
      aria-live="polite"
    >
      {/* Background shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isDownloading ? "100%" : "-100%" }}
        transition={{
          duration: 1.5,
          repeat: isDownloading ? Infinity : 0,
          ease: "linear",
        }}
      />

      {/* Icon */}
      <span className="relative z-10">
        {downloadComplete ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className={iconSizes[size]} />
          </motion.div>
        ) : isDownloading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <Download className={`${iconSizes[size]} transition-transform duration-300 group-hover:-translate-y-0.5`} />
        )}
      </span>

      {/* Text */}
      <span className="relative z-10">
        {downloadComplete ? "Downloaded!" : isDownloading ? "Downloading..." : "Download Resume"}
      </span>

      {/* File icon decoration */}
      {!isDownloading && !downloadComplete && (
        <motion.div
          className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          <FileText className={iconSizes[size]} />
        </motion.div>
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-accent/30 -z-10" />
    </motion.button>
  );
}

// Additional variant: Floating Action Button
export function DownloadResumeFAB({
  resumeUrl = "/resume.pdf",
  fileName = "Rizwan_Ahmed_Resume.pdf",
  position = "bottom-right",
}: {
  resumeUrl?: string;
  fileName?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const positionStyles = {
    "bottom-right": "bottom-8 right-8",
    "bottom-left": "bottom-8 left-8",
    "top-right": "top-8 right-8",
    "top-left": "top-8 left-8",
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      className={`fixed ${positionStyles[position]} z-50`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
    >
      <div className="relative">
        {/* Tooltip */}
        {showTooltip && !isDownloading && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-foreground text-background text-sm font-semibold rounded-lg whitespace-nowrap shadow-lg"
          >
            Download Resume
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-foreground" />
          </motion.div>
        )}

        {/* FAB Button */}
        <motion.button
          onClick={handleDownload}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={isDownloading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-accent text-white shadow-2xl shadow-accent/50 flex items-center justify-center hover:shadow-accent/70 transition-shadow disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-accent/30"
          aria-label="Download resume"
        >
          {isDownloading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Download className="w-6 h-6" />
          )}
        </motion.button>

        {/* Pulse ring */}
        {!isDownloading && (
          <motion.div
            className="absolute inset-0 rounded-full bg-accent"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
