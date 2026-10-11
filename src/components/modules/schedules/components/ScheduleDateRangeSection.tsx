"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  Calendar,
  Sparkles,
  Check,
  CalendarRange,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  format,
  differenceInCalendarDays,
  eachDayOfInterval,
  isValid,
  parseISO,
} from "date-fns";
import AppField from "@/src/components/shared/form/AppField";
import { CreateScheduleFormValues } from "@/src/zod/schedule.validation";

export type DatePresetType = "today" | "3days" | "7days" | "14days" | "custom";

interface ScheduleDateRangeSectionProps {
  register: UseFormRegister<CreateScheduleFormValues>;
  errors: FieldErrors<CreateScheduleFormValues>;
  startDate?: string;
  endDate?: string;
  activePreset: DatePresetType;
  onSelectPreset: (preset: DatePresetType, totalDays: number) => void;
  onCustomChange: () => void;
}

export function ScheduleDateRangeSection({
  register,
  errors,
  startDate,
  endDate,
  activePreset,
  onSelectPreset,
  onCustomChange,
}: ScheduleDateRangeSectionProps) {
  let daysCount = 0;
  let formattedStartDate = "";
  let formattedEndDate = "";
  let dateIntervalList: Date[] = [];
  let isDateRangeValid = false;

  if (startDate && endDate) {
    const startObj = parseISO(startDate);
    const endObj = parseISO(endDate);
    if (isValid(startObj) && isValid(endObj)) {
      if (endObj >= startObj) {
        isDateRangeValid = true;
        daysCount = differenceInCalendarDays(endObj, startObj) + 1;
        formattedStartDate = format(startObj, "MMM dd, yyyy");
        formattedEndDate = format(endObj, "MMM dd, yyyy");

        if (daysCount <= 14) {
          try {
            dateIntervalList = eachDayOfInterval({ start: startObj, end: endObj });
          } catch {
            dateIntervalList = [];
          }
        }
      }
    }
  }

  const startDayName = startDate && isValid(parseISO(startDate))
    ? format(parseISO(startDate), "EEEE")
    : null;

  const endDayName = endDate && isValid(parseISO(endDate))
    ? format(parseISO(endDate), "EEEE")
    : null;

  return (
    <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
      {/* Header & Presets */}
      <div className="space-y-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            Date Range Selection
          </h4>
          {isDateRangeValid && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs">
              {daysCount} {daysCount === 1 ? "Day" : "Days"} Selected
            </span>
          )}
        </div>

        {/* Date Presets Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-zinc-500 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => onSelectPreset("today", 1)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              activePreset === "today"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs font-semibold ring-2 ring-blue-400/25"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750"
            }`}
          >
            {activePreset === "today" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            Today (1 Day)
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset("3days", 3)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              activePreset === "3days"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs font-semibold ring-2 ring-blue-400/25"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750"
            }`}
          >
            {activePreset === "3days" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            Next 3 Days
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset("7days", 7)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              activePreset === "7days"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs font-semibold ring-2 ring-blue-400/25"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750"
            }`}
          >
            {activePreset === "7days" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            Next 7 Days (1 Week)
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset("14days", 14)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              activePreset === "14days"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs font-semibold ring-2 ring-blue-400/25"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750"
            }`}
          >
            {activePreset === "14days" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            14 Days (2 Weeks)
          </button>
        </div>
      </div>

      {/* Reusable Form Inputs via AppField */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppField
          label={
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                Start Date
              </span>
              {startDayName && (
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-900/40">
                  {startDayName}
                </span>
              )}
            </div>
          }
          type="date"
          error={errors.startDate?.message}
          className="bg-zinc-50 dark:bg-zinc-950 w-full"
          {...register("startDate", {
            onChange: onCustomChange,
          })}
        />

        <AppField
          label={
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                End Date
              </span>
              {endDayName && (
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-900/40">
                  {endDayName}
                </span>
              )}
            </div>
          }
          type="date"
          error={errors.endDate?.message}
          className="bg-zinc-50 dark:bg-zinc-950 w-full"
          {...register("endDate", {
            onChange: onCustomChange,
          })}
        />
      </div>

      {/* Live Date Span Banner with Day-by-Day Badges */}
      {isDateRangeValid ? (
        <div className="p-3.5 rounded-xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <span className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <CalendarRange className="w-4 h-4 text-blue-600 shrink-0" />
              Selected Period ({daysCount} {daysCount === 1 ? "Calendar Day" : "Calendar Days"}):
            </span>
            <span className="font-bold text-blue-700 dark:text-blue-300">
              {formattedStartDate} <ArrowRight className="inline w-3 h-3 mx-1 text-blue-500" /> {formattedEndDate}
            </span>
          </div>

          {/* Day Badges */}
          {dateIntervalList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {dateIntervalList.map((day, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-zinc-900 text-blue-900 dark:text-blue-200 border border-blue-200/80 dark:border-blue-800 shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  {format(day, "EEE, MMM dd")}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>End date must be greater than or equal to start date.</span>
        </div>
      )}
    </div>
  );
}
