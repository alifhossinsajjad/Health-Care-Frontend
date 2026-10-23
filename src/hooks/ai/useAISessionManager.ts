"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IChatMessage, IChatSession } from "@/src/types/ai.type";

export const SESSIONS_STORAGE_KEY = "healthcare_ai_chat_sessions_v2";
export const ACTIVE_SESSION_ID_KEY = "healthcare_ai_active_session_id_v2";

export const createInitialGreeting = (): IChatMessage => ({
  id: `greeting-${Date.now()}`,
  sender: "ai",
  text: "Hello! I am your HealthCare Clinical AI Assistant. You can describe your symptoms, ask for specialist recommendations, verify doctor schedule availability, or learn about our online payment policies. How can I assist your health today?",
  timestamp: new Date().toISOString(),
});

export const createDefaultSession = (): IChatSession => {
  const now = new Date().toISOString();
  return {
    id: `session-${Date.now()}`,
    title: "New Health Consultation",
    createdAt: now,
    updatedAt: now,
    messages: [createInitialGreeting()],
  };
};

export function useAISessionManager() {
  const [sessions, setSessions] = useState<IChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const isHydratedRef = useRef<boolean>(false);

  // Hydrate sessions from localStorage on mount
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
      // Fallback silently if storage unavailable
    }

    const initial = createDefaultSession();
    setSessions([initial]);
    setActiveSessionId(initial.id);
    isHydratedRef.current = true;
  }, []);

  // Sync sessions to localStorage on change
  useEffect(() => {
    if (!isHydratedRef.current || sessions.length === 0) return;
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      localStorage.setItem(ACTIVE_SESSION_ID_KEY, activeSessionId);
    } catch {
      // Quota exceeded guard
    }
  }, [sessions, activeSessionId]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];
  const activeSessionTitle = activeSession?.title || "Health Consultation";

  const createNewSession = useCallback(() => {
    if (activeSession && activeSession.messages.length === 1 && activeSession.messages[0].sender === "ai") {
      return;
    }
    const fresh = createDefaultSession();
    setSessions((prev) => [fresh, ...prev]);
    setActiveSessionId(fresh.id);
  }, [activeSession]);

  const switchSession = useCallback((sessionId: string) => {
    if (sessionId !== activeSessionId) setActiveSessionId(sessionId);
  }, [activeSessionId]);

  const deleteSession = useCallback((sessionId: string) => {
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
  }, [activeSessionId]);

  const clearAllSessions = useCallback(() => {
    const fresh = createDefaultSession();
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
    try {
      localStorage.removeItem(SESSIONS_STORAGE_KEY);
      localStorage.setItem(ACTIVE_SESSION_ID_KEY, fresh.id);
    } catch {}
  }, []);

  const clearChat = useCallback(() => {
    const greeting = createInitialGreeting();
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, title: "New Health Consultation", updatedAt: new Date().toISOString(), messages: [greeting] }
          : s
      )
    );
  }, [activeSessionId]);

  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle.trim() } : s))
    );
  }, []);

  const appendMessages = useCallback((newMessages: IChatMessage[], newTitle?: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: newTitle || s.title,
              updatedAt: new Date().toISOString(),
              messages: [...s.messages, ...newMessages],
            }
          : s
      )
    );
  }, [activeSessionId]);

  const updateAiMessage = useCallback((messageId: string, partial: Partial<IChatMessage>) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              updatedAt: new Date().toISOString(),
              messages: s.messages.map((m) => (m.id === messageId ? { ...m, ...partial } : m)),
            }
          : s
      )
    );
  }, [activeSessionId]);

  return {
    sessions,
    setSessions,
    activeSessionId,
    activeSession,
    activeSessionTitle,
    messages,
    createNewSession,
    switchSession,
    deleteSession,
    clearAllSessions,
    clearChat,
    renameSession,
    appendMessages,
    updateAiMessage,
  };
}
