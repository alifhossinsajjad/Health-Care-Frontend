"use client";

import { useRef, useCallback } from "react";
import { webrtcService } from "@/src/services/webrtc.service";

interface UsePeerConnectionProps {
  appointmentId: string;
  onIceCandidate: (candidate: RTCIceCandidateInit) => void;
  onRemoteStreamAvailable?: () => void;
}

export const usePeerConnection = ({
  appointmentId,
  onIceCandidate,
  onRemoteStreamAvailable,
}: UsePeerConnectionProps) => {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const queuedCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const isRemoteDescriptionSetRef = useRef(false);

  /**
   * Flush buffered ICE candidates once remote description is set
   */
  const flushCandidates = useCallback(async (pc: RTCPeerConnection) => {
    while (queuedCandidatesRef.current.length > 0) {
      const cand = queuedCandidatesRef.current.shift();
      if (cand) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(cand));
        } catch (e) {
          console.warn("Error adding queued ICE candidate:", e);
        }
      }
    }
  }, []);

  /**
   * Initialize or retrieve active RTCPeerConnection
   */
  const setupPeerConnection = useCallback(
    async (localStream: MediaStream | null): Promise<RTCPeerConnection> => {
      if (peerConnectionRef.current) {
        if (localStream) {
          const currentTracks = peerConnectionRef.current
            .getSenders()
            .map((s) => s.track);
          localStream.getTracks().forEach((track) => {
            if (!currentTracks.includes(track)) {
              peerConnectionRef.current?.addTrack(track, localStream);
            }
          });
        }
        return peerConnectionRef.current;
      }

      const iceServers = await webrtcService.getIceServers();
      const pc = new RTCPeerConnection({
        iceServers,
        iceCandidatePoolSize: 10,
      });

      isRemoteDescriptionSetRef.current = false;
      queuedCandidatesRef.current = [];

      // Deterministic track order (Audio first, Video second) to maintain identical SDP m-lines
      if (localStream) {
        const audioTracks = localStream.getAudioTracks();
        const videoTracks = localStream.getVideoTracks();

        audioTracks.forEach((t) => pc.addTrack(t, localStream));
        videoTracks.forEach((t) => pc.addTrack(t, localStream));
      }

      // Inbound remote media tracks (Audio & Video)
      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            remoteVideoRef.current.play().catch(() => {});
          }
        } else {
          let stream = remoteVideoRef.current?.srcObject as MediaStream;
          if (!stream) {
            stream = new MediaStream();
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
          }
          stream.addTrack(event.track);
          remoteVideoRef.current?.play().catch(() => {});
        }
        onRemoteStreamAvailable?.();
      };

      // Local ICE candidate generation
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          onIceCandidate(event.candidate.toJSON());
        }
      };

      peerConnectionRef.current = pc;
      return pc;
    },
    [onIceCandidate, onRemoteStreamAvailable]
  );

  /**
   * Handle incoming remote offer
   */
  const handleRemoteOffer = useCallback(
    async (sdp: RTCSessionDescriptionInit, localStream: MediaStream | null) => {
      const pc = await setupPeerConnection(localStream);

      // Guard: Only apply remote offer when signaling state is stable
      if (pc.signalingState !== "stable") {
        console.warn("Ignoring remote offer, state is not stable:", pc.signalingState);
        return null;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      isRemoteDescriptionSetRef.current = true;
      await flushCandidates(pc);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      return answer;
    },
    [setupPeerConnection, flushCandidates]
  );

  /**
   * Handle incoming remote answer
   */
  const handleRemoteAnswer = useCallback(
    async (sdp: RTCSessionDescriptionInit) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      // Guard: Only apply remote answer if in have-local-offer state
      if (pc.signalingState !== "have-local-offer") {
        console.warn("Ignoring remote answer in signalingState:", pc.signalingState);
        return;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      isRemoteDescriptionSetRef.current = true;
      await flushCandidates(pc);
    },
    [flushCandidates]
  );

  /**
   * Handle incoming remote ICE candidate with race condition buffering
   */
  const handleRemoteCandidate = useCallback(
    async (candidate: RTCIceCandidateInit) => {
      const pc = peerConnectionRef.current;
      if (pc && isRemoteDescriptionSetRef.current) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn("Failed to add immediate candidate:", err);
        }
      } else {
        queuedCandidatesRef.current.push(candidate);
      }
    },
    []
  );

  /**
   * Close and destroy peer connection
   */
  const cleanupPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    isRemoteDescriptionSetRef.current = false;
    queuedCandidatesRef.current = [];
  }, []);

  return {
    peerConnectionRef,
    remoteVideoRef,
    setupPeerConnection,
    handleRemoteOffer,
    handleRemoteAnswer,
    handleRemoteCandidate,
    cleanupPeerConnection,
  };
};
