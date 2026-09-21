/**
 * ATK-014: Injeksi Nama Karakter Kosong atau Whitespace Murni
 * Kategori: INPUT / SANITIZATION
 * Target: GameEngine.submitCharacter (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { GameEngine } from '../../src/core/GameEngine';

describe('ATK-014-empty-name', () => {
  it('harus menolak pembuatan karakter dengan nama kosong atau spasi kosong', () => {
    const engine = new GameEngine();
    expect(() =>
      engine.submitCharacter({ name: '   ', gender: 'Pria' })
    ).toThrow(/ERR_INVALID_CHARACTER_NAME/);
    expect(() =>
      engine.submitCharacter({ name: '', gender: 'Wanita' })
    ).toThrow(/ERR_INVALID_CHARACTER_NAME/);
  });
});
