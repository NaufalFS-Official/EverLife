/**
 * Suite Pengujian Red Team: Manipulasi Data Simpanan (Save Tampering).
 * Menguji ketahanan parser save, checksum FNV-1a, manipulasi stat, dan format data korup.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { describe, it, expect } from 'vitest';
import { SaveService } from '../../src/storage/SaveService';
import { GameEngine } from '../../src/core/GameEngine';
import { calculateChecksum } from '../../src/contracts/saveSchema';

describe('Red Team: Manipulasi Data Simpanan (Tamper Attacks)', () => {
  const saveService = new SaveService();

  it('ATK-001 [BLOCKED-OK]: Harus menolak save JSON jika saldo dimanipulasi tanpa memperbarui checksum', async () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Korban Tamper', gender: 'Pria' });
    const session = engine.getState().session!;
    const originalSave = await saveService.saveActiveSession(session, 1);
    const jsonStr = saveService.exportToJson(originalSave);

    // Serangan: Ubah cash dari 0 menjadi 999.999.999 tanpa memperbarui checksum
    const tamperedJson = jsonStr.replace('"cash": 0', '"cash": 999999999');

    expect(() => saveService.importFromJson(tamperedJson)).toThrow(
      /ERR_SAVE_CHECKSUM_MISMATCH/
    );
  });

  it('ATK-002 [BLOCKED-OK]: Harus menolak berkas dengan format JSON tidak valid / korup', () => {
    const brokenJson = '{"schemaVersion": 1, "profile": { broken json syntax';

    expect(() => saveService.importFromJson(brokenJson)).toThrow(
      /ERR_IMPORT_INVALID_JSON/
    );
  });

  it('ATK-003 [BLOCKED-OK]: Harus menolak berkas save dengan versi skema masa depan (schemaVersion > CURRENT)', () => {
    const futureSavePayload = {
      schemaVersion: 999,
      slotId: 1,
      updatedAt: new Date().toISOString(),
      lifeSeed: 12345,
      profile: {
        name: 'Penjelajah Waktu',
        gender: 'Pria' as const,
        country: 'Indonesia',
        birthYear: 2008,
        age: 10,
        cash: 1000,
        grade: 'SD' as const,
      },
      stats: { health: 90, happiness: 85, relationship: 80, academic: 50 },
      relations: [],
      timelineHistory: [],
      flags: [],
      isCompleted: false,
    };

    const checksum = calculateChecksum(futureSavePayload);
    const futureSaveJson = JSON.stringify({ ...futureSavePayload, checksum });

    expect(() => saveService.importFromJson(futureSaveJson)).toThrow(
      /ERR_SAVE_FUTURE_VERSION/
    );
  });

  it('ATK-004 [OPEN]: Client-side limitation: Pengguna dapat menghitung ulang checksum publik lokal', async () => {
    // Pengukuran realitas Mode A: Karena kode & algoritma checksum berada 100% di browser pemain,
    // penyerang yang mengubah data DAN menghitung ulang FNV-1a checksum dapat mengimpornya.
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Hacker Lokal', gender: 'Pria' });
    const session = engine.getState().session!;

    const tamperedPayload = {
      schemaVersion: 1,
      slotId: 1,
      updatedAt: new Date().toISOString(),
      lifeSeed: session.lifeSeed,
      profile: {
        ...session.profile,
        cash: 500000000, // 500 juta rupiah
      },
      stats: session.stats,
      relations: session.relations,
      timelineHistory: session.timelineHistory,
      flags: session.flags,
      isCompleted: session.isCompleted,
    };

    // Hacker menghitung ulang checksum yang cocok dengan payload baru
    const recalculatedChecksum = calculateChecksum(tamperedPayload);
    const tamperedWithChecksumJson = JSON.stringify({
      ...tamperedPayload,
      checksum: recalculatedChecksum,
    });

    const imported = saveService.importFromJson(tamperedWithChecksumJson);
    expect(imported.profile.cash).toBe(500000000);
    // Dokumentasi Red Team: Ini adalah batasan inherent Mode A (klien tanpa private key / server)
  });

  it('ATK-005 [BLOCKED-OK]: Harus menolak slotId di luar rentang sah (1..3)', async () => {
    expect(() => saveService.loadSlot(0)).rejects.toThrow(/ERR_INVALID_SLOT_ID/);
    expect(() => saveService.loadSlot(4)).rejects.toThrow(/ERR_INVALID_SLOT_ID/);
    expect(() => saveService.loadSlot(-1)).rejects.toThrow(/ERR_INVALID_SLOT_ID/);
  });

  it('ATK-001B [BLOCKED-OK]: Harus menolak save JSON jika usia dimanipulasi (age = 99 atau -5) tanpa memperbarui checksum', async () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Korban Usia', gender: 'Wanita' });
    const session = engine.getState().session!;
    const originalSave = await saveService.saveActiveSession(session, 1);
    const jsonStr = saveService.exportToJson(originalSave);

    // Serangan: ubah "age": 0 menjadi "age": 99 tanpa mengubah checksum
    const tamperedAge99 = jsonStr.replace('"age": 0', '"age": 99');
    expect(() => saveService.importFromJson(tamperedAge99)).toThrow(
      /ERR_SAVE_CHECKSUM_MISMATCH/
    );

    // Serangan: ubah "age": 0 menjadi "age": -5 tanpa mengubah checksum
    const tamperedAgeNeg = jsonStr.replace('"age": 0', '"age": -5');
    expect(() => saveService.importFromJson(tamperedAgeNeg)).toThrow(
      /ERR_SAVE_CHECKSUM_MISMATCH/
    );
  });
});
