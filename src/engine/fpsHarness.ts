/**
 * FPS & MEMORY BENCHMARK HARNESS (EverLife)
 * D16 & DAEL-06: Verifikasi kuantitatif frame-time (p95 <= 16.6ms) dan stabilitas memori heap (<10% growth).
 */

import { TARGET_FPS } from '../shared';
import { simulate } from '../core/simulation';
import { PlayerAction } from '../core/types';

export interface BenchmarkMetrics {
  totalFrames: number;
  avgFrameTimeMs: number;
  p50FrameTimeMs: number;
  p95FrameTimeMs: number;
  p99FrameTimeMs: number;
  effectiveFps: number;
  heapStartMb: number;
  heapEndMb: number;
  heapGrowthPercent: number;
  passed: boolean;
}

/**
 * Mengambil penggunaan memori heap saat ini dalam Megabytes (MB).
 */
export function getHeapUsageMb(): number {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage().heapUsed / (1024 * 1024);
  }
  const perf = typeof window !== 'undefined' ? (window.performance as unknown as { memory?: { usedJSHeapSize: number } }) : undefined;
  if (perf?.memory) {
    return perf.memory.usedJSHeapSize / (1024 * 1024);
  }
  return 0;
}

/**
 * Menghitung persentil dari array angka.
 */
function calculatePercentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  const clampedIndex = Math.max(0, Math.min(sorted.length - 1, index));
  return sorted[clampedIndex] ?? 0;
}

/**
 * Menjalankan uji benchmark simulasi bot 60 detik (ekivalen 300+ tahun / ribuan aksi).
 */
export function runSimulationBenchmark(iterations: number = 300): BenchmarkMetrics {
  const actions: PlayerAction[] = [
    { type: 'AGE_UP' },
    { type: 'CHOOSE_OPTION', eventId: 'evt_vaccine_toddler', choiceIndex: 1 },
    { type: 'SPEND_TIME_NPC', npcId: 'npc_father' },
    { type: 'AGE_UP' },
    { type: 'APPLY_JOB', jobId: 'job_cashier' },
    { type: 'GO_TO_GYM' },
    { type: 'AGE_UP' },
    { type: 'VISIT_DOCTOR' },
    { type: 'AGE_UP' },
  ];

  // Warm-up iterasi untuk stabilisasi JIT compiler dan memory allocator V8
  for (let w = 0; w < 60; w++) {
    simulate(500 + w, actions);
  }

  if (typeof globalThis !== 'undefined' && typeof (globalThis as { gc?: () => void }).gc === 'function') {
    (globalThis as { gc: () => void }).gc();
  }

  const heapStartMb = getHeapUsageMb();
  const frameTimes: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    simulate(1000 + i, actions);
    const t1 = performance.now();
    frameTimes.push(t1 - t0);
  }

  if (typeof globalThis !== 'undefined' && typeof (globalThis as { gc?: () => void }).gc === 'function') {
    (globalThis as { gc: () => void }).gc();
  }

  const heapEndMb = getHeapUsageMb();
  const heapGrowthPercent = heapStartMb > 0 ? Math.max(0, ((heapEndMb - heapStartMb) / heapStartMb) * 100) : 0;

  frameTimes.sort((a, b) => a - b);
  const totalFrames = frameTimes.length;
  const sumTime = frameTimes.reduce((acc, val) => acc + val, 0);
  const avgFrameTimeMs = sumTime / (totalFrames || 1);

  const p50FrameTimeMs = calculatePercentile(frameTimes, 50);
  const p95FrameTimeMs = calculatePercentile(frameTimes, 95);
  const p99FrameTimeMs = calculatePercentile(frameTimes, 99);

  const targetBudgetMs = 1000 / TARGET_FPS; // 16.666 ms
  const effectiveFps = avgFrameTimeMs > 0 ? Math.min(60, 1000 / avgFrameTimeMs) : 60;

  const passed = p95FrameTimeMs <= targetBudgetMs && heapGrowthPercent < 10;

  return {
    totalFrames,
    avgFrameTimeMs: Number(avgFrameTimeMs.toFixed(3)),
    p50FrameTimeMs: Number(p50FrameTimeMs.toFixed(3)),
    p95FrameTimeMs: Number(p95FrameTimeMs.toFixed(3)),
    p99FrameTimeMs: Number(p99FrameTimeMs.toFixed(3)),
    effectiveFps: Number(effectiveFps.toFixed(1)),
    heapStartMb: Number(heapStartMb.toFixed(2)),
    heapEndMb: Number(heapEndMb.toFixed(2)),
    heapGrowthPercent: Number(heapGrowthPercent.toFixed(2)),
    passed,
  };
}
