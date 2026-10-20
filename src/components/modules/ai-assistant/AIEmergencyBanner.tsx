"use client";

import React from "react";
import { AlertTriangle, PhoneCall, ShieldAlert } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface AIEmergencyBannerProps {
  phone?: string;
}

export function AIEmergencyBanner({ phone = "+8801700000000" }: AIEmergencyBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-rose-500/80 bg-rose-50 dark:bg-rose-950/40 p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Background pulsing glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" />

      <div className="flex items-start gap-3.5 relative z-10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
          <ShieldAlert className="h-5 w-5 animate-bounce" />
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
              <AlertTriangle className="h-3 w-3" /> Critical Clinical Alert
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100 leading-snug">
            Your reported symptoms indicate an urgent medical situation. Please do not wait for an online appointment. Seek immediate in-person emergency care!
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white gap-2 h-8 text-xs font-bold shadow-md shadow-rose-600/20"
            >
              <a href={`tel:${phone}`}>
                <PhoneCall className="h-3.5 w-3.5" /> Call Hospital Emergency ({phone})
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 h-8 text-xs font-medium"
            >
              <a href="tel:999">
                Call National 999
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
