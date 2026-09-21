/**
 * Engine Generator & Resolusi Peristiwa Deterministik EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4.5.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import { EventDilemma, EventOption } from '../contracts/gameEvents';
import { TimelineLogEntry, CharacterStats } from '../contracts/gameState';
import { MASTER_EVENT_POOL, findEventById } from './EventPool';
import { PRNG } from './prng';
import { StatCalculator } from './StatCalculator';

export class EventEngine {
  /**
   * Menarik satu kartu peristiwa yang cocok untuk usia dan kondisi karakter saat ini.
   * Menggunakan PRNG deterministik per kehidupan (lifeSeed).
   */
  public static selectEventForAge(params: {
    readonly age: number;
    readonly prng: PRNG;
    readonly pastFlags: readonly string[];
    readonly pastEventIds: readonly string[];
  }): EventDilemma | null {
    const candidates = MASTER_EVENT_POOL.filter(event => {
      // 1. Filter usia
      if (params.age < event.minAge || params.age > event.maxAge) {
        return false;
      }
      // 2. Filter event unik yang sudah pernah terjadi
      if (event.isUnique && params.pastEventIds.includes(event.id)) {
        return false;
      }
      // 3. Filter prasyarat flag
      if (event.requiredFlag && !params.pastFlags.includes(event.requiredFlag)) {
        return false;
      }
      return true;
    });

    if (candidates.length === 0) {
      return null;
    }

    const selectedIndex = params.prng.nextInt(0, candidates.length - 1);
    const chosen = candidates[selectedIndex];
    return chosen ?? null;
  }

  /**
   * Mengeksekusi resolusi cabang opsi yang dipilih oleh pemain.
   */
  public static resolveOption(params: {
    readonly event: EventDilemma;
    readonly optionId: string;
    readonly currentStats: CharacterStats;
    readonly currentCash: number;
    readonly currentAge: number;
  }): {
    readonly nextStats: CharacterStats;
    readonly nextCash: number;
    readonly grantedFlag?: string;
    readonly logEntry: TimelineLogEntry;
    readonly selectedOption: EventOption;
  } {
    const option = params.event.options.find(opt => opt.id === params.optionId);
    if (!option) {
      throw new Error(`ERR_INVALID_OPTION_ID: Opsi '${params.optionId}' tidak ditemukan pada event '${params.event.id}'.`);
    }

    const nextStats = StatCalculator.applyDeltas(params.currentStats, option.statDeltas);
    const cashDelta = option.statDeltas['cash'] ?? 0;
    const nextCash = Math.max(0, params.currentCash + cashDelta);

    const logEntry: TimelineLogEntry = {
      age: params.currentAge,
      title: params.event.title,
      description: `${params.event.narrative} -> ${option.resultLog}`,
      category: params.event.category,
      statDeltas: option.statDeltas,
    };

    return {
      nextStats,
      nextCash,
      grantedFlag: option.grantFlag,
      logEntry,
      selectedOption: option,
    };
  }

  /**
   * Mengambil event berdasarkan ID langsung.
   */
  public static getEvent(id: string): EventDilemma | undefined {
    return findEventById(id);
  }
}
