"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { getSocket, soundAlerts } from "@/src/lib/socket";
import { webrtcService } from "@/src/services/webrtc.service";
import {
  CallState,
  CallType,
  IIncomingCallData,
  IWebrtcOfferPayload,
  IWebrtcAnswerPayload,
  IWebrtcIceCandidatePayload,
  ICallEndedEvent,
} from "@/src/types/webrtc.type";

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
  const [callState, setCallState] = useState<CallState>("IDLE");
  const [activeCallType, setActiveCallType] = useState<CallType>("VIDEO");
  const [incomingCall, setIncomingCall] = useState<IIncomingCallData | null>(null);

  // Media Track states
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Peer Media states
  const [peerAudioMuted, setPeerAudioMuted] = useState(false);
  const [peerVideoMuted, setPeerVideoMuted] = useState(false);

  // Stats & Timers
  const [callDuration, setCallDuration] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Media Element Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // WebRTC & Stream References
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Race condition protection: Queue ICE candidates until remote description is set
  const queuedCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const isRemoteDescriptionSetRef = useRef(false);

  // Timer reference
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ----------------------------------------------------------------------------
  // 1. Initialize Socket
  // ----------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;
    getSocket().then((s) => {
      if (mounted) socketRef.current = s;
    });

    return () => {
      mounted = false;
    };
  }, []);

  // ----------------------------------------------------------------------------
  // 2. Call Duration Timer
  // ----------------------------------------------------------------------------
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
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    };
  }, [callState]);

  // Format seconds to MM:SS or HH:MM:SS
  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}:${remainingMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ----------------------------------------------------------------------------
  // 3. Setup RTCPeerConnection
  // ----------------------------------------------------------------------------
  const setupPeerConnection = useCallback(async (): Promise<RTCPeerConnection> => {
    // If peer connection already active, reuse
    if (peerConnectionRef.current) {
      return peerConnectionRef.current;
    }

    const iceServers = await webrtcService.getIceServers();
    const pc = new RTCPeerConnection({
      iceServers,
      iceCandidatePoolSize: 10,
    });

    isRemoteDescriptionSetRef.current = false;
    queuedCandidatesRef.current = [];

    // Add local media tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle inbound remote streams
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Emit local ICE candidate to remote peer via signaling socket
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("webrtc:ice-candidate", {
          appointmentId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    // Monitor connection health & handle disconnections
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
        console.warn("ICE connection dropped, state:", pc.iceConnectionState);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [appointmentId]);

  // Flush queued candidates once remote description is ready
  const flushQueuedCandidates = useCallback(async (pc: RTCPeerConnection) => {
    while (queuedCandidatesRef.current.length > 0) {
      const candidate = queuedCandidatesRef.current.shift();
      if (candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.warn("Error adding queued ICE candidate:", e);
        }
      }
    }
  }, []);

  // ----------------------------------------------------------------------------
  // 4. Clean Up Streams & Peer Connection
  // ----------------------------------------------------------------------------
  const cleanupCall = useCallback(() => {
    soundAlerts.stopIncomingRingtone();

    // Stop local camera/mic tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Stop screen share tracks
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    isRemoteDescriptionSetRef.current = false;
    queuedCandidatesRef.current = [];
    setIncomingCall(null);
    setIsScreenSharing(false);
  }, []);

  // ----------------------------------------------------------------------------
  // 5. Initiate Outgoing Call
  // ----------------------------------------------------------------------------
  const initiateCall = async (type: CallType = "VIDEO") => {
    try {
      setPermissionError(null);
      setActiveCallType(type);
      setCallState("CALLING");

      // Request User Media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "VIDEO" ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const socket = socketRef.current || (await getSocket());
      socket.emit("call:initiate", {
        appointmentId,
        videoCallingId: videoCallingId || appointmentId,
        callType: type,
        callerName: currentUserName,
        callerRole: currentUserRole,
      });
    } catch (err: any) {
      console.error("Camera/Mic access error:", err);
      cleanupCall();
      setCallState("IDLE");
      setPermissionError(
        err?.name === "NotAllowedError"
          ? "Camera or microphone permission was denied. Please allow camera and mic permissions in your browser settings to proceed with the consultation."
          : "Could not find an accessible camera or microphone on this device."
      );
    }
  };

  // ----------------------------------------------------------------------------
  // 6. Accept Incoming Call
  // ----------------------------------------------------------------------------
  const acceptCall = async () => {
    if (!incomingCall) return;
    soundAlerts.stopIncomingRingtone();

    try {
      setPermissionError(null);
      setCallState("CONNECTING");

      // Obtain User Media matching the call type
      const stream = await navigator.mediaDevices.getUserMedia({
        video: incomingCall.callType === "VIDEO" ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      await setupPeerConnection();

      const socket = socketRef.current || (await getSocket());
      socket.emit("call:accept", {
        appointmentId,
        callId: incomingCall.callId,
      });

      setIncomingCall(null);
      setCallState("CONNECTED");
    } catch (err: any) {
      console.error("Error accepting call:", err);
      rejectCall("PERMISSION_DENIED");
      setPermissionError(
        "Camera/mic permission was denied. Please permit device access in your browser."
      );
    }
  };

  // ----------------------------------------------------------------------------
  // 7. Reject Incoming Call
  // ----------------------------------------------------------------------------
  const rejectCall = async (reason = "DECLINED") => {
    soundAlerts.stopIncomingRingtone();
    if (incomingCall && socketRef.current) {
      socketRef.current.emit("call:reject", {
        appointmentId,
        callId: incomingCall.callId,
        reason,
      });
    }
    setIncomingCall(null);
    setCallState("IDLE");
  };

  // ----------------------------------------------------------------------------
  // 8. End Ongoing Call
  // ----------------------------------------------------------------------------
  const endCall = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("call:end", { appointmentId });
    }
    soundAlerts.playCallEndTone();
    cleanupCall();
    setCallState("ENDED");
    setTimeout(() => setCallState("IDLE"), 2500);
  }, [appointmentId, cleanupCall]);

  // ----------------------------------------------------------------------------
  // 9. Media Track Toggles (Mic, Camera, Screen Share)
  // ----------------------------------------------------------------------------
  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      const muted = !audioTrack.enabled;
      setIsAudioMuted(muted);
      socketRef.current?.emit("call:toggle-media", {
        appointmentId,
        audioMuted: muted,
      });
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      const muted = !videoTrack.enabled;
      setIsVideoMuted(muted);
      socketRef.current?.emit("call:toggle-media", {
        appointmentId,
        videoMuted: muted,
      });
    }
  };

  const toggleScreenShare = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    if (isScreenSharing) {
      // Revert from screen share to camera track
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }

      const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender && cameraTrack) {
        await sender.replaceTrack(cameraTrack);
      }
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsScreenSharing(false);
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        // Revert when user clicks browser's native "Stop Sharing" bar
        screenTrack.onended = () => {
          toggleScreenShare();
        };

        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          await sender.replaceTrack(screenTrack);
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } catch (err) {
        console.warn("Screen share was canceled or unavailable:", err);
      }
    }
  };

  // ----------------------------------------------------------------------------
  // 10. WebRTC Socket Event Handlers
  // ----------------------------------------------------------------------------
  useEffect(() => {
    let active = true;

    const attachListeners = async () => {
      const socket = socketRef.current || (await getSocket());
      if (!active) return;

      // 1. Inbound incoming call
      socket.on("call:incoming", (data: IIncomingCallData) => {
        setIncomingCall(data);
        setActiveCallType(data.callType);
        setCallState("INCOMING");
        soundAlerts.startIncomingRingtone();
      });

      // 2. Call accepted by remote peer -> Create & Send SDP Offer
      socket.on("call:accepted", async () => {
        soundAlerts.stopIncomingRingtone();
        setCallState("CONNECTED");
        const pc = await setupPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("webrtc:offer", {
          appointmentId,
          sdp: offer,
        });
      });

      // 3. Receive SDP Offer -> Set Remote, Create & Send SDP Answer
      socket.on("webrtc:offer", async ({ sdp }: IWebrtcOfferPayload) => {
        const pc = await setupPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        isRemoteDescriptionSetRef.current = true;
        await flushQueuedCandidates(pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc:answer", {
          appointmentId,
          sdp: answer,
        });
      });

      // 4. Receive SDP Answer
      socket.on("webrtc:answer", async ({ sdp }: IWebrtcAnswerPayload) => {
        const pc = peerConnectionRef.current;
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          isRemoteDescriptionSetRef.current = true;
          await flushQueuedCandidates(pc);
        }
      });

      // 5. Receive ICE Candidate (with buffer race condition prevention)
      socket.on("webrtc:ice-candidate", async ({ candidate }: IWebrtcIceCandidatePayload) => {
        const pc = peerConnectionRef.current;
        if (pc && isRemoteDescriptionSetRef.current) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.warn("Failed to add immediate ICE candidate:", err);
          }
        } else {
          queuedCandidatesRef.current.push(candidate);
        }
      });

      // 6. Media Toggled (Peer mic or camera status changed)
      socket.on("call:media-toggled", ({ videoMuted, audioMuted }) => {
        if (typeof videoMuted === "boolean") setPeerVideoMuted(videoMuted);
        if (typeof audioMuted === "boolean") setPeerAudioMuted(audioMuted);
      });

      // 7. Call Rejected
      socket.on("call:rejected", () => {
        soundAlerts.stopIncomingRingtone();
        cleanupCall();
        setCallState("IDLE");
      });

      // 8. Call Ended
      socket.on("call:ended", (data: ICallEndedEvent) => {
        soundAlerts.playCallEndTone();
        cleanupCall();
        setCallDuration(data.durationSec || 0);
        setCallState("ENDED");
        setTimeout(() => setCallState("IDLE"), 2500);
      });
    };

    attachListeners();

    return () => {
      active = false;
      cleanupCall();
      if (socketRef.current) {
        socketRef.current.off("call:incoming");
        socketRef.current.off("call:accepted");
        socketRef.current.off("webrtc:offer");
        socketRef.current.off("webrtc:answer");
        socketRef.current.off("webrtc:ice-candidate");
        socketRef.current.off("call:media-toggled");
        socketRef.current.off("call:rejected");
        socketRef.current.off("call:ended");
      }
    };
  }, [appointmentId, setupPeerConnection, flushQueuedCandidates, cleanupCall]);

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
    formattedDuration: formatDuration(callDuration),
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
