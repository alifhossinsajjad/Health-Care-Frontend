"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import { soundAlerts } from "@/src/lib/socket";
import {
  CallState,
  CallType,
  IIncomingCallData,
  ICallEndedEvent,
} from "@/src/types/webrtc.type";

interface UseSignalingProps {
  socket: Socket | null;
  appointmentId: string;
  videoCallingId: string;
  onCallAccepted: () => Promise<void>;
  onCallEnded: () => void;
}

export const useSignaling = ({
  socket,
  appointmentId,
  videoCallingId,
  onCallAccepted,
  onCallEnded,
}: UseSignalingProps) => {
  const [callState, setCallState] = useState<CallState>("IDLE");
  const [activeCallType, setActiveCallType] = useState<CallType>("VIDEO");
  const [incomingCall, setIncomingCall] = useState<IIncomingCallData | null>(null);

  const [peerAudioMuted, setPeerAudioMuted] = useState(false);
  const [peerVideoMuted, setPeerVideoMuted] = useState(false);

  const [callDuration, setCallDuration] = useState(0);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Call duration counter
  useEffect(() => {
    if (callState === "CONNECTED") {
      setCallDuration(0);
      durationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    }

    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [callState]);

  // Format call duration
  const formatDuration = useCallback((sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  // Attach signaling socket listeners
  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.emit("join:appointment", { appointmentId, videoCallingId });
      socket.emit("call:join", { appointmentId, videoCallingId });
    };

    joinRoom();
    socket.on("connect", joinRoom);
    socket.on("reconnect", joinRoom);

    // 1. Inbound incoming call
    socket.on("call:incoming", (data: IIncomingCallData) => {
      setIncomingCall(data);
      setActiveCallType(data.callType);
      setCallState("INCOMING");
      soundAlerts.startIncomingRingtone();
    });

    // 2. Call accepted by remote peer
    socket.on("call:accepted", async () => {
      soundAlerts.stopIncomingRingtone();
      setCallState("CONNECTED");
      await onCallAccepted();
    });

    // 3. Media toggled by remote peer
    socket.on("call:media-toggled", ({ videoMuted, audioMuted }) => {
      if (typeof videoMuted === "boolean") setPeerVideoMuted(videoMuted);
      if (typeof audioMuted === "boolean") setPeerAudioMuted(audioMuted);
    });

    // 4. Remote peer rejected call
    socket.on("call:rejected", () => {
      soundAlerts.stopIncomingRingtone();
      setCallState("IDLE");
      onCallEnded();
    });

    // 5. Remote peer ended call
    socket.on("call:ended", (data: ICallEndedEvent) => {
      soundAlerts.playCallEndTone();
      setCallDuration(data.durationSec || 0);
      setCallState("ENDED");
      onCallEnded();
      setTimeout(() => setCallState("IDLE"), 2500);
    });

    return () => {
      socket.off("connect", joinRoom);
      socket.off("reconnect", joinRoom);
      socket.off("call:incoming");
      socket.off("call:accepted");
      socket.off("call:media-toggled");
      socket.off("call:rejected");
      socket.off("call:ended");
    };
  }, [socket, appointmentId, videoCallingId, onCallAccepted, onCallEnded]);

  return {
    callState,
    setCallState,
    activeCallType,
    setActiveCallType,
    incomingCall,
    setIncomingCall,
    peerAudioMuted,
    peerVideoMuted,
    callDuration,
    formattedDuration: formatDuration(callDuration),
  };
};
