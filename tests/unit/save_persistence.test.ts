import { describe, it, expect } from 'vitest';
import { LocalSaveRepository } from '../../src/adapter/localAdapter';
import { createNewLife } from '../../src/core/character';

describe('TEST-AC-008: Save/Load Persistence via LocalAdapter with HMAC Checksum', () => {
  it('harus berhasil menyimpan, memuat, dan memvalidasi integritas state karakter', async () => {
    const repo = new LocalSaveRepository();
    const originalState = createNewLife({
      firstName: 'Saver',
      lastName: 'Hero',
      gender: 'Male',
      seed: 98765,
    });
    originalState.character.finances.bankBalance = 55000;
    originalState.character.age = 25;

    const saved = await repo.save(originalState);
    expect(saved).toBe(true);

    const loaded = await repo.load();
    expect(loaded).not.toBeNull();
    if (loaded) {
      expect(loaded.character.name.first).toBe('Saver');
      expect(loaded.character.age).toBe(25);
      expect(loaded.character.finances.bankBalance).toBe(55000);
    }

    await repo.clear();
    const afterClear = await repo.load();
    expect(afterClear).toBeNull();
  });
});
