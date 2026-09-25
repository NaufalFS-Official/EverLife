import { describe, it, expect, beforeEach } from 'vitest';
import { LocalSaveRepository } from '../../src/adapter/localAdapter';
import { createNewLife } from '../../src/core/character';
import { createSaveEnvelope } from '../../src/shared';

describe('Storage Fallback & Export/Import System', () => {
  let repo: LocalSaveRepository;

  beforeEach(() => {
    repo = new LocalSaveRepository();
  });

  it('harus berhasil menyimpan dan membaca ulang state game', async () => {
    const initialState = createNewLife({
      firstName: 'Budi',
      lastName: 'Santoso',
      gender: 'Male',
      country: 'Indonesia',
      city: 'Jakarta',
    });

    const saved = await repo.save(initialState);
    expect(saved).toBe(true);

    const loaded = await repo.load();
    expect(loaded).not.toBeNull();
    expect(loaded?.character.name.first).toBe('Budi');
    expect(loaded?.character.name.last).toBe('Santoso');
  });

  it('harus dapat mengekspor payload terserialisasi dengan checksum HMAC', async () => {
    const state = createNewLife({
      firstName: 'Siti',
      lastName: 'Rahma',
      gender: 'Female',
      country: 'Indonesia',
      city: 'Surabaya',
    });

    await repo.save(state);
    const exported = await repo.exportPayload();

    expect(exported).toBeTruthy();
    const parsed = JSON.parse(exported);
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.checksum).toBeTruthy();
    expect(parsed.payload.character.name.first).toBe('Siti');
  });

  it('harus menerima dan memulihkan data save valid melalui importPayload', async () => {
    const state = createNewLife({
      firstName: 'Dewi',
      lastName: 'Lestari',
      gender: 'Female',
      country: 'Indonesia',
      city: 'Bandung',
    });

    const envelope = createSaveEnvelope(state);
    const serialized = JSON.stringify(envelope);

    const imported = await repo.importPayload(serialized);
    expect(imported).toBe(true);

    const loaded = await repo.load();
    expect(loaded?.character.name.first).toBe('Dewi');
  });

  it('harus menolak payload yang dimanipulasi (tampered checksum)', async () => {
    const state = createNewLife({
      firstName: 'Joko',
      lastName: 'Widodo',
      gender: 'Male',
      country: 'Indonesia',
      city: 'Solo',
    });

    const envelope = createSaveEnvelope(state);
    // Tamper payload tanpa update checksum
    envelope.payload.character.finances.bankBalance = 999999999;
    const tampered = JSON.stringify(envelope);

    const imported = await repo.importPayload(tampered);
    expect(imported).toBe(false);
  });

  it('harus menolak string non-JSON atau schemaVersion tidak valid', async () => {
    expect(await repo.importPayload('bukan_json_valid')).toBe(false);
    expect(await repo.importPayload('')).toBe(false);

    const invalidVersion = JSON.stringify({
      schemaVersion: 0,
      timestamp: Date.now(),
      checksum: 'abc',
      payload: {},
    });
    expect(await repo.importPayload(invalidVersion)).toBe(false);
  });
});
