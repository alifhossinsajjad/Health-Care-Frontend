"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface BlockedDoctorNoticeProps {
  doctorName: string;
}

export function BlockedDoctorNotice({ doctorName }: BlockedDoctorNoticeProps) {
  return (
    <div className="mt-6 p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
        Doctor Currently Unavailable
      </h3>
      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 max-w-md">
        Dr. {doctorName} is currently inactive or suspended by administration. New appointments cannot be scheduled at this time.
      </p>
      <Button
        disabled
        className="mt-6 w-full max-w-sm rounded-full bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
      >
        Booking Disabled
      </Button>
    </div>
  );
}
