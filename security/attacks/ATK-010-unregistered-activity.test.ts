/**
 * ATK-010: Injeksi Aktivitas Fiktif / Tidak Terdaftar
 * Kategori: LOGIC / INJECTION
 * Target: EconomyEngine.executeActivity (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { EconomyEngine } from '../../src/core/EconomyEngine';

describe('ATK-010-unregistered-activity', () => {
  it('harus menolak aktivitas yang tidak terdaftar dalam konfigurasi sistem', () => {
    expect(() =>
      EconomyEngine.executeActivity({
        activityId: 'act-cheat-billionaire',
        currentAge: 16,
        currentCash: 100000,
      })
    ).toThrow(/ERR_ACTIVITY_NOT_FOUND/);
  });
});
