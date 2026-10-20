"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Square, Sparkles } from "lucide-react";
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
  "হাসপাতালের ইমার্জেন্সি সার্ভিস কি ২৪ ঘণ্টা খোলা থাকে?",
];

export function AIChatInput({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  disabled = false,
}: AIChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
    if (isStreaming || disabled) return;
    onSendMessage(suggestion);
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Quick Clinical Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-semibold text-zinc-400 shrink-0 flex items-center gap-1 pl-1">
          <Sparkles className="h-3 w-3 text-purple-500" /> Quick Ask:
        </span>
        {QUICK_SUGGESTIONS.map((suggestion, i) => (
          <button
            key={i}
            type="button"
            disabled={isStreaming || disabled}
            onClick={() => handleSuggestionClick(suggestion)}
            className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors disabled:opacity-50 text-left truncate max-w-[220px]"
            title={suggestion}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Main Input Box */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 p-1.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
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

      <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 select-none">
        HealthCare AI provides medical triage and scheduling recommendations. In critical emergencies, please call 999.
      </p>
    </div>
  );
}
