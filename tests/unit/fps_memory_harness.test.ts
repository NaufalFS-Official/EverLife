import { describe, it, expect } from 'vitest';
import { runSimulationBenchmark } from '../../src/engine/fpsHarness';

describe('TEST-AC-PERF: FPS Frame-Time & Memory Stability Harness (D16 & DAEL-06)', () => {
  it('harus memenuhi budget frame-time (p95 <= 16.66ms) dan pertumbuhan heap < 10%', () => {
    // Jalankan 150 iterasi simulasi bot (setara ratusan siklus hidup dan ribuan event)
    const metrics = runSimulationBenchmark(150);

    console.log('[HARNESS PERFORMA & MEMORI EVERLIFE]', {
      totalFrames: metrics.totalFrames,
      avgFrameTimeMs: metrics.avgFrameTimeMs,
      p50FrameTimeMs: metrics.p50FrameTimeMs,
      p95FrameTimeMs: metrics.p95FrameTimeMs,
      p99FrameTimeMs: metrics.p99FrameTimeMs,
      effectiveFps: metrics.effectiveFps,
      heapGrowthPercent: metrics.heapGrowthPercent,
      passed: metrics.passed,
    });

    // P95 frame time harus lebih kecil atau sama dengan budget 1000/60 = 16.666 ms
    expect(metrics.p95FrameTimeMs).toBeLessThanOrEqual(16.67);
    // Pertumbuhan heap memory selama simulasi endurance harus < 10%
    expect(metrics.heapGrowthPercent).toBeLessThan(10);
    expect(metrics.passed).toBe(true);
  });
});
