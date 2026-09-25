import { describe, it, expect } from 'vitest';
import {
  calculateMortalityProbability,
  evaluateMortality,
  evaluateRibbon,
} from '../../src/core/mortality';
import { createNewLife } from '../../src/core/character';
import { Mulberry32PRNG } from '../../src/shared';

describe('TEST-AC-004 & TEST-AC-007: Mortality Formula & Memorial Ribbon', () => {
  it('harus menghasilkan probabilitas 1.0 (kematian mutlak) jika Health <= 0%', () => {
    expect(calculateMortalityProbability(25, 0)).toBe(1.0);
    expect(calculateMortalityProbability(80, -10)).toBe(1.0);
  });

  it('harus meningkatkan mortalitas seiring bertambahnya usia', () => {
    const probYoung = calculateMortalityProbability(10, 90);
    const probMiddle = calculateMortalityProbability(50, 90);
    const probElderly = calculateMortalityProbability(80, 90);

    expect(probYoung).toBeLessThan(probMiddle);
    expect(probMiddle).toBeLessThan(probElderly);
  });

  it('harus memicu kematian instan saat health karakter habis', () => {
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      seed: 555,
    });
    state.character.attributes.health = 0;

    const rng = new Mulberry32PRNG(555);
    const result = evaluateMortality(state, rng);

    expect(result.isDead).toBe(true);
    expect(result.cause).toContain('Health 0%');
  });

  it('harus mengevaluasi pita kehormatan (Ribbon) secara akurat', () => {
    const state = createNewLife({
      firstName: 'Richie',
      lastName: 'Rich',
      gender: 'Male',
      seed: 111,
    });

    state.character.finances.netWorth = 2500000;
    expect(evaluateRibbon(state)).toBe('Loaded');

    state.character.finances.netWorth = 50000;
    state.character.attributes.karma = 95;
    expect(evaluateRibbon(state)).toBe('Saint');

    state.character.attributes.karma = 5;
    expect(evaluateRibbon(state)).toBe('Wicked');

    state.character.age = 101;
    expect(evaluateRibbon(state)).toBe('Centenarian');
  });
});
