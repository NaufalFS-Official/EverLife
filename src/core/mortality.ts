/**
 * MORTALITY FORMULA & DEATH RESOLVER (EverLife)
 * Layer 1 Core: Pure logic, zero DOM, deterministic mortality curve.
 */

import { GAME_CONFIG, Mulberry32PRNG } from '../shared';
import { GlobalGameState } from './types';

/**
 * Menghitung probabilitas mortalitas pasif berdasarkan usia dan kesehatan karakter.
 * Formula eksponensial Gompertz-Makeham disederhanakan:
 * P = baseRate * exp(exponent * age) + healthPenalty
 */
export function calculateMortalityProbability(age: number, health: number): number {
  if (health <= 0) return 1.0; // Kematian mutlak jika Health 0%

  const baseRate = GAME_CONFIG.FEEL_MORTALITY_BASE_RATE;
  const exponent = GAME_CONFIG.FEEL_MORTALITY_EXPONENT;

  // Laju dasar seiring penuaan
  let prob = baseRate * Math.exp(exponent * age);

  // Penalti kesehatan kritis (Health di bawah 20%)
  if (health < 20) {
    const healthDeficit = (20 - health) / 20; // 0.0 s/d 1.0
    prob += healthDeficit * 0.25; // Lonjakan risiko hingga +25%
  }

  // Crisis start age multiplier (usia 60+)
  if (age >= GAME_CONFIG.FEEL_CRISIS_START_AGE) {
    const elderlyYears = age - GAME_CONFIG.FEEL_CRISIS_START_AGE;
    prob += elderlyYears * 0.005;
  }

  // Dibatasi maksimal 0.95 kecuali Health = 0
  return Math.min(0.95, Math.max(0.0001, prob));
}

/**
 * Mengevaluasi apakah karakter meninggal dunia pada siklus penuaan ini.
 */
export function evaluateMortality(
  state: GlobalGameState,
  rng: Mulberry32PRNG
): { isDead: boolean; cause?: string } {
  const { age, attributes } = state.character;

  if (attributes.health <= 0) {
    return {
      isDead: true,
      cause: 'Gagal organ fatal akibat komplikasi kesehatan parah (Health 0%).',
    };
  }

  const deathProb = calculateMortalityProbability(age, attributes.health);
  const roll = rng.next();

  if (roll < deathProb) {
    let cause = 'Meninggal tenang dalam tidur akibat usia tua.';
    if (age < 18) {
      cause = 'Komplikasi penyakit langka masa kanak-kanak.';
    } else if (age < 50) {
      cause = attributes.health < 30
        ? 'Serangan jantung mendadak akibat kondisi fisik yang melemah.'
        : 'Kecelakaan lalu lintas fatal.';
    } else if (age < 75) {
      cause = 'Penyakit kronis berkepanjangan pada usia lanjut.';
    }
    return { isDead: true, cause };
  }

  return { isDead: false };
}

/**
 * Menghasilkan pita kehormatan (Ribbon Memorial) berdasarkan pencapaian hidup.
 */
export function evaluateRibbon(state: GlobalGameState): string {
  const { age, finances, attributes, prisonYears, education } = state.character;

  if (age >= 100) return 'Centenarian';
  if ((prisonYears ?? 0) >= 5) return 'Jailbird';
  if (finances.netWorth >= 1000000) return 'Loaded';
  if (attributes.karma >= 90) return 'Saint';
  if (attributes.karma <= 15) return 'Wicked';
  if (education.level === 'University' && attributes.smarts >= 90) return 'Academic';
  if (finances.netWorth >= 250000) return 'Successful';
  if (age <= 18) return 'Unlucky';

  return 'Mediocre';
}
