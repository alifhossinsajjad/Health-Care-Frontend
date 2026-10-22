"use client";

import { io, Socket } from "socket.io-client";
import { getAuthToken } from "@/src/utils/auth-token";

let socketInstance: Socket | null = null;
let currentToken: string | null = null;

/**
 * Determine the appropriate Socket.IO server URL
 * Defaults to http://localhost:5000 in local development
 */
export const getSocketUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  // Derive from API URL or browser window
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
    return window.location.origin;
  }

  return "http://localhost:5000";
};

/**
 * Initialize or retrieve the shared Socket.io client instance
 */
export const getSocket = async (): Promise<Socket> => {
  const token = (await getAuthToken()) || "";

  // If socket exists and token has not changed, reuse existing connection
  if (socketInstance && currentToken === token) {
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
    return socketInstance;
  }

  // If token changed, disconnect old instance
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  currentToken = token;
  const socketUrl = getSocketUrl();

  socketInstance = io(socketUrl, {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
  });

  socketInstance.on("connect", () => {
    // Socket connected
  });

  socketInstance.on("connect_error", (error) => {
    console.warn("Socket.io connection error:", error.message);
  });

  socketInstance.on("disconnect", (reason) => {
    // Socket disconnected
  });

  return socketInstance;
};

/**
 * Disconnect and destroy the socket connection (e.g. on logout)
 */
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    currentToken = null;
  }
};

/**
 * ==============================================================================
 * Web Audio API Sound Synthesizer
 * ==============================================================================
 * Generates crisp, modern, zero-latency audio chimes and incoming ringtones
 * directly via browser oscillators. Eliminates 404 missing audio file risks!
 */
class SoundAlertSynthesizer {
  private audioCtx: AudioContext | null = null;
  private ringtoneInterval: NodeJS.Timeout | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.audioCtx) {
        const AudioCtxClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx?.state === "suspended") {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Subtle modern Messenger/WhatsApp-like message notification chime (E6 -> G6)
   */
  public playMessageChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1318.51, now); // E6
      osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.08); // G6

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Continuous smooth incoming call ringtone melody
   */
  public startIncomingRingtone() {
    this.stopIncomingRingtone();

    const playChimePattern = () => {
      const ctx = this.getContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        const notes = [
          { f: 523.25, start: 0, end: 0.15 }, // C5
          { f: 659.25, start: 0.15, end: 0.3 }, // E5
          { f: 783.99, start: 0.3, end: 0.5 }, // G5
          { f: 1046.5, start: 0.5, end: 0.8 }, // C6
        ];

        notes.forEach(({ f, start, end }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + start);

          gain.gain.setValueAtTime(0, now + start);
          gain.gain.linearRampToValueAtTime(0.2, now + start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + end);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + start);
          osc.stop(now + end);
        });
      } catch {
        // Autoplay policy
      }
    };

    playChimePattern();
    this.ringtoneInterval = setInterval(playChimePattern, 2600);
  }

  /**
   * Stop ringtone immediately when call is accepted or rejected
   */
  public stopIncomingRingtone() {
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  /**
   * Gentle call ending tone (G5 -> C5)
   */
  public playCallEndTone() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(783.99, now); // G5
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15); // C5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Ignore
    }
  }
}

export const soundAlerts = new SoundAlertSynthesizer();
