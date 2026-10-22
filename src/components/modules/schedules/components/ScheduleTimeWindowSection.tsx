"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  Clock,
  Sparkles,
  Check,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import AppField from "@/src/components/shared/form/AppField";
import { CreateScheduleFormValues } from "@/src/zod/schedule.validation";

export type TimePresetType = "morning" | "afternoon" | "evening" | "fullday" | "custom";

interface ScheduleTimeWindowSectionProps {
  register: UseFormRegister<CreateScheduleFormValues>;
  errors: FieldErrors<CreateScheduleFormValues>;
  startTime?: string;
  endTime?: string;
  activePreset: TimePresetType;
  onSelectPreset: (preset: TimePresetType, start: string, end: string) => void;
  onCustomChange: () => void;
}

export function ScheduleTimeWindowSection({
  register,
  errors,
  startTime,
  endTime,
  activePreset,
  onSelectPreset,
  onCustomChange,
}: ScheduleTimeWindowSectionProps) {
  let dailyMinutes = 0;
  let formattedStartTime = "";
  let formattedEndTime = "";
  let isTimeWindowValid = false;
  const sampleSlotTimes: string[] = [];
  let lastSlotTime = "";

  if (startTime && endTime) {
    const [sH, sM] = startTime.split(":").map(Number);
    const [eH, eM] = endTime.split(":").map(Number);
    if (!isNaN(sH) && !isNaN(sM) && !isNaN(eH) && !isNaN(eM)) {
      const startTotal = sH * 60 + sM;
      const endTotal = eH * 60 + eM;
      if (endTotal > startTotal) {
        isTimeWindowValid = true;
        dailyMinutes = endTotal - startTotal;

        const dummyStart = new Date();
        dummyStart.setHours(sH, sM, 0, 0);
        formattedStartTime = format(dummyStart, "hh:mm a");

        const dummyEnd = new Date();
        dummyEnd.setHours(eH, eM, 0, 0);
        formattedEndTime = format(dummyEnd, "hh:mm a");

        // Generate sample slot timestamps (first 4 slots)
        let curMins = startTotal;
        while (curMins + 30 <= endTotal && sampleSlotTimes.length < 4) {
          const slotD = new Date();
          slotD.setHours(Math.floor(curMins / 60), curMins % 60, 0, 0);
          sampleSlotTimes.push(format(slotD, "hh:mm a"));
          curMins += 30;
        }

        if (endTotal - 30 >= startTotal) {
          const lastD = new Date();
          lastD.setHours(Math.floor((endTotal - 30) / 60), (endTotal - 30) % 60, 0, 0);
          lastSlotTime = format(lastD, "hh:mm a");
        }
      }
    }
  }

  const slotsPerDay = isTimeWindowValid ? Math.floor(dailyMinutes / 30) : 0;
  const dailyHours = (dailyMinutes / 60).toFixed(dailyMinutes % 60 === 0 ? 0 : 1);

  return (
    <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
      {/* Header & Presets */}
      <div className="space-y-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </span>
            Daily Time Window
          </h4>
          {isTimeWindowValid && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              {dailyHours} Hours • {slotsPerDay} Slots/Day
            </span>
          )}
        </div>

        {/* Time Presets Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-zinc-500 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => onSelectPreset("morning", "09:00", "13:00")}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              activePreset === "morning"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold ring-2 ring-emerald-400/25"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750"
            }`}
          >
            {activePreset === "morning" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            Morning (09:00 - 13:00)
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset("afternoon", "14:00", "18:00")}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              activePreset === "afternoon"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold ring-2 ring-emerald-400/25"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750"
            }`}
          >
            {activePreset === "afternoon" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            Afternoon (14:00 - 18:00)
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset("evening", "18:00", "22:00")}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              activePreset === "evening"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold ring-2 ring-emerald-400/25"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750"
            }`}
          >
            {activePreset === "evening" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            Evening (18:00 - 22:00)
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset("fullday", "09:00", "18:00")}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              activePreset === "fullday"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold ring-2 ring-emerald-400/25"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750"
            }`}
          >
            {activePreset === "fullday" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            Full Day (09:00 - 18:00)
          </button>
        </div>
      </div>

      {/* Reusable Form Inputs via AppField */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppField
          label={
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                Daily Start Time
              </span>
              {formattedStartTime && (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-900/40">
                  {formattedStartTime}
                </span>
              )}
            </div>
          }
          type="time"
          error={errors.startTime?.message}
          className="bg-zinc-50 dark:bg-zinc-950 w-full"
          {...register("startTime", {
            onChange: onCustomChange,
          })}
        />

        <AppField
          label={
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                Daily End Time
              </span>
              {formattedEndTime && (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-900/40">
                  {formattedEndTime}
                </span>
              )}
            </div>
          }
          type="time"
          error={errors.endTime?.message}
          className="bg-zinc-50 dark:bg-zinc-950 w-full"
          {...register("endTime", {
            onChange: onCustomChange,
          })}
        />
      </div>

      {/* Live Time Summary Banner */}
      {isTimeWindowValid ? (
        <div className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <span className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              Daily Operating Window:
            </span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">
              {formattedStartTime} <ArrowRight className="inline w-3 h-3 mx-1 text-emerald-500" /> {formattedEndTime} ({dailyHours} hrs/day)
            </span>
          </div>

          {/* Sample Generated Slot Preview Chips */}
          {sampleSlotTimes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-xs text-zinc-500 font-medium mr-1">Sample 30m slots:</span>
              {sampleSlotTimes.map((st, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium font-mono shadow-2xs"
                >
                  {st}
                </span>
              ))}
              {slotsPerDay > 4 && lastSlotTime && (
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  ... until {lastSlotTime} ({slotsPerDay} total slots daily)
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>End time must be after start time (minimum 30 minutes duration).</span>
        </div>
      )}
    </div>
  );
}
