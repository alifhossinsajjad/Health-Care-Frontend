"use client";

import React, { useState } from "react";
import { Search, Filter, AlertCircle, FileSearch } from "lucide-react";
import { ILabReport, ILabReportFilters, LabReportType } from "@/src/types/labReport.type";
import { LabReportCard } from "./LabReportCard";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

interface LabReportHistoryGridProps {
  reports: ILabReport[];
  isLoading: boolean;
  filters: ILabReportFilters;
  onFilterChange: (filters: Partial<ILabReportFilters>) => void;
  onViewDetails: (report: ILabReport) => void;
  onDeleteReport: (id: string) => void;
}

const REPORT_TYPES: { label: string; value: string }[] = [
  { label: "All Types", value: "ALL" },
  { label: "Complete Blood Count (CBC)", value: "CBC" },
  { label: "Lipid Profile", value: "LIPID_PROFILE" },
  { label: "Liver Function (LFT)", value: "LIVER_FUNCTION" },
  { label: "Kidney Function (KFT)", value: "KIDNEY_FUNCTION" },
  { label: "Thyroid (TSH/T3/T4)", value: "THYROID_PROFILE" },
  { label: "Blood Sugar / HbA1c", value: "BLOOD_SUGAR" },
  { label: "Urine Analysis", value: "URINE_ANALYSIS" },
  { label: "Electrolytes", value: "ELECTROLYTES" },
];

export function LabReportHistoryGrid({
  reports,
  isLoading,
  filters,
  onFilterChange,
  onViewDetails,
  onDeleteReport,
}: LabReportHistoryGridProps) {
  const [search, setSearch] = useState(filters.searchTerm || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ searchTerm: search });
  };

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by test name, lab or biomarker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs sm:text-sm rounded-xl"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Report Type Filter */}
          <select
            value={filters.reportType || "ALL"}
            onChange={(e) => onFilterChange({ reportType: e.target.value })}
            className="h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {REPORT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Urgency Filter */}
          <select
            value={filters.urgency || "ALL"}
            onChange={(e) => onFilterChange({ urgency: e.target.value })}
            className="h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Urgencies</option>
            <option value="ROUTINE">Routine (Normal)</option>
            <option value="ATTENTION">Attention Needed</option>
            <option value="CRITICAL">Critical Finding</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 animate-pulse"
            />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
            <FileSearch className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            No Lab Reports Found
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
            You haven&apos;t uploaded any reports matching this filter. Upload a PDF or photo above to start AI vision scanning.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <LabReportCard
              key={report.id}
              report={report}
              onViewDetails={onViewDetails}
              onDelete={onDeleteReport}
            />
          ))}
        </div>
      )}
    </div>
  );
}
