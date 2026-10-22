"use client";

import React from "react";
import Link from "next/link";
import { Video, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";

interface JoinConsultationButtonProps {
  appointmentId: string;
  isPaid: boolean;
  isScheduled: boolean;
  userRole?: "PATIENT" | "DOCTOR";
  className?: string;
  label?: string;
}

export function JoinConsultationButton({
  appointmentId,
  isPaid,
  isScheduled,
  userRole = "PATIENT",
  className = "",
  label,
}: JoinConsultationButtonProps) {
  const defaultLabel =
    label || (userRole === "DOCTOR" ? "Join Consultation" : "Join Video Call");

  if (!isScheduled) {
    return null;
  }

  // If NOT Paid -> Locked state with warning toast on click
  if (!isPaid) {
    const handleUnpaidClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (userRole === "DOCTOR") {
        toast.warning("Consultation is locked.", {
          description:
            "The patient has not completed their payment yet. Consultation will unlock once payment is confirmed.",
        });
      } else {
        toast.error("Please confirm your payment.", {
          description:
            "You must complete your appointment payment before joining the live video consultation.",
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
            : "Please confirm your payment to join consultation"
        }
        className={`rounded-full bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold text-xs flex items-center gap-1.5 cursor-not-allowed border border-dashed border-zinc-300 dark:border-zinc-700 shadow-none transition-all ${className}`}
      >
        <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>{defaultLabel}</span>
      </Button>
    );
  }

  // If PAID -> Active, clickable Video Call Button
  return (
    <Button
      size="sm"
      asChild
      className={`rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 ${className}`}
    >
      <Link href={`/consultation/${appointmentId}`}>
        <Video className="w-3.5 h-3.5" />
        <span>{defaultLabel}</span>
      </Link>
    </Button>
  );
}
