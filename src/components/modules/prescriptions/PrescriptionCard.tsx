"use client";

import React from "react";
import { FileText, Download, Calendar, Stethoscope, User, Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { IPrescription } from "@/src/types/prescription.type";

interface PrescriptionCardProps {
  prescription: IPrescription;
  viewMode: "PATIENT" | "DOCTOR" | "ADMIN";
  onView: (p: IPrescription) => void;
  onEdit?: (p: IPrescription) => void;
  onDelete?: (id: string) => void;
}

export function PrescriptionCard({
  prescription,
  viewMode,
  onView,
  onEdit,
  onDelete,
}: PrescriptionCardProps) {
  const isPatientView = viewMode === "PATIENT";
  const primaryName = isPatientView
    ? prescription.doctor?.name || "Attending Physician"
    : prescription.patient?.name || "Patient";
  const primaryPhoto = isPatientView
    ? prescription.doctor?.profilePhoto
    : prescription.patient?.profilePhoto;
  const primarySubtitle = isPatientView
    ? prescription.doctor?.specialties?.[0]?.title ||
      prescription.doctor?.specialties?.[0]?.specialty?.title ||
      prescription.doctor?.designation ||
      "Clinical Specialist"
    : prescription.patient?.email || "Patient Record";

  const dateFormatted = new Date(prescription.createdAt).toLocaleDateString(undefined, {
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
    <div className="group rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-11 w-11 rounded-2xl border border-zinc-100 dark:border-zinc-800 shrink-0">
              <AvatarImage src={primaryPhoto || ""} alt={primaryName} />
              <AvatarFallback className="rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs">
                {primaryName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                {primaryName}
              </h4>
              <p className="text-xs text-zinc-500 truncate">{primarySubtitle}</p>
            </div>
          </div>

          <span className="shrink-0 text-[11px] font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-xl">
            {dateFormatted}
          </span>
        </div>

        {/* Instructions Snippet */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            Prescription Summary
          </p>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 leading-relaxed font-sans">
            {prescription.instructions}
          </p>
        </div>

        {/* Follow-up date pill if present */}
        {followUpFormatted && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 mb-4">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Follow-up: {followUpFormatted}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onView(prescription)}
          className="rounded-xl text-xs font-semibold h-8 px-3 gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Details</span>
        </Button>

        <div className="flex items-center gap-1.5">
          {onEdit && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(prescription)}
              className="h-8 w-8 rounded-xl text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              title="Edit advice"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          )}

          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDelete(prescription.id)}
              className="h-8 w-8 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
              title="Delete prescription"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}

          {prescription.pdfUrl && (
            <Button
              type="button"
              size="sm"
              onClick={() => window.open(prescription.pdfUrl!, "_blank")}
              className="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-xs"
              title="Download or view PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
