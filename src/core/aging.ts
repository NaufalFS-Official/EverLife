/**
 * CORE AGING ENGINE & ANNUAL CYCLE (EverLife)
 * Layer 1 Core: +Age loop, education, cashflow, mortality evaluation, and event queuing.
 */

import { Mulberry32PRNG } from '../shared';
import { GlobalGameState, ScenarioEvent } from './types';
import { processAnnualEducation } from './career';
import { processAnnualCashflow } from './finances';
import { processAnnualRelationships } from './relationships';
import { evaluateMortality, evaluateRibbon } from './mortality';
import { servePrisonYear } from './crime';
import { selectEligibleEvent } from './events';

export interface AgingTickResult {
  nextState: GlobalGameState;
  annualLogs: string[];
  isDead: boolean;
  activeScenario: ScenarioEvent | null;
}

/**
 * Memvalidasi dan memastikan usia karakter berjalan monotonik (+1 diskrit).
 * Mencegah manipulasi memori Age Rewind (pembalikan usia) maupun Age Skip (lompatan usia).
 */
export function validateAndSyncAgeMonotonicity(state: GlobalGameState): {
  revertedRewind: boolean;
  clampedSkip: boolean;
} {
  const logs = state.character.lifeLog ?? [];
  const maxRecordedAge = logs.reduce((max, entry) => Math.max(max, entry.age), 0);
  let revertedRewind = false;
  let clampedSkip = false;

  // 1. Guard Age Rewind: Usia tidak boleh lebih kecil dari usia maksimal yang pernah dicapai
  if (state.character.age < maxRecordedAge) {
    state.character.age = maxRecordedAge;
    revertedRewind = true;
  }

  // 2. Guard Age Skip: Bila karakter sudah aktif menua (>1 entri log), lompatan tidak boleh melampaui riwayat
  if (logs.length > 1) {
    const lastLoggedAge = logs[logs.length - 1]?.age ?? 0;
    if (state.character.age > lastLoggedAge + 1) {
      state.character.age = lastLoggedAge;
      clampedSkip = true;
    }
  }

  return { revertedRewind, clampedSkip };
}

/**
 * Menjalankan siklus penuaan tahunan (+Age).
 * Sumber kebenaran bagi seluruh transisi usia karakter.
 */
export function tickAge(
  state: GlobalGameState,
  rng: Mulberry32PRNG
): AgingTickResult {
  const { character } = state;
  const annualLogs: string[] = [];

  // Validasi monotonitas usia untuk mencegah Age Rewind dan Age Skip
  validateAndSyncAgeMonotonicity(state);

  // 1. Tambah usia 1 tahun
  character.age += 1;
  const ageHeader = `Usia ${character.age} tahun:`;

  // 2. Evaluasi Hukuman Penjara jika ada
  if (character.prisonYears && character.prisonYears > 0) {
    const prisonLog = servePrisonYear(state);
    if (prisonLog) annualLogs.push(prisonLog);
  }

  // 3. Kemajuan Pendidikan
  const eduLog = processAnnualEducation(state);
  if (eduLog) annualLogs.push(eduLog);

  // 4. Arus Kas Finansial (Gaji, Pajak, Pemeliharaan Aset, Biaya Hidup)
  const cashflow = processAnnualCashflow(state);
  if (character.age >= 18) {
    if (cashflow.salaryEarned > 0) {
      annualLogs.push(`Menerima gaji tahunan $${cashflow.salaryEarned.toLocaleString()} (Pajak: $${cashflow.taxPaid.toLocaleString()}).`);
    }
    if (cashflow.livingCost > 0) {
      annualLogs.push(`Biaya hidup tahunan: $${cashflow.livingCost.toLocaleString()}.`);
    }
  }

  // 5. Penuaan Relasi & Berita Keluarga
  const relLogs = processAnnualRelationships(state, rng);
  annualLogs.push(...relLogs);

  // 6. Evaluasi Mortalitas (Apakah karakter meninggal di usia ini?)
  const mortality = evaluateMortality(state, rng);
  if (mortality.isDead) {
    state.currentScreen = 'DEATH_SUMMARY';
    character.causeOfDeath = mortality.cause ?? 'Meninggal dunia secara wajar.';
    character.ribbon = evaluateRibbon(state);

    const deathText = `${ageHeader} ${character.causeOfDeath}`;
    character.lifeLog.push({
      age: character.age,
      text: deathText,
      categoryTag: 'Death',
      iconKey: 'icon_death',
    });

    return {
      nextState: state,
      annualLogs: [deathText],
      isDead: true,
      activeScenario: null,
    };
  }

  // 7. Seleksi Skenario Keputusan Interaktif
  const scenario = selectEligibleEvent(state, rng);
  if (scenario) {
    state.activeModal = scenario;
    state.currentScreen = 'SCENARIO_POPUP';
  } else {
    state.activeModal = null;
    state.currentScreen = 'GAMEPLAY_ACTIVE';
  }

  // 8. Cetak Log Tahunan ke Life History
  const logMessage = annualLogs.length > 0
    ? `${ageHeader} ${annualLogs.join(' ')}`
    : `${ageHeader} Satu tahun berlalu dengan tenang tanpa kejadian istimewa.`;

  character.lifeLog.push({
    age: character.age,
    text: logMessage,
    categoryTag: 'Aging',
    iconKey: 'icon_age',
  });

  return {
    nextState: state,
    annualLogs,
    isDead: false,
    activeScenario: scenario,
  };
}
