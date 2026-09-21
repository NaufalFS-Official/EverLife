/**
 * ATK-007: Bypass Guard Penambahan Umur Saat Modal Event Aktif
 * Kategori: STATE / GUARD
 * Target: GameEngine.ageUp (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { GameEngine } from '../../src/core/GameEngine';

describe('ATK-007-bypass-ageup-guard', () => {
  it('harus menolak pemanggilan ageUp saat layar berada pada EVENT_MODAL', () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Subjek Guard', gender: 'Wanita' });

    while (engine.getState().screen !== 'EVENT_MODAL') {
      engine.ageUp();
    }

    expect(engine.getState().screen).toBe('EVENT_MODAL');
    expect(() => engine.ageUp()).toThrow(/ERR_AGE_UP_GUARD/);
  });
});
