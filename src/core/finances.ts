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
  const salary = character.job ? character.job.salary : 0;
  const tax = calculateAnnualTax(salary);
  const living = calculateLivingExpenses(character.age);
  const maintenance = calculateAnnualAssetMaintenance(character.assets ?? []);

  const totalExpense = living + maintenance + tax;
  const netSavingsDelta = salary - totalExpense;

  character.finances.annualSalary = salary;
  character.finances.livingExpenses = totalExpense;
  character.finances.bankBalance += netSavingsDelta;

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
  state.character.finances.bankBalance += saleValue;

  const totalAssets = calculateTotalAssetValue(state.character.assets);
  state.character.finances.netWorth = state.character.finances.bankBalance + totalAssets;
  return true;
}
