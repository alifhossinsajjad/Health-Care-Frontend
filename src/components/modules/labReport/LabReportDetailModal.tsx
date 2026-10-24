"use client";

import React from "react";
import {
  X,
  ExternalLink,
  Calendar,
  Building2,
  User,
  Stethoscope,
  Share2,
  Printer,
} from "lucide-react";
import { ILabReport } from "@/src/types/labReport.type";
import { Button } from "@/src/components/ui/button";
import { BiomarkerTable } from "./BiomarkerTable";
import { AbnormalFindingsBanner } from "./AbnormalFindingsBanner";
import { BilingualSummaryTabs } from "./BilingualSummaryTabs";
import { DoctorQuestionsChecklist } from "./DoctorQuestionsChecklist";

interface LabReportDetailModalProps {
  report: ILabReport | null;
  isOpen: boolean;
  onClose: () => void;
  onLinkAppointment?: (reportId: string) => void;
}

export function LabReportDetailModal({
  report,
  isOpen,
  onClose,
  onLinkAppointment,
}: LabReportDetailModalProps) {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                {report.reportType.replace(/_/g, " ")}
              </span>
              <span className="text-xs text-zinc-400">•</span>
              <span className="text-xs text-zinc-500 font-mono">
                {report.testDate
                  ? new Date(report.testDate).toLocaleDateString()
                  : new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 truncate">
              {report.reportName || "Multimodal Lab Report"}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {report.reportUrl && (
              <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 hidden sm:inline-flex">
                <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" /> View Original
                </a>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-400 block text-[11px]">Diagnostic Center</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate block">
                {report.labName || "Standard Clinical Lab"}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[11px]">Patient Profile</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                {report.patientAge ? `${report.patientAge} yrs` : "Age N/A"}{" "}
                {report.patientGender ? `• ${report.patientGender}` : ""}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[11px]">Clinical Urgency</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                {report.urgency}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[11px]">Biomarkers Tested</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 block">
                {report.parameters?.length || 0} Parameters
              </span>
            </div>
          </div>

          {/* 1. Highlighted Abnormal Findings */}
          {report.abnormalFindings && report.abnormalFindings.length > 0 && (
            <AbnormalFindingsBanner findings={report.abnormalFindings} />
          )}

          {/* 2. Bilingual Summary (English & বাংলা) */}
          <BilingualSummaryTabs
            summaryEn={report.summaryEn}
            summaryBn={report.summaryBn}
            disclaimer={report.disclaimer}
          />

          {/* 3. Biomarker Parameter Table */}
          {report.parameters && report.parameters.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Detailed Parameter Measurements
              </h3>
              <BiomarkerTable parameters={report.parameters} />
            </div>
          )}

          {/* 4. Recommended Doctor Questions */}
          {report.doctorQuestions && report.doctorQuestions.length > 0 && (
            <DoctorQuestionsChecklist questions={report.doctorQuestions} />
          )}

          {/* 5. Recommended Specialties */}
          {report.recommendedSpecialties && report.recommendedSpecialties.length > 0 && (
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-2">
                <Stethoscope className="h-4 w-4" />
                <span>Recommended Specialist Consultation</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.recommendedSpecialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white dark:bg-zinc-800 text-xs font-semibold text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 shadow-xs"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-zinc-50/80 dark:bg-zinc-900/80">
          <p className="text-xs text-zinc-500 hidden sm:block">
            Analyzed by HealthCare Multimodal Clinical Engine
          </p>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="rounded-xl text-xs gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </Button>

            {onLinkAppointment && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLinkAppointment(report.id)}
                className="rounded-xl text-xs font-semibold gap-1.5 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100"
              >
                <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>{report.appointmentId ? "Re-attach Consultation" : "Attach to Consultation"}</span>
              </Button>
            )}

            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="rounded-xl px-5 text-xs font-bold"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
