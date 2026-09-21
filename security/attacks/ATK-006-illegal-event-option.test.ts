/**
 * ATK-006: Injeksi Opsi Event Ilegal / Fiktif
 * Kategori: LOGIC / EVENT
 * Target: GameEngine.selectEventOption (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { GameEngine } from '../../src/core/GameEngine';

describe('ATK-006-illegal-event-option', () => {
  it('harus menolak optionId ilegal tanpa menyebabkan unhandled crash', () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Subjek Uji', gender: 'Pria' });

    while (engine.getState().screen !== 'EVENT_MODAL') {
      engine.ageUp();
    }

    expect(engine.getState().screen).toBe('EVENT_MODAL');

    expect(() => engine.selectEventOption('opt-hacked-999')).toThrow(
      /ERR_INVALID_OPTION_ID/
    );

    expect(engine.getState().screen).toBe('EVENT_MODAL');
  });
});
