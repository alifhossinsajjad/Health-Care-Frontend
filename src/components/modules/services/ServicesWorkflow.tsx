"use client";

import React from "react";
import { Sparkles, Calendar, Video, FileCheck, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
    title: "AI Symptom Triage",
    description: "Describe symptoms in natural Bengali or English. Our RAG engine evaluates clinical urgency within 300ms.",
  },
  {
    step: "02",
    icon: <Calendar className="h-5 w-5 text-blue-500" />,
    title: "Select & Lock Slot",
    description: "Browse certified doctor schedules. Lock an appointment with instant Stripe card checkout or 30-min Pay Later.",
  },
  {
    step: "03",
    icon: <Video className="h-5 w-5 text-emerald-500" />,
    title: "HD Video & Voice Consultation",
    description: "Enter your private WebRTC consultation room. Talk via encrypted P2P video, live chat, and voice notes.",
  },
  {
    step: "04",
    icon: <FileCheck className="h-5 w-5 text-sky-500" />,
    title: "Prescription & Follow-up",
    description: "Receive signed digital prescriptions, lab test recommendations, and official Cloudinary invoices instantly.",
  },
];

export function ServicesWorkflow() {
  return (
    <section className="py-14 sm:py-20 bg-zinc-50/70 dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
            Seamless Workflow
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">
            How The Clinical Journey Works
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            From initial symptom discovery to official e-prescription delivery in four straightforward steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((item, index) => (
            <div
              key={index}
              className="relative flex flex-col p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all group"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-black text-zinc-300 dark:text-zinc-700 group-hover:text-blue-500 transition-colors">
                  {item.step}
                </span>
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
