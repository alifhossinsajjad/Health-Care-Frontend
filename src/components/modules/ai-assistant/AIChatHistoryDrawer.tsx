"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  X,
  Clock,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { IChatSession } from "@/src/types/ai.type";

interface AIChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: IChatSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClearAll: () => void;
}

export function AIChatHistoryDrawer({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAll,
}: AIChatHistoryDrawerProps) {
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-[300px] sm:w-[320px] max-w-[85vw] h-full bg-white dark:bg-zinc-950 border-r border-zinc-200/90 dark:border-zinc-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* 1. Header */}
        <div className="p-3.5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                Chat History
              </h3>
              <p className="text-[11px] text-zinc-400">Past clinical consultations</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 2. New Chat Action Button */}
        <div className="p-3">
          <Button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Consultation</span>
          </Button>
        </div>

        {/* 3. History Sessions List */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 py-1 space-y-1">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-400 text-center px-4">
              <MessageSquare className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
              <p className="text-xs font-semibold">No past chats yet</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Your conversations will be saved here automatically.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const userMsgCount = session.messages.filter((m) => m.sender === "user").length;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between gap-2 p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                    isActive
                      ? "bg-blue-50/90 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/80 dark:border-blue-900/60 shadow-xs"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs leading-snug">
                        {session.title || "Health Consultation"}
                      </p>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span>{formatDate(session.updatedAt || session.createdAt)}</span>
                        <span>•</span>
                        <span>{userMsgCount} {userMsgCount === 1 ? "query" : "queries"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Delete specific session button */}
                  <button
                    type="button"
                    title="Delete conversation"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* 4. Footer */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-900 text-xs flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
          <span className="text-[11px] text-zinc-400">
            {sessions.length} {sessions.length === 1 ? "chat" : "chats"} saved
          </span>

          {sessions.length > 0 && (
            confirmClearAll ? (
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    onClearAll();
                    setConfirmClearAll(false);
                    onClose();
                  }}
                  className="h-6 px-2 text-[10px] rounded-md"
                >
                  Confirm Clear
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmClearAll(false)}
                  className="h-6 px-1.5 text-[10px] rounded-md text-zinc-400"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="text-[11px] text-zinc-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                title="Clear all saved history"
              >
                <Trash2 className="h-3 w-3" /> Clear all
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
