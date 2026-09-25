import { describe, it, expect } from 'vitest';
import { createNewLife } from '../../src/core/character';
import { tickAge } from '../../src/core/aging';
import { Mulberry32PRNG } from '../../src/shared/rng';

describe('Headless Endurance & Memory Stress Test (D24 & DoD L5)', () => {
  it('harus mengeksekusi 500 siklus kehidupan penuh tanpa crash dan memori heap stabil', () => {
    const TOTAL_LIFETIMES = 500;
    const rng = new Mulberry32PRNG(424242);

    // Warm-up nursery
    if (typeof global.gc === 'function') {
      global.gc();
    }
    const initialHeap = process.memoryUsage().heapUsed;

    let totalAgesAtDeath = 0;
    let completedRuns = 0;

    for (let i = 0; i < TOTAL_LIFETIMES; i++) {
      let state = createNewLife({
        firstName: `Runner_${i}`,
        lastName: 'Endurance',
        gender: i % 2 === 0 ? 'Male' : 'Female',
        country: 'Indonesia',
        city: 'Jakarta',
      });

      let isDead = false;
      let iterations = 0;

      // Loop penuaan hingga karakter wafat (maksimal 130 tahun)
      while (!isDead && iterations < 130) {
        iterations++;
        const result = tickAge(state, rng);
        state = result.nextState;
        isDead = result.isDead;
      }

      totalAgesAtDeath += state.character.age;
      completedRuns++;
    }

    if (typeof global.gc === 'function') {
      global.gc();
    }
    const finalHeap = process.memoryUsage().heapUsed;
    const heapGrowthPercent = ((finalHeap - initialHeap) / initialHeap) * 100;
    const avgAgeAtDeath = totalAgesAtDeath / completedRuns;

    console.log('[ENDURANCE RUNNER REPORT]', {
      totalLifetimes: completedRuns,
      averageAgeAtDeath: Math.round(avgAgeAtDeath * 10) / 10,
      initialHeapMb: (initialHeap / (1024 * 1024)).toFixed(2),
      finalHeapMb: (finalHeap / (1024 * 1024)).toFixed(2),
      heapGrowthPercent: `${heapGrowthPercent.toFixed(2)}%`,
    });

    expect(completedRuns).toBe(TOTAL_LIFETIMES);
    // Rata-rata usia wafat harus berada di rentang wajar (60 - 88 tahun)
    expect(avgAgeAtDeath).toBeGreaterThanOrEqual(60);
    expect(avgAgeAtDeath).toBeLessThanOrEqual(90);
    // Pertumbuhan memori heap stabil (< 10%)
    expect(heapGrowthPercent).toBeLessThan(10);
  });
});
