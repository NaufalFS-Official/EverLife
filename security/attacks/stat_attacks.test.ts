/**
 * RED TEAM ATTACK SUITE: STAT & CHARACTER ATTRIBUTES
 * Target: Localhost in-process memory runtime
 * Payloads: ATK-001 s/d ATK-006
 */

import { describe, it, expect } from 'vitest';
import { clampStat, applyStatDeltas, createNewLife } from '../../src/core/character';
import { tickAge } from '../../src/core/aging';
import { Mulberry32PRNG } from '../../src/shared';

describe('RED TEAM: Stat & Attribute Tamper (ATK-001 s/d ATK-006)', () => {
  it('[ATK-001-STAT] Injeksi stat di atas ceiling (health: 999999)', () => {
    const rawVal = 999999;
    const clamped = clampStat(rawVal);
    console.log('[ATK-001-STAT RAW RESP] Input:', rawVal, 'Output:', clamped);
    expect(clamped).toBe(100); // BLOCKED-OK by clampStat
  });

  it('[ATK-002-STAT] Injeksi stat negatif (happiness: -500)', () => {
    const initial = {
      happiness: 80,
      health: 80,
      smarts: 80,
      looks: 80,
      karma: 50,
      discipline: 50,
      fertility: 50,
      sexuality: 'Straight' as const,
    };
    const mutated = applyStatDeltas(initial, { happiness: -500 });
    console.log('[ATK-002-STAT RAW RESP] Input: -500, Result happiness:', mutated.happiness);
    expect(mutated.happiness).toBe(0); // BLOCKED-OK by clampStat
  });

  it('[ATK-003-STAT] Injeksi NaN pada atribut karakter (smarts: NaN)', () => {
    const clamped = clampStat(NaN);
    console.log('[ATK-003-STAT RAW RESP] Input: NaN, Output:', clamped);
    expect(clamped).toBe(0); // BLOCKED-OK: NaN falls back to min safe value 0
  });

  it('[ATK-004-STAT] Injeksi Infinity pada atribut karakter (karma: Infinity)', () => {
    const clamped = clampStat(Infinity);
    console.log('[ATK-004-STAT RAW RESP] Input: Infinity, Output:', clamped);
    expect(clamped).toBe(0); // BLOCKED-OK: Infinity rejected by isFinite check
  });

  it('[ATK-005-STAT] Delta usia mustahil / Age rewind manipulasi manual (35 -> 10)', () => {
    const state = createNewLife({ firstName: 'Test', lastName: 'Rewind', gender: 'Male', seed: 12345 });
    state.character.age = 35;
    state.character.lifeLog.push({ age: 35, text: 'Usia 35 tahun', categoryTag: 'Aging', iconKey: 'icon_age' });

    // Attacker manually reverts age in memory
    state.character.age = 10;
    const rng = new Mulberry32PRNG(999);
    tickAge(state, rng);

    console.log('[ATK-005-STAT RAW RESP] Memory reverted to 10, after tickAge age is:', state.character.age);
    // HARDENED VERIFICATION (ADA Blue Team):
    // validateAndSyncAgeMonotonicity detects rewind (age 10 < maxRecordedAge 35), restores to 35, advances to 36
    expect(state.character.age).toBe(36);
  });

  it('[ATK-006-STAT] Delta usia melonjak / Age skip (5 -> 95)', () => {
    const state = createNewLife({ firstName: 'Test', lastName: 'Skip', gender: 'Male', seed: 54321 });
    state.character.age = 5;
    state.character.lifeLog.push({ age: 5, text: 'Usia 5 tahun', categoryTag: 'Aging', iconKey: 'icon_age' });

    // Attacker forcibly jumps age to 95 in memory
    state.character.age = 95;
    const rng = new Mulberry32PRNG(888);
    tickAge(state, rng);

    console.log('[ATK-006-STAT RAW RESP] Memory jumped to 95, after tickAge age is:', state.character.age, 'Screen:', state.currentScreen);
    // HARDENED VERIFICATION (ADA Blue Team):
    // validateAndSyncAgeMonotonicity detects skip (> lastLoggedAge + 1), clamps to 5, advances strictly to 6
    expect(state.character.age).toBe(6);
  });
});
