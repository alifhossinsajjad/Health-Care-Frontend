"use client";

/**
 * ==============================================================================
 * Web Audio API Sound Synthesizer
 * ==============================================================================
 * Generates crisp, zero-latency audio chimes and incoming ringtones
 * directly via browser oscillators without relying on external .mp3 files.
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
   * Internal oscillator tone synthesizer
   */
  private triggerTone(
    freq: number,
    startOffset: number,
    duration: number,
    maxGain = 0.2,
    endFreq?: number,
    type: OscillatorType = "sine"
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + startOffset);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(
          endFreq,
          now + startOffset + duration
        );
      }

      gain.gain.setValueAtTime(0, now + startOffset);
      gain.gain.linearRampToValueAtTime(
        maxGain,
        now + startOffset + Math.min(0.015, duration * 0.2)
      );
      gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + startOffset);
      osc.stop(now + startOffset + duration + 0.01);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Messenger-style incoming message chime ("Tuing" / musical dual-tone bell)
   * Warm, crystal-clear, zero-latency acoustic tone without harsh high frequencies
   */
  public playMessageChime() {
    // Note 1: Warm "Tu-" (659.25 Hz - E5)
    this.triggerTone(659.25, 0, 0.09, 0.2);
    // Note 2: Melodic crystalline "-ing" (1046.50 Hz - C6)
    this.triggerTone(1046.5, 0.08, 0.32, 0.22);
    // Harmonic warmth overtone (1318.51 Hz - E6)
    this.triggerTone(1318.51, 0.08, 0.28, 0.08);
  }

  /**
   * Messenger-style outgoing message pop / swoop
   * Tactile, subtle, satisfying bubble pop on message dispatch
   */
  public playMessageSentTone() {
    this.triggerTone(440, 0, 0.12, 0.15, 740);
  }

  /**
   * Continuous incoming call ringtone sequence (C5 -> E5 -> G5 -> C6)
   */
  public startIncomingRingtone() {
    this.stopIncomingRingtone();

    const playChimePattern = () => {
      const notes = [
        { f: 523.25, s: 0, d: 0.15 },
        { f: 659.25, s: 0.15, d: 0.15 },
        { f: 783.99, s: 0.3, d: 0.2 },
        { f: 1046.5, s: 0.5, d: 0.3 },
      ];
      notes.forEach(({ f, s, d }) => this.triggerTone(f, s, d, 0.2));
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
   * Call termination tone (G5 -> C5)
   */
  public playCallEndTone() {
    this.triggerTone(783.99, 0, 0.35, 0.18, 523.25);
  }

  /**
   * Standard in-app notification chime (melodic ascending triad)
   */
  public playNotificationChime() {
    this.triggerTone(698.46, 0, 0.12, 0.18); // F5
    this.triggerTone(880.0, 0.08, 0.16, 0.2); // A5
    this.triggerTone(1046.5, 0.16, 0.28, 0.22); // C6
  }

  /**
   * Urgent alert double chime for 5-minute reminder & peer waiting in consultation room
   */
  public playUrgentAlertChime() {
    this.triggerTone(1046.5, 0, 0.1, 0.25); // C6 Beep 1
    this.triggerTone(1318.51, 0.14, 0.22, 0.28); // E6 Beep 2
  }
}

export const soundAlerts = new SoundAlertSynthesizer();
