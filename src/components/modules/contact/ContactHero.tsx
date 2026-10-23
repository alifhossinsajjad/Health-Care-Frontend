"use client";

import React from "react";
import { MessageSquareText, Sparkles, Clock, ShieldCheck } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-8 sm:pt-16 sm:pb-12 text-center select-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[320px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4 shadow-2xs">
          <MessageSquareText className="h-3.5 w-3.5 text-blue-600" />
          <span>Patient Support & Clinical Concierge</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          How Can We Help You Today?
        </h1>

        <p className="mt-3.5 text-xs sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Have questions about doctor appointments, telemedicine video sessions, or billing? Our dedicated support and clinical concierge team is ready to assist.
        </p>

        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-blue-500" /> 24/7 Emergency Dispatch
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Rapid &lt;2hr Response
          </span>
        </div>
      </div>
    </section>
  );
}
