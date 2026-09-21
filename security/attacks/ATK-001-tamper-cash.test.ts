/**
 * ATK-001: Manipulasi Saldo Kas pada Berkas Simpanan JSON
 * Kategori: STORAGE / TAMPER
 * Target: SaveService.importFromJson (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { SaveService } from '../../src/storage/SaveService';
import { GameEngine } from '../../src/core/GameEngine';

describe('ATK-001-tamper-cash', () => {
  it('harus mendeteksi modifikasi saldo cash tanpa checksum yang valid dan menolak impor', async () => {
    const saveService = new SaveService();
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Target Tamper', gender: 'Pria' });

    const session = engine.getState().session!;
    const originalSave = await saveService.saveActiveSession(session, 1);
    const jsonStr = saveService.exportToJson(originalSave);

    // PAYLOAD: Ubah cash dari 0 menjadi 999.999.999
    const payload = jsonStr.replace('"cash": 0', '"cash": 999999999');

    expect(() => saveService.importFromJson(payload)).toThrow(/ERR_SAVE_CHECKSUM_MISMATCH/);
  });
});
