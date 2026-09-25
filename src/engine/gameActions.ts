/**
 * GAME ACTIONS HANDLERS (EverLife)
 * Modular action executors connecting core simulation logic to audio and haptics.
 */

import { GlobalGameState } from '../core/types';
import { tickAge } from '../core/aging';
import { resolveChoice, surpriseMeChoice } from '../core/events';
import { commitCrime } from '../core/crime';
import { audio } from './audioManager';
import { triggerHaptic } from '../adapter/haptics';
import { Mulberry32PRNG } from '../shared';

export interface ActionOutcome {
  nextState: GlobalGameState;
  isFatal: boolean;
}

export function executeAgeUp(state: GlobalGameState): ActionOutcome {
  audio.play('age_tick');
  triggerHaptic(20);

  const rng = new Mulberry32PRNG(state.seed + state.character.age * 1337);
  const result = tickAge({ ...state }, rng);

  if (result.isDead) {
    audio.play('death');
    triggerHaptic(40);
  }

  return { nextState: result.nextState, isFatal: result.isDead };
}

export function executeChoice(state: GlobalGameState, choiceIndex: number): ActionOutcome {
  if (!state.activeModal) {
    return { nextState: state, isFatal: false };
  }

  audio.play('ui_click');
  triggerHaptic(15);

  const result = resolveChoice({ ...state }, state.activeModal, choiceIndex);
  if (result.isFatal) {
    audio.play('death');
    triggerHaptic(40);
  }

  return { nextState: result.nextState, isFatal: result.isFatal };
}

export function executeSurpriseMe(state: GlobalGameState): ActionOutcome {
  if (!state.activeModal) {
    return { nextState: state, isFatal: false };
  }

  audio.play('ui_click');
  const rng = new Mulberry32PRNG(state.seed + state.character.age + 9999);
  const result = surpriseMeChoice({ ...state }, state.activeModal, rng);
  if (result.isFatal) {
    audio.play('death');
  }

  return { nextState: result.nextState, isFatal: result.isFatal };
}

export function executeDoctor(state: GlobalGameState): boolean {
  if (state.character.finances.bankBalance < 200) {
    audio.play('fail');
    return false;
  }
  state.character.finances.bankBalance -= 200;
  state.character.attributes.health = Math.min(100, state.character.attributes.health + 15);
  state.character.lifeLog.push({
    age: state.character.age,
    text: 'Mengunjungi dokter spesialis dan menerima perawatan medis prima (+15% Health).',
    categoryTag: 'Health',
    iconKey: 'icon_health',
  });
  audio.play('cash');
  return true;
}

export function executeGym(state: GlobalGameState): boolean {
  if (state.character.finances.bankBalance < 20) {
    audio.play('fail');
    return false;
  }
  state.character.finances.bankBalance -= 20;
  state.character.attributes.health = Math.min(100, state.character.attributes.health + 5);
  state.character.attributes.looks = Math.min(100, state.character.attributes.looks + 3);
  audio.play('ui_click');
  return true;
}

export function executeCrime(
  state: GlobalGameState,
  crimeType: 'shoplift' | 'robbery' | 'heist'
): boolean {
  const rng = new Mulberry32PRNG(state.seed + state.character.age * 555);
  const res = commitCrime(state, crimeType, rng);
  if (res.success) {
    audio.play('cash');
  } else {
    audio.play('fail');
  }
  return res.success;
}
