/**
 * Kalkulator Mutasi Statistik & Boundary Clamping EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S7.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import { CharacterStats, EducationGrade, StatKey } from '../contracts/gameState';
import { GAME_CONFIG } from '../contracts/gameConfig';

export class StatCalculator {
  /**
   * Mengunci nilai statistik di antara batas aman [CFG_STAT_MIN, CFG_STAT_MAX].
   */
  public static clamp(value: number): number {
    return Math.max(GAME_CONFIG.CFG_STAT_MIN, Math.min(GAME_CONFIG.CFG_STAT_MAX, Math.round(value)));
  }

  /**
   * Menerapkan delta perubahan pada statistik karakter dengan proteksi clamping kaku.
   */
  public static applyDeltas(
    current: CharacterStats,
    deltas: Partial<Record<StatKey, number>>
  ): CharacterStats {
    return {
      health: this.clamp(current.health + (deltas.health ?? 0)),
      happiness: this.clamp(current.happiness + (deltas.happiness ?? 0)),
      relationship: this.clamp(current.relationship + (deltas.relationship ?? 0)),
      academic: this.clamp(current.academic + (deltas.academic ?? 0)),
    };
  }

  /**
   * Mengevaluasi penalti kebahagiaan tahunan jika kesehatan karakter di bawah ambang batas (20%).
   */
  public static evaluateHealthPenalty(stats: CharacterStats): {
    readonly stats: CharacterStats;
    readonly penaltyApplied: boolean;
    readonly penaltyAmount: number;
  } {
    if (stats.health < 20 && stats.health > 0) {
      const penalty = GAME_CONFIG.CFG_HEALTH_PENALTY_DEPLETION;
      return {
        stats: {
          ...stats,
          happiness: this.clamp(stats.happiness - penalty),
        },
        penaltyApplied: true,
        penaltyAmount: penalty,
      };
    }
    return {
      stats,
      penaltyApplied: false,
      penaltyAmount: 0,
    };
  }

  /**
   * Menentukan jenjang pendidikan berdasarkan umur karakter saat ini.
   */
  public static resolveGrade(age: number): EducationGrade {
    if (age < GAME_CONFIG.CFG_AGE_PRIMARY_SCHOOL) {
      return 'Balita';
    }
    if (age < GAME_CONFIG.CFG_AGE_MIDDLE_SCHOOL) {
      return 'SD';
    }
    if (age < GAME_CONFIG.CFG_AGE_HIGH_SCHOOL) {
      return 'SMP';
    }
    if (age < GAME_CONFIG.CFG_AGE_MAX_V1) {
      return 'SMA';
    }
    return 'Lulus SMA';
  }

  /**
   * Menghitung jatah uang saku tahunan otomatis berdasarkan umur.
   */
  public static resolveAnnualAllowance(age: number): number {
    if (age < GAME_CONFIG.CFG_AGE_PRIMARY_SCHOOL) {
      return 0; // Balita belum menerima uang saku mandiri
    }
    if (age < GAME_CONFIG.CFG_AGE_MIDDLE_SCHOOL) {
      return GAME_CONFIG.CFG_ALLOWANCE_BASE_SD;
    }
    if (age < GAME_CONFIG.CFG_AGE_HIGH_SCHOOL) {
      return GAME_CONFIG.CFG_ALLOWANCE_BASE_SMP;
    }
    return GAME_CONFIG.CFG_ALLOWANCE_BASE_SMA;
  }
}
