"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Stethoscope, Zap, Heart } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 text-center select-none">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),rgba(147,51,234,0.08),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-4xl">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
          <span>Next-Generation Telemedicine Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
          Clinical-Grade Telehealth <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Engineered for Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          From real-time intelligent AI symptom triage to encrypted WebRTC HD video consultations, instant voice notes, and zero-conflict schedule locking—discover the full clinical ecosystem.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link href="/doctors">
            <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center gap-2 transition-transform hover:scale-105">
              <span>Find Board-Certified Doctors</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/ai-assistant">
            <Button variant="outline" className="h-11 px-6 rounded-xl border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>Launch AI Symptom Triage</span>
            </Button>
          </Link>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 shadow-xs backdrop-blur-sm">
          <div>
            <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">99.98%</div>
            <div className="text-[11px] font-medium text-zinc-500 mt-0.5">Platform Uptime</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">&lt; 300ms</div>
            <div className="text-[11px] font-medium text-zinc-500 mt-0.5">AI Triage Latency</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">P2P SRTP</div>
            <div className="text-[11px] font-medium text-zinc-500 mt-0.5">Encrypted Calls</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">24/7/365</div>
            <div className="text-[11px] font-medium text-zinc-500 mt-0.5">Clinical Availability</div>
          </div>
        </div>
      </div>
    </section>
  );
}
