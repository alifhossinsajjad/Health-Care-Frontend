"use client";

import React from "react";
import { Send, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface ActiveRecordingBarProps {
  formattedDuration: string;
  volumeLevel: number;
  isMicSilent: boolean;
  activeMicLabel?: string | null;
  isUploading: boolean;
  onCancel: () => void;
  onSend: () => void;
}

export function ActiveRecordingBar({
  formattedDuration,
  volumeLevel,
  isMicSilent,
  activeMicLabel,
  isUploading,
  onCancel,
  onSend,
}: ActiveRecordingBarProps) {
  // Height factors for dynamic audio waveform visualization
  const h1 = Math.max(4, Math.round(volumeLevel * 0.16));
  const h2 = Math.max(4, Math.round(volumeLevel * 0.28));
  const h3 = Math.max(4, Math.round(volumeLevel * 0.20));
  const h4 = Math.max(4, Math.round(volumeLevel * 0.24));

  return (
    <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl px-3 py-2 flex-1 animate-in fade-in">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
        </span>

        <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 font-mono shrink-0">
          Recording... {formattedDuration}
        </span>

        {/* Live Audio Waveform Visualizer */}
        <div className="flex items-center gap-0.5 h-6 px-1.5 shrink-0" title="Live audio input meter">
          <span className="w-1 bg-rose-500 rounded-full transition-all duration-75" style={{ height: `${h1}px` }} />
          <span className="w-1 bg-rose-500 rounded-full transition-all duration-75" style={{ height: `${h2}px` }} />
          <span className="w-1 bg-rose-500 rounded-full transition-all duration-75" style={{ height: `${h3}px` }} />
          <span className="w-1 bg-rose-500 rounded-full transition-all duration-75" style={{ height: `${h4}px` }} />
        </div>

        {/* Silent mic warning */}
        {isMicSilent && (
          <span className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 truncate">
            <AlertCircle className="h-3 w-3 shrink-0" />
            Mic volume low / muted
          </span>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="h-8 px-2 text-xs text-zinc-600 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg gap-1 shrink-0"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Cancel</span>
      </Button>

      <Button
        type="button"
        size="sm"
        disabled={isUploading}
        onClick={onSend}
        className="h-8 px-3 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs gap-1 shrink-0"
      >
        {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        <span>Send Voice</span>
      </Button>
    </div>
  );
}
