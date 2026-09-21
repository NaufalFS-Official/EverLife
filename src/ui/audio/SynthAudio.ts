/**
 * Modul Sintesis Audio Prosedural (Web Audio API) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S6.
 * Berjalan tanpa file audio eksternal (0 KB asset size).
 * Default berstatus senyap (CFG_AUDIO_DEFAULT_MUTED = true).
 * Direktif D6: 100% strict type-safe, nol any.
 */

import { GAME_CONFIG } from '../../contracts/gameConfig';

export class SynthAudio {
  private static instance: SynthAudio | null = null;
  private ctx: AudioContext | null = null;
  private muted: boolean = GAME_CONFIG.CFG_AUDIO_DEFAULT_MUTED;

  private constructor() {
    // Diinisialisasi saat interaksi pengguna pertama kali
  }

  public static getInstance(): SynthAudio {
    if (!SynthAudio.instance) {
      SynthAudio.instance = new SynthAudio();
    }
    return SynthAudio.instance;
  }

  private initContext(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      return this.ctx;
    }

    if (typeof window === 'undefined') {
      return null;
    }

    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) {
      return null;
    }

    try {
      this.ctx = new AudioContextClass();
      return this.ctx;
    } catch {
      return null;
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  /**
   * Memainkan bunyi klik lembut (sine oscillator 440Hz, 50ms).
   */
  public playTap(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Abaikan jika audio dihentikan oleh browser
    }
  }

  /**
   * Memainkan bunyi peringatan / penalti (sawtooth oscillator 150Hz, 150ms).
   */
  public playAlert(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Abaikan jika audio dihentikan oleh browser
    }
  }

  /**
   * Memainkan bunyi selebrasi kelulusan (arpeggio ceria 3 nada: C5 -> E5 -> G5).
   */
  public playSuccess(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = ctx.currentTime + index * 0.1;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    } catch {
      // Abaikan jika audio dihentikan oleh browser
    }
  }
}
