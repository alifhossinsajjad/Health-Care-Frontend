"use client";

import React, { useState } from "react";
import { Sparkles, FileText, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { useLabReports } from "@/src/hooks/labReport/useLabReports";
import { ILabReport } from "@/src/types/labReport.type";
import { LabReportUploadZone } from "./LabReportUploadZone";
import { LabReportHistoryGrid } from "./LabReportHistoryGrid";
import { LabReportDetailModal } from "./LabReportDetailModal";
import { LinkReportToAppointmentModal } from "./LinkReportToAppointmentModal";

export function PatientLabReportsView() {
  const {
    reports,
    isLoading,
    filters,
    updateFilters,
    deleteReport,
    linkToAppointment,
    addNewReport,
  } = useLabReports();

  const [selectedReport, setSelectedReport] = useState<ILabReport | null>(null);
  const [linkingReport, setLinkingReport] = useState<ILabReport | null>(null);

  const abnormalTotal = reports.filter((r) => r.urgency === "CRITICAL" || r.urgency === "ATTENTION").length;

  const handleUploadComplete = (newReport: ILabReport) => {
    addNewReport(newReport);
    setSelectedReport(newReport);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-xs text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-blue-200" />
            <span>Multimodal Vision AI Clinical Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Lab Report Vision Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Upload diagnostic blood tests, imaging reports, and urine analyses. Our clinical AI instantly extracts biomarkers, highlights abnormal findings, and delivers patient-friendly bilingual explanations.
          </p>
        </div>

        {/* Quick Diagnostic Metrics */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[90px]">
            <span className="block text-2xl font-black">{reports.length}</span>
            <span className="text-[11px] text-blue-200 font-medium">Total Reports</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[90px]">
            <span className="block text-2xl font-black text-amber-300">
              {abnormalTotal}
            </span>
            <span className="text-[11px] text-blue-200 font-medium">Flagged Alerts</span>
          </div>
        </div>
      </div>

      {/* 2. Drag & Drop Upload Zone */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <FileText className="h-4 w-4 text-blue-600" />
          <span>Upload New Lab Document</span>
        </div>
        <LabReportUploadZone onAnalysisComplete={handleUploadComplete} />
      </div>

      {/* 3. History Grid with Filters */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <Activity className="h-4 w-4 text-emerald-600" />
            <span>Analyzed Medical Records History ({reports.length})</span>
          </div>
        </div>

        <LabReportHistoryGrid
          reports={reports}
          isLoading={isLoading}
          filters={filters}
          onFilterChange={updateFilters}
          onViewDetails={(report) => setSelectedReport(report)}
          onDeleteReport={deleteReport}
        />
      </div>

      {/* 4. Full Telemetry Inspection Dialog */}
      <LabReportDetailModal
        report={selectedReport}
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        onLinkAppointment={() => {
          if (selectedReport) {
            setLinkingReport(selectedReport);
          }
        }}
      />

      {/* 5. Link to Consultation Modal */}
      <LinkReportToAppointmentModal
        report={linkingReport}
        isOpen={Boolean(linkingReport)}
        onClose={() => setLinkingReport(null)}
        onLinked={(reportId, appointmentId) => {
          linkToAppointment(reportId, appointmentId);
          if (selectedReport && selectedReport.id === reportId) {
            setSelectedReport({ ...selectedReport, appointmentId });
          }
        }}
      />
    </div>
  );
}
