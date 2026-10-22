"use client";

import { useRef, useState, useCallback } from "react";
import { CallType } from "@/src/types/webrtc.type";

interface UseMediaTracksProps {
  onMediaToggled?: (videoMuted: boolean, audioMuted: boolean) => void;
  onScreenShareToggled?: (isSharing: boolean) => void;
}

export const useMediaTracks = ({
  onMediaToggled,
  onScreenShareToggled,
}: UseMediaTracksProps = {}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  /**
   * Acquire local camera and microphone stream with reliable device fallbacks
   */
  const acquireMediaStream = useCallback(async (type: CallType = "VIDEO"): Promise<MediaStream> => {
    const audioConstraints: MediaTrackConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    };

    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: type === "VIDEO" ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        audio: audioConstraints,
      });
    } catch (err: any) {
      if (type === "VIDEO") {
        console.warn("High-res video request failed, attempting default video...", err);
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        } catch {
          console.warn("Camera locked/unavailable, falling back to audio-only stream...");
          stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
        }
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
      }
    }

    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play().catch(() => {});
    }

    setIsAudioMuted(false);
    setIsVideoMuted(type === "AUDIO");

    return stream;
  }, []);

  /**
   * Toggle local microphone mute
   */
  const toggleAudio = useCallback(() => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      const muted = !audioTrack.enabled;
      setIsAudioMuted(muted);
      onMediaToggled?.(isVideoMuted, muted);
    }
  }, [isVideoMuted, onMediaToggled]);

  /**
   * Toggle local camera mute
   */
  const toggleVideo = useCallback(() => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      const muted = !videoTrack.enabled;
      setIsVideoMuted(muted);
      onMediaToggled?.(muted, isAudioMuted);
    }
  }, [isAudioMuted, onMediaToggled]);

  const revertScreenShare = useCallback(
    async (pc: RTCPeerConnection | null) => {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      if (pc) {
        const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender && cameraTrack) {
          await sender.replaceTrack(cameraTrack);
        }
      }
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current.play().catch(() => {});
      }
      setIsScreenSharing(false);
      onScreenShareToggled?.(false);
    },
    [onScreenShareToggled]
  );

  /**
   * Toggle clinical screen share
   */
  const toggleScreenShare = useCallback(
    async (pc: RTCPeerConnection | null) => {
      if (!pc) return;
      if (isScreenSharing) {
        await revertScreenShare(pc);
      } else {
        try {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: "always" } as any,
            audio: false,
          });
          screenStreamRef.current = screenStream;
          const screenTrack = screenStream.getVideoTracks()[0];
          screenTrack.onended = () => {
            revertScreenShare(pc);
          };

          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            await sender.replaceTrack(screenTrack);
          }
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
            localVideoRef.current.play().catch(() => {});
          }
          setIsScreenSharing(true);
          onScreenShareToggled?.(true);
        } catch (err) {
          console.warn("Screen share was canceled or unavailable:", err);
        }
      }
    },
    [isScreenSharing, revertScreenShare, onScreenShareToggled]
  );

  /**
   * Stop all active media hardware tracks
   */
  const cleanupMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    setIsAudioMuted(false);
    setIsVideoMuted(false);
    setIsScreenSharing(false);
  }, []);

  return {
    localVideoRef,
    localStreamRef,
    screenStreamRef,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    acquireMediaStream,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    cleanupMedia,
  };
};
