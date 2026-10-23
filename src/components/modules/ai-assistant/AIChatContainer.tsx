"use client";

import React, { useRef, useEffect, useState } from "react";
import { useAIChatStream } from "@/src/hooks/useAIChatStream";
import { AIChatHeader } from "./AIChatHeader";
import { AIMessageBubble } from "./AIMessageBubble";
import { AIChatInput } from "./AIChatInput";
import { AIChatHistoryDrawer } from "./AIChatHistoryDrawer";
import { AIChatSidebar } from "./AIChatSidebar";
import { AIChatWelcomeHero } from "./AIChatWelcomeHero";

interface AIChatContainerProps {
  onClose?: () => void;
  className?: string;
  isFullPage?: boolean;
}

export function AIChatContainer({ onClose, className = "", isFullPage = false }: AIChatContainerProps) {
  const {
    activeSessionId, activeSessionTitle, messages, isStreaming, error, sessions,
    sendMessage, stopStreaming, clearChat, createNewSession, switchSession,
    deleteSession, clearAllSessions,
  } = useAIChatStream();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll ONLY the internal message container (NEVER scrolls browser window)
  const scrollToBottom = () => {
    if (messagesViewportRef.current) {
      messagesViewportRef.current.scrollTo({
        top: messagesViewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const hasOnlyGreeting = messages.length <= 1 && (!messages[0] || messages[0].sender === "ai");

  return (
    <div className={`relative flex h-full w-full bg-white dark:bg-zinc-950 overflow-hidden ${className}`}>
      {/* 1. Desktop Dockable Sidebar (Full Page Mode) */}
      {isFullPage && isSidebarOpen && (
        <div className="hidden lg:block h-full">
          <AIChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={switchSession}
            onNewChat={createNewSession}
            onDeleteSession={deleteSession}
            onClearAll={clearAllSessions}
          />
        </div>
      )}

      {/* 2. Mobile Slide-over Drawer */}
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

      {/* 3. Main Conversational Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <AIChatHeader
          onClearChat={clearChat}
          onNewChat={createNewSession}
          onToggleHistory={() => {
            if (isFullPage && window.innerWidth >= 1024) {
              setIsSidebarOpen((prev) => !prev);
            } else {
              setIsHistoryOpen((prev) => !prev);
            }
          }}
          onClose={onClose}
          isStreaming={isStreaming}
          activeSessionTitle={activeSessionTitle}
          hasHistory={sessions.length > 0}
        />

        {/* Messages Viewport (Scroll Container) */}
        <div
          ref={messagesViewportRef}
          className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 space-y-4"
        >
          <div className="max-w-3xl sm:max-w-4xl mx-auto w-full flex flex-col min-h-full">
            {hasOnlyGreeting ? (
              <AIChatWelcomeHero onSelectPrompt={sendMessage} />
            ) : (
              messages.map((message) => (
                <AIMessageBubble key={message.id} message={message} />
              ))
            )}

            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs text-center animate-in fade-in my-2">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Docked Input Area */}
        <div className="p-3 sm:p-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shrink-0">
          <div className="max-w-3xl sm:max-w-4xl mx-auto w-full">
            <AIChatInput
              onSendMessage={sendMessage}
              onStopStreaming={stopStreaming}
              isStreaming={isStreaming}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
