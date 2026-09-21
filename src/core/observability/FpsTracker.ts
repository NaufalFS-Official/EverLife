/**
 * Modul Pemantauan Performa Frame Rate (FPS Tracker) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S15 & Instruksi INFRA.
 * Menghitung distribusi persentil latensi frame (p5, p50, p95) setiap 60 detik.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

export interface FpsMetrics {
  readonly sampleCount: number;
  readonly averageFps: number;
  readonly p5Ms: number;
  readonly p50Ms: number;
  readonly p95Ms: number;
  readonly isHealthy: boolean;
}

export type FpsReporterCallback = (metrics: FpsMetrics) => void;

export class FpsTracker {
  private static instance: FpsTracker | null = null;
  private frameTimes: number[] = [];
  private lastTimestamp: number = 0;
  private isRunning: boolean = false;
  private animFrameId: number | null = null;
  private intervalTimerId: number | null = null;
  private readonly listeners = new Set<FpsReporterCallback>();

  public static getInstance(): FpsTracker {
    if (!FpsTracker.instance) {
      FpsTracker.instance = new FpsTracker();
    }
    return FpsTracker.instance;
  }

  public subscribe(callback: FpsReporterCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.frameTimes = [];
    this.lastTimestamp = typeof performance !== 'undefined' ? performance.now() : Date.now();

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      const loop = (timestamp: number) => {
        if (!this.isRunning) return;
        const delta = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        if (delta > 0 && delta < 1000) {
          this.recordFrame(delta);
        }

        this.animFrameId = window.requestAnimationFrame(loop);
      };
      this.animFrameId = window.requestAnimationFrame(loop);

      // Pelaporan berkala setiap 60 detik
      this.intervalTimerId = window.setInterval(() => {
        this.report();
      }, 60000);
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (typeof window !== 'undefined') {
      if (this.animFrameId !== null) {
        window.cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      if (this.intervalTimerId !== null) {
        window.clearInterval(this.intervalTimerId);
        this.intervalTimerId = null;
      }
    }
  }

  public recordFrame(deltaMs: number): void {
    this.frameTimes.push(deltaMs);
    // Simpan maksimal 3600 sampel (setara 60 detik pada 60 FPS)
    if (this.frameTimes.length > 3600) {
      this.frameTimes.shift();
    }
  }

  public getMetrics(): FpsMetrics {
    if (this.frameTimes.length === 0) {
      return {
        sampleCount: 0,
        averageFps: 60,
        p5Ms: 16.6,
        p50Ms: 16.6,
        p95Ms: 16.6,
        isHealthy: true,
      };
    }

    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    const count = sorted.length;

    const p5Index = Math.min(count - 1, Math.floor(count * 0.05));
    const p50Index = Math.min(count - 1, Math.floor(count * 0.5));
    const p95Index = Math.min(count - 1, Math.floor(count * 0.95));

    const p5Ms = sorted[p5Index] ?? 16.6;
    const p50Ms = sorted[p50Index] ?? 16.6;
    const p95Ms = sorted[p95Index] ?? 16.6;

    const totalTime = sorted.reduce((sum, val) => sum + val, 0);
    const avgMs = totalTime / count;
    const averageFps = avgMs > 0 ? Math.round(1000 / avgMs) : 60;

    // Sehat jika rata-rata FPS >= 55 dan p95 frame time < 33.3ms (>= 30 FPS drop threshold)
    const isHealthy = averageFps >= 55 && p95Ms <= 33.3;

    return {
      sampleCount: count,
      averageFps,
      p5Ms: Math.round(p5Ms * 10) / 10,
      p50Ms: Math.round(p50Ms * 10) / 10,
      p95Ms: Math.round(p95Ms * 10) / 10,
      isHealthy,
    };
  }

  public report(): FpsMetrics {
    const metrics = this.getMetrics();
    this.listeners.forEach(listener => listener(metrics));
    return metrics;
  }
}
