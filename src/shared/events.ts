/**
 * GAME EVENTS & ACTIONS CONTRACT (EverLife)
 * Menentukan tipe-tipe aksi event game diskrit serta payload mutasinya.
 */

import { Gender, SpecialTalent, CharacterAppearance, CharacterAttributes } from './state';

export type GameActionType =
  | 'ACTION_START_LIFE'
  | 'ACTION_AGE_UP'
  | 'ACTION_SELECT_CHOICE'
  | 'ACTION_SURPRISE_ME'
  | 'ACTION_INTERACT_NPC'
  | 'ACTION_APPLY_JOB'
  | 'ACTION_OPEN_SUBMENU'
  | 'ACTION_CLOSE_SUBMENU'
  | 'ACTION_RESET_GAME';

export interface StartLifePayload {
  firstName: string;
  lastName: string;
  gender: Gender;
  birthCountry: string;
  birthCity: string;
  specialTalent: SpecialTalent;
  appearance: CharacterAppearance;
  initialAttributes: CharacterAttributes;
}

export interface SelectChoicePayload {
  choiceIndex: number;
}

export interface InteractNpcPayload {
  npcId: string;
  interactionType: 'Spend Time' | 'Compliment' | 'Insult' | 'Ask for Money' | 'Give Gift';
}

export interface ApplyJobPayload {
  jobId: string;
}

export interface OpenSubmenuPayload {
  submenu: 'Occupation' | 'Assets' | 'Relationships' | 'Activities';
}

export type GameAction =
  | { type: 'ACTION_START_LIFE'; payload: StartLifePayload }
  | { type: 'ACTION_AGE_UP' }
  | { type: 'ACTION_SELECT_CHOICE'; payload: SelectChoicePayload }
  | { type: 'ACTION_SURPRISE_ME' }
  | { type: 'ACTION_INTERACT_NPC'; payload: InteractNpcPayload }
  | { type: 'ACTION_APPLY_JOB'; payload: ApplyJobPayload }
  | { type: 'ACTION_OPEN_SUBMENU'; payload: OpenSubmenuPayload }
  | { type: 'ACTION_CLOSE_SUBMENU' }
  | { type: 'ACTION_RESET_GAME' };
