"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  PhoneCall,
  Monitor,
  Maximize2,
  Minimize2,
  Sparkles,
  ShieldCheck,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { CallState, CallType } from "@/src/types/webrtc.type";

interface ConsultationVideoRoomProps {
  partnerName: string;
  partnerRole: string;
  partnerPhoto?: string | null;
  callState: CallState;
  activeCallType: CallType;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  peerAudioMuted: boolean;
  peerVideoMuted: boolean;
  formattedDuration: string;
  onInitiateCall: (type: CallType) => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
}

export function ConsultationVideoRoom({
  partnerName,
  partnerRole,
  partnerPhoto,
  callState,
  activeCallType,
  localVideoRef,
  remoteVideoRef,
  isAudioMuted,
  isVideoMuted,
  isScreenSharing,
  peerAudioMuted,
  peerVideoMuted,
  formattedDuration,
  onInitiateCall,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
}: ConsultationVideoRoomProps) {
  const [isPipExpanded, setIsPipExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isConnected = callState === "CONNECTED";
  const isCalling = callState === "CALLING";
  const isConnecting = callState === "CONNECTING";
  const isEnded = callState === "ENDED";
  const isIdle = callState === "IDLE";

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden select-none min-h-[420px] sm:min-h-[500px]">
      {/* ------------------------------------------------------------------------
          1. REMOTE VIDEO STREAM (Full-bleed container)
          ------------------------------------------------------------------------ */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isConnected && !peerVideoMuted ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ------------------------------------------------------------------------
          2. PEER VIDEO OFF / IDLE / CALLING FALLBACK OVERLAY
          ------------------------------------------------------------------------ */}
      {(!isConnected || peerVideoMuted) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-radial from-zinc-900 to-zinc-950">
          {/* A. Call is IDLE: Provide Call Initiation CTAs */}
          {isIdle && (
            <div className="flex flex-col items-center max-w-sm animate-in fade-in duration-300">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 rounded-3xl border-2 border-zinc-800 shadow-2xl">
                  <AvatarImage src={partnerPhoto || ""} alt={partnerName} className="object-cover" />
                  <AvatarFallback className="rounded-3xl bg-blue-600/30 text-blue-400 font-extrabold text-2xl">
                    {partnerName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-md">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-zinc-100">
                {partnerName}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Verified {partnerRole} • Direct Encrypted WebRTC Consultation
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-8">
                <Button
                  size="lg"
                  onClick={() => onInitiateCall("VIDEO")}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 h-12 gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
                >
                  <Video className="h-4 w-4" /> Start Video Consultation
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onInitiateCall("AUDIO")}
                  className="h-12 w-12 rounded-full border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 shadow-md"
                  title="Audio-only consultation"
                >
                  <PhoneCall className="h-4 w-4 text-blue-400" />
                </Button>
              </div>
            </div>
          )}

          {/* B. Outgoing Ringing State */}
          {isCalling && (
            <div className="flex flex-col items-center max-w-xs animate-in fade-in">
              <div className="relative mb-5 flex items-center justify-center">
                <span className="absolute h-32 w-32 rounded-full bg-blue-500/20 animate-ping" />
                <span className="absolute h-28 w-28 rounded-full bg-indigo-500/30 animate-pulse" />

                <Avatar className="h-24 w-24 rounded-3xl border-2 border-zinc-700 shadow-2xl relative z-10">
                  <AvatarImage src={partnerPhoto || ""} alt={partnerName} className="object-cover" />
                  <AvatarFallback className="rounded-3xl bg-blue-600 text-white font-bold text-2xl">
                    {partnerName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h4 className="text-lg font-bold text-zinc-100">Calling {partnerName}...</h4>
              <p className="text-xs text-zinc-400 mt-1">Awaiting remote peer connection</p>

              <Button
                variant="destructive"
                size="sm"
                onClick={onEndCall}
                className="mt-6 rounded-full px-5 h-10 gap-1.5 text-xs font-semibold shadow-lg shadow-rose-600/30"
              >
                <PhoneOff className="h-4 w-4" /> Cancel Call
              </Button>
            </div>
          )}

          {/* C. Connected but Remote Video is Muted */}
          {isConnected && peerVideoMuted && (
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 rounded-3xl border-2 border-zinc-800 mb-3 shadow-xl">
                <AvatarImage src={partnerPhoto || ""} alt={partnerName} className="object-cover" />
                <AvatarFallback className="rounded-3xl bg-zinc-800 text-zinc-300 font-bold text-2xl">
                  {partnerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h4 className="text-sm font-bold text-zinc-200">{partnerName}</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Camera is turned off</p>
            </div>
          )}

          {/* D. Call Ended Summary */}
          {isEnded && (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
              <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 text-emerald-400 mb-3 shadow-xl">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-zinc-100">Consultation Finished</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Duration: <span className="font-mono font-bold text-emerald-400">{formattedDuration}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------------
          3. PEER AUDIO MUTED BADGE (Top-Left Pill)
          ------------------------------------------------------------------------ */}
      {isConnected && peerAudioMuted && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-zinc-800 text-rose-400 text-xs font-semibold shadow-md animate-in fade-in">
          <VolumeX className="h-3.5 w-3.5" />
          <span>{partnerName}&apos;s Mic Muted</span>
        </div>
      )}

      {/* ------------------------------------------------------------------------
          4. LOCAL PIP STREAM (Self-View Camera in Corner)
          ------------------------------------------------------------------------ */}
      {(isConnected || isCalling) && (
        <div
          className={`absolute bottom-24 right-4 z-20 rounded-2xl overflow-hidden border-2 border-white/20 bg-zinc-900 shadow-2xl transition-all duration-300 ${
            isPipExpanded ? "w-64 h-48 sm:w-80 sm:h-60" : "w-36 h-28 sm:w-44 sm:h-32"
          }`}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover -scale-x-100 ${
              isVideoMuted ? "opacity-0" : "opacity-100"
            }`}
          />

          {isVideoMuted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-400">
              <VideoOff className="h-6 w-6 mb-1 text-zinc-500" />
              <span className="text-[10px] font-semibold">Your Camera Off</span>
            </div>
          )}

          {/* Local Mute Indicator */}
          {isAudioMuted && (
            <div className="absolute bottom-2 left-2 p-1 rounded-md bg-rose-600/90 text-white shadow-xs">
              <MicOff className="h-3 w-3" />
            </div>
          )}

          {/* PiP Expand / Minimize Toggle */}
          <button
            type="button"
            onClick={() => setIsPipExpanded((prev) => !prev)}
            className="absolute top-2 right-2 p-1 rounded-md bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition-colors"
            title={isPipExpanded ? "Shrink self-view" : "Expand self-view"}
          >
            {isPipExpanded ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------------
          5. CONTROL DOCK (Floating Bottom Controls)
          ------------------------------------------------------------------------ */}
      {(isConnected || isCalling) && (
        <div className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-3 px-4 pointer-events-none">
          <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/80 shadow-2xl pointer-events-auto">
            {/* Mic Toggle */}
            <Button
              type="button"
              size="icon"
              onClick={onToggleAudio}
              className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full shadow-md transition-transform active:scale-95 ${
                isAudioMuted
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              }`}
              title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {/* Video Camera Toggle */}
            {activeCallType === "VIDEO" && (
              <Button
                type="button"
                size="icon"
                onClick={onToggleVideo}
                className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full shadow-md transition-transform active:scale-95 ${
                  isVideoMuted
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
                title={isVideoMuted ? "Turn camera on" : "Turn camera off"}
              >
                {isVideoMuted ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </Button>
            )}

            {/* Screen Share Toggle */}
            {isConnected && (
              <Button
                type="button"
                size="icon"
                onClick={onToggleScreenShare}
                className={`hidden sm:flex h-11 w-11 sm:h-12 sm:w-12 rounded-full shadow-md transition-transform active:scale-95 ${
                  isScreenSharing
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
                title={isScreenSharing ? "Stop sharing screen" : "Share clinical screen/reports"}
              >
                <Monitor className="h-5 w-5" />
              </Button>
            )}

            {/* End Call (Red Button) */}
            <Button
              type="button"
              size="icon"
              onClick={onEndCall}
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/40 transition-transform active:scale-95"
              title="End consultation call"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
