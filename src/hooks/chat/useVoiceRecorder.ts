"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface UseVoiceRecorderProps {
  onSendAudio: (audioFile: File) => Promise<void>;
}

export const useVoiceRecorder = ({ onSendAudio }: UseVoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatDuration = useCallback((sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, []);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    setErrorMessage(null);
    try {
      // 1. High-fidelity vocal capture without aggressive AEC noise-gating
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      streamRef.current = stream;

      stream.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });

      // 2. Select optimal browser-supported audio codec
      let mimeType = "";
      const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4;codecs=mp4a.40.2",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];
      for (const candidate of candidates) {
        if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(candidate)) {
          mimeType = candidate;
          break;
        }
      }

      const options: MediaRecorderOptions = {
        audioBitsPerSecond: 128000,
      };
      if (mimeType) options.mimeType = mimeType;

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const rawType = recorder.mimeType || mimeType || "audio/webm";
        const cleanType = rawType.split(";")[0] || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: cleanType });
        cleanupStream();

        if (audioBlob.size > 200) {
          const ext = cleanType.includes("mp4") ? "m4a" : "webm";
          const audioFile = new File(
            [audioBlob],
            `voice-note-${Date.now()}.${ext}`,
            { type: cleanType }
          );
          await onSendAudio(audioFile);
        } else {
          console.warn("Recorded audio too small or empty:", audioBlob.size);
        }
        audioChunksRef.current = [];
      };

      // Slice in 250ms intervals for progressive stream collection
      recorder.start(250);
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMessage(
        err?.name === "NotAllowedError"
          ? "Microphone access denied. Please enable permission."
          : "Could not access microphone on this device."
      );
      cleanupStream();
      setIsRecording(false);
    }
  }, [onSendAudio, cleanupStream]);

  const stopAndSend = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  }, [isRecording]);

  const cancelRecording = useCallback(() => {
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    cleanupStream();
    setIsRecording(false);
    setSeconds(0);
  }, [cleanupStream]);

  useEffect(() => {
    return () => {
      cleanupStream();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
    };
  }, [cleanupStream]);

  return {
    isRecording,
    seconds,
    formattedDuration: formatDuration(seconds),
    errorMessage,
    startRecording,
    stopAndSend,
    cancelRecording,
  };
};
