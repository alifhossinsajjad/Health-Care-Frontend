import React from "react";
import Link from "next/link";
import {
  Star,
  Building2,
  Calendar,
  Video,
  ArrowRight,
  Award,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";
import { IDoctor } from "@/src/types/doctor.type";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import { Button } from "@/src/components/ui/button";

interface FeaturedDoctorsSectionProps {
  doctors?: IDoctor[];
}

export function FeaturedDoctorsSection({
  doctors = [],
}: FeaturedDoctorsSectionProps) {
  // If no doctors exist in database, display a clean empty state
  if (!doctors || doctors.length === 0) {
    return (
      <section className="py-20 bg-zinc-50/70 dark:bg-zinc-950/40 border-y border-zinc-200/70 dark:border-zinc-800/80">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            No Doctors Registered Yet
          </h3>
          <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
            Our medical specialists are currently updating their schedules. Please check back shortly or browse all doctor profiles.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-zinc-50/70 dark:bg-zinc-950/40 border-y border-zinc-200/70 dark:border-zinc-800/80">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 border border-blue-200/50 dark:border-blue-800/50">
              <Award className="w-3.5 h-3.5" />
              <span>Accredited Professionals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Consult Top Medical Specialists
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">
              Book consultations with highly credentialed doctors offering in-clinic slots and live video care.
            </p>
          </div>

          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors shrink-0 group"
          >
            <span>View All Doctors ({doctors.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => {
            return (
              <div
                key={doc.id}
                className="group relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Doctor Profile Top */}
                  <div className="flex items-start gap-4 mb-4">
                    <DoctorAvatar
                      src={doc.profilePhoto}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl ring-2 ring-blue-50 dark:ring-blue-950 shrink-0"
                      fallbackClassName="text-lg font-bold bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 truncate">
                          {doc.name}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50 shrink-0" />
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate mt-0.5">
                        {doc.designation || "Specialist Consultant"}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {doc.qualification || "MBBS, Specialist"}
                      </p>
                    </div>
                  </div>

                  {/* Rating & Experience */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 mb-4 text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {doc.avarageRating || (doc as any).averageRating || "5.0"}
                      </span>
                      <span className="text-[10px] text-zinc-400">Rating</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 border-l border-zinc-200 dark:border-zinc-700 pl-2">
                      <Award className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {doc.experience ? `${doc.experience} Yrs` : "5+ Yrs"}
                      </span>
                      <span className="text-[10px] text-zinc-400">Exp.</span>
                    </div>
                  </div>

                  {/* Workplace */}
                  {doc.currentWorkingPlace && (
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-4 truncate">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{doc.currentWorkingPlace}</span>
                    </div>
                  )}
                </div>

                {/* Footer: Fee & Action */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Consultation Fee
                    </span>
                    <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">
                      ৳ {doc.appointmentFee || 1000}
                    </span>
                  </div>

                  <Link href={`/doctors/${doc.id}`} className="shrink-0">
                    <Button
                      size="sm"
                      className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 shadow-xs"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
