/**
 * CORE TYPES & DOMAIN INTERFACES (EverLife)
 * Layer 1: Pure TypeScript definitions, decoupling domain logic from UI/DOM.
 */

import {
  GlobalGameState,
  CharacterAttributes,
  CharacterAppearance,
  NPC,
  LogEntry,
  ScenarioEvent,
  ChoiceOutcome,
  GameScreenState,
  Gender,
  SpecialTalent,
  EducationLevel,
  Sexuality,
  NPCRole,
  AssetItem,
} from '../shared';
import type { CharacterCreationParams } from './character';

export type {
  CharacterCreationParams,
  GlobalGameState,
  CharacterAttributes,
  CharacterAppearance,
  NPC,
  LogEntry,
  ScenarioEvent,
  ChoiceOutcome,
  GameScreenState,
  Gender,
  SpecialTalent,
  EducationLevel,
  Sexuality,
  NPCRole,
  AssetItem,
};

export type PlayerAction =
  | { type: 'AGE_UP' }
  | { type: 'CHOOSE_OPTION'; eventId: string; choiceIndex: number }
  | { type: 'SPEND_TIME_NPC'; npcId: string }
  | { type: 'APPLY_JOB'; jobId: string }
  | { type: 'QUIT_JOB' }
  | { type: 'BUY_ASSET'; assetId: string }
  | { type: 'SELL_ASSET'; assetId: string }
  | { type: 'COMMIT_CRIME'; crimeType: 'shoplift' | 'robbery' | 'heist' }
  | { type: 'VISIT_DOCTOR' }
  | { type: 'GO_TO_GYM' };

export interface SimulationResult {
  finalState: GlobalGameState;
  stateHash: string;
  log: string[];
}
