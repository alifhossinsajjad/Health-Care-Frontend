"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, Square, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  onStopStreaming: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

const QUICK_SUGGESTIONS = [
  "আমার হাঁটুতে অনেক ব্যথা এবং হাঁটতে পারছি না, কোন ডাক্তার দেখাব?",
  "হাসপাতালের অনলাইন পে-লেটার (Pay Later) পলিসি কী?",
  "অভিজ্ঞ কার্ডিওলজিস্ট (হৃদরোগ বিশেষজ্ঞ) কে আছেন?",
  "হঠাৎ বুকে তীব্র ব্যথা ও শ্বাসকষ্ট হচ্ছে, কী করব?",
  "হাসপাতালের ইমার্জেন্সি সার্ভিস কি ২৪ ঘণ্টা খোলা থাকে?",
  "কিডনি স্পেশালিস্ট ডাক্তারের পরামর্শ ফি কত?",
];

export function AIChatInput({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  disabled = false,
}: AIChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Quick Chips Horizontal Scroll References & Drag State
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Check scroll boundary visibility for arrow buttons
  const checkScrollBounds = useCallback(() => {
    if (!chipsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = chipsRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkScrollBounds();
    window.addEventListener("resize", checkScrollBounds);
    return () => window.removeEventListener("resize", checkScrollBounds);
  }, [checkScrollBounds]);

  // Desktop Mouse Wheel support (Converts vertical wheel to horizontal scroll)
  const handleChipsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (chipsRef.current && e.deltaY !== 0) {
      chipsRef.current.scrollLeft += e.deltaY;
      checkScrollBounds();
    }
  };

  // Chevron Buttons Click
  const handleScrollStep = (direction: "left" | "right") => {
    if (!chipsRef.current) return;
    const offset = direction === "left" ? -180 : 180;
    chipsRef.current.scrollBy({ left: offset, behavior: "smooth" });
    setTimeout(checkScrollBounds, 300);
  };

  // Mouse Drag-to-Scroll handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chipsRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - chipsRef.current.offsetLeft;
    scrollLeftRef.current = chipsRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !chipsRef.current) return;
    const x = e.pageX - chipsRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    chipsRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkScrollBounds();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming || disabled) return;

    onSendMessage(input.trim());
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (hasDraggedRef.current || isStreaming || disabled) return;
    onSendMessage(suggestion);
  };

  return (
    <div className="w-full space-y-2">
      {/* 1. Quick Clinical Suggestion Chips Bar with Desktop & Mobile Scroll */}
      <div className="relative flex items-center group/chips">
        {/* Left Scroll Chevron */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScrollStep("left")}
            className="absolute -left-1 z-10 p-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md text-zinc-600 dark:text-zinc-300 hover:text-blue-600 hover:scale-110 transition-all"
            title="Scroll left"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={chipsRef}
          onWheel={handleChipsWheel}
          onScroll={checkScrollBounds}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full select-none cursor-grab active:cursor-grabbing px-1"
        >
          <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 shrink-0 flex items-center gap-1 pl-0.5">
            <Sparkles className="h-3 w-3 text-purple-500" /> Quick Ask:
          </span>

          {QUICK_SUGGESTIONS.map((suggestion, i) => (
            <button
              key={i}
              type="button"
              disabled={isStreaming || disabled}
              onClick={() => handleSuggestionClick(suggestion)}
              className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors disabled:opacity-50 text-left truncate max-w-[240px] shadow-2xs"
              title={suggestion}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Right Scroll Chevron */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScrollStep("right")}
            className="absolute -right-1 z-10 p-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md text-zinc-600 dark:text-zinc-300 hover:text-blue-600 hover:scale-110 transition-all"
            title="Scroll right"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* 2. Main Input Box */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 p-1.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-xs focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isStreaming
              ? "AI is responding with clinical triage..."
              : "Describe your symptoms or ask a question (Enter to send)..."
          }
          rows={1}
          disabled={disabled}
          className="flex-1 max-h-[120px] resize-none bg-transparent px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
        />

        {/* Action Button: Send or Stop */}
        {isStreaming ? (
          <Button
            type="button"
            size="icon"
            onClick={onStopStreaming}
            className="h-8 w-8 shrink-0 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            title="Stop generating response"
          >
            <Square className="h-3.5 w-3.5 fill-white" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || disabled}
            className="h-8 w-8 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-40 transition-all"
            title="Send query"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </form>

      <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 select-none leading-tight">
        HealthCare AI provides medical triage and scheduling recommendations. In critical emergencies, please call 999.
      </p>
    </div>
  );
}
