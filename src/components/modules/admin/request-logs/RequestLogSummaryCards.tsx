import React from "react";
import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { StatCard } from "@/src/components/shared/stats/StatCard";
import { IRequestLogSummary } from "@/src/types/request-log.type";

interface RequestLogSummaryCardsProps {
  summary?: IRequestLogSummary;
}

export function RequestLogSummaryCards({ summary }: RequestLogSummaryCardsProps) {
  const total = summary?.totalRecorded || 0;
  const success = summary?.success2xx || 0;
  const clientErrors = summary?.clientErrors4xx || 0;
  const serverErrors = summary?.serverErrors5xx || 0;

  const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : "100";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Requests"
        value={total.toLocaleString()}
        icon={Activity}
        description="Recorded in audit buffer"
        iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
      />

      <StatCard
        title="2xx Success"
        value={success.toLocaleString()}
        icon={CheckCircle2}
        description={`${successRate}% success rate`}
        iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />

      <StatCard
        title="4xx Client Errors"
        value={clientErrors.toLocaleString()}
        icon={AlertTriangle}
        description="Auth & validation rejects"
        iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />

      <StatCard
        title="5xx Server Errors"
        value={serverErrors.toLocaleString()}
        icon={XCircle}
        description="Internal gateway crashes"
        iconClassName="bg-rose-500/10 text-rose-600 dark:text-rose-400"
      />
    </div>
  );
}
