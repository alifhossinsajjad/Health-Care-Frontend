"use client";

import React from "react";
import { Sparkles, Activity, ShieldCheck } from "lucide-react";

interface AIAnalyzingLoaderProps {
  stage?: string;
  fileName?: string;
}

export function AIAnalyzingLoader({ stage, fileName }: AIAnalyzingLoaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/80 dark:from-zinc-900 dark:via-zinc-950 dark:to-blue-950/40 p-8 sm:p-10 text-center shadow-lg">
      {/* Background Ambient Glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Central Medical Radar HUD Animation */}
      <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <span className="absolute inset-0 rounded-full border-2 border-blue-400/40 dark:border-blue-500/30 animate-ping opacity-75" />
        
        {/* Rotating Conic Radar Gradient */}
        <div className="absolute inset-1 rounded-full border border-blue-500/30 dark:border-blue-400/20 animate-spin [animation-duration:3s]">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
        </div>

        {/* Inner Glowing Core */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
          <Activity className="h-8 w-8 animate-pulse text-white" />
        </div>
      </div>

      {/* Title & Multimodal Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold mb-3">
        <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 animate-spin [animation-duration:8s]" />
        <span>Multimodal Clinical Vision Engine</span>
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
        Scanning Clinical Biomarkers
      </h3>

      {fileName && (
        <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate max-w-xs mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md">
          {fileName}
        </p>
      )}

      {/* Dynamic Stage Text */}
      <div className="min-h-[3rem] flex items-center justify-center px-4">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-200 transition-all duration-300">
          {stage || "Initializing multimodal neural vision pipeline..."}
        </p>
      </div>

      {/* Animated Infinite Progress Bar */}
      <div className="w-full max-w-sm mx-auto mt-4 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 w-1/2 rounded-full animate-[progress_1.8s_ease-in-out_infinite]" />
      </div>

      {/* Security Assurance */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>256-bit encrypted • HIPAA compliant clinical processing</span>
      </div>
    </div>
  );
}
