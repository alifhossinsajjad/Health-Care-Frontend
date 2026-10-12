"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DialogTitle, DialogDescription } from "@/src/components/ui/dialog";

interface BookingSuccessViewProps {
  doctorName: string;
  onClose: () => void;
}

export function BookingSuccessView({
  doctorName,
  onClose,
}: BookingSuccessViewProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center py-4">
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/10">
        <CalendarCheck className="w-8 h-8" />
      </div>
      <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Appointment Confirmed!
      </DialogTitle>
      <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 max-w-sm">
        Your appointment with <strong>Dr. {doctorName}</strong> has been successfully booked. You can review and manage it anytime in your dashboard.
      </DialogDescription>

      <div className="mt-3 px-3.5 py-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-xs text-amber-800 dark:text-amber-300 text-center max-w-sm">
        ⏳ <strong>Pay Later Notice:</strong> If you chose Pay Later, please complete payment within 30 minutes to prevent auto-cancellation.
      </div>

      <div className="w-full mt-6 flex flex-col gap-2.5">
        <Button
          onClick={() => router.push("/dashboard/my-appointments")}
          className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
        >
          View My Appointments
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full rounded-2xl"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
