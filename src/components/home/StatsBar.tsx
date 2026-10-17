import React from "react";
import { Users, Award, HeartPulse, Clock, Sparkles } from "lucide-react";

export function StatsBar() {
  const stats = [
    {
      label: "Patient Satisfaction",
      value: "99.4%",
      subtext: "From verified consultation reviews",
      icon: HeartPulse,
      accent: "text-rose-600 bg-rose-50 dark:bg-rose-950/40",
    },
    {
      label: "Accredited Specialists",
      value: "150+",
      subtext: "Top tier hospital affiliations",
      icon: Award,
      accent: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
    },
    {
      label: "Consultations Completed",
      value: "250,000+",
      subtext: "Across Bangladesh & Global Telehealth",
      icon: Users,
      accent: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      label: "Average Slot Wait Time",
      value: "< 15 Mins",
      subtext: "Instant telehealth connection",
      icon: Clock,
      accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    },
  ];

  return (
    <section className="py-12 border-y border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.accent}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {item.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
