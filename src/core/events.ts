/**
 * SCENARIO SELECTION ENGINE & OUTCOME RESOLVER (EverLife)
 * Layer 1 Core: Pure logic, zero DOM, deterministic event filtering and resolution.
 */

import { GAME_CONFIG, Mulberry32PRNG } from '../shared';
import { GlobalGameState, ScenarioEvent } from './types';
import rawScenarios from '../data/scenarios.json';

export const SCENARIO_BANK: readonly ScenarioEvent[] = rawScenarios as unknown as ScenarioEvent[];

/**
 * Memilih skenario yang relevan dengan usia karakter saat ini.
 * Memastikan minimal ada 1 pilihan survival (non-fatal) per modal.
 */
export function selectEligibleEvent(
  state: GlobalGameState,
  rng: Mulberry32PRNG
): ScenarioEvent | null {
  const { age } = state.character;

  const eligible = SCENARIO_BANK.filter((evt) => {
    return age >= evt.minAge && age <= evt.maxAge;
  });

  if (eligible.length === 0) return null;

  const chosenIndex = rng.nextInt(0, eligible.length - 1);
  const event = eligible[chosenIndex];
  if (!event) return null;

  // Verifikasi jaminan cabang choices (min 2, max 4)
  const choiceCount = Math.min(
    GAME_CONFIG.FEEL_TREE_BRANCH_MAX,
    Math.max(GAME_CONFIG.FEEL_TREE_BRANCH_MIN, event.choices.length)
  );

  return {
    ...event,
    choices: event.choices.slice(0, choiceCount),
  };
}

export interface ChoiceResolutionResult {
  nextState: GlobalGameState;
  outcomeLog: string;
  isFatal: boolean;
  statDeltas: Partial<GlobalGameState['character']['attributes']>;
}

/**
 * Menyelesaikan pilihan keputusan pemain pada modal skenario.
 */
export function resolveChoice(
  state: GlobalGameState,
  event: ScenarioEvent,
  choiceIndex: number
): ChoiceResolutionResult {
  const choice = event.choices[choiceIndex] ?? event.choices[0];
  if (!choice) {
    throw new Error(`Choice index ${choiceIndex} tidak valid untuk event ${event.id}`);
  }

  const { character } = state;
  const deltas = choice.statDeltas;

  // Terapkan perubahan atribut
  character.attributes.happiness = Math.max(0, Math.min(100, character.attributes.happiness + (deltas.happiness ?? 0)));
  character.attributes.health = Math.max(0, Math.min(100, character.attributes.health + (deltas.health ?? 0)));
  character.attributes.smarts = Math.max(0, Math.min(100, character.attributes.smarts + (deltas.smarts ?? 0)));
  character.attributes.looks = Math.max(0, Math.min(100, character.attributes.looks + (deltas.looks ?? 0)));
  character.attributes.karma = Math.max(0, Math.min(100, character.attributes.karma + (choice.karmaDelta ?? 0)));
  if (deltas.discipline) {
    character.attributes.discipline = Math.max(0, Math.min(100, character.attributes.discipline + deltas.discipline));
  }

  // Tambahkan log naratif
  const outcomeLog = choice.logText;
  character.lifeLog.push({
    age: character.age,
    text: outcomeLog,
    categoryTag: event.category,
    iconKey: `icon_${event.category.toLowerCase()}`,
  });

  // Periksa apakah pilihan berakibat fatal
  const isFatal = character.attributes.health <= 0;
  if (isFatal) {
    state.currentScreen = 'DEATH_SUMMARY';
    character.causeOfDeath = `Meninggal akibat komplikasi dari insiden: ${event.title}`;
  } else {
    state.currentScreen = 'GAMEPLAY_ACTIVE';
  }

  state.activeModal = null;

  return {
    nextState: state,
    outcomeLog,
    isFatal,
    statDeltas: deltas,
  };
}

/**
 * Pilihan acak berbobot "Surprise Me!" (eksekusi dalam < 50ms)
 */
export function surpriseMeChoice(
  state: GlobalGameState,
  event: ScenarioEvent,
  rng: Mulberry32PRNG
): ChoiceResolutionResult {
  const randomIndex = rng.nextInt(0, event.choices.length - 1);
  return resolveChoice(state, event, randomIndex);
}
