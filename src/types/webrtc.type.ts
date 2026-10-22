/**
 * ==============================================================================
 * WebRTC Voice & Video Consultation — Domain Types & Signaling Contracts
 * ==============================================================================
 * Covers:
 * - Peer Connection Signaling (SDP Offer, Answer, ICE Candidates)
 * - Call Lifecycle States (Idle, Calling, Incoming, Connecting, Connected, Ended)
 * - Media State Synchronization (Mute Mic, Camera Off, Screen Share)
 * - Audit Logs and STUN/TURN Configurations
 */

export type CallType = "VIDEO" | "AUDIO";

export type CallState =
  | "IDLE"
  | "CALLING"
  | "INCOMING"
  | "CONNECTING"
  | "CONNECTED"
  | "ENDED";

export interface IIceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface IIncomingCallData {
  callId: string;
  appointmentId: string;
  videoCallingId: string;
  callerName: string;
  callerRole: "DOCTOR" | "PATIENT" | "ADMIN" | "SUPER_ADMIN";
  callerPhoto?: string | null;
  callType: CallType;
}

export interface ICallInitiatePayload {
  appointmentId: string;
  videoCallingId: string;
  callType: CallType;
}

export interface ICallAcceptPayload {
  appointmentId: string;
  callId: string;
}

export interface ICallAcceptedEvent {
  callId: string;
  appointmentId: string;
  acceptedBy: string;
}

export interface ICallRejectPayload {
  appointmentId: string;
  callId: string;
  reason?: string;
}

export interface ICallRejectedEvent {
  callId: string;
  reason?: string;
}

export interface ICallEndPayload {
  appointmentId: string;
}

export interface ICallEndedEvent {
  appointmentId: string;
  endedBy: string;
  durationSec: number;
}

export interface ICallToggleMediaPayload {
  appointmentId: string;
  videoMuted?: boolean;
  audioMuted?: boolean;
}

export interface ICallMediaToggledEvent {
  userId: string;
  videoMuted?: boolean;
  audioMuted?: boolean;
}

export interface IWebrtcOfferPayload {
  appointmentId: string;
  sdp: RTCSessionDescriptionInit;
}

export interface IWebrtcAnswerPayload {
  appointmentId: string;
  sdp: RTCSessionDescriptionInit;
}

export interface IWebrtcIceCandidatePayload {
  appointmentId: string;
  candidate: RTCIceCandidateInit;
}

export interface IVideoConsultationLog {
  id: string;
  appointmentId: string;
  startedAt: string;
  endedAt?: string | null;
  durationSec: number;
  initiatedBy: string;
  callType: CallType;
  status: "COMPLETED" | "MISSED" | "REJECTED" | "FAILED";
}
