import { describe, it, expect } from 'vitest';
import {
  GAME_CONFIG,
  msToFrames,
  STATE_GUARD_TABLE,
  evaluateTransition,
  validateScenarioEvent,
  validateJobListing,
  Mulberry32PRNG,
  computeStateHash,
  DefaultPlatformAdapter,
  createSaveEnvelope,
  validateSaveEnvelope,
  migrateSaveData,
  createSampleV1State,
  computeSaveChecksum,
} from '../../src/shared';

describe('Contracts - Game Config & Timing', () => {
  it('harus memuat seluruh konstanta numerik dalam batas aman yang sah', () => {
    expect(GAME_CONFIG.STAT_MIN_VALUE).toBe(0);
    expect(GAME_CONFIG.STAT_MAX_VALUE).toBe(100);
    expect(GAME_CONFIG.FEEL_AGE_TAP_LATENCY_MS).toBe(200);
    expect(GAME_CONFIG.FEEL_MIN_SURVIVAL_CHOICES).toBeGreaterThanOrEqual(1);
    expect(GAME_CONFIG.FEEL_MORTALITY_BASE_RATE).toBe(0.001);
  });

  it('harus mengonversi ms ke frame secara akurat berdasarkan FPS 60', () => {
    expect(msToFrames(1000, 60)).toBe(60);
    expect(msToFrames(200, 60)).toBe(12);
    expect(msToFrames(16.6, 60)).toBe(1);
  });
});

describe('Contracts - State Machine Guard Table', () => {
  it('harus memverifikasi bahwa tabel guard terdefinisi sebagai data yang dapat diuji', () => {
    expect(STATE_GUARD_TABLE.length).toBeGreaterThan(5);
  });

  it('harus mengizinkan transisi yang sah', () => {
    const res = evaluateTransition('MAIN_MENU', 'CHARACTER_CREATION');
    expect(res.allowed).toBe(true);

    const res2 = evaluateTransition('CHARACTER_CREATION', 'GAMEPLAY_ACTIVE');
    expect(res2.allowed).toBe(true);
  });

  it('harus menolak transisi terlarang: menutup modal tanpa memilih', () => {
    const res = evaluateTransition('SCENARIO_POPUP', 'GAMEPLAY_ACTIVE');
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Dilarang menutup popup wajib');
  });

  it('harus menolak transisi terlarang: bangkit kembali setelah mati (permadeath)', () => {
    const res = evaluateTransition('DEATH_SUMMARY', 'GAMEPLAY_ACTIVE');
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Permadeath');
  });

  it('harus mengizinkan fatal interrupt ke DEATH_SUMMARY dari state mana pun', () => {
    expect(evaluateTransition('GAMEPLAY_ACTIVE', 'DEATH_SUMMARY').allowed).toBe(true);
    expect(evaluateTransition('SCENARIO_POPUP', 'DEATH_SUMMARY').allowed).toBe(true);
    expect(evaluateTransition('SUBMENU_OPEN', 'DEATH_SUMMARY').allowed).toBe(true);
  });
});

describe('Contracts - Zod Content Schema Validation', () => {
  it('harus meloloskan skenario event yang valid', () => {
    const validEvent = {
      id: 'childhood_vaccine',
      category: 'Childhood',
      minAge: 2,
      maxAge: 5,
      title: 'Vaksinasi Balita',
      description: 'Ibumu membawamu ke dokter untuk mendapatkan suntikan vaksin.',
      choices: [
        {
          text: 'Mencoba tetap tenang',
          statDeltas: { health: 5, happiness: -2 },
          logText: 'Saya bersikap tenang saat disuntik.',
          karmaDelta: 5,
        },
        {
          text: 'Menangis histeris',
          statDeltas: { happiness: -10 },
          logText: 'Saya menangis keras di ruang dokter.',
        },
      ],
    };

    const parsed = validateScenarioEvent(validEvent);
    expect(parsed.id).toBe('childhood_vaccine');
    expect(parsed.choices.length).toBe(2);
  });

  it('harus menolak event jika maxAge < minAge', () => {
    const invalidEvent = {
      id: 'broken_age_event',
      category: 'School',
      minAge: 18,
      maxAge: 10,
      title: 'Invalid Age Range',
      description: 'Event dengan rentang usia terbalik.',
      choices: [
        { text: 'Pilihan 1', statDeltas: {}, logText: 'Log 1' },
        { text: 'Pilihan 2', statDeltas: {}, logText: 'Log 2' },
      ],
    };

    expect(() => validateScenarioEvent(invalidEvent)).toThrow();
  });

  it('harus menolak event dengan pilihan kurang dari 2', () => {
    const singleChoiceEvent = {
      id: 'single_choice',
      category: 'Drama',
      minAge: 20,
      maxAge: 30,
      title: 'Single Choice',
      description: 'Hanya ada satu pilihan.',
      choices: [{ text: 'Pilihan 1', statDeltas: {}, logText: 'Log 1' }],
    };

    expect(() => validateScenarioEvent(singleChoiceEvent)).toThrow();
  });

  it('harus memvalidasi lowongan pekerjaan yang sah', () => {
    const validJob = {
      id: 'junior_dev',
      title: 'Junior Developer',
      minSmarts: 60,
      minEducation: 'Secondary',
      baseSalary: 45000,
    };

    const parsed = validateJobListing(validJob);
    expect(parsed.title).toBe('Junior Developer');
    expect(parsed.baseSalary).toBe(45000);
  });
});

describe('Contracts - Deterministic PRNG & State Hash (D16)', () => {
  it('harus menghasilkan deret angka acak yang identik untuk seed yang sama', () => {
    const rng1 = new Mulberry32PRNG(12345678);
    const rng2 = new Mulberry32PRNG(12345678);

    const values1 = [rng1.next(), rng1.next(), rng1.nextInt(1, 100), rng1.nextChoice(['A', 'B', 'C'])];
    const values2 = [rng2.next(), rng2.next(), rng2.nextInt(1, 100), rng2.nextChoice(['A', 'B', 'C'])];

    expect(values1).toEqual(values2);
  });

  it('harus menghasilkan stateHash identik untuk representasi state yang sama', () => {
    const stateA = { age: 10, health: 90, name: 'Archie' };
    const stateB = { name: 'Archie', health: 90, age: 10 };

    expect(computeStateHash(stateA)).toBe(computeStateHash(stateB));
  });
});

describe('Contracts - Persistence & Save Schema Migration (S8)', () => {
  it('harus membuat envelope dengan salted SHA-256 checksum yang valid', () => {
    const sampleState = createSampleV1State();
    const envelope = createSaveEnvelope(sampleState);

    expect(envelope.schemaVersion).toBe(1);
    expect(validateSaveEnvelope(envelope)).toBe(true);
    expect(envelope.checksum.startsWith('sha256_')).toBe(true);
  });

  it('harus menghasilkan checksum deterministik menggunakan computeSaveChecksum', () => {
    const raw = JSON.stringify({ test: 123 });
    const hash1 = computeSaveChecksum(raw);
    const hash2 = computeSaveChecksum(raw);
    expect(hash1).toBe(hash2);
    expect(hash1.startsWith('sha256_')).toBe(true);
  });

  it('harus menolak envelope yang checksum-nya tidak cocok (korup/tampered)', () => {
    const sampleState = createSampleV1State();
    const envelope = createSaveEnvelope(sampleState);

    // Tampering payload
    envelope.payload.character.finances.bankBalance = 999999999;
    expect(validateSaveEnvelope(envelope)).toBe(false);
    expect(() => migrateSaveData(envelope)).toThrow('checksum tidak valid');
  });

  it('harus berhasil memigrasi fixture save state v1 yang sah', () => {
    const sampleState = createSampleV1State();
    const envelope = createSaveEnvelope(sampleState);
    const restored = migrateSaveData(envelope);

    expect(restored.character.name.first).toBe('Archie');
    expect(restored.character.age).toBe(24);
    expect(restored.character.finances.bankBalance).toBe(12500);
  });
});

describe('Contracts - Platform Adapter Fallback (D19)', () => {
  it('harus menyediakan MemoryStorage fallback pada lingkungan non-browser (Node.js)', () => {
    const adapter = new DefaultPlatformAdapter();
    expect(adapter.isBrowser()).toBe(false);

    adapter.storage.setItem('test_key', 'test_value');
    expect(adapter.storage.getItem('test_key')).toBe('test_value');

    adapter.storage.removeItem('test_key');
    expect(adapter.storage.getItem('test_key')).toBeNull();
  });

  it('harus mengembalikan safe area fallback default', () => {
    const adapter = new DefaultPlatformAdapter();
    const insets = adapter.getSafeArea();
    expect(insets.top).toBe(16);
    expect(insets.bottom).toBe(20);
  });
});
