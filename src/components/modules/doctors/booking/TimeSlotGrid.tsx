"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import { Clock, Check } from "lucide-react";
import { IDoctorScheduleWithSlot } from "./types";

interface TimeSlotGridProps {
  slots: IDoctorScheduleWithSlot[];
  selectedScheduleId: string | null;
  onSelectSlot: (scheduleId: string) => void;
}

export function TimeSlotGrid({
  slots,
  selectedScheduleId,
  onSelectSlot,
}: TimeSlotGridProps) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 block">
        2. Choose Time Slot
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {slots.map((item) => {
          const isSelected = selectedScheduleId === item.scheduleId;
          const startTime = format(
            parseISO(item.schedule.startDateTime),
            "hh:mm a"
          );
          const endTime = format(
            parseISO(item.schedule.endDateTime),
            "hh:mm a"
          );

          return (
            <button
              key={item.scheduleId}
              type="button"
              onClick={() => onSelectSlot(item.scheduleId)}
              className={`relative flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-sm ring-2 ring-blue-500/50"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  {startTime} - {endTime}
                </span>
              </div>

              {isSelected && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
