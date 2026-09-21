/**
 * ATK-002: Injeksi Berkas Simpanan Korup / Sintaks Rusak
 * Kategori: INPUT / STORAGE
 * Target: SaveService.importFromJson (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { SaveService } from '../../src/storage/SaveService';

describe('ATK-002-corrupt-json', () => {
  it('harus menolak string JSON yang rusak atau terpotong', () => {
    const saveService = new SaveService();
    const corruptedPayload = '{"schemaVersion": 1, "profile": { "name": "Broken", ';

    expect(() => saveService.importFromJson(corruptedPayload)).toThrow(
      /ERR_IMPORT_INVALID_JSON/
    );
  });
});
