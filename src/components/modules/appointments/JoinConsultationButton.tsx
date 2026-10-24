"use client";

import React from "react";
import Link from "next/link";
import { Video, Lock, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";

interface JoinConsultationButtonProps {
  appointmentId: string;
  isPaid: boolean;
  isScheduled?: boolean;
  status?: string;
  endDateTime?: string;
  userRole?: "PATIENT" | "DOCTOR";
  className?: string;
  label?: string;
}

export function JoinConsultationButton({
  appointmentId,
  isPaid,
  isScheduled = true,
  status = "SCHEDULED",
  endDateTime,
  userRole = "PATIENT",
  className = "",
  label,
}: JoinConsultationButtonProps) {
  const currentStatus = status || (isScheduled ? "SCHEDULED" : "COMPLETED");

  // If completed or canceled -> no video button
  if (currentStatus === "COMPLETED" || currentStatus === "CANCELED") {
    return null;
  }

  // Check if scheduled end time has already elapsed
  const isPast = endDateTime ? new Date(endDateTime).getTime() < Date.now() : false;

  // 1. If Time has Expired and status was never started (still SCHEDULED)
  if (isPast && currentStatus === "SCHEDULED") {
    const handleExpiredClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toast.info("Consultation Schedule Expired", {
        description:
          userRole === "DOCTOR"
            ? "The scheduled time window for this patient appointment has elapsed."
            : "Your appointment time window has passed. Please contact support or reschedule.",
      });
    };

    return (
      <Button
        type="button"
        size="sm"
        onClick={handleExpiredClick}
        title="Schedule time window has elapsed"
        className={`rounded-full bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 font-semibold text-xs flex items-center gap-1.5 cursor-not-allowed border border-dashed border-zinc-200 dark:border-zinc-700 shadow-none ${className}`}
      >
        <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span>Time Expired</span>
      </Button>
    );
  }

  // 2. If NOT Paid -> Locked state
  if (!isPaid) {
    const handleUnpaidClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (userRole === "DOCTOR") {
        toast.warning("Consultation is locked.", {
          description:
            "The patient has not completed payment yet. Room unlocks upon payment confirmation.",
        });
      } else {
        toast.error("Please confirm your payment.", {
          description:
            "You must complete payment before entering the live video consultation room.",
        });
      }
    };

    return (
      <Button
        type="button"
        size="sm"
        onClick={handleUnpaidClick}
        title={
          userRole === "DOCTOR"
            ? "Locked: Patient payment pending"
            : "Please confirm payment to enter consultation"
        }
        className={`rounded-full bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 font-semibold text-xs flex items-center gap-1.5 cursor-not-allowed border border-dashed border-zinc-300 dark:border-zinc-700 shadow-none transition-all ${className}`}
      >
        <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>{label || (userRole === "DOCTOR" ? "Join Consultation" : "Join Video Call")}</span>
      </Button>
    );
  }

  // 3. Dynamic label based on INPROGRESS vs SCHEDULED
  const isInProgress = currentStatus === "INPROGRESS";
  const buttonText =
    label ||
    (isInProgress
      ? userRole === "DOCTOR"
        ? "Rejoin Consultation"
        : "Rejoin Video Call"
      : userRole === "DOCTOR"
      ? "Join Consultation"
      : "Join Video Call");

  // 4. Active Live Consultation Link
  return (
    <Button
      size="sm"
      asChild
      className={`rounded-full text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 ${
        isInProgress
          ? "bg-emerald-600 hover:bg-emerald-700 animate-pulse"
          : "bg-blue-600 hover:bg-blue-700"
      } ${className}`}
    >
      <Link href={`/consultation/${appointmentId}`}>
        <Video className="w-3.5 h-3.5" />
        <span>{buttonText}</span>
      </Link>
    </Button>
  );
}
