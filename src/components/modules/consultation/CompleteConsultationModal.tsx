"use client";

import React from "react";
import { CheckCircle, Clock, X, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface CompleteConsultationModalProps {
  isOpen: boolean;
  isCompleting: boolean;
  isWaitingForPatient: boolean;
  patientName: string;
  onRequestEnd: () => void;
  onForceComplete: () => void;
  onClose: () => void;
}

export function CompleteConsultationModal({
  isOpen,
  isCompleting,
  isWaitingForPatient,
  patientName,
  onRequestEnd,
  onForceComplete,
  onClose,
}: CompleteConsultationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          disabled={isCompleting}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {isWaitingForPatient ? (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 animate-pulse">
              <Clock className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1.5">
              Waiting for Patient Confirmation
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              We sent an end-of-session confirmation to{" "}
              <strong className="text-zinc-900 dark:text-zinc-200">{patientName}</strong>. If they have more questions, you can continue discussing.
            </p>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-2 mb-6">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
              </span>
              <span className="text-xs text-zinc-500 font-medium">Awaiting patient response...</span>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isCompleting}
                onClick={onClose}
                className="rounded-xl text-xs font-semibold"
              >
                Keep In Call
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isCompleting}
                onClick={onForceComplete}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
              >
                <CheckCircle className="h-4 w-4" />
                <span>{isCompleting ? "Completing..." : "Force Complete Session"}</span>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1.5">
              End Consultation?
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Request{" "}
              <span className="font-bold text-zinc-900 dark:text-zinc-200">{patientName}</span>{" "}
              to confirm conclusion of this session. If they have no further questions, the session will be marked as{" "}
              <span className="font-semibold text-emerald-600">COMPLETED</span>.
            </p>

            <div className="flex items-center gap-2.5 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isCompleting}
                onClick={onClose}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={isCompleting}
                onClick={onRequestEnd}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>Request Patient Confirmation</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
