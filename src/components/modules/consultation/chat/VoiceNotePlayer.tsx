"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, AlertCircle } from "lucide-react";

interface VoiceNotePlayerProps {
  audioUrl: string;
  isMe: boolean;
}

export const getPlayableAudioUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.includes("cloudinary.com") && !/\.(mp3|wav|ogg|m4a|aac)$/i.test(url)) {
    return `${url.replace(/\.(webm|mp4|m4a|ogg|bin)$/i, "")}.mp3`;
  }
  return url;
};

export function VoiceNotePlayer({ audioUrl, isMe }: VoiceNotePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const [hasError, setHasError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSrc, setCurrentSrc] = useState<string>(getPlayableAudioUrl(audioUrl) || audioUrl || "");

  useEffect(() => {
    if (audioUrl) {
      setCurrentSrc(getPlayableAudioUrl(audioUrl) || audioUrl);
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(false);
      setHasError(false);
    }
  }, [audioUrl]);

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec) || sec === Infinity) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity && audio.duration > 0) {
      setDuration(audio.duration);
    }
    setHasError(false);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.muted = false;
      audio.volume = 1.0;
      if (audio.ended || (duration > 0 && audio.currentTime >= duration - 0.2)) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn("Audio playback error, trying raw format fallback:", e);
          if (currentSrc !== audioUrl) {
            setCurrentSrc(audioUrl);
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.muted = false;
                audioRef.current.volume = 1.0;
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setHasError(true));
              }
            }, 150);
          } else {
            setHasError(true);
          }
        });
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity && audio.duration > 0) {
      setDuration(audio.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const toggleSpeed = () => {
    const nextSpeed: 1 | 1.5 | 2 = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  if (hasError) {
    return (
      <div className="flex flex-col gap-1 py-1">
        <audio controls src={audioUrl} className="h-8 max-w-[240px]" preload="metadata">
          <source src={audioUrl} type="audio/webm" />
          <source src={getPlayableAudioUrl(audioUrl)} type="audio/mpeg" />
          Your browser does not support audio playback.
        </audio>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 min-w-[220px] sm:min-w-[260px] py-1 select-none">
      <audio
        ref={audioRef}
        src={currentSrc}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={() => setHasError(true)}
        className="hidden"
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-90 ${
            isMe ? "bg-white text-blue-600 hover:bg-blue-50" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          title={isPlaying ? "Pause" : "Play Voice Note"}
        >
          {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
        </button>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-current ${
              isMe ? "accent-white bg-blue-700/60" : "accent-blue-600 bg-zinc-200 dark:bg-zinc-700"
            }`}
          />
          <div
            className={`flex items-center justify-between text-[10px] font-mono font-medium ${
              isMe ? "text-blue-100" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleSpeed}
          className={`h-6 px-1.5 rounded-md text-[10px] font-bold font-mono transition-colors ${
            isMe
              ? "bg-blue-700/70 hover:bg-blue-700 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300"
          }`}
          title="Playback speed"
        >
          {speed}x
        </button>
      </div>
    </div>
  );
}
