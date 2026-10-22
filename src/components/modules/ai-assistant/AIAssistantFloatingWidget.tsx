"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, Minus, GripVertical } from "lucide-react";
import { AIChatContainer } from "./AIChatContainer";

const MINIMIZED_STORAGE_KEY = "healthcare_ai_widget_minimized_v1";
const OFFSET_Y_STORAGE_KEY = "healthcare_ai_widget_offset_y_v1";

export function AIAssistantFloatingWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [offsetY, setOffsetY] = useState(24); // px from bottom
  const [isMounted, setIsMounted] = useState(false);

  const dragStartYRef = useRef(0);
  const initialOffsetYRef = useRef(24);

  // Restore state after mounting to avoid SSR mismatch
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedMinimized = localStorage.getItem(MINIMIZED_STORAGE_KEY);
      if (savedMinimized === "true") {
        setIsMinimized(true);
      }
      const savedOffset = sessionStorage.getItem(OFFSET_Y_STORAGE_KEY);
      if (savedOffset) {
        const parsed = parseInt(savedOffset, 10);
        if (
          !isNaN(parsed) &&
          parsed >= 16 &&
          parsed <= window.innerHeight - 100
        ) {
          setOffsetY(parsed);
        }
      }
    } catch {
      // safe fallback
    }
  }, []);

  // Dismiss badge once user opens assistant
  useEffect(() => {
    if (isOpen && hasNewBadge) {
      setHasNewBadge(false);
    }
  }, [isOpen, hasNewBadge]);

  // Hide floating widget inside live consultation room to prevent blocking chat/call controls
  if (pathname?.startsWith("/consultation")) {
    return null;
  }

  // Pointer drag handlers for vertical repositioning on the dedicated drag handle
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragStartYRef.current = e.clientY;
    initialOffsetYRef.current = offsetY;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!e.buttons) return;
    const deltaY = dragStartYRef.current - e.clientY; // positive = moving up
    const maxOffset = Math.max(80, window.innerHeight - 100);
    const newOffset = Math.min(
      Math.max(16, initialOffsetYRef.current + deltaY),
      maxOffset
    );
    setOffsetY(newOffset);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    try {
      sessionStorage.setItem(OFFSET_Y_STORAGE_KEY, offsetY.toString());
    } catch {}
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isMinimized;
    setIsMinimized(next);
    try {
      localStorage.setItem(MINIMIZED_STORAGE_KEY, next.toString());
    } catch {}
  };

  return (
    <>
      {/* 1. Minimized State: Sleek dock tab */}
      {isMounted && isMinimized && !isOpen && (
        <div
          style={{ bottom: `${offsetY}px` }}
          className="fixed right-2 z-50 flex items-center select-none animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => {
              setIsMinimized(false);
              try {
                localStorage.setItem(MINIMIZED_STORAGE_KEY, "false");
              } catch {}
            }}
            title="Expand AI Assistant"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-lg hover:shadow-indigo-500/25 border border-indigo-400/40 hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI</span>
          </button>
        </div>
      )}

      {/* 2. Normal State: Circular FAB + Hover Drag & Minimize Controls */}
      {!isMinimized && !isOpen && (
        <div
          style={{ bottom: `${offsetY}px` }}
          className="fixed right-4 sm:right-6 z-50 flex items-center select-none transition-[bottom] duration-75"
        >
          {/* Main Container */}
          <div className="relative group flex items-center gap-2">
            {/* Quick Action Controls on the left (Appear on hover) */}
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Drag Grip Handle */}
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                title="Drag vertically to move widget up or down"
                className="h-8 w-5 rounded-md bg-zinc-900/85 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-ns-resize shadow-md border border-zinc-700/60 touch-none transition-colors"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </div>

              {/* Minimize Button */}
              <button
                type="button"
                onClick={toggleMinimize}
                title="Minimize AI Assistant"
                className="h-8 w-8 rounded-full bg-zinc-900/85 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-xs shadow-md border border-zinc-700/60 transition-all hover:scale-105 cursor-pointer"
                aria-label="Minimize AI Assistant"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Circular FAB Button (Click directly opens the chat) */}
            <div className="relative">
              {/* Subtle Pulsing Halo */}
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-60 blur-sm group-hover:opacity-100 transition duration-500 animate-pulse pointer-events-none" />

              <button
                type="button"
                id="ai-assistant-fab-button"
                onClick={handleButtonClick}
                className="relative h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                title="Click to open AI Health Assistant"
                aria-label="Open AI Health Assistant"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm pointer-events-none">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>

                {hasNewBadge && (
                  <span className="absolute top-0 right-0 flex h-3 w-3 pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-white dark:border-zinc-950" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Floating Chat Window */}
      {isOpen && (
        <div className="fixed inset-2 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[410px] sm:max-w-[calc(100vw-1.5rem)] sm:h-[min(560px,calc(100dvh-2.5rem))] max-h-[calc(100dvh-1rem)] z-50 flex flex-col rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          <AIChatContainer onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
