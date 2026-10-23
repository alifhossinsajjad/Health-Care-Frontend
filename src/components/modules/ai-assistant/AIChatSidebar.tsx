"use client";

import React, { useState } from "react";
import { Plus, Trash2, Clock, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { IChatSession } from "@/src/types/ai.type";

interface AIChatSidebarProps {
  sessions: IChatSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClearAll: () => void;
}

export function AIChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAll,
}: AIChatSidebarProps) {
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "Recent";
    }
  };

  return (
    <aside className="w-64 sm:w-72 h-full flex flex-col bg-zinc-50/80 dark:bg-zinc-900/60 border-r border-zinc-200/80 dark:border-zinc-800 shrink-0 select-none transition-all duration-300">
      {/* 1. Header with New Chat Button */}
      <div className="p-3 border-b border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
        <Button
          onClick={onNewChat}
          className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Consultation</span>
        </Button>
      </div>

      {/* 2. Sessions List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <div className="px-2 mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Recent Chats
          </span>
          <span className="font-mono text-[10px]">{sessions.length}</span>
        </div>

        {sessions.length === 0 ? (
          <div className="py-10 text-center px-4">
            <Sparkles className="h-6 w-6 text-zinc-300 dark:text-zinc-600 mx-auto mb-1.5 opacity-60" />
            <p className="text-xs text-zinc-500 font-medium">No past sessions</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Start a conversation to see history</p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                  isActive
                    ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-semibold shadow-xs border border-zinc-200/80 dark:border-zinc-700"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-blue-600" : "text-zinc-400"}`} />
                  <span className="truncate">{session.title || "Clinical Consultation"}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-400 group-hover:hidden">
                    {formatDate(session.updatedAt)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="hidden group-hover:flex p-1 rounded hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Footer with Clear All */}
      {sessions.length > 0 && (
        <div className="p-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
          {confirmClearAll ? (
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[11px] font-semibold">Delete all?</span>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setConfirmClearAll(false);
                  }}
                  className="px-2 py-0.5 rounded bg-rose-600 text-white font-semibold text-[10px]"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px]"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClearAll(true)}
              className="w-full py-1.5 px-2 text-[11px] font-medium text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="h-3 w-3" /> Clear Consultation History
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
