"use client";

import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Sparkles,
  User,
  Database,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Stethoscope,
  Info,
} from "lucide-react";
import { IChatMessage } from "@/src/types/ai.type";
import { AIEmergencyBanner } from "./AIEmergencyBanner";
import { AIDoctorRecommendationCard } from "./AIDoctorRecommendationCard";

interface AIMessageBubbleProps {
  message: IChatMessage;
  onDoctorBookingSelect?: (doctorId: string, doctorName: string) => void;
}

export function AIMessageBubble({
  message,
  onDoctorBookingSelect,
}: AIMessageBubbleProps) {
  const [showSources, setShowSources] = useState(false);

  const isUser = message.sender === "user";
  const isSystem = message.sender === "system";

  const formattedTime = (() => {
    try {
      if (typeof message.timestamp === "string") {
        return format(parseISO(message.timestamp), "HH:mm");
      }
      return format(message.timestamp, "HH:mm");
    } catch {
      return "";
    }
  })();

  // Simple Markdown text formatter (handles bold, bullet points, headers)
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n");

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Empty line -> break
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Bullet Point
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
        const content = trimmed.replace(/^[\*\-•]\s*/, "");
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm leading-relaxed my-0.5">
            {renderInlineMarkdown(content)}
          </li>
        );
      }

      // Header (### or ##)
      if (trimmed.startsWith("### ")) {
        return (
          <h5 key={idx} className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-2 mb-1">
            {trimmed.replace(/^###\s*/, "")}
          </h5>
        );
      }

      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed my-1">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Inline bold and code formatter
  const renderInlineMarkdown = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-zinc-900 dark:text-zinc-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // System Message (e.g. Slot reservation confirmation)
  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <Info className="h-3.5 w-3.5 text-emerald-600" />
          <span>{message.text}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 my-3 group animate-in fade-in slide-in-from-bottom-1 duration-200 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Sender Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      {/* Message Content Container */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`relative rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm"
          }`}
        >
          {/* Main Message Text */}
          <div className="break-words">
            {renderFormattedText(message.text)}

            {/* Live Streaming Active Cursor */}
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-blue-600 dark:bg-blue-400 ml-1 rounded-sm animate-pulse align-middle" />
            )}
          </div>

          {/* Error Message Alert */}
          {message.error && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{message.error}</span>
            </div>
          )}

          {/* Timestamp */}
          {formattedTime && (
            <div
              className={`mt-1 text-[10px] font-mono select-none ${
                isUser ? "text-blue-200 text-right" : "text-zinc-400 text-left"
              }`}
            >
              {formattedTime}
            </div>
          )}
        </div>

        {/* AI Medical Enriched Metadata: Emergency Banner */}
        {!isUser && message.isEmergency && (
          <div className="w-full mt-3">
            <AIEmergencyBanner />
          </div>
        )}

        {/* Suggested Specialties Chips */}
        {!isUser && message.suggestedSpecialties && message.suggestedSpecialties.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <Stethoscope className="h-3 w-3 text-blue-500" /> Triage Specialty:
            </span>
            {message.suggestedSpecialties.map((spec, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Recommended Doctors Cards */}
        {!isUser && message.recommendedDoctors && message.recommendedDoctors.length > 0 && (
          <div className="w-full mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Recommended Board-Certified Specialists ({message.recommendedDoctors.length})
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {message.recommendedDoctors.map((doc) => (
                <AIDoctorRecommendationCard
                  key={doc.doctorId}
                  doctor={doc}
                  onCheckSchedule={onDoctorBookingSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* RAG Knowledge Sources (Collapsible Accordion) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2.5 w-full">
            <button
              onClick={() => setShowSources((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              <Database className="h-3 w-3 text-purple-500" />
              <span>Verified Clinical Sources ({message.sources.length})</span>
              {showSources ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {showSources && (
              <div className="mt-1.5 space-y-1 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-xs">
                {message.sources.map((src, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] py-0.5">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[200px]">
                      {src.sourceLabel}
                    </span>
                    <span className="font-mono text-zinc-400 text-[10px] shrink-0">
                      Score: {(src.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
