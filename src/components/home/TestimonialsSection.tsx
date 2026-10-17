import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  const reviews = [
    {
      name: "Rafiqul Islam",
      role: "Cardiac Patient",
      rating: 5,
      content:
        "Booking an appointment with a top cardiologist took me literally 2 minutes. The video consultation was crystal clear, and my e-prescription was generated immediately. Life-saving service!",
      location: "Dhaka, Bangladesh",
      initials: "RI",
      avatarBg: "bg-blue-600",
    },
    {
      name: "Sharmin Sultana",
      role: "Mother of 2",
      rating: 5,
      content:
        "My 4-year-old had a sudden high fever at night. Being able to connect with an on-call pediatrician through HD video without rushing through midnight traffic was an absolute blessing.",
      location: "Chittagong, Bangladesh",
      initials: "SS",
      avatarBg: "bg-emerald-600",
    },
    {
      name: "Mahmud Hasan",
      role: "Corporate Executive",
      rating: 5,
      content:
        "The Pay Later option with the 30-minute reservation and official PDF invoice download makes hospital bill claims with corporate medical insurance effortless.",
      location: "Sylhet, Bangladesh",
      initials: "MH",
      avatarBg: "bg-indigo-600",
    },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Real Stories, Real Recoveries
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">
            Loved by 250,000+ Happy Patients
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2">
            Read verified feedback from patients who found the right doctor and fast care through HealthCare.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-zinc-200 dark:text-zinc-800" />
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${rev.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                >
                  {rev.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {rev.name}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {rev.role} • {rev.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
