import { describe, it, expect } from 'vitest';
import { createNewLife } from '../../src/core/character';
import { tickAge } from '../../src/core/aging';
import { Mulberry32PRNG } from '../../src/shared';

describe('TEST-AC-002: Core Aging Engine & Annual Cycle', () => {
  it('harus menambah usia karakter tepat 1 tahun per penekanan tickAge', () => {
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      seed: 999,
    });

    const rng = new Mulberry32PRNG(999);
    expect(state.character.age).toBe(0);

    const res1 = tickAge(state, rng);
    expect(res1.nextState.character.age).toBe(1);
    expect(state.character.lifeLog.length).toBeGreaterThan(1);

    const res2 = tickAge(state, rng);
    expect(res2.nextState.character.age).toBe(2);
  });

  it('harus memicu milestone pendidikan otomatis saat mencapai usia sekolah', () => {
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      seed: 777,
    });
    const rng = new Mulberry32PRNG(777);

    // Maju sampai usia 6 tahun
    for (let i = 0; i < 6; i++) {
      tickAge(state, rng);
    }

    expect(state.character.age).toBe(6);
    expect(state.character.education.level).toBe('Primary');

    // Maju sampai usia 12 tahun
    for (let i = 6; i < 12; i++) {
      tickAge(state, rng);
    }
    expect(state.character.age).toBe(12);
    expect(state.character.education.level).toBe('Secondary');
  });

  it('harus memotong biaya hidup tahunan saat karakter menginjak usia dewasa (>= 18)', () => {
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      seed: 888,
    });
    state.character.finances.bankBalance = 10000;
    const rng = new Mulberry32PRNG(888);

    // Di bawah 18, biaya hidup = 0
    state.character.age = 16;
    tickAge(state, rng);
    expect(state.character.finances.bankBalance).toBe(10000);

    // Usia 18, dipotong biaya hidup $3,600
    state.character.age = 17;
    tickAge(state, rng); // Menjadi 18 tahun
    expect(state.character.finances.bankBalance).toBe(10000 - 3600);
  });
});
