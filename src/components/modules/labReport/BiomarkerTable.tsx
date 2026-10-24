"use client";

import React, { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, CheckCircle2, AlertOctagon, Search } from "lucide-react";
import { ILabParameter, ParameterStatus } from "@/src/types/labReport.type";
import { Input } from "@/src/components/ui/input";

interface BiomarkerTableProps {
  parameters: ILabParameter[];
}

const renderStatusBadge = (status: ParameterStatus) => {
  switch (status) {
    case "NORMAL":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="h-3 w-3" /> Normal
        </span>
      );
    case "HIGH":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <ArrowUp className="h-3 w-3 stroke-[2.5]" /> High
        </span>
      );
    case "LOW":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <ArrowDown className="h-3 w-3 stroke-[2.5]" /> Low
        </span>
      );
    case "CRITICAL":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
          <AlertOctagon className="h-3 w-3" /> Critical
        </span>
      );
    default:
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
          {status}
        </span>
      );
  }
};

export function BiomarkerTable({ parameters = [] }: BiomarkerTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "ABNORMAL" | "NORMAL">("ALL");

  const filtered = useMemo(() => {
    return parameters.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.clinicalNote && p.clinicalNote.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchSearch) return false;

      if (filterType === "ABNORMAL") return p.status !== "NORMAL";
      if (filterType === "NORMAL") return p.status === "NORMAL";
      return true;
    });
  }, [parameters, searchTerm, filterType]);

  const abnormalCount = parameters.filter((p) => p.status !== "NORMAL").length;

  return (
    <div className="space-y-3">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search parameter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterType === "ALL"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            All ({parameters.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("ABNORMAL")}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterType === "ABNORMAL"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            }`}
          >
            Abnormal ({abnormalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("NORMAL")}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterType === "NORMAL"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Normal ({parameters.length - abnormalCount})
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3.5">Biomarker / Test Name</th>
              <th className="py-2.5 px-3.5">Measured Value</th>
              <th className="py-2.5 px-3.5">Biological Reference Range</th>
              <th className="py-2.5 px-3.5">Clinical Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-zinc-400">
                  No biomarkers match your search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr
                  key={`${item.name}-${idx}`}
                  className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors ${
                    item.status === "CRITICAL"
                      ? "bg-rose-50/40 dark:bg-rose-950/20"
                      : item.status !== "NORMAL"
                      ? "bg-amber-50/30 dark:bg-amber-950/10"
                      : ""
                  }`}
                >
                  <td className="py-2.5 px-3.5 font-medium text-zinc-900 dark:text-zinc-100">
                    <div>{item.name}</div>
                    {item.clinicalNote && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
                        {item.clinicalNote}
                      </p>
                    )}
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-zinc-800 dark:text-zinc-200">
                    <span className="font-mono text-sm">{item.value}</span>{" "}
                    <span className="text-[11px] font-normal text-zinc-500">{item.unit}</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                    {item.referenceRange || "Standard clinical range"}
                  </td>
                  <td className="py-2.5 px-3.5">{renderStatusBadge(item.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
