/**
 * PROCEDURAL AUDIO MANAGER & SFX SYNTHESIZER (EverLife)
 * Blueprint S6 & DAEL-15: Zero-latency procedural Web Audio synthesis with offline fallback.
 */

export type SoundEffectType =
  | 'ui_click'
  | 'age_tick'
  | 'birth'
  | 'death'
  | 'cash'
  | 'fail'
  | 'confetti';

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 1.0;

  constructor() {
    // AudioContext diinisialisasi secara lazy saat interaksi pertama pemain (autoplay policy)
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Memainkan efek suara prosedural melalui sintesis gelombang Web Audio API.
   */
  public play(sfx: SoundEffectType): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      switch (sfx) {
        case 'ui_click': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
          gain.gain.setValueAtTime(0.15 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.01 * this.volume, now + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'age_tick': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
          gain.gain.setValueAtTime(0.20 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.01 * this.volume, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case 'birth': {
          // Melodi lonceng kelahiran (C5 - E5 - G5)
          const notes = [523.25, 659.25, 783.99];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noteStart = now + idx * 0.15;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(0.18 * this.volume, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001 * this.volume, noteStart + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.4);
          });
          break;
        }

        case 'cash': {
          // Dua dentang koin (B5 - E6)
          const notes = [987.77, 1318.51];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noteStart = now + idx * 0.08;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(0.20 * this.volume, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.01 * this.volume, noteStart + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.2);
          });
          break;
        }

        case 'death': {
          // Dentang nisan muram berfrekuensi rendah
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 1.2);
          gain.gain.setValueAtTime(0.25 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001 * this.volume, now + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.2);
          break;
        }

        case 'fail': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.linearRampToValueAtTime(140, now + 0.25);
          gain.gain.setValueAtTime(0.20 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.01 * this.volume, now + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case 'confetti': {
          // Kaskade arpeggio kemenangan
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noteStart = now + idx * 0.07;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(0.18 * this.volume, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.01 * this.volume, noteStart + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.3);
          });
          break;
        }
      }
    } catch {
      // Non-blocking fallback jika browser memblokir Web Audio
    }
  }
}

export const audio = new AudioManager();
