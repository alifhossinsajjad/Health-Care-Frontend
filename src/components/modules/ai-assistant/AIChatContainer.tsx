"use client";

import React, { useRef, useEffect, useState } from "react";
import { useAIChatStream } from "@/src/hooks/useAIChatStream";
import { AIChatHeader } from "./AIChatHeader";
import { AIMessageBubble } from "./AIMessageBubble";
import { AIChatInput } from "./AIChatInput";
import { AIChatHistoryDrawer } from "./AIChatHistoryDrawer";

interface AIChatContainerProps {
  onClose?: () => void;
  className?: string;
}

export function AIChatContainer({ onClose, className = "" }: AIChatContainerProps) {
  const {
    activeSessionId,
    activeSessionTitle,
    messages,
    isStreaming,
    error,
    sessions,
    sendMessage,
    stopStreaming,
    clearChat,
    createNewSession,
    switchSession,
    deleteSession,
    clearAllSessions,
  } = useAIChatStream();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest message or active streaming token
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  return (
    <div
      className={`relative flex flex-col h-full w-full bg-white dark:bg-zinc-950 overflow-hidden ${className}`}
    >
      {/* 1. Slide-over Chat History Drawer (ChatGPT / Gemini / Claude Style) */}
      <AIChatHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={switchSession}
        onNewChat={createNewSession}
        onDeleteSession={deleteSession}
        onClearAll={clearAllSessions}
      />

      {/* 2. Top Header with History Hamburger, Title, and Actions */}
      <AIChatHeader
        onClearChat={clearChat}
        onNewChat={createNewSession}
        onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
        onClose={onClose}
        isStreaming={isStreaming}
        activeSessionTitle={activeSessionTitle}
        hasHistory={sessions.length > 0}
      />

      {/* 3. Messages Viewport */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-3 space-y-2">
        {messages.map((message) => (
          <AIMessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {/* Global Error Banner if not attached to message */}
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs text-center animate-in fade-in">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Input Footer with Multi-device Scrollable Suggestions */}
      <div className="p-2.5 sm:p-3 border-t border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm">
        <AIChatInput
          onSendMessage={sendMessage}
          onStopStreaming={stopStreaming}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
