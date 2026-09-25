/**
 * FIXED TIMESTEP GAME LOOP (EverLife)
 * Blueprint S1 & D9: Render via requestAnimationFrame, fixed simulation timestep (1/60s), clamped delta < 100ms.
 */

import { TARGET_FPS } from '../shared';

export type TickCallback = (deltaTimeMs: number) => void;

export class GameLoop {
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimestep: number = 1000 / TARGET_FPS; // ~16.666 ms
  private rafId: number | null = null;
  private onTick: TickCallback;

  constructor(onTick: TickCallback) {
    this.onTick = onTick;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.loop = this.loop.bind(this);
    this.rafId = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    if (!this.isRunning) {
      this.start();
    } else {
      this.isPaused = false;
      this.lastTime = performance.now();
    }
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    let delta = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // D9: Delta time di-clamp maksimal 100 ms agar tidak terjadi spiral of death
    if (delta > 100) {
      delta = 100;
    }

    if (!this.isPaused) {
      this.accumulator += delta;
      while (this.accumulator >= this.fixedTimestep) {
        this.onTick(this.fixedTimestep);
        this.accumulator -= this.fixedTimestep;
      }
    }

    this.rafId = requestAnimationFrame(this.loop);
  }
}
