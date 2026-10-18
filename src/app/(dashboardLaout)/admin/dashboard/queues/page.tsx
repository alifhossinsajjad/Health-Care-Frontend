"use client";

import React, { useState } from "react";
import {
  Layers,
  ExternalLink,
  RotateCcw,
  Mail,
  CreditCard,
  CalendarClock,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function QueuesDashboardPage() {
  const [iframeKey, setIframeKey] = useState(0);

  // Bull-board URL routed via same-origin Next.js rewrite or direct gateway
  const queueUrl = "/api/v1/admin/queues";
  const directGatewayUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost/api/v1"}/admin/queues`;

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(queueUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenDirectGateway = () => {
    window.open(directGatewayUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Background Job Queues
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time BullMQ & Redis visual dashboard for asynchronous jobs, retries, and scheduled tasks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reload Board
          </Button>

          <Button
            size="sm"
            onClick={handleOpenExternal}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Open Fullscreen
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenDirectGateway}
            className="gap-2 text-xs"
            title="Open via Nginx port 80 directly"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            Direct Gateway
          </Button>
        </div>
      </div>

      {/* Role Requirement Warning Banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">SuperAdmin Privilege Required:</span> Access to Bull-Board queues is restricted to the <code className="font-mono font-bold bg-amber-500/20 px-1 py-0.5 rounded">SUPER_ADMIN</code> role. If you see an unauthorized message, ensure you are signed in with SuperAdmin credentials.
        </div>
      </div>

      {/* Queue Service Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              Email Notifications Queue
            </h4>
            <p className="text-xs text-zinc-500 truncate">Appointment confirmations & OTPs</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              Stripe Webhook Processing
            </h4>
            <p className="text-xs text-zinc-500 truncate">Asynchronous invoice & receipt generation</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              Schedule Locking & Cleanup
            </h4>
            <p className="text-xs text-zinc-500 truncate">Expired slot release and audit cron</p>
          </div>
        </div>
      </div>

      {/* Embedded Bull-Board iFrame */}
      <div className="flex-1 min-h-[650px] w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 shadow-md relative">
        <iframe
          key={iframeKey}
          src={queueUrl}
          title="Bull-Board Queue Monitoring"
          className="w-full h-full min-h-[650px] border-none"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
