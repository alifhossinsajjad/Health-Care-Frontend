"use client";

import React from "react";
import { AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { IAbnormalFinding, FindingSeverity } from "@/src/types/labReport.type";

interface AbnormalFindingsBannerProps {
  findings: IAbnormalFinding[];
}

const getSeverityTheme = (severity: FindingSeverity) => {
  switch (severity) {
    case "CRITICAL":
      return {
        card: "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900",
        badge: "bg-rose-600 text-white",
        icon: AlertOctagon,
      };
    case "SEVERE":
      return {
        card: "bg-orange-50/80 dark:bg-orange-950/40 border-orange-300 dark:border-orange-900",
        badge: "bg-orange-600 text-white",
        icon: AlertTriangle,
      };
    case "MODERATE":
      return {
        card: "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900",
        badge: "bg-amber-600 text-white",
        icon: AlertTriangle,
      };
    case "MILD":
    default:
      return {
        card: "bg-yellow-50/80 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-900",
        badge: "bg-yellow-600 text-white",
        icon: Info,
      };
  }
};

export function AbnormalFindingsBanner({ findings = [] }: AbnormalFindingsBannerProps) {
  if (findings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wide">
        <AlertTriangle className="h-4 w-4" />
        <span>Clinical Attention Required ({findings.length} Abnormal Findings)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {findings.map((finding, idx) => {
          const theme = getSeverityTheme(finding.severity);
          const IconComponent = theme.icon;
          return (
            <div
              key={`${finding.parameter}-${idx}`}
              className={`p-3 rounded-xl border ${theme.card} flex items-start gap-3 shadow-xs`}
            >
              <div className="mt-0.5 shrink-0">
                <IconComponent className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 truncate">
                    {finding.parameter}
                  </h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${theme.badge}`}>
                    {finding.severity}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
                  Value: <span className="font-bold">{finding.value}</span>{" "}
                  <span className="text-zinc-500 font-sans">
                    (Ref: {finding.referenceRange})
                  </span>
                </div>
                {finding.clinicalNote && (
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
                    {finding.clinicalNote}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
