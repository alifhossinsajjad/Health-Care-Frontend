import React from "react";
import { getRequestLogs } from "@/src/services/request-log.service";
import { RequestLogSummaryCards } from "@/src/components/modules/admin/request-logs/RequestLogSummaryCards";
import { LogFilterBar } from "@/src/components/modules/admin/request-logs/LogFilterBar";
import { RequestLogTable } from "@/src/components/modules/admin/request-logs/RequestLogTable";
import { ClearLogsButton } from "@/src/components/modules/admin/request-logs/ClearLogsButton";
import { AppPagination } from "@/src/components/shared/AppPagination";
import { ShieldCheck, Activity } from "lucide-react";

interface RequestLogsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export const metadata = {
  title: "Request Logs & System Audit | Admin Dashboard",
  description:
    "Real-time monitoring of all HTTP requests, latency, client devices, and status codes.",
};

export default async function RequestLogsPage({
  searchParams,
}: RequestLogsPageProps) {
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 20;
  const method = resolvedParams.method && resolvedParams.method !== "ALL" ? resolvedParams.method : undefined;
  const statusCode = resolvedParams.statusCode && resolvedParams.statusCode !== "ALL" ? resolvedParams.statusCode : undefined;
  const search = resolvedParams.search || "";

  const response = await getRequestLogs({
    page,
    limit,
    method,
    statusCode,
    search,
  });

  const logs = response.data || [];
  const meta = response.meta || { page, limit, total: logs.length };
  const summary = meta.summary;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Request Logs & System Audit
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time telemetry, response latencies, device metadata, and HTTP status codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ClearLogsButton totalLogs={meta.total} />
        </div>
      </div>

      {/* Metric Summary Cards */}
      <RequestLogSummaryCards summary={summary} />

      {/* Filter and Search Bar */}
      <LogFilterBar />

      {/* Log Data Table */}
      <RequestLogTable logs={logs} />

      {/* Pagination */}
      {meta.total > 0 && (
        <AppPagination
          meta={{
            page: meta.page,
            limit: meta.limit,
            total: meta.total,
          }}
        />
      )}
    </div>
  );
}
