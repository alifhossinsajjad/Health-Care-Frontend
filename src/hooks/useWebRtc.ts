"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { getSocket, soundAlerts } from "@/src/lib/socket";
import { CallType } from "@/src/types/webrtc.type";
import { useMediaTracks } from "./webrtc/useMediaTracks";
import { usePeerConnection } from "./webrtc/usePeerConnection";
import { useSignaling } from "./webrtc/useSignaling";

interface UseWebRtcProps {
  appointmentId: string;
  videoCallingId?: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserRole?: "DOCTOR" | "PATIENT" | "ADMIN" | "SUPER_ADMIN";
}

export const useWebRtc = ({
  appointmentId,
  videoCallingId = "",
  currentUserId = "",
  currentUserName = "User",
  currentUserRole = "PATIENT",
}: UseWebRtcProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const isCallerRef = useRef<boolean>(false);

  // Initialize socket client
  useEffect(() => {
    let mounted = true;
    getSocket().then((s) => {
      if (mounted) setSocket(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 1. Media tracks hook
  const {
    localVideoRef,
    localStreamRef,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    acquireMediaStream,
    toggleAudio,
    toggleVideo,
    toggleScreenShare: baseToggleScreenShare,
    cleanupMedia,
  } = useMediaTracks({
    onMediaToggled: (videoMuted, audioMuted) => {
      socket?.emit("call:toggle-media", { appointmentId, videoMuted, audioMuted });
    },
  });

  // 2. Peer connection hook
  const {
    peerConnectionRef,
    remoteVideoRef,
    setupPeerConnection,
    handleRemoteOffer,
    handleRemoteAnswer,
    handleRemoteCandidate,
    cleanupPeerConnection,
  } = usePeerConnection({
    appointmentId,
    onIceCandidate: (candidate) => {
      socket?.emit("webrtc:ice-candidate", { appointmentId, candidate });
    },
  });

  // Clean teardown helper
  const handleFullCleanup = useCallback(() => {
    isCallerRef.current = false;
    soundAlerts.stopIncomingRingtone();
    cleanupMedia();
    cleanupPeerConnection();
  }, [cleanupMedia, cleanupPeerConnection]);

  // Callback when call is accepted: ONLY the caller initiates the offer to prevent glare
  const onCallAccepted = useCallback(async () => {
    if (!isCallerRef.current) {
      // Callee waits for the caller's offer
      return;
    }
    const pc = await setupPeerConnection(localStreamRef.current);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket?.emit("webrtc:offer", { appointmentId, sdp: offer });
  }, [setupPeerConnection, localStreamRef, socket, appointmentId]);

  // 3. Signaling hook
  const {
    callState,
    setCallState,
    activeCallType,
    setActiveCallType,
    incomingCall,
    setIncomingCall,
    peerAudioMuted,
    peerVideoMuted,
    callDuration,
    formattedDuration,
  } = useSignaling({
    socket,
    appointmentId,
    videoCallingId: videoCallingId || appointmentId,
    onCallAccepted,
    onCallEnded: handleFullCleanup,
  });

  // Wire up incoming SDP offer/answer/candidate
  useEffect(() => {
    if (!socket) return;

    socket.on("webrtc:offer", async ({ sdp }) => {
      const answer = await handleRemoteOffer(sdp, localStreamRef.current);
      if (answer) {
        socket.emit("webrtc:answer", { appointmentId, sdp: answer });
      }
    });

    socket.on("webrtc:answer", async ({ sdp }) => {
      await handleRemoteAnswer(sdp);
    });

    socket.on("webrtc:ice-candidate", async ({ candidate }) => {
      await handleRemoteCandidate(candidate);
    });

    return () => {
      socket.off("webrtc:offer");
      socket.off("webrtc:answer");
      socket.off("webrtc:ice-candidate");
    };
  }, [socket, appointmentId, handleRemoteOffer, handleRemoteAnswer, handleRemoteCandidate, localStreamRef]);

  // Initiate call (Sets isCaller = true)
  const initiateCall = async (type: CallType = "VIDEO") => {
    try {
      setPermissionError(null);
      isCallerRef.current = true;
      setActiveCallType(type);
      setCallState("CALLING");

      await acquireMediaStream(type);

      socket?.emit("call:initiate", {
        appointmentId,
        videoCallingId: videoCallingId || appointmentId,
        callType: type,
        callerName: currentUserName,
        callerRole: currentUserRole,
      });
    } catch (err: any) {
      console.error("Camera/Mic error:", err);
      handleFullCleanup();
      setCallState("IDLE");
      setPermissionError(
        err?.name === "NotAllowedError"
          ? "Camera or microphone permission was denied. Please allow permissions in browser settings."
          : "Could not access camera or microphone on this device."
      );
    }
  };

  // Accept incoming call (Sets isCaller = false)
  const acceptCall = async () => {
    if (!incomingCall) return;
    isCallerRef.current = false;
    soundAlerts.stopIncomingRingtone();

    try {
      setPermissionError(null);
      setCallState("CONNECTING");

      const stream = await acquireMediaStream(incomingCall.callType);
      await setupPeerConnection(stream);

      socket?.emit("call:accept", {
        appointmentId,
        callId: incomingCall.callId,
      });

      setIncomingCall(null);
      setCallState("CONNECTED");
    } catch (err) {
      console.error("Error accepting call:", err);
      rejectCall("PERMISSION_DENIED");
    }
  };

  // Reject incoming call
  const rejectCall = async (reason = "DECLINED") => {
    isCallerRef.current = false;
    soundAlerts.stopIncomingRingtone();
    if (incomingCall && socket) {
      socket.emit("call:reject", { appointmentId, callId: incomingCall.callId, reason });
    }
    setIncomingCall(null);
    setCallState("IDLE");
  };

  // End ongoing call
  const endCall = useCallback(() => {
    if (socket) {
      socket.emit("call:end", { appointmentId });
    }
    soundAlerts.playCallEndTone();
    handleFullCleanup();
    setCallState("ENDED");
    setTimeout(() => setCallState("IDLE"), 2500);
  }, [socket, appointmentId, handleFullCleanup, setCallState]);

  const toggleScreenShare = () => {
    baseToggleScreenShare(peerConnectionRef.current);
  };

  return {
    callState,
    activeCallType,
    incomingCall,
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    peerAudioMuted,
    peerVideoMuted,
    callDuration,
    formattedDuration,
    permissionError,
    setPermissionError,
    initiateCall,
    acceptCall,
    rejectCall,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    endCall,
  };
};
