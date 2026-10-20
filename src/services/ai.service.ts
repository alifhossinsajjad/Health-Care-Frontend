import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import { ApiResponse } from "@/src/types/api.type";
import {
  IAIChatStreamPayload,
  IAIStreamDoneMetadata,
  IAINonStreamingResponseData,
  IAIAvailabilityPayload,
  IAIAvailabilityResponseData,
  IAIPaymentPolicyData,
  IAIHoldSlotPayload,
  IAIHoldSlotResult,
  IAIKnowledgeStats,
  AIStreamEvent,
} from "@/src/types/ai.type";

export interface IStreamAIChatOptions {
  payload: IAIChatStreamPayload;
  onToken: (token: string) => void;
  onDone: (data: IAIStreamDoneMetadata) => void;
  onError?: (errorMessage: string) => void;
  signal?: AbortSignal;
}

/**
 * ==============================================================================
 * Hospital AI Healthcare Assistant — Service Layer
 * ==============================================================================
 * Production-grade integration supporting:
 * - Real-Time Server-Sent Events (SSE) token-by-token streaming with buffer reassembly
 * - AbortController cancellation (Stop Generating)
 * - Agent Tool Execution (Doctor availability, payment policy, and slot hold)
 */
export const aiService = {
  /**
   * Primary Chat: Real-time token streaming with SSE
   * Handles chunk boundary fragmentation and parses "token", "done", and "error" events.
   */
  streamAIChat: async ({
    payload,
    onToken,
    onDone,
    onError,
    signal,
  }: IStreamAIChatOptions): Promise<void> => {
    try {
      const accessToken = await getAuthToken();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        credentials: "include",
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let message = `Server responded with HTTP ${response.status}`;
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.message) message = parsed.message;
        } catch {
          // Use default HTTP status message
        }
        onError?.(message);
        return;
      }

      if (!response.body) {
        onError?.("ReadableStream is not supported or response body is empty.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        if (signal?.aborted) {
          await reader.cancel();
          break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        // Decode new chunk and append to buffer
        buffer += decoder.decode(value, { stream: true });

        // Split buffer by double newline (SSE standard boundary)
        const parts = buffer.split("\n\n");
        // Keep the last partial line in the buffer
        buffer = parts.pop() || "";

        for (const part of parts) {
          const lines = part.split("\n");
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data:")) continue;

            const jsonStr = trimmedLine.replace(/^data:\s*/, "");
            if (!jsonStr) continue;

            try {
              const eventData: AIStreamEvent = JSON.parse(jsonStr);

              if (eventData.type === "token") {
                onToken(eventData.text);
              } else if (eventData.type === "done") {
                onDone(eventData.data);
              } else if (eventData.type === "error") {
                onError?.(
                  eventData.message ||
                    "An error occurred during AI generation.",
                );
              }
            } catch (parseErr) {
              console.warn(
                "Failed to parse SSE line chunk:",
                jsonStr,
                parseErr,
              );
            }
          }
        }
      }

      // Flush any remaining line in buffer
      if (buffer.trim().startsWith("data:")) {
        try {
          const jsonStr = buffer.trim().replace(/^data:\s*/, "");
          const eventData: AIStreamEvent = JSON.parse(jsonStr);
          if (eventData.type === "token") onToken(eventData.text);
          else if (eventData.type === "done") onDone(eventData.data);
        } catch {
          // Ignore incomplete trailing fragment
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        // User aborted the stream intentionally (Stop Generating)
        return;
      }
      const message =
        err instanceof Error
          ? err.message
          : "Network error during AI streaming.";
      onError?.(message);
    }
  },

  /**
   * Fallback Chat: Non-Streaming JSON Response
   * Useful when streaming is disabled or for simple one-off triage queries.
   */
  sendNonStreamingAIChat: async (
    payload: IAIChatStreamPayload,
  ): Promise<ApiResponse<IAINonStreamingResponseData>> => {
    try {
      const accessToken = await getAuthToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        credentials: "include",
      });

      return await res.json();
    } catch (err: unknown) {
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to generate AI response.",
      };
    }
  },

  /**
   * Agent Tool 1: Check Doctor Schedule Availability
   */
  checkDoctorAvailability: async (
    payload: IAIAvailabilityPayload = {},
  ): Promise<ApiResponse<IAIAvailabilityResponseData>> => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/tools/check-availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      return await res.json();
    } catch (err: unknown) {
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to fetch doctor availability.",
      };
    }
  },

  /**
   * Agent Tool 2: Get Hospital Pay Later & Payment Policies
   */
  getPaymentPolicy: async (): Promise<ApiResponse<IAIPaymentPolicyData>> => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/tools/payment-policy`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      return await res.json();
    } catch (err: unknown) {
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to retrieve hospital payment policy.",
      };
    }
  },

  /**
   * Agent Tool 3: Hold Appointment Slot under Pay Later Policy
   * Requires Authenticated Patient access token.
   */
  holdSlotWithAI: async (
    payload: IAIHoldSlotPayload,
  ): Promise<ApiResponse<IAIHoldSlotResult>> => {
    try {
      const accessToken = await getAuthToken();
      if (!accessToken) {
        return {
          success: false,
          message: "Please sign in to reserve an appointment slot.",
        };
      }

      const res = await fetch(`${API_BASE_URL}/ai/tools/hold-slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      return await res.json();
    } catch (err: unknown) {
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to reserve appointment slot.",
      };
    }
  },

  /**
   * Admin Tool: Sync Vector Knowledge Base (Embeddings refresh)
   */
  syncAIKnowledgeBase: async (): Promise<ApiResponse<{ message: string }>> => {
    try {
      const accessToken = await getAuthToken();
      const res = await fetch(`${API_BASE_URL}/ai/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      return await res.json();
    } catch (err: unknown) {
      return {
        success: false,
        message:
          err instanceof Error ? err.message : "Knowledge base sync failed.",
      };
    }
  },

  /**
   * Admin Tool: Get Knowledge Base Statistics
   */
  getAIKnowledgeStats: async (): Promise<ApiResponse<IAIKnowledgeStats>> => {
    try {
      const accessToken = await getAuthToken();
      const res = await fetch(`${API_BASE_URL}/ai/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      return await res.json();
    } catch (err: unknown) {
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to fetch AI knowledge statistics.",
      };
    }
  },
};
