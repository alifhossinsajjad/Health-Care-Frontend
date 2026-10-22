"use client";

import React from "react";
import { Camera, Mic, AlertTriangle, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface MediaPermissionModalProps {
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}

export function MediaPermissionModal({
  error,
  onClose,
  onRetry,
}: MediaPermissionModalProps) {
  if (!error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
              Media Permission Required
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              {error}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1.5">
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">How to allow permissions:</p>
              <p>1. Click the lock or camera icon in your browser address bar.</p>
              <p>2. Set Camera and Microphone to &quot;Allow&quot;.</p>
              <p>3. Click &quot;Try Again&quot; below to start your consultation.</p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-8 rounded-xl text-xs font-semibold"
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                onClick={onRetry}
                className="h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
