/**
 * PERSONAL FINANCES & ASSET ACCOUNTING (EverLife)
 * Layer 1 Core: Cashflow, tax brackets, asset valuation, net worth audit.
 */

import { GAME_CONFIG } from '../shared';
import { GlobalGameState, AssetItem } from './types';

/**
 * Menghitung nilai total aset yang dimiliki karakter.
 */
export function calculateTotalAssetValue(assets: AssetItem[] = []): number {
  return assets.reduce((sum, item) => sum + item.value, 0);
}

/**
 * Menghitung biaya pemeliharaan tahunan seluruh aset (mobil, rumah).
 */
export function calculateAnnualAssetMaintenance(assets: AssetItem[] = []): number {
  return assets.reduce((sum, item) => {
    return sum + (item.maintenanceAnnual > 0 ? item.maintenanceAnnual : Math.round(item.value * GAME_CONFIG.ASSET_MAINTENANCE_RATE));
  }, 0);
}

/**
 * Menghitung pajak penghasilan tahunan.
 */
export function calculateAnnualTax(grossSalary: number): number {
  if (grossSalary <= 0) return 0;
  return Math.round(grossSalary * GAME_CONFIG.TAX_RATE_DEFAULT);
}

/**
 * Menghitung biaya hidup tahunan dasar.
 * Usia di bawah 18 tahun ditanggung orang tua (biaya = 0).
 */
export function calculateLivingExpenses(age: number): number {
  if (age < 18) return 0;
  return GAME_CONFIG.LIVING_EXPENSE_BASE;
}

/**
 * Sanitasi nilai moneter untuk mencegah injeksi NaN, Infinity, atau non-number.
 */
export function sanitizeCurrency(val: unknown, fallback: number = 0): number {
  if (typeof val !== 'number' || Number.isNaN(val) || !Number.isFinite(val)) {
    return fallback;
  }
  return Math.round(val);
}

/**
 * Menghitung dan memperbarui saldo serta kekayaan bersih tahunan.
 */
export function processAnnualCashflow(state: GlobalGameState): {
  netSavingsDelta: number;
  salaryEarned: number;
  taxPaid: number;
  livingCost: number;
  maintenanceCost: number;
} {
  const { character } = state;
  const salary = character.job ? sanitizeCurrency(character.job.salary, 0) : 0;
  const tax = calculateAnnualTax(salary);
  const living = calculateLivingExpenses(character.age);
  const maintenance = calculateAnnualAssetMaintenance(character.assets ?? []);

  const totalExpense = living + maintenance + tax;
  const netSavingsDelta = salary - totalExpense;

  const currentBalance = sanitizeCurrency(character.finances.bankBalance, 0);
  const updatedBalance = currentBalance + netSavingsDelta;

  character.finances.annualSalary = salary;
  character.finances.livingExpenses = totalExpense;
  character.finances.bankBalance = sanitizeCurrency(updatedBalance, 0);

  const totalAssets = calculateTotalAssetValue(character.assets ?? []);
  character.finances.netWorth = character.finances.bankBalance + totalAssets;

  return {
    netSavingsDelta,
    salaryEarned: salary,
    taxPaid: tax,
    livingCost: living,
    maintenanceCost: maintenance,
  };
}

/**
 * Membeli aset baru jika saldo mencukupi.
 */
export function purchaseAsset(
  state: GlobalGameState,
  assetTemplate: Omit<AssetItem, 'yearPurchased'>
): boolean {
  state.character.finances.bankBalance = sanitizeCurrency(state.character.finances.bankBalance, 0);
  if (state.character.finances.bankBalance < assetTemplate.value) {
    return false;
  }

  state.character.finances.bankBalance -= assetTemplate.value;
  const newAsset: AssetItem = {
    ...assetTemplate,
    yearPurchased: state.character.age,
  };

  if (!state.character.assets) {
    state.character.assets = [];
  }
  state.character.assets.push(newAsset);

  const totalAssets = calculateTotalAssetValue(state.character.assets);
  state.character.finances.netWorth = state.character.finances.bankBalance + totalAssets;
  return true;
}

/**
 * Menjual aset dengan memperhitungkan depresiasi tahunan.
 */
export function sellAsset(state: GlobalGameState, assetId: string): boolean {
  if (!state.character.assets) return false;

  const index = state.character.assets.findIndex((a) => a.id === assetId);
  if (index === -1) return false;

  const item = state.character.assets[index];
  if (!item) return false;

  // Depresiasi kendaraan 10% per tahun, properti apresiasi 3% per tahun
  const ageOfAsset = Math.max(0, state.character.age - item.yearPurchased);
  let saleValue = item.value;
  if (item.category === 'Vehicle') {
    saleValue = Math.round(item.value * Math.max(0.2, 1 - ageOfAsset * 0.1));
  } else {
    saleValue = Math.round(item.value * (1 + ageOfAsset * 0.03));
  }

  state.character.assets.splice(index, 1);
  const currentBalance = sanitizeCurrency(state.character.finances.bankBalance, 0);
  state.character.finances.bankBalance = currentBalance + saleValue;

  const totalAssets = calculateTotalAssetValue(state.character.assets);
  state.character.finances.netWorth = state.character.finances.bankBalance + totalAssets;
  return true;
}
