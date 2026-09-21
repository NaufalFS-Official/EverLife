import { describe, it, expect } from 'vitest';
import {
  GAME_CONFIG,
  msToFrames,
  framesToMs,
  ICON_MANIFEST,
  SYNTH_PRESETS,
  calculateChecksum,
  verifySaveChecksum,
  migrateSaveData,
  CURRENT_SCHEMA_VERSION,
  EverLifeSaveData,
  validateScreenTransition,
  validateAgeUpAction,
  INTERRUPT_PRIORITIES,
} from '../../src/contracts';

describe('Kontrak gameConfig & Helper Waktu', () => {
  it('semua konstanta kritis terdefinisi dan bertipe valid', () => {
    expect(GAME_CONFIG.CFG_FPS_TARGET).toBe(60);
    expect(GAME_CONFIG.CFG_AGE_MIN).toBe(0);
    expect(GAME_CONFIG.CFG_AGE_MAX_V1).toBe(18);
    expect(GAME_CONFIG.CFG_STAT_MIN).toBe(0);
    expect(GAME_CONFIG.CFG_STAT_MAX).toBe(100);
    expect(GAME_CONFIG.CFG_INPUT_DEBOUNCE_MS).toBe(200);
    expect(GAME_CONFIG.CFG_SAVE_SLOT_COUNT).toBe(3);
    expect(GAME_CONFIG.CFG_AUDIO_DEFAULT_MUTED).toBe(true);
  });

  it('fungsi msToFrames menghitung konversi frame secara presisi', () => {
    expect(msToFrames(0)).toBe(0);
    expect(msToFrames(1000, 60)).toBe(60);
    expect(msToFrames(500, 60)).toBe(30);
    expect(msToFrames(50, 60)).toBe(3); // 50ms = 3 frames pada 60 FPS
    expect(msToFrames(200, 60)).toBe(12); // 200ms = 12 frames pada 60 FPS
  });

  it('fungsi framesToMs mengembalikan milidetik yang konsisten', () => {
    expect(framesToMs(0)).toBe(0);
    expect(framesToMs(60, 60)).toBe(1000);
    expect(framesToMs(30, 60)).toBe(500);
  });
});

describe('Kontrak assetManifest', () => {
  it('seluruh 7 ikon antarmuka terdaftar dengan Tier H dan fallback teks', () => {
    expect(ICON_MANIFEST).toHaveLength(7);
    for (const icon of ICON_MANIFEST) {
      expect(icon.id).toBeDefined();
      expect(icon.label).toBeDefined();
      expect(icon.tier).toBe('H');
      expect(icon.fallbackText.length).toBeGreaterThan(0);
    }
  });

  it('seluruh preset synthesizer audio terdefinisi dengan durasi dan frekuensi valid', () => {
    expect(SYNTH_PRESETS.tap.frequencies[0]).toBe(440);
    expect(SYNTH_PRESETS.tap.waveform).toBe('sine');
    expect(SYNTH_PRESETS.alert.waveform).toBe('sawtooth');
    expect(SYNTH_PRESETS.success.durationMs).toBe(120);
  });
});

describe('Kontrak saveSchema, Checksum FNV-1a & Rantai Migrasi', () => {
  const sampleSavePayload: Omit<EverLifeSaveData, 'checksum'> = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    slotId: 1,
    updatedAt: '2026-09-21T12:00:00.000Z',
    lifeSeed: 987654321,
    profile: {
      name: 'Naufal Faris',
      gender: 'Pria',
      country: 'Indonesia',
      birthYear: 2008,
      age: 16,
      cash: 150000,
      grade: 'SMA',
    },
    stats: {
      health: 85,
      happiness: 75,
      relationship: 90,
      academic: 70,
    },
    relations: [
      { id: 'npc-dad', name: 'Ayah', role: 'Ayah', relationshipScore: 80, isAlive: true },
      { id: 'npc-mom', name: 'Ibu', role: 'Ibu', relationshipScore: 85, isAlive: true },
    ],
    timelineHistory: [
      { age: 0, title: 'Lahir', description: 'Kamu lahir ke dunia.', category: 'Keluarga' },
    ],
    flags: ['HONOR_STUDENT'],
    isCompleted: false,
  };

  it('calculateChecksum menghasilkan hash 8-karakter hex deterministik', () => {
    const checksum1 = calculateChecksum(sampleSavePayload);
    const checksum2 = calculateChecksum(sampleSavePayload);
    expect(checksum1).toHaveLength(8);
    expect(checksum1).toBe(checksum2);
  });

  it('verifySaveChecksum memvalidasi data asli dan menolak data yang dimanipulasi', () => {
    const validChecksum = calculateChecksum(sampleSavePayload);
    const validSaveData: EverLifeSaveData = {
      ...sampleSavePayload,
      checksum: validChecksum,
    };

    expect(verifySaveChecksum(validSaveData)).toBe(true);

    // Manipulasi saldo uang tanpa memperbarui checksum
    const tamperedData: EverLifeSaveData = {
      ...validSaveData,
      profile: {
        ...validSaveData.profile,
        cash: 999999999, // Nilai dimanipulasi
      },
    };

    expect(verifySaveChecksum(tamperedData)).toBe(false);
  });

  it('migrateSaveData memvalidasi fixture save v1 valid tanpa error', () => {
    const validChecksum = calculateChecksum(sampleSavePayload);
    const validSaveData: EverLifeSaveData = {
      ...sampleSavePayload,
      checksum: validChecksum,
    };

    const result = migrateSaveData(validSaveData);
    expect(result.schemaVersion).toBe(1);
    expect(result.profile.name).toBe('Naufal Faris');
    expect(result.stats.health).toBe(85);
  });

  it('migrateSaveData berhasil memigrasikan data legacy v0 ke skema v1', () => {
    const legacyFixtureV0 = {
      profile: {
        name: 'Budi Handoko',
        age: 10,
      },
      stats: {
        health: 95,
      },
      slotId: 2,
    };

    const migrated = migrateSaveData(legacyFixtureV0);
    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.profile.name).toBe('Budi Handoko');
    expect(migrated.profile.age).toBe(10);
    expect(migrated.profile.cash).toBe(0); // Fallback default
    expect(migrated.stats.health).toBe(95);
    expect(migrated.stats.happiness).toBe(GAME_CONFIG.CFG_STAT_INITIAL_HAPPINESS);
    expect(verifySaveChecksum(migrated)).toBe(true);
  });

  it('migrateSaveData melempar error pada data korup atau versi masa depan', () => {
    expect(() => migrateSaveData(null)).toThrowError('ERR_SAVE_INVALID_FORMAT');
    expect(() => migrateSaveData('bukan json objek')).toThrowError('ERR_SAVE_INVALID_FORMAT');

    const futureVersionFixture = {
      schemaVersion: 99,
      profile: {},
    };
    expect(() => migrateSaveData(futureVersionFixture)).toThrowError('ERR_SAVE_FUTURE_VERSION');

    const invalidChecksumFixture: EverLifeSaveData = {
      ...sampleSavePayload,
      checksum: 'deadbeef', // Checksum salah
    };
    expect(() => migrateSaveData(invalidChecksumFixture)).toThrowError('ERR_SAVE_CHECKSUM_MISMATCH');
  });
});

describe('Kontrak guardTable & Validasi Transisi Mesin State', () => {
  it('seluruh transisi sah dalam matriks dievaluasi sebagai allowed: true', () => {
    expect(validateScreenTransition('BOOT', 'MAIN_MENU').allowed).toBe(true);
    expect(validateScreenTransition('MAIN_MENU', 'CHARACTER_CREATION').allowed).toBe(true);
    expect(validateScreenTransition('MAIN_MENU', 'GAMEPLAY_ACTIVE').allowed).toBe(true);
    expect(validateScreenTransition('CHARACTER_CREATION', 'GAMEPLAY_ACTIVE').allowed).toBe(true);
    expect(validateScreenTransition('GAMEPLAY_ACTIVE', 'EVENT_MODAL').allowed).toBe(true);
    expect(validateScreenTransition('EVENT_MODAL', 'GAMEPLAY_ACTIVE').allowed).toBe(true);
    expect(validateScreenTransition('GAMEPLAY_ACTIVE', 'GRADUATION_SCREEN').allowed).toBe(true);
    expect(validateScreenTransition('GAMEPLAY_ACTIVE', 'GAME_OVER_DEATH').allowed).toBe(true);
  });

  it('transisi terlarang ditolak dengan errorCode spesifik', () => {
    // Larangan 1: Modal event terbuka -> tidak boleh langsung ke kelulusan
    const check1 = validateScreenTransition('EVENT_MODAL', 'GRADUATION_SCREEN');
    expect(check1.allowed).toBe(false);
    expect(check1.errorCode).toBe('ERR_BLOCKED_BY_EVENT');

    // Larangan 2: Sesi aktif berjalan -> tidak boleh langsung buat karakter baru
    const check2 = validateScreenTransition('GAMEPLAY_ACTIVE', 'CHARACTER_CREATION');
    expect(check2.allowed).toBe(false);
    expect(check2.errorCode).toBe('ERR_ACTIVE_SESSION_EXISTS');

    // Larangan 3: Boot langsung loncat ke gameplay
    const check3 = validateScreenTransition('BOOT', 'GAMEPLAY_ACTIVE');
    expect(check3.allowed).toBe(false);
    expect(check3.errorCode).toBe('ERR_UNINITIALIZED_BOOT');

    // Larangan 4: Transisi sembarang yang tidak terdaftar
    const check4 = validateScreenTransition('BOOT', 'EVENT_MODAL');
    expect(check4.allowed).toBe(false);
    expect(check4.errorCode).toBe('ERR_INVALID_TRANSITION');
  });

  it('validateAgeUpAction memvalidasi prasyarat penambahan usia', () => {
    // Kasus 1: Ditolak jika ada event dilema aktif
    const resBlockedByEvent = validateAgeUpAction({
      currentScreen: 'EVENT_MODAL',
      currentAge: 15,
      maxAge: 18,
      health: 80,
      hasActiveEvent: true,
    });
    expect(resBlockedByEvent.allowed).toBe(false);
    expect(resBlockedByEvent.errorCode).toBe('ERR_ACTION_BLOCKED_BY_EVENT');

    // Kasus 2: Ditolak jika kesehatan 0
    const resDeceased = validateAgeUpAction({
      currentScreen: 'GAMEPLAY_ACTIVE',
      currentAge: 15,
      maxAge: 18,
      health: 0,
      hasActiveEvent: false,
    });
    expect(resDeceased.allowed).toBe(false);
    expect(resDeceased.errorCode).toBe('ERR_PLAYER_DECEASED');

    // Kasus 3: Ditolak jika sudah mencapai batas usia maksimal v1
    const resMaxAge = validateAgeUpAction({
      currentScreen: 'GAMEPLAY_ACTIVE',
      currentAge: 18,
      maxAge: 18,
      health: 90,
      hasActiveEvent: false,
    });
    expect(resMaxAge.allowed).toBe(false);
    expect(resMaxAge.errorCode).toBe('ERR_MAX_AGE_REACHED');

    // Kasus 4: Diizinkan saat kondisi hidup normal
    const resValid = validateAgeUpAction({
      currentScreen: 'GAMEPLAY_ACTIVE',
      currentAge: 14,
      maxAge: 18,
      health: 85,
      hasActiveEvent: false,
    });
    expect(resValid.allowed).toBe(true);
  });

  it('hierarki prioritas interupsi mematuhi aturan Blueprint S3.4', () => {
    expect(INTERRUPT_PRIORITIES.FATAL_HEALTH_DEPLETED).toBeLessThan(INTERRUPT_PRIORITIES.EVENT_MODAL);
    expect(INTERRUPT_PRIORITIES.EVENT_MODAL).toBeLessThan(INTERRUPT_PRIORITIES.ACTIVITY_MODAL);
    expect(INTERRUPT_PRIORITIES.ACTIVITY_MODAL).toBeLessThan(INTERRUPT_PRIORITIES.AUTO_SAVE_WORKER);
  });
});
