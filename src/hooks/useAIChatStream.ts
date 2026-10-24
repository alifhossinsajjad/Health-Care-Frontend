"use client";

import { useCallback } from "react";
import { aiService } from "@/src/services/ai.service";
import { useAISessionManager } from "@/src/hooks/ai/useAISessionManager";
import { useAIStreamReader } from "@/src/hooks/ai/useAIStreamReader";
import {
  IChatMessage,
  IChatSession,
  IAIChatHistoryItem,
  IAIHoldSlotResult,
} from "@/src/types/ai.type";
import { sanitizeAiErrorMessage } from "@/src/utils/aiErrorSanitizer";

export interface UseAIChatStreamReturn {
  activeSessionId: string;
  activeSessionTitle: string;
  messages: IChatMessage[];
  isStreaming: boolean;
  streamingMessageId: string | null;
  error: string | null;
  sessions: IChatSession[];
  sendMessage: (query: string) => Promise<void>;
  stopStreaming: () => void;
  clearChat: () => void;
  createNewSession: () => void;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  renameSession: (sessionId: string, newTitle: string) => void;
  holdDoctorSlot: (doctorId: string, scheduleId: string) => Promise<IAIHoldSlotResult | null>;
}

export function useAIChatStream(): UseAIChatStreamReturn {
  const {
    sessions,
    activeSessionId,
    activeSession,
    activeSessionTitle,
    messages,
    createNewSession: managerNewSession,
    switchSession: managerSwitchSession,
    deleteSession: managerDeleteSession,
    clearAllSessions: managerClearAll,
    clearChat: managerClearChat,
    renameSession,
    appendMessages,
    updateAiMessage,
  } = useAISessionManager();

  const {
    isStreaming,
    streamingMessageId,
    error,
    setError,
    stopStreaming,
    startStream,
  } = useAIStreamReader();

  const createNewSession = useCallback(() => {
    stopStreaming();
    setError(null);
    managerNewSession();
  }, [stopStreaming, setError, managerNewSession]);

  const switchSession = useCallback((sessionId: string) => {
    stopStreaming();
    setError(null);
    managerSwitchSession(sessionId);
  }, [stopStreaming, setError, managerSwitchSession]);

  const deleteSession = useCallback((sessionId: string) => {
    stopStreaming();
    managerDeleteSession(sessionId);
  }, [stopStreaming, managerDeleteSession]);

  const clearAllSessions = useCallback(() => {
    stopStreaming();
    setError(null);
    managerClearAll();
  }, [stopStreaming, setError, managerClearAll]);

  const clearChat = useCallback(() => {
    stopStreaming();
    setError(null);
    managerClearChat();
  }, [stopStreaming, setError, managerClearChat]);

  const sendMessage = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query || isStreaming || !activeSessionId) return;

      const userMsg: IChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: query,
        timestamp: new Date().toISOString(),
      };

      const aiMessageId = `ai-${Date.now()}`;
      const placeholderAiMsg: IChatMessage = {
        id: aiMessageId,
        sender: "ai",
        text: "",
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };

      const currentMessages = activeSession?.messages || [];
      const isFirst = !currentMessages.some((m) => m.sender === "user");
      const title = isFirst
        ? query.length > 36 ? `${query.substring(0, 36)}...` : query
        : activeSession?.title;

      appendMessages([userMsg, placeholderAiMsg], title);

      const history: IAIChatHistoryItem[] = currentMessages
        .filter((m) => !m.id.startsWith("greeting") && !m.error && m.text.trim())
        .map((m) => ({ role: m.sender === "user" ? "user" : "model", parts: m.text }));

      let accumulatedText = "";

      await startStream({
        query,
        history,
        messageId: aiMessageId,
        onToken: (token) => {
          accumulatedText += token;
          updateAiMessage(aiMessageId, { text: accumulatedText, isStreaming: true });
        },
        onDone: (data) => {
          updateAiMessage(aiMessageId, {
            text: accumulatedText,
            isStreaming: false,
            isEmergency: data.isEmergency,
            suggestedSpecialties: data.suggestedSpecialties,
            recommendedDoctors: data.recommendedDoctors,
            sources: data.sources,
          });
        },
        onError: (errMessage) => {
          updateAiMessage(aiMessageId, {
            text: accumulatedText || "Issue encountered.",
            isStreaming: false,
            error: sanitizeAiErrorMessage(errMessage),
          });
        },
      });
    },
    [activeSession, activeSessionId, isStreaming, appendMessages, updateAiMessage, startStream]
  );

  const holdDoctorSlot = useCallback(
    async (doctorId: string, scheduleId: string): Promise<IAIHoldSlotResult | null> => {
      try {
        const res = await aiService.holdSlotWithAI({ doctorId, scheduleId });
        if (res.success && res.data) {
          appendMessages([{
            id: `system-${Date.now()}`,
            sender: "system",
            text: `Appointment slot reserved for ${res.data.doctorName}! ${res.data.warning}`,
            timestamp: new Date().toISOString(),
          }]);
          return res.data;
        }
        setError(res.message || "Could not reserve slot.");
        return null;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error reserving slot.");
        return null;
      }
    },
    [appendMessages, setError]
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
