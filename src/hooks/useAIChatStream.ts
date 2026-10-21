"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { aiService } from "@/src/services/ai.service";
import {
  IChatMessage,
  IChatSession,
  IAIChatHistoryItem,
  IAIStreamDoneMetadata,
  IAIHoldSlotResult,
} from "@/src/types/ai.type";

const SESSIONS_STORAGE_KEY = "healthcare_ai_chat_sessions_v2";
const ACTIVE_SESSION_ID_KEY = "healthcare_ai_active_session_id_v2";

const createInitialGreeting = (): IChatMessage => ({
  id: `greeting-${Date.now()}`,
  sender: "ai",
  text: "Hello! I am your HealthCare Clinical AI Assistant. You can describe your symptoms, ask for specialist recommendations, verify doctor schedule availability, or learn about our online payment policies. How can I assist your health today?",
  timestamp: new Date().toISOString(),
});

const createDefaultSession = (): IChatSession => {
  const now = new Date().toISOString();
  return {
    id: `session-${Date.now()}`,
    title: "New Health Consultation",
    createdAt: now,
    updatedAt: now,
    messages: [createInitialGreeting()],
  };
};

export interface UseAIChatStreamReturn {
  // Active conversation state
  activeSessionId: string;
  activeSessionTitle: string;
  messages: IChatMessage[];
  isStreaming: boolean;
  streamingMessageId: string | null;
  error: string | null;

  // Multi-session history list (ChatGPT / Gemini / Claude style)
  sessions: IChatSession[];

  // Conversation control actions
  sendMessage: (query: string) => Promise<void>;
  stopStreaming: () => void;
  clearChat: () => void; // Clears active session messages
  createNewSession: () => void; // Starts a fresh conversation ("+ New Chat")
  switchSession: (sessionId: string) => void; // Switches to another past conversation
  deleteSession: (sessionId: string) => void; // Deletes a specific conversation
  clearAllSessions: () => void; // Clears all history
  renameSession: (sessionId: string, newTitle: string) => void;
  holdDoctorSlot: (doctorId: string, scheduleId: string) => Promise<IAIHoldSlotResult | null>;
}

/**
 * ==============================================================================
 * useAIChatStream — Enterprise Multi-Session Chat & SSE Streaming Hook
 * ==============================================================================
 * Features:
 * 1. ChatGPT/Gemini-style Multi-turn Conversation Sessions with persistent history
 * 2. Automatic smart session titling based on patient's initial query
 * 3. Real-time token streaming with AbortController cancellation
 * 4. Clinical Triage metadata tracking (Emergency alerts, doctor recommendations)
 * 5. Instant session switching, deletion, and new chat creation
 */
export function useAIChatStream(): UseAIChatStreamReturn {
  const [sessions, setSessions] = useState<IChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isHydratedRef = useRef<boolean>(false);

  // ----------------------------------------------------------------------------
  // 1. Session Persistence & Hydration (from localStorage)
  // ----------------------------------------------------------------------------
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_SESSION_ID_KEY);

      if (savedSessions) {
        const parsed: IChatSession[] = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          const activeExists = parsed.some((s) => s.id === savedActiveId);
          setActiveSessionId(activeExists ? (savedActiveId as string) : parsed[0].id);
          isHydratedRef.current = true;
          return;
        }
      }
    } catch {
      // Fallback silently if localStorage fails
    }

    // Initialize with a fresh default session if nothing saved
    const initialSession = createDefaultSession();
    setSessions([initialSession]);
    setActiveSessionId(initialSession.id);
    isHydratedRef.current = true;
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (!isHydratedRef.current || sessions.length === 0) return;
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      localStorage.setItem(ACTIVE_SESSION_ID_KEY, activeSessionId);
    } catch {
      // Ignore quota exceeded
    }
  }, [sessions, activeSessionId]);

  // Clean up running stream on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Get active session and its messages
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];
  const activeSessionTitle = activeSession?.title || "Health Consultation";

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
  // 3. Multi-Session Actions (New Chat, Switch, Delete, Clear All)
  // ----------------------------------------------------------------------------

  /** Start a brand new consultation session (like ChatGPT "+ New Chat") */
  const createNewSession = useCallback(() => {
    stopStreaming();
    setError(null);

    // If current session only has greeting and no user queries, reuse it
    if (
      activeSession &&
      activeSession.messages.length === 1 &&
      activeSession.messages[0].sender === "ai"
    ) {
      return;
    }

    const newSession = createDefaultSession();
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, [activeSession, stopStreaming]);

  /** Switch to a past conversation */
  const switchSession = useCallback(
    (sessionId: string) => {
      if (sessionId === activeSessionId) return;
      stopStreaming();
      setError(null);
      setActiveSessionId(sessionId);
    },
    [activeSessionId, stopStreaming],
  );

  /** Delete a specific conversation session */
  const deleteSession = useCallback(
    (sessionId: string) => {
      stopStreaming();
      setSessions((prev) => {
        const remaining = prev.filter((s) => s.id !== sessionId);
        if (remaining.length === 0) {
          const fresh = createDefaultSession();
          setActiveSessionId(fresh.id);
          return [fresh];
        }
        if (sessionId === activeSessionId) {
          setActiveSessionId(remaining[0].id);
        }
        return remaining;
      });
    },
    [activeSessionId, stopStreaming],
  );

  /** Clear all session history */
  const clearAllSessions = useCallback(() => {
    stopStreaming();
    const fresh = createDefaultSession();
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
    setError(null);
    try {
      localStorage.removeItem(SESSIONS_STORAGE_KEY);
      localStorage.setItem(ACTIVE_SESSION_ID_KEY, fresh.id);
    } catch {
      // Ignore
    }
  }, [stopStreaming]);

  /** Clear messages in currently active chat */
  const clearChat = useCallback(() => {
    stopStreaming();
    setError(null);
    const greeting = createInitialGreeting();
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: "New Health Consultation",
              updatedAt: new Date().toISOString(),
              messages: [greeting],
            }
          : s,
      ),
    );
  }, [activeSessionId, stopStreaming]);

  /** Rename a session */
  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle.trim() } : s)),
    );
  }, []);

  // ----------------------------------------------------------------------------
  // 4. Send Message & Handle SSE Streaming
  // ----------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query || isStreaming || !activeSessionId) return;

      setError(null);

      // 1. Construct User Message
      const userMessage: IChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: query,
        timestamp: new Date().toISOString(),
      };

      // 2. Construct AI Placeholder Message
      const aiMessageId = `ai-${Date.now()}`;
      const placeholderAiMessage: IChatMessage = {
        id: aiMessageId,
        sender: "ai",
        text: "",
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };

      // 3. Smart title generation: if first user message, update session title
      const currentMessages = activeSession?.messages || [];
      const isFirstUserQuery = !currentMessages.some((m) => m.sender === "user");
      const generatedTitle = isFirstUserQuery
        ? query.length > 36
          ? `${query.substring(0, 36)}...`
          : query
        : activeSession?.title || "Health Consultation";

      // Optimistically push into active session
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                title: generatedTitle,
                updatedAt: new Date().toISOString(),
                messages: [...s.messages, userMessage, placeholderAiMessage],
              }
            : s,
        ),
      );

      setIsStreaming(true);
      setStreamingMessageId(aiMessageId);

      // 4. Prepare Multi-turn Chat History for LLM Context
      const historyPayload: IAIChatHistoryItem[] = currentMessages
        .filter((msg) => !msg.id.startsWith("greeting") && !msg.error && msg.text.trim())
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: msg.text,
        }));

      // 5. Initialize AbortController
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
          setSessions((prev) =>
            prev.map((s) =>
              s.id === activeSessionId
                ? {
                    ...s,
                    messages: s.messages.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, text: accumulatedText, isStreaming: true }
                        : msg,
                    ),
                  }
                : s,
            ),
          );
        },
        onDone: (doneData: IAIStreamDoneMetadata) => {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === activeSessionId
                ? {
                    ...s,
                    updatedAt: new Date().toISOString(),
                    messages: s.messages.map((msg) =>
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
                  }
                : s,
            ),
          );
          setIsStreaming(false);
          setStreamingMessageId(null);
          abortControllerRef.current = null;
        },
        onError: (errMessage: string) => {
          setError(errMessage);
          setSessions((prev) =>
            prev.map((s) =>
              s.id === activeSessionId
                ? {
                    ...s,
                    messages: s.messages.map((msg) =>
                      msg.id === aiMessageId
                        ? {
                            ...msg,
                            text: accumulatedText || "I encountered an issue processing your request.",
                            isStreaming: false,
                            error: errMessage,
                          }
                        : msg,
                    ),
                  }
                : s,
            ),
          );
          setIsStreaming(false);
          setStreamingMessageId(null);
          abortControllerRef.current = null;
        },
      });
    },
    [activeSession, activeSessionId, isStreaming],
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
          const confirmationMsg: IChatMessage = {
            id: `system-${Date.now()}`,
            sender: "system",
            text: `Appointment slot reserved for ${response.data.doctorName}! ${response.data.warning}`,
            timestamp: new Date().toISOString(),
          };
          setSessions((prev) =>
            prev.map((s) =>
              s.id === activeSessionId
                ? { ...s, messages: [...s.messages, confirmationMsg] }
                : s,
            ),
          );
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
    [activeSessionId],
  );

  return {
    activeSessionId,
    activeSessionTitle,
    messages,
    isStreaming,
    streamingMessageId,
    error,
    sessions,
    sendMessage,
    stopStreaming,
    clearChat,
    createNewSession,
    switchSession,
    deleteSession,
    clearAllSessions,
    renameSession,
    holdDoctorSlot,
  };
}
