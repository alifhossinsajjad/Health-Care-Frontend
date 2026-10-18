import React from "react";
import { format, parseISO } from "date-fns";
import {
  Globe,
  Monitor,
  Smartphone,
  User,
  Clock,
  Terminal,
  AlertCircle,
} from "lucide-react";
import { IRequestLog } from "@/src/types/request-log.type";
import { DeleteLogButton } from "./DeleteLogButton";

interface RequestLogTableProps {
  logs: IRequestLog[];
}

export function RequestLogTable({ logs }: RequestLogTableProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80">
        <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 mb-3">
          <Terminal className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          No request logs found
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
          No HTTP traffic matches your active filter criteria, or the audit buffer is empty.
        </p>
      </div>
    );
  }

  const getMethodBadgeClass = (method: string) => {
    switch (method?.toUpperCase()) {
      case "GET":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "POST":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "PUT":
      case "PATCH":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "DELETE":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
    }
  };

  const getStatusBadgeClass = (code: number) => {
    if (code >= 200 && code < 300) {
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800";
    }
    if (code >= 400 && code < 500) {
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 dark:border-amber-800";
    }
    if (code >= 500) {
      return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-300 dark:border-rose-800";
    }
    return "bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700";
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <th className="py-3.5 px-4">Method & Status</th>
              <th className="py-3.5 px-4">Endpoint Path</th>
              <th className="py-3.5 px-4">Latency</th>
              <th className="py-3.5 px-4">Client / Device</th>
              <th className="py-3.5 px-4">IP Address</th>
              <th className="py-3.5 px-4">Authenticated User</th>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
            {logs.map((log) => {
              const formattedTime = log.createdAt
                ? format(parseISO(log.createdAt), "MMM d, HH:mm:ss")
                : "Just now";

              const isMobile =
                log.device?.toLowerCase().includes("phone") ||
                log.device?.toLowerCase().includes("android") ||
                log.device?.toLowerCase().includes("mobile");

              return (
                <tr
                  key={log.id}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors group"
                >
                  {/* Method & Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-bold border ${getMethodBadgeClass(
                          log.method,
                        )}`}
                      >
                        {log.method}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-semibold border ${getStatusBadgeClass(
                          log.statusCode,
                        )}`}
                      >
                        {log.statusCode}
                      </span>
                    </div>
                  </td>

                  {/* URL */}
                  <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                    <span
                      className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate block hover:text-clip"
                      title={log.url}
                    >
                      {log.url}
                    </span>
                  </td>

                  {/* Latency */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {typeof log.duration === "number"
                        ? `${log.duration.toFixed(2)}ms`
                        : log.duration || "--"}
                    </span>
                  </td>

                  {/* Client / Device */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      {isMobile ? (
                        <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                      <span>
                        {log.browser || "Browser"} • {log.device || "PC"}
                      </span>
                    </div>
                  </td>

                  {/* IP Address */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800">
                      {log.ip || "127.0.0.1"}
                    </span>
                  </td>

                  {/* User */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {log.user?.email ? (
                      <div className="flex items-center gap-1 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        <span className="truncate max-w-[140px]" title={log.user.email}>
                          {log.user.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400 dark:text-zinc-600 italic">
                        Anonymous
                      </span>
                    )}
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">
                    {formattedTime}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <DeleteLogButton id={log.id} url={log.url} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
