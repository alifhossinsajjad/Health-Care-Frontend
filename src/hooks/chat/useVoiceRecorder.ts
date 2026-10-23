"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getPreferredAudioDevice, acquirePhysicalMicStream } from "@/src/utils/audioDeviceHelper";

interface UseVoiceRecorderProps {
  onSendAudio: (audioFile: File) => Promise<void>;
}

export const useVoiceRecorder = ({ onSendAudio }: UseVoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isMicSilent, setIsMicSilent] = useState(false);
  const [activeMicLabel, setActiveMicLabel] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const hasDetectedVoiceRef = useRef(false);

  const formatDuration = useCallback((sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, []);

  const cleanupAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setVolumeLevel(0);
  }, []);

  const startRecording = useCallback(async () => {
    setErrorMessage(null);
    setIsMicSilent(false);
    hasDetectedVoiceRef.current = false;

    try {
      const preferred = await getPreferredAudioDevice();
      setActiveMicLabel(preferred.label || null);

      const stream = await acquirePhysicalMicStream(preferred);
      streamRef.current = stream;
      stream.getAudioTracks().forEach((track) => { track.enabled = true; });

      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          if (ctx.state === "suspended") await ctx.resume();

          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let sampleCount = 0;

          const monitorAudio = () => {
            if (!analyser) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const avg = sum / dataArray.length;
            const vol = Math.min(100, Math.round((avg / 128) * 100));
            setVolumeLevel(vol);

            if (vol > 4) {
              hasDetectedVoiceRef.current = true;
              setIsMicSilent(false);
            }
            sampleCount++;
            if (sampleCount > 25 && !hasDetectedVoiceRef.current) setIsMicSilent(true);

            animFrameRef.current = requestAnimationFrame(monitorAudio);
          };
          monitorAudio();
        }
      } catch (err) {
        console.warn("AudioContext analyser warning:", err);
      }

      let mimeType = "";
      const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
      for (const candidate of candidates) {
        if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(candidate)) {
          mimeType = candidate;
          break;
        }
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType, audioBitsPerSecond: 128000 } : undefined);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start(250);
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMessage("Could not access microphone. Please check system permissions.");
      cleanupAudio();
      setIsRecording(false);
    }
  }, [cleanupAudio]);

  const stopRecordingBlob = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") return resolve(null);

      recorder.onstop = () => {
        const rawType = recorder.mimeType || "audio/webm";
        const cleanType = rawType.split(";")[0] || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: cleanType });
        audioChunksRef.current = [];
        resolve(audioBlob);
      };

      try {
        if (recorder.state === "recording") recorder.requestData();
        recorder.stop();
      } catch {
        resolve(null);
      }
    });
  }, []);

  const stopAndSend = useCallback(async () => {
    if (!isRecording) return;
    setIsRecording(false);

    try {
      const audioBlob = await stopRecordingBlob();
      cleanupAudio();

      if (audioBlob && audioBlob.size > 150) {
        const cleanType = audioBlob.type.split(";")[0] || "audio/webm";
        const ext = cleanType.includes("mp4") ? "m4a" : "webm";
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.${ext}`, { type: cleanType });
        await onSendAudio(audioFile);
      }
    } catch (err) {
      console.error("Voice note finalizing error:", err);
      cleanupAudio();
    }
  }, [isRecording, stopRecordingBlob, cleanupAudio, onSendAudio]);

  const cancelRecording = useCallback(() => {
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    cleanupAudio();
    setIsRecording(false);
    setSeconds(0);
  }, [cleanupAudio]);

  useEffect(() => {
    return () => {
      cleanupAudio();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try { mediaRecorderRef.current.stop(); } catch {}
      }
    };
  }, [cleanupAudio]);

  return {
    isRecording,
    seconds,
    volumeLevel,
    isMicSilent,
    activeMicLabel,
    formattedDuration: formatDuration(seconds),
    errorMessage,
    startRecording,
    stopAndSend,
    cancelRecording,
  };
};
