import { describe, it, expect } from 'vitest';
import {
  createNewLife,
  clampStat,
  applyStatDeltas,
  generateInitialFamily,
} from '../../src/core/character';
import { Mulberry32PRNG } from '../../src/shared';

describe('TEST-AC-001: Character Creation Wizard & Sandbox Mutators', () => {
  it('harus membuat karakter baru dengan nama valid dan atribut default yang sah', () => {
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      seed: 42,
    });

    expect(state.character.name.first).toBe('Archie');
    expect(state.character.name.last).toBe('King');
    expect(state.character.age).toBe(0);
    expect(state.character.gender).toBe('Male');
    expect(state.character.attributes.happiness).toBeGreaterThanOrEqual(0);
    expect(state.character.attributes.happiness).toBeLessThanOrEqual(100);
    expect(state.character.lifeLog.length).toBeGreaterThanOrEqual(1);
    expect(state.character.lifeLog[0]?.categoryTag).toBe('Birth');
  });

  it('harus menolak nama depan atau belakang yang kosong (Guard validation)', () => {
    expect(() =>
      createNewLife({
        firstName: '',
        lastName: 'King',
        gender: 'Male',
      })
    ).toThrow('Nama depan dan belakang tidak boleh kosong');

    expect(() =>
      createNewLife({
        firstName: '   ',
        lastName: 'King',
        gender: 'Male',
      })
    ).toThrow('Nama depan dan belakang tidak boleh kosong');
  });

  it('harus meng-clamp atribut sandbox di dalam rentang aman [0, 100]', () => {
    expect(clampStat(-50)).toBe(0);
    expect(clampStat(150)).toBe(100);
    expect(clampStat(NaN)).toBe(0);
    expect(clampStat(Infinity)).toBe(0);
    expect(clampStat(75.6)).toBe(76);
  });

  it('harus menerapkan delta atribut dengan proteksi auto-clamping', () => {
    const initial = {
      happiness: 95,
      health: 10,
      smarts: 50,
      looks: 50,
      karma: 50,
      discipline: 50,
      fertility: 50,
      sexuality: 'Straight' as const,
    };

    const updated = applyStatDeltas(initial, {
      happiness: 20, // 95 + 20 = 115 -> clamped to 100
      health: -25,    // 10 - 25 = -15 -> clamped to 0
    });

    expect(updated.happiness).toBe(100);
    expect(updated.health).toBe(0);
    expect(updated.smarts).toBe(50);
  });

  it('harus menghasilkan orang tua (Ayah & Ibu) yang konsisten dengan seed PRNG', () => {
    const rng1 = new Mulberry32PRNG(12345);
    const family1 = generateInitialFamily(rng1, 'King');

    const rng2 = new Mulberry32PRNG(12345);
    const family2 = generateInitialFamily(rng2, 'King');

    expect(family1).toEqual(family2);
    expect(family1.length).toBe(2);
    expect(family1[0]?.role).toBe('Father');
    expect(family1[1]?.role).toBe('Mother');
  });
});
