"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, CheckCheck, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { IChatMessage, ChatMessageType } from "@/src/types/chat.type";
import { ChatMessageBubble } from "./chat/ChatMessageBubble";
import { ChatInputBar } from "./chat/ChatInputBar";

interface ConsultationChatPanelProps {
  messages: IChatMessage[];
  currentUserId: string;
  partnerName: string;
  partnerPhoto?: string | null;
  partnerRole: string;
  isPeerOnline: boolean;
  isPeerTyping: boolean;
  peerTypingUser: string;
  isUploading: boolean;
  onSendMessage: (content: string, type?: ChatMessageType, attachmentUrl?: string | null) => void;
  onSendTyping: (isTyping: boolean) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onUploadAttachment: (file: File) => Promise<void>;
  onMarkAsRead: () => void;
}

export function ConsultationChatPanel({
  messages,
  currentUserId,
  partnerName,
  partnerPhoto,
  partnerRole,
  isPeerOnline,
  isPeerTyping,
  peerTypingUser,
  isUploading,
  onSendMessage,
  onSendTyping,
  onEditMessage,
  onDeleteMessage,
  onUploadAttachment,
  onMarkAsRead,
}: ConsultationChatPanelProps) {
  const [editingMessage, setEditingMessage] = useState<IChatMessage | null>(null);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isUserScrolledUpRef = useRef<boolean>(false);

  // Auto-scroll handler
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    isUserScrolledUpRef.current = scrollHeight - (scrollTop + clientHeight) > 100;
  };

  useEffect(() => {
    if (!isUserScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isPeerTyping]);

  useEffect(() => {
    const hasUnread = messages.some((m) => !m.isRead && m.senderId !== currentUserId);
    if (hasUnread) {
      onMarkAsRead();
    }
  }, [messages, currentUserId, onMarkAsRead]);

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950/50 border-l border-zinc-200/90 dark:border-zinc-800 relative overflow-hidden select-none">
      {/* 1. Header with Partner Status */}
      <div className="h-14 px-4 bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <Avatar className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700">
              <AvatarImage src={partnerPhoto || ""} alt={partnerName} />
              <AvatarFallback className="bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                {partnerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ring-2 ring-white dark:ring-zinc-900 ${
                isPeerOnline ? "bg-emerald-500" : "bg-zinc-400"
              }`}
            />
          </div>

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
              {partnerName}
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {isPeerTyping ? (
                <span className="text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
                  {peerTypingUser || partnerName} is typing...
                </span>
              ) : isPeerOnline ? (
                "Online • Direct Telehealth Chat"
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-900/50">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Encrypted</span>
        </div>
      </div>

      {/* 2. Message History Viewport */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-center p-6">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 mb-2">
              <CheckCheck className="h-6 w-6 text-zinc-400" />
            </div>
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Encrypted Consultation Chat
            </p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-xs">
              Messages and shared clinical reports in this room are end-to-end encrypted and visible only to you and {partnerName}.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              isMe={msg.senderId === currentUserId}
              activeMenuMessageId={activeMenuMessageId}
              onToggleMenu={setActiveMenuMessageId}
              onStartEditing={setEditingMessage}
              onDeleteMessage={onDeleteMessage}
              onPreviewImage={setPreviewImageUrl}
            />
          ))
        )}

        {/* Typing indicator bubble */}
        {isPeerTyping && (
          <div className="flex items-center gap-1.5 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3 py-2 text-xs text-zinc-500 flex items-center gap-1 shadow-2xs">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {peerTypingUser || partnerName}
              </span>
              <span>is typing</span>
              <span className="flex gap-0.5 ml-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Bottom Chat Input Bar */}
      <ChatInputBar
        isUploading={isUploading}
        editingMessageId={editingMessage?.id || null}
        editingText={editingMessage?.content || ""}
        onSendText={(text) => onSendMessage(text, "TEXT")}
        onSaveEdit={(text) => {
          if (editingMessage) onEditMessage(editingMessage.id, text);
          setEditingMessage(null);
        }}
        onCancelEdit={() => setEditingMessage(null)}
        onUploadFile={onUploadAttachment}
        onTyping={onSendTyping}
      />

      {/* 4. Image Preview Lightbox */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <button
              type="button"
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewImageUrl}
              alt="Expanded preview"
              className="max-h-[85vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
