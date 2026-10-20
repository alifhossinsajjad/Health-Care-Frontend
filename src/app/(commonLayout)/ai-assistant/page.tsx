import React from "react";
import { Metadata } from "next";
import { Sparkles, ShieldCheck, HeartPulse, Clock } from "lucide-react";
import { AIChatContainer } from "@/src/components/modules/ai-assistant/AIChatContainer";

export const metadata: Metadata = {
  title: "AI Clinical Health Assistant & Medical Triage | HealthCare",
  description:
    "Real-time AI-powered symptom checker, specialist recommendation engine, and clinical doctor booking triage.",
};

export default function AIAssistantPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50/60 dark:bg-zinc-900/40 py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 h-full">
        {/* Page Top Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="h-5 w-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                AI Clinical Health Assistant
              </h1>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-2xl">
              Intelligent clinical triage powered by Retrieval-Augmented Generation (RAG). Describe your symptoms to find verified specialists and check schedule availability.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm">
              <Clock className="h-3.5 w-3.5 text-blue-500" /> 24/7 Live Triage
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Verified Specialists
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm">
              <HeartPulse className="h-3.5 w-3.5 text-purple-500" /> Emergency Alerts
            </span>
          </div>
        </div>

        {/* Full-Height Chat Container */}
        <div className="h-[700px] w-full rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xl bg-white dark:bg-zinc-950">
          <AIChatContainer />
        </div>
      </div>
    </div>
  );
}
