"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, MessageSquare, Bot } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { AIChatContainer } from "./AIChatContainer";

export function AIAssistantFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(true);

  // Dismiss badge once user opens assistant
  useEffect(() => {
    if (isOpen && hasNewBadge) {
      setHasNewBadge(false);
    }
  }, [isOpen, hasNewBadge]);

  return (
    <>
      {/* 1. Floating Action Trigger Button */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {!isOpen && (
          <div className="relative group">
            {/* Pulsing attention ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-70 blur-sm group-hover:opacity-100 transition duration-500 animate-pulse" />

            <Button
              onClick={() => setIsOpen(true)}
              className="relative h-14 px-4 sm:px-5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-xl shadow-indigo-500/30 flex items-center gap-2.5 transition-transform duration-300 hover:scale-105"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-white animate-spin-slow" />
              </div>

              <span className="text-sm tracking-tight hidden sm:inline-block">
                AI Health Assistant
              </span>

              {hasNewBadge && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
              )}
            </Button>
          </div>
        )}

        {/* 2. Floating Chat Window */}
        {isOpen && (
          <div className="fixed inset-2 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[410px] sm:max-w-[calc(100vw-1.5rem)] sm:h-[min(560px,calc(100dvh-2.5rem))] max-h-[calc(100dvh-1rem)] z-50 flex flex-col rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
            <AIChatContainer onClose={() => setIsOpen(false)} />
          </div>
        )}
      </div>
    </>
  );
}
