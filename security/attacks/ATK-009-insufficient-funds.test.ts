/**
 * ATK-009: Eksploitasi Saldo Negatif / Dana Tidak Cukup untuk Aktivitas Berbayar
 * Kategori: ECONOMY / VALIDATION
 * Target: EconomyEngine.executeActivity (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { EconomyEngine } from '../../src/core/EconomyEngine';

describe('ATK-009-insufficient-funds', () => {
  it('harus menolak aktivitas berbayar jika saldo kas tidak mencukupi', () => {
    const result = EconomyEngine.executeActivity({
      activityId: 'act-tutoring', // Biaya Rp 30.000
      currentAge: 11,
      currentCash: 5000, // Saldo hanya Rp 5.000
    });

    expect(result.success).toBe(false);
    expect(result.cashDelta).toBe(0);
    expect(result.message).toContain('Saldo tidak mencukupi');
  });
});
