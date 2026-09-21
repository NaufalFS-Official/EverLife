/**
 * Definisi Event, Pilihan Dilema, dan Aksi Game EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S2, S3, S7.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import { EventCategory, Gender, StatKey, ActiveTab } from './gameState';

export type EventTheme = 'positive' | 'rational' | 'rebellious' | 'passive';

/**
 * Cabang pilihan respons dalam sebuah dilema kejadian.
 */
export interface EventOption {
  readonly id: string;
  readonly label: string;
  readonly theme: EventTheme;
  readonly statDeltas: Partial<Record<StatKey | 'cash', number>>;
  readonly resultLog: string;
  readonly requiredFlag?: string;
  readonly grantFlag?: string;
}

/**
 * Kartu dilema kejadian tahunan yang disajikan kepada pemain.
 */
export interface EventDilemma {
  readonly id: string;
  readonly minAge: number;
  readonly maxAge: number;
  readonly category: EventCategory;
  readonly title: string;
  readonly narrative: string;
  readonly options: readonly EventOption[];
  readonly requiresSchool?: boolean;
  readonly requiredFlag?: string;
  readonly isUnique?: boolean;
}

/**
 * Hasil kalkulasi transisi giliran pergantian tahun (+1 tahun).
 */
export interface YearTransitionResult {
  readonly oldAge: number;
  readonly newAge: number;
  readonly allowanceDelta: number;
  readonly relationDecay: number;
  readonly healthPenalty: number;
  readonly triggeredEvent: EventDilemma | null;
  readonly autoSaved: boolean;
}

/**
 * Diskriminasi tipe aksi permainan untuk reducer dan dispatch loop.
 */
export type GameActionType =
  | 'START_NEW_GAME'
  | 'SUBMIT_CHARACTER'
  | 'LOAD_SAVE_SLOT'
  | 'AGE_UP'
  | 'SELECT_EVENT_OPTION'
  | 'PERFORM_ACTIVITY'
  | 'INTERACT_RELATION'
  | 'SWITCH_TAB'
  | 'DISCARD_SESSION'
  | 'RESET_GAME';

export type GameAction =
  | { readonly type: 'START_NEW_GAME' }
  | {
      readonly type: 'SUBMIT_CHARACTER';
      readonly payload: {
        readonly name: string;
        readonly gender: Gender;
        readonly country: string;
      };
    }
  | { readonly type: 'LOAD_SAVE_SLOT'; readonly payload: { readonly slotId: number } }
  | { readonly type: 'AGE_UP' }
  | { readonly type: 'SELECT_EVENT_OPTION'; readonly payload: { readonly optionId: string } }
  | {
      readonly type: 'PERFORM_ACTIVITY';
      readonly payload: {
        readonly activityId: string;
        readonly cost: number;
        readonly statDeltas: Partial<Record<StatKey, number>>;
        readonly activityLog: string;
      };
    }
  | {
      readonly type: 'INTERACT_RELATION';
      readonly payload: {
        readonly targetNpcId: string;
        readonly interactionType: 'chat' | 'spend_time' | 'ask_allowance';
        readonly scoreDelta: number;
      };
    }
  | { readonly type: 'SWITCH_TAB'; readonly payload: { readonly tab: ActiveTab } }
  | { readonly type: 'DISCARD_SESSION' }
  | { readonly type: 'RESET_GAME' };
