/**
 * Skema Penyimpanan & Verifikasi Integritas EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S8.
 * Memenuhi Aturan: "schemaVersion = 1; rantai migrate(v -> v+1); uji dengan fixture save; nol any".
 */

import { CharacterProfile, CharacterStats, RelationNPC, TimelineLogEntry } from './gameState';
import { GAME_CONFIG } from './gameConfig';

export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Struktur data lengkap yang disimpan ke IndexedDB / LocalStorage / file JSON ekspor.
 */
export interface EverLifeSaveData {
  readonly schemaVersion: number;
  readonly slotId: number;
  readonly updatedAt: string;
  readonly lifeSeed: number;
  readonly profile: CharacterProfile;
  readonly stats: CharacterStats;
  readonly relations: readonly RelationNPC[];
  readonly timelineHistory: readonly TimelineLogEntry[];
  readonly flags: readonly string[];
  readonly isCompleted: boolean;
  readonly checksum: string;
}

/**
 * Menghitung hash FNV-1a 32-bit dari representasi string JSON data simpanan (tanpa field checksum).
 * Sumber: Blueprint S8.3.
 */
export function calculateChecksum(data: Omit<EverLifeSaveData, 'checksum'>): string {
  const str = JSON.stringify(data);
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Memverifikasi integritas berkas simpanan. Mengembalikan true jika checksum cocok.
 */
export function verifySaveChecksum(data: EverLifeSaveData): boolean {
  if (!data.checksum || typeof data.checksum !== 'string') {
    return false;
  }
  const { checksum, ...payload } = data;
  const expectedChecksum = calculateChecksum(payload);
  return checksum.toLowerCase() === expectedChecksum.toLowerCase();
}

/**
 * Tipe fungsi migrator skema bertingkat.
 */
export type MigrationStep = (raw: Record<string, unknown>) => Record<string, unknown>;

/**
 * Rantai migrasi skema v -> v+1.
 * Skala v1: mendefinisikan langkah migrasi dari v0 (data awal tanpa schemaVersion) ke v1.
 */
export const MIGRATION_CHAIN: Record<number, MigrationStep> = {
  // Migrasi dari skema hipotetis v0 (data mentah awal) ke skema v1
  0: (raw: Record<string, unknown>): Record<string, unknown> => {
    const rawProfile = (raw['profile'] as Record<string, unknown> | undefined) ?? {};
    const rawStats = (raw['stats'] as Record<string, unknown> | undefined) ?? {};

    const profile: CharacterProfile = {
      name: typeof rawProfile['name'] === 'string' ? rawProfile['name'] : 'Karakter',
      gender: rawProfile['gender'] === 'Wanita' ? 'Wanita' : 'Pria',
      country: typeof rawProfile['country'] === 'string' ? rawProfile['country'] : 'Indonesia',
      birthYear: typeof rawProfile['birthYear'] === 'number' ? rawProfile['birthYear'] : 2008,
      age: typeof rawProfile['age'] === 'number' ? rawProfile['age'] : GAME_CONFIG.CFG_AGE_MIN,
      cash: typeof rawProfile['cash'] === 'number' ? rawProfile['cash'] : 0,
      grade: typeof rawProfile['grade'] === 'string' ? (rawProfile['grade'] as CharacterProfile['grade']) : 'Balita',
    };

    const stats: CharacterStats = {
      health: typeof rawStats['health'] === 'number' ? rawStats['health'] : GAME_CONFIG.CFG_STAT_INITIAL_HEALTH,
      happiness: typeof rawStats['happiness'] === 'number' ? rawStats['happiness'] : GAME_CONFIG.CFG_STAT_INITIAL_HAPPINESS,
      relationship: typeof rawStats['relationship'] === 'number' ? rawStats['relationship'] : GAME_CONFIG.CFG_STAT_INITIAL_RELATION,
      academic: typeof rawStats['academic'] === 'number' ? rawStats['academic'] : GAME_CONFIG.CFG_STAT_INITIAL_ACADEMIC,
    };

    const relations = Array.isArray(raw['relations']) ? (raw['relations'] as RelationNPC[]) : [];
    const timelineHistory = Array.isArray(raw['timelineHistory']) ? (raw['timelineHistory'] as TimelineLogEntry[]) : [];
    const flags = Array.isArray(raw['flags']) ? (raw['flags'] as string[]) : [];

    const migratedPayload: Omit<EverLifeSaveData, 'checksum'> = {
      schemaVersion: 1,
      slotId: typeof raw['slotId'] === 'number' ? raw['slotId'] : 1,
      updatedAt: typeof raw['updatedAt'] === 'string' ? raw['updatedAt'] : new Date().toISOString(),
      lifeSeed: typeof raw['lifeSeed'] === 'number' ? raw['lifeSeed'] : 123456789,
      profile,
      stats,
      relations,
      timelineHistory,
      flags,
      isCompleted: Boolean(raw['isCompleted']),
    };

    return {
      ...migratedPayload,
      checksum: calculateChecksum(migratedPayload),
    };
  },
};

/**
 * Memvalidasi dan memigrasikan data simpanan mentah ke versi skema terkini (CURRENT_SCHEMA_VERSION).
 * Menolak data jika format bukan objek JSON valid.
 */
export function migrateSaveData(raw: unknown): EverLifeSaveData {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('ERR_SAVE_INVALID_FORMAT: Data simpanan bukan objek JSON valid.');
  }

  let currentRecord = { ...(raw as Record<string, unknown>) };
  let version = typeof currentRecord['schemaVersion'] === 'number' ? currentRecord['schemaVersion'] : 0;

  if (version > CURRENT_SCHEMA_VERSION) {
    throw new Error(`ERR_SAVE_FUTURE_VERSION: Skema simpanan v${version} lebih tinggi dari versi aplikasi saat ini (v${CURRENT_SCHEMA_VERSION}).`);
  }

  while (version < CURRENT_SCHEMA_VERSION) {
    const migrator = MIGRATION_CHAIN[version];
    if (!migrator) {
      throw new Error(`ERR_SAVE_MISSING_MIGRATOR: Tidak ditemukan fungsi migrasi dari skema v${version}.`);
    }
    currentRecord = migrator(currentRecord);
    version = typeof currentRecord['schemaVersion'] === 'number' ? currentRecord['schemaVersion'] : version + 1;
  }

  const candidate = currentRecord as unknown as EverLifeSaveData;

  if (!verifySaveChecksum(candidate)) {
    throw new Error('ERR_SAVE_CHECKSUM_MISMATCH: Verifikasi checksum simpanan gagal. Berkas telah dimodifikasi atau rusak.');
  }

  return candidate;
}
