"use client";

import React from "react";
import { X, FileText, Download, Calendar, User, Stethoscope, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { IPrescription } from "@/src/types/prescription.type";

interface PrescriptionDetailsModalProps {
  isOpen: boolean;
  prescription: IPrescription | null;
  onClose: () => void;
}

export function PrescriptionDetailsModal({
  isOpen,
  prescription,
  onClose,
}: PrescriptionDetailsModalProps) {
  if (!isOpen || !prescription) return null;

  const doctorSpecialty =
    prescription.doctor?.specialties?.[0]?.title ||
    prescription.doctor?.specialties?.[0]?.specialty?.title ||
    prescription.doctor?.designation ||
    "Specialist Physician";

  const formattedDate = new Date(prescription.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const followUpFormatted = prescription.followUpDate
    ? new Date(prescription.followUpDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Official Medical Prescription
              </h3>
              <p className="text-xs text-zinc-500">Issued on {formattedDate}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Doctor & Patient Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 mb-1">
                <Stethoscope className="h-3.5 w-3.5 text-blue-500" />
                <span>Prescribed By</span>
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {prescription.doctor?.name || "Attending Doctor"}
              </p>
              <p className="text-xs text-zinc-500">{doctorSpecialty}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 mb-1">
                <User className="h-3.5 w-3.5 text-emerald-500" />
                <span>Patient</span>
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {prescription.patient?.name || "Patient"}
              </p>
              <p className="text-xs text-zinc-500">{prescription.patient?.email || ""}</p>
            </div>
          </div>

          {/* Follow-up banner if present */}
          {followUpFormatted && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>Recommended Follow-up Date:</span>
              </div>
              <span className="font-bold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                {followUpFormatted}
              </span>
            </div>
          )}

          {/* Clinical Instructions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Clinical Advice & Medications
            </h4>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200/90 dark:border-zinc-800 whitespace-pre-wrap text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans min-h-[100px]">
              {prescription.instructions}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs font-semibold"
          >
            Close
          </Button>

          {prescription.pdfUrl ? (
            <Button
              type="button"
              size="sm"
              onClick={() => window.open(prescription.pdfUrl!, "_blank")}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Download Official PDF</span>
            </Button>
          ) : (
            <span className="text-xs text-zinc-400 italic">PDF is being processed...</span>
          )}
        </div>
      </div>
    </div>
  );
}
