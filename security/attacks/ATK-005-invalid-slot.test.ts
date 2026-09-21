/**
 * ATK-005: Akses Slot Simpanan di Luar Batas Sah (Slot ID Boundary Bypass)
 * Kategori: STORAGE / BOUNDARY
 * Target: SaveService.loadSlot, deleteSlot (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { SaveService } from '../../src/storage/SaveService';

describe('ATK-005-invalid-slot', () => {
  it('harus menolak nomor slot di luar batas 1..3', async () => {
    const saveService = new SaveService();

    await expect(saveService.loadSlot(0)).rejects.toThrow(/ERR_INVALID_SLOT_ID/);
    await expect(saveService.loadSlot(4)).rejects.toThrow(/ERR_INVALID_SLOT_ID/);
    await expect(saveService.loadSlot(-1)).rejects.toThrow(/ERR_INVALID_SLOT_ID/);
    await expect(saveService.deleteSlot(99)).rejects.toThrow(/ERR_INVALID_SLOT_ID/);
  });
});
