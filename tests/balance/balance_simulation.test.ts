/**
 * DATA-DRIVEN BALANCE SIMULATION HARNESS (EverLife)
 * Menguji target PRD (§3.5, §10) & Feel Spec (S2, S7) menggunakan 3 bot bertingkat
 * (Average Joe, High Achiever, Risk Taker) dengan 1.000 run headless per konfigurasi.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { simulate } from '../../src/core/simulation';
import { PlayerAction, SimulationResult } from '../../src/core/types';

export type BotArchetype = 'average' | 'achiever' | 'criminal';

export function buildArchetypeActions(archetype: BotArchetype, maxAge = 120): PlayerAction[] {
  const actions: PlayerAction[] = [];

  for (let age = 1; age <= maxAge; age++) {
    actions.push({ type: 'AGE_UP' });

    if (archetype === 'average') {
      actions.push({ type: 'CHOOSE_OPTION', eventId: 'evt_generic', choiceIndex: 0 });
      if (age === 18) {
        actions.push({ type: 'APPLY_JOB', jobId: 'job_waiter' });
      }
      if (age % 5 === 0) {
        actions.push({ type: 'SPEND_TIME_NPC', npcId: 'npc_father' });
      }
    } else if (archetype === 'achiever') {
      actions.push({ type: 'CHOOSE_OPTION', eventId: 'evt_generic', choiceIndex: 0 });
      if (age === 18) {
        actions.push({ type: 'APPLY_JOB', jobId: 'job_apprentice_dev' });
      }
      if (age === 24) {
        actions.push({ type: 'APPLY_JOB', jobId: 'job_software_engineer' });
      }
      if (age >= 18 && age % 2 === 0) {
        actions.push({ type: 'VISIT_DOCTOR' });
        actions.push({ type: 'GO_TO_GYM' });
      }
      if (age % 4 === 0) {
        actions.push({ type: 'SPEND_TIME_NPC', npcId: 'npc_mother' });
      }
    } else if (archetype === 'criminal') {
      actions.push({ type: 'CHOOSE_OPTION', eventId: 'evt_generic', choiceIndex: 1 });
      if (age >= 14 && age < 20) {
        actions.push({ type: 'COMMIT_CRIME', crimeType: 'shoplift' });
      } else if (age >= 20) {
        actions.push({ type: 'COMMIT_CRIME', crimeType: 'heist' });
      }
    }
  }

  return actions;
}

export interface ArchetypeRunMetrics {
  archetype: BotArchetype;
  totalRuns: number;
  medianLifespan: number;
  meanLifespan: number;
  p5Lifespan: number;
  p95Lifespan: number;
  childMortalityRate: number; // age < 18
  centenarianRate: number; // age >= 100
  medianNetWorth: number;
  insolvencyRate: number; // netWorth < 0
  ribbons: Record<string, number>;
  causesOfDeath: Record<string, number>;
}

export function analyzeSimulationRuns(archetype: BotArchetype, count = 1000, baseSeed = 100000): ArchetypeRunMetrics {
  const actions = buildArchetypeActions(archetype);
  const lifespans: number[] = [];
  const netWorths: number[] = [];
  const ribbons: Record<string, number> = {};
  const causes: Record<string, number> = {};
  let childDeaths = 0;
  let centenarians = 0;
  let insolvencies = 0;

  for (let i = 0; i < count; i++) {
    const seed = baseSeed + i;
    const result: SimulationResult = simulate(seed, actions);
    const finalAge = result.finalState.character.age;
    const netWorth = result.finalState.character.finances.netWorth;
    const ribbon = result.finalState.character.ribbon ?? 'None';
    const cause = result.finalState.character.causeOfDeath ?? 'Natural';

    lifespans.push(finalAge);
    netWorths.push(netWorth);



    if (finalAge < 18) childDeaths++;
    if (finalAge >= 100) centenarians++;
    if (netWorth < 0) insolvencies++;

    ribbons[ribbon] = (ribbons[ribbon] ?? 0) + 1;
    causes[cause] = (causes[cause] ?? 0) + 1;
  }

  lifespans.sort((a, b) => a - b);
  netWorths.sort((a, b) => a - b);

  const medianLifespan = lifespans[Math.floor(count / 2)] ?? 0;
  const meanLifespan = Math.round((lifespans.reduce((s, v) => s + v, 0) / count) * 10) / 10;
  const p5Lifespan = lifespans[Math.floor(count * 0.05)] ?? 0;
  const p95Lifespan = lifespans[Math.floor(count * 0.95)] ?? 0;
  const medianNetWorth = netWorths[Math.floor(count / 2)] ?? 0;

  return {
    archetype,
    totalRuns: count,
    medianLifespan,
    meanLifespan,
    p5Lifespan,
    p95Lifespan,
    childMortalityRate: Math.round((childDeaths / count) * 1000) / 10, // %
    centenarianRate: Math.round((centenarians / count) * 1000) / 10, // %
    medianNetWorth,
    insolvencyRate: Math.round((insolvencies / count) * 1000) / 10, // %
    ribbons,
    causesOfDeath: causes,
  };
}

describe('BALANCE SIMULATION: Headless Multi-Bot Verification (PRD §3.5, §10)', () => {
  it('harus memvalidasi metrik keseimbangan hidup untuk 1.000 run Average Joe', () => {
    const metrics = analyzeSimulationRuns('average', 1000, 100000);

    // 1. Usia Harapan Hidup Median (PRD §1 & §3.5 target: 70 - 85 tahun)
    expect(metrics.medianLifespan).toBeGreaterThanOrEqual(68);
    expect(metrics.medianLifespan).toBeLessThanOrEqual(85);

    // 2. Child Mortality (Usia < 18 tahun) harus rendah (< 5%)
    expect(metrics.childMortalityRate).toBeLessThan(5.0);

    // 3. P95 Lifespan harus mencapai lansia 80+ tahun
    expect(metrics.p95Lifespan).toBeGreaterThanOrEqual(80);

    // 4. Centenarian rate dalam batas realistis (< 5%)
    expect(metrics.centenarianRate).toBeLessThanOrEqual(5.0);

    // 5. Pekerja standar rata-rata memiliki saldo non-negatif
    expect(metrics.insolvencyRate).toBeLessThan(25.0);
  });

  it('harus memvalidasi metrik High Achiever (panjang umur & net worth tinggi)', () => {
    const metrics = analyzeSimulationRuns('achiever', 1000, 200000);

    // High achiever menjaga kesehatan -> umur median setidaknya sama atau lebih tinggi dari average
    expect(metrics.medianLifespan).toBeGreaterThanOrEqual(70);

    // Net worth median karir tech/developer harus positif signifikan (>= $50.000)
    expect(metrics.medianNetWorth).toBeGreaterThanOrEqual(50000);

    // Memiliki peluang memperoleh ribbon Successful atau Loaded
    const highTierRibbons = (metrics.ribbons['Successful'] ?? 0) + (metrics.ribbons['Loaded'] ?? 0);
    expect(highTierRibbons).toBeGreaterThan(100);
  });

  it('harus memvalidasi metrik Risk Taker (kriminalitas & konsekuensi penjara/kematian)', () => {
    const metrics = analyzeSimulationRuns('criminal', 1000, 300000);

    // Kriminal rentan dipenjara sehingga memicu ribbon Jailbird atau umur lebih pendek
    const jailbirds = metrics.ribbons['Jailbird'] ?? 0;
    const wicked = metrics.ribbons['Wicked'] ?? 0;
    expect(jailbirds + wicked).toBeGreaterThan(50);
  });

  it('harus mengekspor ringkasan metrik keseimbangan ke reports/balance_results.json', () => {
    const average = analyzeSimulationRuns('average', 1000, 100000);
    const achiever = analyzeSimulationRuns('achiever', 1000, 200000);
    const criminal = analyzeSimulationRuns('criminal', 1000, 300000);

    const reportData = {
      timestamp: new Date().toISOString(),
      sampleSizePerArchetype: 1000,
      totalSimulatedLives: 3000,
      archetypes: { average, achiever, criminal },
    };

    const outDir = path.resolve(process.cwd(), 'reports');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outDir, 'balance_results.json'), JSON.stringify(reportData, null, 2), 'utf-8');

    expect(fs.existsSync(path.join(outDir, 'balance_results.json'))).toBe(true);
  });
});
