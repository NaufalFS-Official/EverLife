/**
 * ATK-012: Bypass Penambahan Umur pada Karakter yang Telah Wafat
 * Kategori: STATE / GAME_OVER
 * Target: GameEngine.ageUp (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { GameEngine } from '../../src/core/GameEngine';

describe('ATK-012-deceased-ageup', () => {
  it('harus menolak penambahan umur ketika karakter telah wafat (health <= 0)', () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Subjek Mati', gender: 'Pria' });

    const session = engine.getState().session!;
    engine.loadSession({ ...session, stats: { ...session.stats, health: 0 } }, 1);

    expect(engine.getState().screen).toBe('GAME_OVER_DEATH');
    expect(() => engine.ageUp()).toThrow(/ERR_AGE_UP_GUARD/);
  });
});
