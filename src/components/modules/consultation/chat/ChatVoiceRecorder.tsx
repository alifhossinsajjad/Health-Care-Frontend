"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Send, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface ChatVoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopAndSend: (audioFile: File) => Promise<void>;
  onCancelRecording: () => void;
  isUploading: boolean;
}

export function ChatVoiceRecorder({
  isRecording,
  onStartRecording,
  onStopAndSend,
  onCancelRecording,
  isUploading,
}: ChatVoiceRecorderProps) {
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const rawType = recorder.mimeType || mimeType || "audio/webm";
        const cleanType = rawType.split(";")[0] || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: cleanType });

        if (audioBlob.size > 100) {
          const ext = cleanType.includes("mp4") ? "m4a" : "webm";
          const audioFile = new File([audioBlob], `voice-note-${Date.now()}.${ext}`, {
            type: cleanType,
          });
          await onStopAndSend(audioFile);
        }
      };

      recorder.start(200);
      onStartRecording();
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === "recording") {
        try {
          mediaRecorderRef.current.requestData();
        } catch {}
      }
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const cancel = () => {
    if (mediaRecorderRef.current && isRecording) {
      audioChunksRef.current = [];
      try {
        mediaRecorderRef.current.stream?.getTracks().forEach((t) => t.stop());
      } catch {}
      if (timerRef.current) clearInterval(timerRef.current);
      onCancelRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
    };
  }, []);

  if (isRecording) {
    return (
      <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl px-3 py-2 flex-1 animate-in fade-in">
        <div className="flex items-center gap-2 flex-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
            Recording Voice Note... {formatTime(seconds)}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={cancel}
          className="h-8 px-2 text-xs text-zinc-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Cancel</span>
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={stop}
          className="h-8 px-3 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm gap-1"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Send Voice</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={isUploading}
      onClick={start}
      className="h-9 w-9 rounded-xl text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0"
      title="Record Voice Note"
    >
      <Mic className="h-4 w-4" />
    </Button>
  );
}
