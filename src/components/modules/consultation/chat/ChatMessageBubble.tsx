"use client";

import React from "react";
import {
  FileText,
  Download,
  Check,
  CheckCheck,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Mic,
} from "lucide-react";
import { IChatMessage } from "@/src/types/chat.type";
import { VoiceNotePlayer } from "./VoiceNotePlayer";

interface ChatMessageBubbleProps {
  message: IChatMessage;
  isMe: boolean;
  activeMenuMessageId: string | null;
  onToggleMenu: (id: string | null) => void;
  onStartEditing: (message: IChatMessage) => void;
  onDeleteMessage: (id: string) => void;
  onPreviewImage: (url: string) => void;
}

export function ChatMessageBubble({
  message,
  isMe,
  activeMenuMessageId,
  onToggleMenu,
  onStartEditing,
  onDeleteMessage,
  onPreviewImage,
}: ChatMessageBubbleProps) {
  const isDeleted = message.isDeleted;
  const contentText = message.content || (message as any).message || (message as any).text || "";

  // Helper to suppress raw technical file names from appearing as captions
  const isRawAttachmentName = (text: string) => {
    if (!text) return true;
    return (
      text === "Voice Note" ||
      text.startsWith("voice-note-") ||
      text.startsWith("download") ||
      /^(voice-note-|download|\S+\.(png|jpe?g|webp|gif|webm|m4a|mp4|ogg|wav)$)/i.test(text.trim())
    );
  };

  const formatMessageTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className={`group relative flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      <div className="relative max-w-[85%] sm:max-w-[75%] flex items-start gap-1">
        {/* Sender Actions Menu */}
        {isMe && !isDeleted && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-center pr-1">
            <button
              type="button"
              onClick={() => onToggleMenu(activeMenuMessageId === message.id ? null : message.id)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              title="Message actions"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>

            {activeMenuMessageId === message.id && (
              <div className="absolute right-full mr-1 top-0 z-30 w-32 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-1 text-xs space-y-0.5 animate-in fade-in">
                <button
                  type="button"
                  onClick={() => onStartEditing(message)}
                  className="w-full px-2 py-1.5 rounded-lg flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-left"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteMessage(message.id);
                    onToggleMenu(null);
                  }}
                  className="w-full px-2 py-1.5 rounded-lg flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-left"
                >
                  <Trash2 className="h-3 w-3" /> Unsend
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(contentText);
                    onToggleMenu(null);
                  }}
                  className="w-full px-2 py-1.5 rounded-lg flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-left"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bubble Box */}
        <div
          className={`rounded-2xl px-3.5 py-2.5 shadow-2xs text-xs sm:text-sm ${
            isDeleted
              ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 italic border border-zinc-200/60 dark:border-zinc-800"
              : isMe
              ? "bg-blue-600 text-white rounded-br-xs"
              : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-800 rounded-bl-xs"
          }`}
        >
          {/* Image Attachment */}
          {message.messageType === "IMAGE" && message.attachmentUrl && !isDeleted && (
            <div className="mb-2 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
              <img
                src={message.attachmentUrl}
                alt="Medical report attachment"
                onClick={() => onPreviewImage(message.attachmentUrl!)}
                className="max-h-56 w-auto object-cover rounded-xl"
              />
            </div>
          )}

          {/* Document Attachment */}
          {message.messageType === "DOCUMENT" && message.attachmentUrl && !isDeleted && (
            <a
              href={message.attachmentUrl}
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
                  {contentText || "Clinical Report PDF"}
                </p>
                <span className="text-[10px] opacity-75">Click to view / download</span>
              </div>
              <Download className="h-4 w-4 shrink-0 opacity-80" />
            </a>
          )}

          {/* Voice Note Attachment */}
          {message.messageType === "AUDIO" && message.attachmentUrl && !isDeleted && (
            <div className={`mb-1 p-2 rounded-2xl ${isMe ? "bg-blue-700/40" : "bg-zinc-100 dark:bg-zinc-800/80"}`}>
              <VoiceNotePlayer audioUrl={message.attachmentUrl} isMe={isMe} />
            </div>
          )}

          {/* Text Content (Hides raw filenames) */}
          {Boolean(contentText) &&
            !((message.messageType === "AUDIO" || (message.messageType === "IMAGE" && message.attachmentUrl)) &&
              isRawAttachmentName(contentText)) && (
              <p className="leading-relaxed whitespace-pre-wrap break-words">{contentText}</p>
            )}

          {/* Timestamp and Checkmarks */}
          <div
            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
              isMe ? "text-blue-100/90" : "text-zinc-400"
            }`}
          >
            {message.isEdited && <span className="italic mr-0.5">(edited)</span>}
            <span>{formatMessageTime(message.createdAt)}</span>

            {isMe && !isDeleted && (
              <span className="inline-flex ml-0.5">
                {message.status === "SENDING" ? (
                  <span title="Sending..."><Clock className="h-2.5 w-2.5 opacity-75 animate-spin" /></span>
                ) : message.isRead ? (
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
}
