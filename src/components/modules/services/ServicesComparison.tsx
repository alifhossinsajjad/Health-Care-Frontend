"use client";

import React from "react";
import { Check, X, ShieldAlert, Sparkles } from "lucide-react";

const COMPARISONS = [
  {
    feature: "Average Waiting Time",
    traditional: "2 - 3 hours in crowded hospital lobbies",
    healthcare: "Under 2 minutes inside instant WebRTC room",
  },
  {
    feature: "Initial Symptom Guidance",
    traditional: "Unverified internet searches causing panic",
    healthcare: "Verified clinical RAG triage with 999 emergency shield",
  },
  {
    feature: "Schedule Reservation",
    traditional: "Physical paper tokens prone to collisions",
    healthcare: "Concurrency-safe transactional slot locking with Pay Later",
  },
  {
    feature: "Diagnostic & Lab Test Sharing",
    traditional: "Hand-carried heavy folders and physical films",
    healthcare: "Direct screen sharing & 10MB encrypted document uploads",
  },
  {
    feature: "Follow-up Communication",
    traditional: "Another stressful trip to hospital outpatient",
    healthcare: "WhatsApp-style chat, vocal voice notes & live chimes",
  },
  {
    feature: "Prescription Delivery",
    traditional: "Handwritten paper slips easily misplaced",
    healthcare: "Legible signed digital PDFs with instant Cloudinary storage",
  },
];

export function ServicesComparison() {
  return (
    <section className="py-14 sm:py-20 select-none">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
            Clinical Superiority
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">
            Traditional Clinic vs. HealthCare
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            See how modern digital infrastructure transforms patient satisfaction and clinical speed.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-md">
          <div className="grid grid-cols-12 bg-zinc-100/80 dark:bg-zinc-900/80 p-4 border-b border-zinc-200/80 dark:border-zinc-800 font-bold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
            <div className="col-span-4 sm:col-span-4">Feature</div>
            <div className="col-span-4 sm:col-span-4 text-zinc-500">Traditional Visits</div>
            <div className="col-span-4 sm:col-span-4 text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span>HealthCare</span>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-xs sm:text-sm">
            {COMPARISONS.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-12 p-4 items-center hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <div className="col-span-4 sm:col-span-4 font-semibold text-zinc-900 dark:text-zinc-100 pr-2">
                  {row.feature}
                </div>
                <div className="col-span-4 sm:col-span-4 text-zinc-500 dark:text-zinc-400 flex items-start gap-1.5 pr-2">
                  <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-xs">{row.traditional}</span>
                </div>
                <div className="col-span-4 sm:col-span-4 text-zinc-800 dark:text-zinc-200 font-medium flex items-start gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                    {row.healthcare}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
