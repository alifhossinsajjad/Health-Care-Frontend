"use client";

import React from "react";
import {
  Calendar,
  Building2,
  AlertTriangle,
  FileText,
  ExternalLink,
  Trash2,
  Activity,
  ArrowRight,
} from "lucide-react";
import { ILabReport, LabReportUrgency } from "@/src/types/labReport.type";
import { Button } from "@/src/components/ui/button";

interface LabReportCardProps {
  report: ILabReport;
  onViewDetails: (report: ILabReport) => void;
  onDelete?: (id: string) => void;
}

const renderUrgencyBadge = (urgency: LabReportUrgency) => {
  switch (urgency) {
    case "CRITICAL":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Critical
        </span>
      );
    case "ATTENTION":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Attention
        </span>
      );
    case "ROUTINE":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Routine
        </span>
      );
  }
};

export function LabReportCard({ report, onViewDetails, onDelete }: LabReportCardProps) {
  const abnormalCount = report.abnormalFindings?.length || 0;
  const paramCount = report.parameters?.length || 0;

  return (
    <div className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900/60 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Urgency & Type */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/60">
            {report.reportType.replace(/_/g, " ")}
          </span>
          {renderUrgencyBadge(report.urgency)}
        </div>

        {/* Report Title */}
        <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {report.reportName || "Laboratory Analysis"}
        </h3>

        {/* Metadata Details */}
        <div className="space-y-1.5 mb-4 text-xs text-zinc-500 dark:text-zinc-400">
          {report.labName && (
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{report.labName}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span>
              {report.testDate
                ? new Date(report.testDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>

          {report.appointmentId && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-900/60 w-fit mt-1">
              <Calendar className="h-3 w-3" />
              <span>Attached to Consultation</span>
            </div>
          )}
        </div>

        {/* Quick Biomarker Stat Pill */}
        <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 mb-4 text-xs">
          <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
            <Activity className="h-3.5 w-3.5 text-blue-500" />
            <span>{paramCount} biomarkers</span>
          </div>
          {abnormalCount > 0 && (
            <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 ml-auto text-[11px]">
              <AlertTriangle className="h-3 w-3" /> {abnormalCount} flagged
            </span>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => onViewDetails(report)}
          className="flex-1 rounded-xl text-xs font-semibold gap-1.5"
        >
          <span>View Analysis</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>

        {report.reportUrl && (
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100"
            title="Open Original File"
          >
            <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}

        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(report.id)}
            className="h-8 w-8 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400"
            title="Delete Report"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
