/**
 * ATK-003: Injeksi Skema Simpanan Masa Depan (Future Schema Version)
 * Kategori: STORAGE / SCHEMA
 * Target: SaveService.importFromJson (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { SaveService } from '../../src/storage/SaveService';
import { calculateChecksum } from '../../src/contracts/saveSchema';

describe('ATK-003-future-schema', () => {
  it('harus menolak berkas save dengan versi skema masa depan (schemaVersion > CURRENT_SCHEMA_VERSION)', () => {
    const saveService = new SaveService();
    const futurePayload = {
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

    const checksum = calculateChecksum(futurePayload);
    const jsonStr = JSON.stringify({ ...futurePayload, checksum });

    expect(() => saveService.importFromJson(jsonStr)).toThrow(/ERR_SAVE_FUTURE_VERSION/);
  });
});
