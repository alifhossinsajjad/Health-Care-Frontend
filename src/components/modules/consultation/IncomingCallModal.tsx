"use client";

import React from "react";
import { Phone, PhoneOff, Video, Mic, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { IIncomingCallData } from "@/src/types/webrtc.type";

interface IncomingCallModalProps {
  incomingCall: IIncomingCallData | null;
  onAccept: () => void;
  onReject: () => void;
}

export function IncomingCallModal({
  incomingCall,
  onAccept,
  onReject,
}: IncomingCallModalProps) {
  if (!incomingCall) return null;

  const isVideo = incomingCall.callType === "VIDEO";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 shadow-2xl p-6 text-center overflow-hidden flex flex-col items-center">
        {/* Pulsing Glow Background */}
        <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        {/* Radar Ring Animation around Avatar */}
        <div className="relative my-4 flex items-center justify-center">
          <span className="absolute h-28 w-28 rounded-full bg-emerald-400/20 animate-ping" />
          <span className="absolute h-24 w-24 rounded-full bg-emerald-500/30 animate-pulse" />

          <Avatar className="h-20 w-20 rounded-2xl border-4 border-white dark:border-zinc-900 shadow-xl relative z-10">
            <AvatarImage
              src={incomingCall.callerPhoto || ""}
              alt={incomingCall.callerName}
              className="object-cover"
            />
            <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl">
              {incomingCall.callerName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Caller Info */}
        <div className="mt-2 space-y-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <ShieldCheck className="h-3 w-3" /> {incomingCall.callerRole}
          </div>

          <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            {incomingCall.callerName}
          </h3>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1.5 pt-1">
            {isVideo ? (
              <>
                <Video className="h-4 w-4 text-emerald-500" />
                <span>Incoming Video Consultation Call...</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 text-blue-500" />
                <span>Incoming Audio Consultation Call...</span>
              </>
            )}
          </p>
        </div>

        {/* Action Buttons: Accept / Decline */}
        <div className="mt-8 flex items-center justify-center gap-6 w-full">
          {/* Decline Button */}
          <div className="flex flex-col items-center gap-1.5">
            <Button
              type="button"
              size="icon"
              onClick={onReject}
              className="h-14 w-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
              title="Decline Call"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              Decline
            </span>
          </div>

          {/* Accept Button */}
          <div className="flex flex-col items-center gap-1.5">
            <Button
              type="button"
              size="icon"
              onClick={onAccept}
              className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 animate-bounce"
              title="Accept Call"
            >
              <Phone className="h-6 w-6" />
            </Button>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Accept
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
