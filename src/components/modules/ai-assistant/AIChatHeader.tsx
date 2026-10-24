"use client";

import React from "react";
import { Sparkles, RotateCcw, X, ShieldCheck, PanelLeft, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface AIChatHeaderProps {
  onClearChat: () => void;
  onNewChat?: () => void;
  onToggleHistory?: () => void;
  onClose?: () => void;
  isStreaming?: boolean;
  activeSessionTitle?: string;
  hasHistory?: boolean;
}

export function AIChatHeader({
  onClearChat,
  onNewChat,
  onToggleHistory,
  onClose,
  isStreaming = false,
  activeSessionTitle,
}: AIChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger / History Drawer Toggle */}
        {onToggleHistory && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleHistory}
            className="h-8 w-8 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-900 shrink-0"
            title="Chat History / আগের চ্যাট তালিকা"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}

        {/* AI Brand Avatar */}
        <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
          <Sparkles className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          {/* Active Status Pulse Indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500 border-2 border-white dark:border-zinc-950" />
          </span>
        </div>

        {/* Header Title & Subtitle */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-tight truncate">
              {activeSessionTitle || "HealthCare AI Assistant"}
            </h3>
            <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 shrink-0">
              <ShieldCheck className="h-2.5 w-2.5" /> Clinical Triage
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-500 leading-none mt-0.5 truncate">
            {isStreaming ? "Generating live clinical response..." : "Online • Real-Time Doctor Recommendation"}
          </p>
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {onNewChat && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewChat}
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            title="Start New Chat / নতুন কথোপকথন"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onClearChat}
          className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          title="Clear Conversation Messages"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            title="Close Assistant"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
