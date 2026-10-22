"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  FileText,
  Download,
  AlertCircle,
  ExternalLink,
  X,
  FileIcon,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { IChatMessage, ChatMessageType } from "@/src/types/chat.type";

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
  const [inputText, setInputText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isUserScrolledUpRef = useRef<boolean>(false);

  // ----------------------------------------------------------------------------
  // 1. Auto-scroll Logic (Only auto-scroll if user hasn't scrolled up)
  // ----------------------------------------------------------------------------
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // If distance from bottom is greater than 100px, consider user reading history
    isUserScrolledUpRef.current = scrollHeight - (scrollTop + clientHeight) > 100;
  };

  useEffect(() => {
    if (!isUserScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isPeerTyping]);

  // Mark messages as read on mount and when panel is focused
  useEffect(() => {
    onMarkAsRead();
  }, [messages.length, onMarkAsRead]);

  // ----------------------------------------------------------------------------
  // 2. Submit & Typing Handlers
  // ----------------------------------------------------------------------------
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    onSendTyping(e.target.value.trim().length > 0);

    // Auto-resize height up to 100px
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  };

  const handleSendOrSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (editingMessageId) {
      // Editing existing message
      onEditMessage(editingMessageId, inputText.trim());
      setEditingMessageId(null);
    } else {
      // Sending new message
      onSendMessage(inputText.trim(), "TEXT");
    }

    setInputText("");
    onSendTyping(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendOrSave();
    }
  };

  const startEditing = (msg: IChatMessage) => {
    setEditingMessageId(msg.id);
    setInputText(msg.content);
    setActiveMenuMessageId(null);
    textareaRef.current?.focus();
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setInputText("");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadAttachment(file);
      e.target.value = "";
    }
  };

  const formatMessageTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200/90 dark:border-zinc-800 overflow-hidden select-none">
      {/* ------------------------------------------------------------------------
          1. CHAT HEADER
          ------------------------------------------------------------------------ */}
      <div className="px-4 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative">
            <Avatar className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
              <AvatarImage src={partnerPhoto || ""} alt={partnerName} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs">
                {partnerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
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
                  {peerTypingUser} is typing...
                </span>
              ) : isPeerOnline ? (
                "Online • Direct Telehealth Chat"
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
          WhatsApp / Messenger UX
        </span>
      </div>

      {/* ------------------------------------------------------------------------
          2. MESSAGE HISTORY VIEWPORT
          ------------------------------------------------------------------------ */}
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
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            const isDeleted = msg.isDeleted;

            return (
              <div
                key={msg.id}
                className={`group relative flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {/* Bubble Container */}
                <div className="relative max-w-[85%] sm:max-w-[75%] flex items-start gap-1">
                  {/* Action Dropdown on Hover (Only for sender) */}
                  {isMe && !isDeleted && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-center pr-1">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuMessageId(
                            activeMenuMessageId === msg.id ? null : msg.id
                          )
                        }
                        className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        title="Message actions"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuMessageId === msg.id && (
                        <div className="absolute right-full mr-1 top-0 z-30 w-32 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-1 text-xs space-y-0.5 animate-in fade-in">
                          <button
                            type="button"
                            onClick={() => startEditing(msg)}
                            className="w-full px-2 py-1.5 rounded-lg flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-left"
                          >
                            <Edit2 className="h-3 w-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteMessage(msg.id);
                              setActiveMenuMessageId(null);
                            }}
                            className="w-full px-2 py-1.5 rounded-lg flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-left"
                          >
                            <Trash2 className="h-3 w-3" /> Unsend
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(msg.content);
                              setActiveMenuMessageId(null);
                            }}
                            className="w-full px-2 py-1.5 rounded-lg flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-left"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bubble Content */}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 shadow-2xs text-xs sm:text-sm ${
                      isDeleted
                        ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 italic border border-zinc-200/60 dark:border-zinc-800"
                        : isMe
                        ? "bg-blue-600 text-white rounded-br-xs"
                        : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-800 rounded-bl-xs"
                    }`}
                  >
                    {/* Attachment: Image Preview */}
                    {msg.messageType === "IMAGE" && msg.attachmentUrl && !isDeleted && (
                      <div className="mb-2 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
                        <img
                          src={msg.attachmentUrl}
                          alt="Medical report attachment"
                          onClick={() => setPreviewImageUrl(msg.attachmentUrl!)}
                          className="max-h-56 w-auto object-cover rounded-xl"
                        />
                      </div>
                    )}

                    {/* Attachment: PDF or Document Card */}
                    {msg.messageType === "DOCUMENT" && msg.attachmentUrl && !isDeleted && (
                      <a
                        href={msg.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl mb-2 transition-colors ${
                          isMe
                            ? "bg-blue-700/80 hover:bg-blue-700 text-white"
                            : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        <FileText className="h-6 w-6 shrink-0 text-red-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold truncate leading-tight">
                            {msg.content || "Clinical Report PDF"}
                          </p>
                          <span className="text-[10px] opacity-75">Click to view / download</span>
                        </div>
                        <Download className="h-4 w-4 shrink-0 opacity-80" />
                      </a>
                    )}

                    {/* Text Content */}
                    <p className="leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>

                    {/* Footer: Timestamp, Edited Tag & Seen Checkmarks */}
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isMe ? "text-blue-100/90" : "text-zinc-400"
                      }`}
                    >
                      {msg.isEdited && <span className="italic mr-0.5">(edited)</span>}
                      <span>{formatMessageTime(msg.createdAt)}</span>

                      {/* Status Checkmarks (WhatsApp Messenger Style) */}
                      {isMe && !isDeleted && (
                        <span className="inline-flex ml-0.5">
                          {msg.status === "SENDING" ? (
                            <span title="Sending..."><Clock className="h-2.5 w-2.5 opacity-75 animate-spin" /></span>
                          ) : msg.isRead ? (
                            <span title="Read / Seen"><CheckCheck className="h-3 w-3 text-cyan-200 stroke-[2.5]" /></span>
                          ) : (
                            <span title="Sent"><Check className="h-3 w-3 opacity-90 stroke-[2.5]" /></span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator bubble */}
        {isPeerTyping && (
          <div className="flex items-center gap-1.5 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3 py-2 text-xs text-zinc-500 flex items-center gap-1 shadow-2xs">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{peerTypingUser}</span>
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

      {/* ------------------------------------------------------------------------
          3. ATTACHMENT UPLOAD PROGRESS INDICATOR
          ------------------------------------------------------------------------ */}
      {isUploading && (
        <div className="px-4 py-1.5 bg-blue-50 dark:bg-blue-950/50 border-t border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 animate-spin" />
          <span>Uploading clinical attachment to Cloudinary...</span>
        </div>
      )}

      {/* ------------------------------------------------------------------------
          4. EDITING BAR BANNER
          ------------------------------------------------------------------------ */}
      {editingMessageId && (
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/50 border-t border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Edit2 className="h-3 w-3" /> Editing message...
          </span>
          <button
            type="button"
            onClick={cancelEditing}
            className="text-amber-600 hover:text-amber-900 dark:hover:text-amber-100 font-semibold"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------------
          5. BOTTOM CHAT INPUT BAR
          ------------------------------------------------------------------------ */}
      <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200/80 dark:border-zinc-800 shrink-0">
        <form onSubmit={handleSendOrSave} className="flex items-end gap-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,application/pdf,.doc,.docx"
            className="hidden"
          />

          {/* Attachment Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-9 w-9 rounded-xl text-zinc-500 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
            title="Attach clinical report or image (Max 10MB)"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={editingMessageId ? "Edit your message..." : "Type a message (Enter to send)..."}
            rows={1}
            className="flex-1 max-h-[100px] resize-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />

          {/* Send / Save Button */}
          <Button
            type="submit"
            size="icon"
            disabled={!inputText.trim() && !isUploading}
            className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs shrink-0 transition-transform active:scale-95 disabled:opacity-40"
            title={editingMessageId ? "Save edit" : "Send message"}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* ------------------------------------------------------------------------
          6. LIGHTBOX MODAL FOR IMAGE ATTACHMENTS
          ------------------------------------------------------------------------ */}
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
