"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, XCircle } from "lucide-react";

interface PayLaterCountdownProps {
  createdAt: string;
  durationMinutes?: number;
  onExpire?: () => void;
}

export function PayLaterCountdown({
  createdAt,
  durationMinutes = 30,
  onExpire,
}: PayLaterCountdownProps) {
  const [timeLeftMs, setTimeLeftMs] = useState<number | null>(null);

  useEffect(() => {
    if (!createdAt) return;

    const createdTime = new Date(createdAt).getTime();
    if (isNaN(createdTime)) return;

    const totalDurationMs = durationMinutes * 60 * 1000;
    const expiryTimestamp = createdTime + totalDurationMs;

    const calculateRemaining = () => {
      const now = Date.now();
      const diff = expiryTimestamp - now;
      if (diff <= 0) {
        setTimeLeftMs(0);
        if (onExpire) onExpire();
        return false;
      }
      setTimeLeftMs(diff);
      return true;
    };

    // Initial check
    const stillActive = calculateRemaining();
    if (!stillActive) return;

    // Tick every second
    const interval = setInterval(() => {
      const active = calculateRemaining();
      if (!active) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, durationMinutes, onExpire]);

  // Before mounting on client, show a subtle placeholder
  if (timeLeftMs === null) {
    return (
      <div className="py-2 px-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Pay Later Deadline:</span>
        </span>
        <span className="font-mono font-bold">Checking...</span>
      </div>
    );
  }

  // 1. Expired state (timeLeft <= 0)
  if (timeLeftMs <= 0) {
    return (
      <div className="py-2 px-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between animate-in fade-in duration-300">
        <span className="flex items-center gap-1.5 font-semibold">
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Payment Window Expired</span>
        </span>
        <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
          Booking Cancelled
        </span>
      </div>
    );
  }

  const minutes = Math.floor(timeLeftMs / (1000 * 60));
  const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isCriticalUrgent = timeLeftMs <= 5 * 60 * 1000; // <= 5 minutes

  // 2. Critical Alert state (Last 5 minutes)
  if (isCriticalUrgent) {
    return (
      <div className="py-2.5 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400/80 dark:border-rose-600/60 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between shadow-xs transition-all animate-pulse">
        <div className="flex items-center gap-2">
          {/* Pulsing indicator beacon */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
          </span>
          <span className="font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Hurry! Pay before auto-cancel:</span>
          </span>
        </div>
        <div className="font-mono font-extrabold text-sm text-rose-700 dark:text-rose-300 bg-white/80 dark:bg-zinc-900/80 px-2 py-0.5 rounded-lg border border-rose-300 dark:border-rose-700">
          {formattedTime}
        </div>
      </div>
    );
  }

  // 3. Normal Countdown state (> 5 minutes)
  return (
    <div className="py-2 px-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between transition-colors">
      <span className="flex items-center gap-1.5 font-medium">
        <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>Pay Later Deadline:</span>
      </span>
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
          Remaining:
        </span>
        <span className="font-mono font-bold text-xs bg-amber-100/80 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-800/60">
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
