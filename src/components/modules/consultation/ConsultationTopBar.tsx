"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Wifi,
  PhoneCall,
  Video,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { CallState } from "@/src/types/webrtc.type";

interface ConsultationTopBarProps {
  partnerName: string;
  partnerRole: string;
  partnerPhoto?: string | null;
  partnerSpecialty?: string | null;
  callState: CallState;
  formattedDuration: string;
  isPeerOnline: boolean;
  onExit: () => void;
}

export function ConsultationTopBar({
  partnerName,
  partnerRole,
  partnerPhoto,
  partnerSpecialty,
  callState,
  formattedDuration,
  isPeerOnline,
  onExit,
}: ConsultationTopBarProps) {
  const isCallActive = callState === "CONNECTED";

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200/90 dark:border-zinc-800 flex items-center justify-between gap-4 shrink-0 shadow-xs z-20">
      {/* 1. Left: Back Button & Partner Metadata */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onExit}
          className="h-9 w-9 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 shrink-0"
          title="Exit consultation"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <Avatar className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <AvatarImage src={partnerPhoto || ""} alt={partnerName} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs">
                {partnerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Live Online Presence Dot */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-950 ${
                isPeerOnline ? "bg-emerald-500" : "bg-zinc-400"
              }`}
              title={isPeerOnline ? "User is Online" : "User is Offline"}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight truncate">
                {partnerName}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900">
                <ShieldCheck className="h-2.5 w-2.5" /> {partnerRole}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {partnerSpecialty || (isPeerOnline ? "Active in consultation" : "Offline")}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle: Live Call Timer */}
      <div className="flex items-center gap-2">
        {isCallActive ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 shadow-xs animate-in fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold tracking-wider">
              {formattedDuration}
            </span>
            <span className="hidden sm:inline text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Live Call
            </span>
          </div>
        ) : callState === "CALLING" ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-semibold animate-pulse">
            <PhoneCall className="h-3.5 w-3.5 animate-bounce" />
            <span>Ringing...</span>
          </div>
        ) : callState === "CONNECTING" ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Wifi className="h-3.5 w-3.5 animate-spin" />
            <span>Connecting WebRTC...</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>Ready for Telehealth Consultation</span>
          </div>
        )}
      </div>

      {/* 3. Right: Exit Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExit}
          className="h-9 px-3.5 rounded-xl border-zinc-200 dark:border-zinc-800 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
        >
          Leave Room
        </Button>
      </div>
    </header>
  );
}
