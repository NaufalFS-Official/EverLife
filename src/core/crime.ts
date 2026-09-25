/**
 * CRIME & RISKY ACTIVITIES SYSTEM (EverLife)
 * Layer 1 Core: Heist odds, police apprehension, prison sentences, karma penalties.
 */

import { Mulberry32PRNG } from '../shared';
import { GlobalGameState } from './types';

export interface CrimeResult {
  success: boolean;
  lootAmount: number;
  arrested: boolean;
  sentenceYears: number;
  message: string;
}

/**
 * Mengeksekusi aksi kriminal dengan kalkulasi risiko berbasis Smarts dan Karma.
 */
export function commitCrime(
  state: GlobalGameState,
  crimeType: 'shoplift' | 'robbery' | 'heist',
  rng: Mulberry32PRNG
): CrimeResult {
  const { character } = state;

  let baseSuccess = 0.6;
  let loot = 0;
  let penaltyYears = 1;

  if (crimeType === 'shoplift') {
    baseSuccess = 0.75;
    loot = rng.nextInt(50, 250);
    penaltyYears = 1;
  } else if (crimeType === 'robbery') {
    baseSuccess = 0.40;
    loot = rng.nextInt(2500, 8000);
    penaltyYears = 3;
  } else if (crimeType === 'heist') {
    baseSuccess = 0.20;
    loot = rng.nextInt(25000, 100000);
    penaltyYears = 7;
  }

  // Bonus keberhasilan dari Smarts dan bakat kejahatan
  const smartsBonus = (character.attributes.smarts - 50) * 0.003;
  const talentBonus = character.specialTalent === 'Crime' ? 0.15 : 0;
  const finalSuccessOdds = Math.max(0.05, Math.min(0.90, baseSuccess + smartsBonus + talentBonus));

  // Penalti karma instan
  character.attributes.karma = Math.max(0, character.attributes.karma - (crimeType === 'heist' ? 30 : 15));

  if (rng.next() < finalSuccessOdds) {
    character.finances.bankBalance += loot;
    character.attributes.happiness = Math.min(100, character.attributes.happiness + 10);
    return {
      success: true,
      lootAmount: loot,
      arrested: false,
      sentenceYears: 0,
      message: `Aksi ${crimeType} berhasil gemilang! Anda mengantongi $${loot.toLocaleString()}.`,
    };
  }

  // Tertangkap polisi
  character.prisonYears = (character.prisonYears ?? 0) + penaltyYears;
  character.job = null; // Dipecat seketika dari pekerjaan
  character.finances.annualSalary = 0;
  character.attributes.happiness = Math.max(0, character.attributes.happiness - 35);

  return {
    success: false,
    lootAmount: 0,
    arrested: true,
    sentenceYears: penaltyYears,
    message: `Aksi gagal! Polisi meringkus Anda di tempat kejadian. Anda divonis hukuman penjara ${penaltyYears} tahun.`,
  };
}

/**
 * Menjalani satu tahun masa hukuman penjara saat penuaan.
 */
export function servePrisonYear(state: GlobalGameState): string {
  if (!state.character.prisonYears || state.character.prisonYears <= 0) {
    return '';
  }

  state.character.prisonYears -= 1;
  state.character.attributes.happiness = Math.max(5, state.character.attributes.happiness - 10);
  state.character.attributes.health = Math.max(10, state.character.attributes.health - 5);

  if (state.character.prisonYears === 0) {
    return 'Masa hukuman penjara Anda telah berakhir. Anda resmi menghirup udara bebas kembali!';
  }

  return `Menjalani satu tahun di balik jeruji besi. Sisa hukuman: ${state.character.prisonYears} tahun.`;
}
