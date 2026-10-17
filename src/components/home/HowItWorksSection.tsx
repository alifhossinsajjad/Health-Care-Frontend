import React from "react";
import { Search, Calendar, HeartHandshake, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Find Your Specialist",
      description:
        "Filter through 150+ board-certified doctors by medical department, hospital, consultation fee, or verified patient ratings.",
      icon: Search,
      accent: "from-blue-600 to-indigo-600",
    },
    {
      step: "02",
      title: "Choose Slot & Pay Flexibility",
      description:
        "Select your preferred date and 30-minute consultation window. Pay instantly online via Stripe or pick Pay Later with automated slot reservation.",
      icon: Calendar,
      accent: "from-indigo-600 to-cyan-600",
    },
    {
      step: "03",
      title: "Receive Quality Care",
      description:
        "Join your private encrypted video call or visit the hospital clinic. Instantly download your certified e-prescription and official tax invoice PDF.",
      icon: HeartHandshake,
      accent: "from-cyan-600 to-emerald-600",
    },
  ];

  return (
    <section className="py-20 bg-zinc-50/70 dark:bg-zinc-950/40 border-t border-zinc-200/70 dark:border-zinc-800/80">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Frictionless Healthcare
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">
            Your Health Journey in 3 Easy Steps
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2">
            We removed administrative friction so you can focus entirely on getting better.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.accent} text-white flex items-center justify-center shadow-lg shadow-blue-600/10`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-zinc-200 dark:text-zinc-800">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Step {item.step} of 03</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
