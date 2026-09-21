/**
 * Master Pool Kartu Dilema Kejadian EverLife v1.0 (Lahir hingga Tamat SMA).
 * Total 50 Kartu Kejadian Lengkap.
 * Sumber: Blueprint S7 (CFG_EVENT_POOL_SIZE_V1).
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { EventDilemma } from '../contracts/gameEvents';
import { TODDLER_EVENTS } from './eventDataToddler';
import { ELEMENTARY_EVENTS } from './eventDataElementary';
import { MIDDLE_EVENTS } from './eventDataMiddle';
import { HIGH_EVENTS } from './eventDataHigh';

export const MASTER_EVENT_POOL: readonly EventDilemma[] = [
  ...TODDLER_EVENTS,
  ...ELEMENTARY_EVENTS,
  ...MIDDLE_EVENTS,
  ...HIGH_EVENTS,
];

export function findEventById(id: string): EventDilemma | undefined {
  return MASTER_EVENT_POOL.find(event => event.id === id);
}

export function getEventsForAge(age: number): readonly EventDilemma[] {
  return MASTER_EVENT_POOL.filter(event => age >= event.minAge && age <= event.maxAge);
}
