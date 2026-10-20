"use client";

import React from "react";
import { Sparkles, RotateCcw, X, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface AIChatHeaderProps {
  onClearChat: () => void;
  onClose?: () => void;
  isStreaming?: boolean;
}

export function AIChatHeader({
  onClearChat,
  onClose,
  isStreaming = false,
}: AIChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="h-5 w-5" />
          {/* Active Status Pulse Indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-zinc-950" />
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
              HealthCare AI Assistant
            </h3>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              <ShieldCheck className="h-2.5 w-2.5" /> Clinical Triage
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-none mt-0.5">
            {isStreaming ? "Generating live clinical response..." : "Online • Real-Time Doctor Recommendation"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearChat}
          className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          title="Clear Conversation"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            title="Close Assistant"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
