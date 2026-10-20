"use client";

import React from "react";
import Link from "next/link";
import { Stethoscope, Calendar, Star, ArrowUpRight, ShieldCheck } from "lucide-react";
import { IAIRecommendedDoctor } from "@/src/types/ai.type";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";

interface AIDoctorRecommendationCardProps {
  doctor: IAIRecommendedDoctor;
  onCheckSchedule?: (doctorId: string, doctorName: string) => void;
}

export function AIDoctorRecommendationCard({
  doctor,
  onCheckSchedule,
}: AIDoctorRecommendationCardProps) {
  // Normalize doctor name: strip repetitive Dr. Dr. prefixes
  const cleanName = doctor.name
    ? doctor.name.replace(/^(Dr\.\s*)+/i, "Dr. ")
    : "Doctor";

  const initials = cleanName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Clean specialties (e.g. remove trailing indices like "-1")
  const formattedSpecialties = doctor.specialties
    ? doctor.specialties
        .split(",")
        .map((s) => s.replace(/[-_0-9]+/g, " ").trim())
        .filter(Boolean)
        .join(", ")
    : "Clinical Specialist";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-3">
        {/* Doctor Avatar */}
        <Avatar className="h-12 w-12 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0 shadow-sm">
          <AvatarImage src={doctor.profileImage} alt={cleanName} className="object-cover" />
          <AvatarFallback className="rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs">
            {initials || "DR"}
          </AvatarFallback>
        </Avatar>

        {/* Doctor Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate" title={cleanName}>
              {cleanName}
            </h4>
            {typeof doctor.rating === "number" && doctor.rating > 0 ? (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 shrink-0 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {doctor.rating.toFixed(1)}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
            <Stethoscope className="h-3 w-3 text-blue-500 shrink-0" />
            <span className="truncate" title={formattedSpecialties}>
              {formattedSpecialties}
            </span>
          </div>

          {/* Pricing & Badges */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-zinc-400 font-medium">Fee:</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ৳{doctor.appointmentFee}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-zinc-600 dark:text-zinc-300 hover:text-blue-600 gap-1"
              >
                <Link href={`/doctors/${doctor.doctorId}`}>
                  Profile <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>

              <Button
                size="sm"
                onClick={() => onCheckSchedule?.(doctor.doctorId, doctor.name)}
                asChild={!onCheckSchedule}
                className="h-7 px-2.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1 shadow-sm"
              >
                {onCheckSchedule ? (
                  <span>
                    <Calendar className="h-3 w-3" /> Book
                  </span>
                ) : (
                  <Link href={`/doctors/${doctor.doctorId}`}>
                    <Calendar className="h-3 w-3" /> Book
                  </Link>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
