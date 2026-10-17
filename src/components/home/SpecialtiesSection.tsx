import React from "react";
import Link from "next/link";
import { 
  Heart, 
  Brain, 
  Bone, 
  Baby, 
  Eye, 
  Stethoscope, 
  Activity, 
  ShieldAlert, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { ISpecialty } from "@/src/types/specialty.type";

interface SpecialtiesSectionProps {
  specialties?: ISpecialty[];
}

export function SpecialtiesSection({ specialties = [] }: SpecialtiesSectionProps) {
  // Curated list of departments with icons and descriptions
  const defaultDepartments = [
    {
      title: "Cardiology",
      description: "Heart diseases, hypertension, chest pain & ECG specialists",
      icon: Heart,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40",
      count: "24 Doctors",
    },
    {
      title: "Neurology",
      description: "Brain, spine, migraine, neuropathy & nervous disorders",
      icon: Brain,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40",
      count: "18 Doctors",
    },
    {
      title: "Orthopedics",
      description: "Joint pains, bone fractures, arthritis & sports injuries",
      icon: Bone,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40",
      count: "15 Doctors",
    },
    {
      title: "Pediatrics",
      description: "Infant care, child vaccinations, growth & fever management",
      icon: Baby,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40",
      count: "20 Doctors",
    },
    {
      title: "Ophthalmology",
      description: "Vision correction, cataracts, retinal health & eye checks",
      icon: Eye,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40",
      count: "12 Doctors",
    },
    {
      title: "General Medicine",
      description: "Comprehensive health checkups, flu, diabetes & lifestyle care",
      icon: Stethoscope,
      color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-100 dark:border-cyan-900/40",
      count: "30 Doctors",
    },
    {
      title: "Gynecology & Obs",
      description: "Maternal care, women's wellness, prenatal & reproductive health",
      icon: Activity,
      color: "text-pink-600 bg-pink-50 dark:bg-pink-950/40 border-pink-100 dark:border-pink-900/40",
      count: "22 Doctors",
    },
    {
      title: "Emergency Medicine",
      description: "24/7 acute trauma, urgent diagnosis & critical triage",
      icon: ShieldAlert,
      color: "text-red-600 bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/40",
      count: "16 Doctors",
    },
  ];

  // If backend specialties are available, merge or display them prominently
  const displayList = defaultDepartments.map((dept, i) => {
    const backendMatch = specialties[i];
    return {
      title: backendMatch?.title || dept.title,
      description: dept.description,
      icon: dept.icon,
      color: dept.color,
      count: dept.count,
    };
  });

  return (
    <section className="py-20 bg-background relative">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 border border-blue-200/50 dark:border-blue-800/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Specialized Departments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Explore Clinical Specialties
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">
              From routine wellness checks to complex surgical interventions, find accredited experts dedicated to your well-being.
            </p>
          </div>

          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors shrink-0 group"
          >
            <span>Browse All Doctors</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={`/doctors?searchTerm=${encodeURIComponent(item.title)}`}
                className="group relative p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-800/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 ${item.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {item.count}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Consult Specialist</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
