/**
 * Modul Inisialisasi Karakter Baru (FTUE Usia 0) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S2, S3, S7.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import { ActiveSession, CharacterProfile, CharacterStats, Gender, TimelineLogEntry } from '../contracts/gameState';
import { GAME_CONFIG } from '../contracts/gameConfig';
import { RelationEngine } from './RelationEngine';

export interface CreateCharacterInput {
  readonly name: string;
  readonly gender: Gender;
  readonly country?: string;
  readonly birthYear?: number;
  readonly lifeSeed?: number;
}

export class CharacterInitializer {
  /**
   * Membuat sesi kehidupan baru di Usia 0 (Bayi) dengan statistik awal seimbang.
   */
  public static createNewSession(input: CreateCharacterInput): ActiveSession {
    const trimmedName = input.name.trim();
    if (trimmedName.length === 0) {
      throw new Error('ERR_INVALID_CHARACTER_NAME: Nama karakter tidak boleh kosong.');
    }

    const birthYear = input.birthYear ?? 2008;
    const country = input.country ?? 'Indonesia';
    const lifeSeed = input.lifeSeed ?? Math.floor(Math.random() * 1000000) + 1;

    const profile: CharacterProfile = {
      name: trimmedName,
      gender: input.gender,
      country,
      birthYear,
      age: GAME_CONFIG.CFG_AGE_MIN,
      cash: 0,
      grade: 'Balita',
    };

    const stats: CharacterStats = {
      health: GAME_CONFIG.CFG_STAT_INITIAL_HEALTH,
      happiness: GAME_CONFIG.CFG_STAT_INITIAL_HAPPINESS,
      relationship: GAME_CONFIG.CFG_STAT_INITIAL_RELATION,
      academic: GAME_CONFIG.CFG_STAT_INITIAL_ACADEMIC,
    };

    const initialRelations = RelationEngine.createInitialFamily();

    const initialTimeline: readonly TimelineLogEntry[] = [
      {
        age: 0,
        title: 'Lahir ke Dunia',
        description: `Selamat datang di dunia! Kamu lahir di ${country} sebagai seorang anak yang sehat dan disayangi kedua orang tuamu.`,
        category: 'Keluarga',
        statDeltas: { health: stats.health, happiness: stats.happiness },
      },
    ];

    return {
      lifeSeed,
      profile,
      stats,
      relations: initialRelations,
      timelineHistory: initialTimeline,
      flags: ['born', 'ftue_ready'],
      activeEventId: null,
      isCompleted: false,
    };
  }
}
