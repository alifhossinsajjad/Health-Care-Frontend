"use client";

import React from "react";
import { Clock } from "lucide-react";

interface EmptyScheduleNoticeProps {
  doctorName: string;
}

export function EmptyScheduleNotice({ doctorName }: EmptyScheduleNoticeProps) {
  return (
    <div className="mt-6 py-12 px-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-3">
        <Clock className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
        No Available Schedule Slots
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
        Dr. {doctorName} has not published any open slots for the upcoming days. Please check back later or browse other specialists.
      </p>
    </div>
  );
}
