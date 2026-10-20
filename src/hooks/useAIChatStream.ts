"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { aiService } from "@/src/services/ai.service";
import {
  IChatMessage,
  IAIChatHistoryItem,
  IAIStreamDoneMetadata,
  IAIHoldSlotResult,
} from "@/src/types/ai.type";

const STORAGE_KEY = "healthcare_ai_chat_history";

const INITIAL_GREETING: IChatMessage = {
  id: "greeting-0",
  sender: "ai",
  text: "Hello! I am your HealthCare Clinical AI Assistant. You can describe your symptoms, ask for specialist recommendations, verify doctor schedule availability, or learn about our online payment policies. How can I assist your health today?",
  timestamp: new Date().toISOString(),
};

export interface UseAIChatStreamReturn {
  messages: IChatMessage[];
  isStreaming: boolean;
  streamingMessageId: string | null;
  error: string | null;
  sendMessage: (query: string) => Promise<void>;
  stopStreaming: () => void;
  clearChat: () => void;
  holdDoctorSlot: (doctorId: string, scheduleId: string) => Promise<IAIHoldSlotResult | null>;
}

/**
 * ==============================================================================
 * useAIChatStream — Enterprise Headless Chat & SSE Streaming Hook
 * ==============================================================================
 * Encapsulates:
 * 1. Token-by-token accumulator for ChatGPT-like live rendering
 * 2. Multi-turn chat history formatting for Gemini LLM API
 * 3. Clinical metadata tracking (Emergency beacons, recommended doctors, RAG sources)
 * 4. Graceful stream abortion (Stop Generating)
 * 5. Safe client-side session persistence
 */
export function useAIChatStream(): UseAIChatStreamReturn {
  const [messages, setMessages] = useState<IChatMessage[]>([INITIAL_GREETING]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // ----------------------------------------------------------------------------
  // 1. Session Persistence (Hydrate from sessionStorage on client mount)
  // ----------------------------------------------------------------------------
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Fallback silently if sessionStorage is unavailable
    }
  }, []);

  // Save conversation state whenever messages change and not actively streaming
  useEffect(() => {
    if (!isStreaming && messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // Ignore quota exceeded errors
      }
    }
  }, [messages, isStreaming]);

  // Clean up running stream on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ----------------------------------------------------------------------------
  // 2. Stop Streaming Action
  // ----------------------------------------------------------------------------
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setStreamingMessageId(null);
  }, []);

  // ----------------------------------------------------------------------------
  // 3. Clear Chat Action
  // ----------------------------------------------------------------------------
  const clearChat = useCallback(() => {
    stopStreaming();
    setMessages([
      {
        ...INITIAL_GREETING,
        id: `greeting-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setError(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, [stopStreaming]);

  // ----------------------------------------------------------------------------
  // 4. Send Message & Handle SSE Streaming
  // ----------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query || isStreaming) return;

      setError(null);

      // 1. Construct User Message
      const userMessage: IChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: query,
        timestamp: new Date().toISOString(),
      };

      // 2. Construct AI Placeholder Message (for live token accumulation)
      const aiMessageId = `ai-${Date.now()}`;
      const placeholderAiMessage: IChatMessage = {
        id: aiMessageId,
        sender: "ai",
        text: "",
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };

      // Optimistically push both into messages list
      setMessages((prev) => [...prev, userMessage, placeholderAiMessage]);
      setIsStreaming(true);
      setStreamingMessageId(aiMessageId);

      // 3. Prepare Multi-turn Chat History for LLM Context
      const historyPayload: IAIChatHistoryItem[] = messages
        .filter((msg) => msg.id !== "greeting-0" && !msg.error && msg.text.trim())
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: msg.text,
        }));

      // 4. Initialize AbortController
      const controller = new AbortController();
      abortControllerRef.current = controller;

      let accumulatedText = "";

      await aiService.streamAIChat({
        payload: {
          query,
          history: historyPayload,
        },
        signal: controller.signal,
        onToken: (token: string) => {
          accumulatedText += token;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, text: accumulatedText, isStreaming: true }
                : msg,
            ),
          );
        },
        onDone: (doneData: IAIStreamDoneMetadata) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    text: accumulatedText || msg.text,
                    isStreaming: false,
                    isEmergency: doneData.isEmergency,
                    suggestedSpecialties: doneData.suggestedSpecialties,
                    recommendedDoctors: doneData.recommendedDoctors,
                    sources: doneData.sources,
                  }
                : msg,
            ),
          );
          setIsStreaming(false);
          setStreamingMessageId(null);
          abortControllerRef.current = null;
        },
        onError: (errMessage: string) => {
          setError(errMessage);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    text: accumulatedText || "I encountered an issue processing your request.",
                    isStreaming: false,
                    error: errMessage,
                  }
                : msg,
            ),
          );
          setIsStreaming(false);
          setStreamingMessageId(null);
          abortControllerRef.current = null;
        },
      });
    },
    [isStreaming, messages],
  );

  // ----------------------------------------------------------------------------
  // 5. Tool Action: Quick Slot Hold (Direct from Chat)
  // ----------------------------------------------------------------------------
  const holdDoctorSlot = useCallback(
    async (
      doctorId: string,
      scheduleId: string,
    ): Promise<IAIHoldSlotResult | null> => {
      try {
        const response = await aiService.holdSlotWithAI({ doctorId, scheduleId });
        if (response.success && response.data) {
          // Push confirmation message into the chat
          const confirmationMsg: IChatMessage = {
            id: `system-${Date.now()}`,
            sender: "system",
            text: `Appointment slot reserved for ${response.data.doctorName}! ${response.data.warning}`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, confirmationMsg]);
          return response.data;
        } else {
          setError(response.message || "Could not reserve slot.");
          return null;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error reserving slot.";
        setError(msg);
        return null;
      }
    },
    [],
  );

  return {
    messages,
    isStreaming,
    streamingMessageId,
    error,
    sendMessage,
    stopStreaming,
    clearChat,
    holdDoctorSlot,
  };
}
