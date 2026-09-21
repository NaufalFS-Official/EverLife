/**
 * ATK-013: Penambahan Umur Melebihi Batas Maksimal SMA (18 Tahun)
 * Kategori: STATE / BOUNDARY
 * Target: GameEngine.ageUp (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { GameEngine } from '../../src/core/GameEngine';

describe('ATK-013-max-age-overflow', () => {
  it('harus menolak penambahan umur ketika telah mencapai usia batas SMA (18 tahun)', () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Subjek Lulus', gender: 'Wanita' });

    const session = engine.getState().session!;
    engine.loadSession({ ...session, profile: { ...session.profile, age: 18 } }, 1);

    expect(() => engine.ageUp()).toThrow(/ERR_AGE_UP_GUARD/);
  });
});
