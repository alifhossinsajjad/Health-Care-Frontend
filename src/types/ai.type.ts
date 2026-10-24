/**
 * ==============================================================================
 * Hospital AI Healthcare Assistant — Domain & Contract Types
 * ==============================================================================
 * This module defines end-to-end type contracts for:
 * 1. Real-time Token Streaming (Server-Sent Events - SSE)
 * 2. Clinical Triage & RAG Semantic Search Metadata
 * 3. AI Agent Tools (Doctor Availability, Hold Slot, Hospital Policies)
 * 4. UI Chat State & Conversation Management
 */

// ------------------------------------------------------------------------------
// 1. Chat History & Streaming Request Contracts
// ------------------------------------------------------------------------------

export type AIChatRole = "user" | "model" | "system";

/**
 * Format expected by LLM multi-turn chat history
 */
export interface IAIChatHistoryItem {
  role: "user" | "model";
  parts: string;
}

/**
 * Payload sent to POST /api/v1/ai/chat/stream or POST /api/v1/ai/chat
 */
export interface IAIChatStreamPayload {
  query: string;
  history?: IAIChatHistoryItem[];
}

// ------------------------------------------------------------------------------
// 2. Doctor Recommendations & RAG Metadata
// ------------------------------------------------------------------------------

export interface IAIRecommendedDoctor {
  doctorId: string;
  name: string;
  specialties: string;
  appointmentFee: number;
  rating?: number;
  profileImage?: string;
  designation?: string;
  hospital?: string;
}

export type AIRAGSourceType =
  | "DOCTOR"
  | "SPECIALTY"
  | "POLICY"
  | "GUIDELINE"
  | string;

export interface IAIRAGSource {
  id: string;
  sourceType: AIRAGSourceType;
  sourceLabel: string;
  similarity: number;
}

/**
 * Metadata delivered in the final SSE "done" event or non-streaming JSON
 */
export interface IAIStreamDoneMetadata {
  isEmergency: boolean;
  suggestedSpecialties: string[];
  recommendedDoctors: IAIRecommendedDoctor[];
  sources?: IAIRAGSource[];
}

// ------------------------------------------------------------------------------
// 3. Server-Sent Events (SSE) Stream Payloads (Discriminated Union)
// ------------------------------------------------------------------------------

export interface IAIStreamTokenEvent {
  type: "token";
  text: string;
}

export interface IAIStreamDoneEvent {
  type: "done";
  data: IAIStreamDoneMetadata;
}

export interface IAIStreamErrorEvent {
  type: "error";
  message: string;
}

export type AIStreamEvent =
  | IAIStreamTokenEvent
  | IAIStreamDoneEvent
  | IAIStreamErrorEvent;

// ------------------------------------------------------------------------------
// 4. Non-Streaming Response Contract (POST /api/v1/ai/chat)
// ------------------------------------------------------------------------------

export interface IAINonStreamingResponseData {
  answer: string;
  isEmergency: boolean;
  suggestedSpecialties: string[];
  recommendedDoctors: IAIRecommendedDoctor[];
  sources?: IAIRAGSource[];
}

// ------------------------------------------------------------------------------
// 5. AI Agent Tools Contracts
// ------------------------------------------------------------------------------

/** Tool 1: Doctor Schedule Availability Check (POST /api/v1/ai/tools/check-availability) */
export interface IAIAvailabilityPayload {
  doctorName?: string;
  specialtyTitle?: string;
}

export interface IAIScheduleSlot {
  scheduleId: string;
  startDateTime: string;
  endDateTime: string;
  isBooked?: boolean;
}

export interface IAIAvailableDoctor {
  doctorId: string;
  name: string;
  appointmentFee: number;
  availableSlots: IAIScheduleSlot[];
}

export interface IAIAvailabilityResponseData {
  doctors: IAIAvailableDoctor[];
}

/** Tool 2: Hospital Pay Later & Payment Policy (GET /api/v1/ai/tools/payment-policy) */
export interface IAIPaymentPolicyData {
  policyName: string;
  isCashSupportedAtHospitalCounter: boolean;
  rules: string[];
}

/** Tool 3: Hold Slot under Pay Later Policy (POST /api/v1/ai/tools/hold-slot) */
export interface IAIHoldSlotPayload {
  doctorId: string;
  scheduleId: string;
}

export interface IAIHoldSlotResult {
  appointmentId: string;
  doctorName: string;
  appointmentFee: number;
  scheduleTime: string;
  paymentStatus: "UNPAID" | "PAID" | string;
  warning: string;
}

/** Admin Tool: Knowledge Base Statistics (GET /api/v1/ai/stats) */
export interface IAIKnowledgeStats {
  totalVectors?: number;
  totalDocuments?: number;
  activeIndexes?: number;
  categories?: Record<string, number>;
  lastSyncedAt?: string;
  vectorStoreStatus?: string;
  dimensions?: number;
  embeddingModel?: string;
  [key: string]: any;
}

// ------------------------------------------------------------------------------
// 6. UI Chat Message Model (State in React Components)
// ------------------------------------------------------------------------------

export interface IChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: Date | string;
  isStreaming?: boolean;
  isEmergency?: boolean;
  suggestedSpecialties?: string[];
  recommendedDoctors?: IAIRecommendedDoctor[];
  sources?: IAIRAGSource[];
  error?: string;
}

// ------------------------------------------------------------------------------
// 7. Chat Conversation Session Model (ChatGPT / Gemini Multi-Session History)
// ------------------------------------------------------------------------------

export interface IChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: IChatMessage[];
}
