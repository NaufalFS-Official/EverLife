/**
 * ATK-008: Eksekusi Pekerjaan Paruh Waktu di Bawah Usia Pembuka
 * Kategori: LOGIC / ECONOMY
 * Target: EconomyEngine.executeActivity (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { EconomyEngine } from '../../src/core/EconomyEngine';

describe('ATK-008-underage-job', () => {
  it('harus menolak eksekusi pekerjaan paruh waktu di bawah usia 15 tahun', () => {
    expect(() =>
      EconomyEngine.executeActivity({
        activityId: 'act-part-time',
        currentAge: 8, // Usia SD (pembuka pekerjaan adalah 15 tahun)
        currentCash: 0,
      })
    ).toThrow(/ERR_ACTIVITY_LOCKED/);
  });
});
