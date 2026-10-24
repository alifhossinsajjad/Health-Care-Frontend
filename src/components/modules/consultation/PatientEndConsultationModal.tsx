"use client";

import React from "react";
import { Stethoscope, CheckCircle, HelpCircle, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface PatientEndConsultationModalProps {
  isOpen: boolean;
  doctorName: string;
  isCompleting?: boolean;
  onConfirm: () => void;
  onDecline: () => void;
}

export function PatientEndConsultationModal({
  isOpen,
  doctorName,
  isCompleting = false,
  onConfirm,
  onDecline,
}: PatientEndConsultationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden">
        <button
          type="button"
          onClick={onDecline}
          disabled={isCompleting}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
          <Stethoscope className="h-6 w-6" />
        </div>

        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Doctor Requested to End Consultation
        </h3>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">
            {doctorName || "Your doctor"}
          </span>{" "}
          has finished the medical review and requested to officially end this telehealth session.
          Do you have any further questions, or are you ready to conclude?
        </p>

        <div className="flex items-center gap-2.5 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isCompleting}
            onClick={onDecline}
            className="rounded-xl text-xs font-semibold gap-1.5 border-zinc-200 dark:border-zinc-800"
          >
            <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
            <span>I Have Questions</span>
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isCompleting}
            onClick={onConfirm}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
          >
            <CheckCircle className="h-4 w-4" />
            <span>{isCompleting ? "Finishing..." : "Yes, End Consultation"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
