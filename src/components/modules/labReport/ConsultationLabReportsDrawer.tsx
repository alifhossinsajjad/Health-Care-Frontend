"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  AlertTriangle,
  Upload,
  ExternalLink,
  Activity,
  Layers,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ILabReport } from "@/src/types/labReport.type";
import { useAppointmentReports } from "@/src/hooks/labReport/useAppointmentReports";
import { BiomarkerTable } from "./BiomarkerTable";
import { AbnormalFindingsBanner } from "./AbnormalFindingsBanner";
import { BilingualSummaryTabs } from "./BilingualSummaryTabs";
import { LabReportUploadZone } from "./LabReportUploadZone";

interface ConsultationLabReportsDrawerProps {
  appointmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationLabReportsDrawer({
  appointmentId,
  isOpen,
  onClose,
}: ConsultationLabReportsDrawerProps) {
  const { reports, isLoading, refetch, addReport } = useAppointmentReports(appointmentId);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  if (!isOpen) return null;

  const activeReport =
    reports.find((r) => r.id === selectedReportId) || reports[0] || null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] md:w-[600px] lg:w-[680px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-16 px-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
              Lab Reports & AI Summary
            </h3>
            <p className="text-[11px] text-zinc-500">
              In-consultation clinical telemetry ({reports.length} reports)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploader((prev) => !prev)}
            className="h-8 px-2.5 rounded-xl text-xs gap-1 font-semibold"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{showUploader ? "View Reports" : "Upload New"}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Upload Mode */}
        {showUploader && (
          <div className="mb-4">
            <LabReportUploadZone
              appointmentId={appointmentId}
              onAnalysisComplete={(report) => {
                addReport(report);
                setSelectedReportId(report.id);
                setShowUploader(false);
              }}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center text-xs text-zinc-400">
            <Activity className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
            <span>Loading attached clinical reports...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && reports.length === 0 && !showUploader && (
          <div className="py-16 text-center text-zinc-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mx-auto flex items-center justify-center">
              <Layers className="h-6 w-6 text-zinc-400" />
            </div>
            <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              No Lab Reports Attached Yet
            </h4>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Patient has not attached a lab report to this appointment. You or the patient can upload one now.
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowUploader(true)}
              className="rounded-xl text-xs font-semibold gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" /> Upload Report Now
            </Button>
          </div>
        )}

        {/* Reports Navigation Bar */}
        {reports.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {reports.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedReportId(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeReport?.id === r.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {r.reportName || r.reportType}
              </button>
            ))}
          </div>
        )}

        {/* Selected Report Telemetry */}
        {activeReport && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                  {activeReport.reportType}
                </span>
                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 truncate mt-1">
                  {activeReport.reportName}
                </h4>
              </div>
              {activeReport.reportUrl && (
                <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1">
                  <a href={activeReport.reportUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" /> Original File
                  </a>
                </Button>
              )}
            </div>

            {/* Abnormal findings */}
            {activeReport.abnormalFindings && activeReport.abnormalFindings.length > 0 && (
              <AbnormalFindingsBanner findings={activeReport.abnormalFindings} />
            )}

            {/* Bilingual summary */}
            <BilingualSummaryTabs
              summaryEn={activeReport.summaryEn}
              summaryBn={activeReport.summaryBn}
              disclaimer={activeReport.disclaimer}
            />

            {/* Biomarker Table */}
            {activeReport.parameters && activeReport.parameters.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Parameters ({activeReport.parameters.length})
                </h4>
                <BiomarkerTable parameters={activeReport.parameters} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
