"use client";

import React, { useRef, useState, useEffect } from "react";
import { Send, Paperclip, Edit2, Loader2, Mic, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useVoiceRecorder } from "@/src/hooks/chat/useVoiceRecorder";
import { ActiveRecordingBar } from "./ActiveRecordingBar";

interface ChatInputBarProps {
  isUploading: boolean;
  editingMessageId: string | null;
  editingText: string;
  onSendText: (content: string) => void;
  onSaveEdit: (newContent: string) => void;
  onCancelEdit: () => void;
  onUploadFile: (file: File) => Promise<void>;
  onTyping: (isTyping: boolean) => void;
}

export function ChatInputBar({
  isUploading,
  editingMessageId,
  editingText,
  onSendText,
  onSaveEdit,
  onCancelEdit,
  onUploadFile,
  onTyping,
}: ChatInputBarProps) {
  const [inputText, setInputText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isRecording,
    formattedDuration,
    volumeLevel,
    isMicSilent,
    activeMicLabel,
    errorMessage,
    startRecording,
    stopAndSend,
    cancelRecording,
  } = useVoiceRecorder({
    onSendAudio: onUploadFile,
  });

  useEffect(() => {
    if (editingMessageId) {
      setInputText(editingText);
      textareaRef.current?.focus();
    } else {
      setInputText("");
    }
  }, [editingMessageId, editingText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

    onTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => onTyping(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    onTyping(false);

    if (editingMessageId) {
      onSaveEdit(inputText.trim());
    } else {
      onSendText(inputText.trim());
    }
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-t border-zinc-200/80 dark:border-zinc-800 shrink-0">
      {/* Editing Message Banner */}
      {editingMessageId && (
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium"><Edit2 className="h-3 w-3" /> Editing message...</span>
          <button type="button" onClick={onCancelEdit} className="text-amber-600 hover:text-amber-900 dark:hover:text-amber-100 font-semibold">Cancel</button>
        </div>
      )}

      {/* Permission / Recording Error Notice */}
      {errorMessage && (
        <div className="px-4 py-1.5 bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="p-3">
        {isRecording ? (
          <ActiveRecordingBar
            formattedDuration={formattedDuration}
            volumeLevel={volumeLevel}
            isMicSilent={isMicSilent}
            activeMicLabel={activeMicLabel}
            isUploading={isUploading}
            onCancel={cancelRecording}
            onSend={stopAndSend}
          />
        ) : (
          /* Standard Input Bar */
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf,.doc,.docx,audio/*,video/*"
              className="hidden"
            />

            {/* Paperclip File Upload */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 rounded-xl text-zinc-500 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
              title="Attach clinical report, image or audio"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
            </Button>

            {/* Mic Voice Note Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isUploading}
              onClick={startRecording}
              className="h-9 w-9 rounded-xl text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0"
              title="Record Voice Note"
            >
              <Mic className="h-4 w-4" />
            </Button>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={
                editingMessageId
                  ? "Edit your message..."
                  : "Type a message (Enter to send)..."
              }
              rows={1}
              className="flex-1 max-h-[100px] resize-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />

            {/* Send Button */}
            <Button
              type="submit"
              size="icon"
              disabled={!inputText.trim() && !isUploading}
              className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs shrink-0 transition-transform active:scale-95 disabled:opacity-40"
              title={editingMessageId ? "Save edit" : "Send message"}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
