"use client";

import React from "react";
import { Sparkles, CalendarDays, Clock, Layers } from "lucide-react";

interface SchedulePreviewSummaryProps {
  daysCount: number;
  slotsPerDay: number;
  dailyHours: string;
  formattedStartDate: string;
  totalSlots: number;
}

export function SchedulePreviewSummary({
  daysCount,
  slotsPerDay,
  dailyHours,
  formattedStartDate,
  totalSlots,
}: SchedulePreviewSummaryProps) {
  if (daysCount <= 0 || slotsPerDay <= 0 || totalSlots <= 0) {
    return null;
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-linear-to-br from-blue-50/80 via-indigo-50/50 to-blue-50/80 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-blue-200/70 dark:border-blue-800/50">
        <span className="text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          Live Generation Preview
        </span>
        <span className="text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full bg-blue-600 text-white shadow-xs">
          {totalSlots} Total Slots
        </span>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 sm:p-4 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-blue-100 dark:border-zinc-800 shadow-2xs space-y-0.5">
          <span className="text-zinc-500 block text-xs flex items-center justify-center gap-1.5 font-medium">
            <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
            Total Days
          </span>
          <strong className="font-bold text-zinc-900 dark:text-zinc-100 text-lg sm:text-xl block">
            {daysCount}
          </strong>
          <span className="text-[11px] text-zinc-400 block truncate">
            {formattedStartDate}
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-blue-100 dark:border-zinc-800 shadow-2xs space-y-0.5">
          <span className="text-zinc-500 block text-xs flex items-center justify-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            Slots / Day
          </span>
          <strong className="font-bold text-zinc-900 dark:text-zinc-100 text-lg sm:text-xl block">
            {slotsPerDay}
          </strong>
          <span className="text-[11px] text-zinc-400 block truncate">
            {dailyHours} hrs / day
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-blue-100 dark:border-zinc-800 shadow-2xs space-y-0.5">
          <span className="text-zinc-500 block text-xs flex items-center justify-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Interval
          </span>
          <strong className="font-bold text-zinc-900 dark:text-zinc-100 text-lg sm:text-xl block">
            30 Min
          </strong>
          <span className="text-[11px] text-zinc-400 block truncate">
            Per booking slot
          </span>
        </div>
      </div>

      {/* Formula Summary */}
      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-blue-100/90 dark:border-zinc-800 text-center">
        <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 font-medium">
          Calculation: <strong>{daysCount} Days</strong> × <strong>{slotsPerDay} Slots/Day</strong> = <span className="font-bold text-blue-700 dark:text-blue-300 underline decoration-blue-400 decoration-2">{totalSlots} Total Appointment Slots</span>
        </p>
      </div>
    </div>
  );
}
