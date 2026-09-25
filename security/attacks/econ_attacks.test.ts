/**
 * RED TEAM ATTACK SUITE: ECONOMY & FINANCES
 * Target: Localhost in-process memory runtime
 * Payloads: ATK-007 s/d ATK-011
 */

import { describe, it, expect } from 'vitest';
import { createNewLife } from '../../src/core/character';
import { purchaseAsset, sellAsset, processAnnualCashflow, calculateAnnualTax } from '../../src/core/finances';

describe('RED TEAM: Economy & Financial Tamper (ATK-007 s/d ATK-011)', () => {
  it('[ATK-007-ECON] Injeksi saldo negatif ekstrem (bankBalance: -999999999)', () => {
    const state = createNewLife({ firstName: 'Broke', lastName: 'Attacker', gender: 'Male' });
    state.character.age = 25;
    state.character.finances.bankBalance = -999999999;

    const res = processAnnualCashflow(state);
    console.log('[ATK-007-ECON RAW RESP] Injected Balance:', state.character.finances.bankBalance, 'NetWorth:', state.character.finances.netWorth, 'Delta:', res.netSavingsDelta);

    // Negative balance persists into netWorth without lower clamp
    expect(state.character.finances.netWorth).toBeLessThan(-999999999);
  });

  it('[ATK-008-ECON] Integer Overflow / NaN pada saldo bank (bankBalance: NaN)', () => {
    const state = createNewLife({ firstName: 'NaN', lastName: 'Attacker', gender: 'Male' });
    state.character.age = 25;
    state.character.finances.bankBalance = NaN;

    processAnnualCashflow(state);
    console.log('[ATK-008-ECON RAW RESP] After cashflow, bankBalance:', state.character.finances.bankBalance, 'netWorth:', state.character.finances.netWorth);

    // VULNERABILITY AUDIT: finances.bankBalance does not sanitize NaN, spreading NaN to netWorth!
    expect(Number.isNaN(state.character.finances.bankBalance)).toBe(true);
    expect(Number.isNaN(state.character.finances.netWorth)).toBe(true);
  });

  it('[ATK-009-ECON] Pembelian aset tanpa saldo mencukupi (Saldo $100 beli aset $5,000)', () => {
    const state = createNewLife({ firstName: 'Fraud', lastName: 'Buyer', gender: 'Male' });
    state.character.finances.bankBalance = 100;

    const success = purchaseAsset(state, {
      id: 'veh_luxury_suv',
      name: 'SUV Mewah',
      category: 'Vehicle',
      value: 5000,
      maintenanceAnnual: 250,
    });

    console.log('[ATK-009-ECON RAW RESP] Purchase result:', success, 'Remaining balance:', state.character.finances.bankBalance);
    expect(success).toBe(false); // BLOCKED-OK by purchaseAsset balance guard
    expect(state.character.finances.bankBalance).toBe(100);
  });

  it('[ATK-010-ECON] Penjualan aset hantu (menjual assetId tidak terdaftar)', () => {
    const state = createNewLife({ firstName: 'Phantom', lastName: 'Seller', gender: 'Male' });
    state.character.finances.bankBalance = 500;

    const success = sellAsset(state, 'asset_phantom_yacht_999');
    console.log('[ATK-010-ECON RAW RESP] Sell phantom asset result:', success, 'Balance:', state.character.finances.bankBalance);

    expect(success).toBe(false); // BLOCKED-OK: index not found
    expect(state.character.finances.bankBalance).toBe(500);
  });

  it('[ATK-011-ECON] Manipulasi gaji kotor negatif (-$50,000)', () => {
    const tax = calculateAnnualTax(-50000);
    console.log('[ATK-011-ECON RAW RESP] Tax on negative salary (-$50,000):', tax);
    expect(tax).toBe(0); // BLOCKED-OK: calculateAnnualTax guards if (grossSalary <= 0) return 0
  });
});
