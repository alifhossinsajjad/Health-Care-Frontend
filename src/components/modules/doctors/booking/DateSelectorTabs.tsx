"use client";

import React from "react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { IDoctorScheduleWithSlot } from "./types";

interface DateSelectorTabsProps {
  sortedDateKeys: string[];
  effectiveDateKey: string;
  groupedByDate: Record<string, IDoctorScheduleWithSlot[]>;
  onSelectDate: (dateKey: string) => void;
}

export function DateSelectorTabs({
  sortedDateKeys,
  effectiveDateKey,
  groupedByDate,
  onSelectDate,
}: DateSelectorTabsProps) {
  const getDateLabel = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return `Today, ${format(date, "MMM dd")}`;
      if (isTomorrow(date)) return `Tomorrow, ${format(date, "MMM dd")}`;
      return format(date, "EEE, MMM dd");
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 block">
        1. Choose Date
      </label>
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {sortedDateKeys.map((dateKey) => {
          const isSelected = dateKey === effectiveDateKey;
          const slotCount = groupedByDate[dateKey]?.length || 0;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              className={`flex flex-col items-center justify-center min-w-[120px] px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 scale-[1.02]"
                  : "bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700"
              }`}
            >
              <span className="font-semibold whitespace-nowrap">
                {getDateLabel(dateKey)}
              </span>
              <span
                className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {slotCount} {slotCount === 1 ? "slot" : "slots"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
