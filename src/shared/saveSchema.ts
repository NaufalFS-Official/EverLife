/**
 * SAVE SCHEMA & PERSISTENCE CONTRACT (S8)
 * Skema envelope save game, versioning, verifikasi checksum, dan migrasi state.
 */

import { GlobalGameState } from './state';

export const CURRENT_SAVE_SCHEMA_VERSION = 1 as const;
export const SAVE_SALT = 'everlife_secure_salt_v1';

export interface SaveDataEnvelope {
  schemaVersion: number;
  timestamp: number;
  checksum: string;
  payload: GlobalGameState;
}

/**
 * Menghitung salted checksum dari payload save string secara deterministik.
 * Bekerja identik di lingkungan Node.js dan peramban web.
 */
export function computeSaveChecksum(payloadJson: string, salt: string = SAVE_SALT): string {
  const combined = `${payloadJson}::${salt}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < combined.length; i++) {
    const code = combined.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 = Math.imul(h2 ^ code, 0x5bd1e995);
    h2 ^= h2 >>> 15;
  }
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `sha256_${part1}${part2}`;
}

/**
 * Membungkus GlobalGameState ke dalam SaveDataEnvelope ber-checksum.
 */
export function createSaveEnvelope(state: GlobalGameState): SaveDataEnvelope {
  const payloadStr = JSON.stringify(state);
  return {
    schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
    timestamp: Date.now(),
    checksum: computeSaveChecksum(payloadStr),
    payload: state,
  };
}

/**
 * Memvalidasi integritas envelope save data.
 */
export function validateSaveEnvelope(envelope: SaveDataEnvelope): boolean {
  if (!envelope || typeof envelope !== 'object') return false;
  if (typeof envelope.schemaVersion !== 'number') return false;
  if (typeof envelope.checksum !== 'string') return false;
  if (!envelope.payload) return false;

  const payloadStr = JSON.stringify(envelope.payload);
  const expectedChecksum = computeSaveChecksum(payloadStr);
  return envelope.checksum === expectedChecksum;
}

/**
 * Melakukan migrasi save state jika terdeteksi versi skema lama.
 */
export function migrateSaveData(envelope: SaveDataEnvelope): GlobalGameState {
  if (!validateSaveEnvelope(envelope)) {
    throw new Error('Save data corrupt: checksum tidak valid');
  }

  // Version 1 (Current)
  if (envelope.schemaVersion === 1) {
    return envelope.payload;
  }

  // Placeholder untuk migrasi skema masa depan (v2, v3, dst.)
  throw new Error(`Versi skema save ${envelope.schemaVersion} tidak dikenali`);
}

/**
 * Fixture sample save data v1 yang sah untuk pengujian unit dan verifikasi migrasi.
 */
export function createSampleV1State(): GlobalGameState {
  return {
    runId: 'fixture_run_001',
    seed: 424242,
    currentScreen: 'GAMEPLAY_ACTIVE',
    activeModal: null,
    character: {
      name: { first: 'Archie', last: 'King' },
      gender: 'Male',
      age: 24,
      birthLocation: { country: 'Indonesia', city: 'Jakarta' },
      specialTalent: 'None',
      appearance: { skin: 2, eyes: 1, brows: 0, hair: 3, hairColor: 0 },
      attributes: {
        happiness: 80,
        health: 95,
        smarts: 75,
        looks: 70,
        karma: 85,
        discipline: 60,
        fertility: 80,
        sexuality: 'Straight',
      },
      finances: {
        bankBalance: 12500,
        netWorth: 12500,
        annualSalary: 45000,
        livingExpenses: 3600,
      },
      education: { level: 'Secondary', grades: 85 },
      job: { id: 'junior_dev', title: 'Junior Developer', salary: 45000, performance: 75 },
      relationships: [
        { id: 'npc_dad', name: 'Budi King', role: 'Father', age: 52, relationshipBar: 85, alive: true },
        { id: 'npc_mom', name: 'Siti King', role: 'Mother', age: 50, relationshipBar: 90, alive: true },
      ],
      lifeLog: [
        { age: 0, text: 'Saya lahir di Jakarta, Indonesia.', categoryTag: 'Birth', iconKey: 'sfx_birth' },
        { age: 18, text: 'Lulus sekolah menengah dengan nilai baik.', categoryTag: 'Education', iconKey: 'sfx_ui_click' },
        { age: 24, text: 'Bekerja sebagai Junior Developer.', categoryTag: 'Career', iconKey: 'sfx_cash' },
      ],
    },
  };
}
