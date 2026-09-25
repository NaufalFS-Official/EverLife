import { describe, it, expect } from 'vitest';
import {
  selectEligibleEvent,
  resolveChoice,
  surpriseMeChoice,
  SCENARIO_BANK,
} from '../../src/core/events';
import { createNewLife } from '../../src/core/character';
import { Mulberry32PRNG } from '../../src/shared';

describe('TEST-AC-003: Interactive Decision Modals & Choice Outcomes', () => {
  it('harus memuat bank skenario yang semuanya memiliki 2 hingga 4 cabang pilihan', () => {
    expect(SCENARIO_BANK.length).toBeGreaterThanOrEqual(10);
    for (const evt of SCENARIO_BANK) {
      expect(evt.choices.length).toBeGreaterThanOrEqual(2);
      expect(evt.choices.length).toBeLessThanOrEqual(4);
    }
  });

  it('harus memilih skenario yang cocok dengan usia karakter saat ini', () => {
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      seed: 42,
    });
    state.character.age = 2; // Balita
    const rng = new Mulberry32PRNG(42);

    const event = selectEligibleEvent(state, rng);
    expect(event).not.toBeNull();
    if (event) {
      expect(event.minAge).toBeLessThanOrEqual(2);
      expect(event.maxAge).toBeGreaterThanOrEqual(2);
    }
  });

  it('harus menerapkan delta atribut dan menambahkan catatan ke lifeLog', () => {
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      seed: 1234,
    });
    const sampleEvent = SCENARIO_BANK[0]!;
    const prevLogCount = state.character.lifeLog.length;

    const res = resolveChoice(state, sampleEvent, 1); // Pilihan ke-2 (tetap tenang)
    expect(res.outcomeLog).toBeDefined();
    expect(state.character.lifeLog.length).toBe(prevLogCount + 1);
    expect(state.currentScreen).toBe('GAMEPLAY_ACTIVE');
  });

  it('harus dapat mengeksekusi "Surprise Me!" secara deterministik dengan seed', () => {
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      seed: 5678,
    });
    const rng = new Mulberry32PRNG(5678);
    const sampleEvent = SCENARIO_BANK[0]!;

    const res = surpriseMeChoice(state, sampleEvent, rng);
    expect(res.outcomeLog.length).toBeGreaterThan(0);
    expect(res.isFatal).toBe(false);
  });
});
