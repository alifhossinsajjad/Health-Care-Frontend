"use client";

import React, { useRef, useEffect } from "react";
import { useAIChatStream } from "@/src/hooks/useAIChatStream";
import { AIChatHeader } from "./AIChatHeader";
import { AIMessageBubble } from "./AIMessageBubble";
import { AIChatInput } from "./AIChatInput";

interface AIChatContainerProps {
  onClose?: () => void;
  className?: string;
}

export function AIChatContainer({ onClose, className = "" }: AIChatContainerProps) {
  const {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
    clearChat,
  } = useAIChatStream();

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
      className={`flex flex-col h-full w-full bg-white dark:bg-zinc-950 overflow-hidden ${className}`}
    >
      {/* 1. Header */}
      <AIChatHeader
        onClearChat={clearChat}
        onClose={onClose}
        isStreaming={isStreaming}
      />

      {/* 2. Messages Viewport */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map((message) => (
          <AIMessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {/* Global Error Banner if not attached to message */}
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Footer */}
      <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm">
        <AIChatInput
          onSendMessage={sendMessage}
          onStopStreaming={stopStreaming}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
