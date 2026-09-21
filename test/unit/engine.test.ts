/**
 * Suite Pengujian Unit GameEngine, SaveService, dan Siklus Hidup 0 s.d. 18 Tahun.
 * Memverifikasi state machine, guard anti-tamper, ekspor/impor JSON, dan kelulusan SMA.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { describe, it, expect } from 'vitest';
import { GameEngine } from '../../src/core/GameEngine';
import { SaveService } from '../../src/storage/SaveService';
import { EventEngine } from '../../src/core/EventEngine';
import { GAME_CONFIG } from '../../src/contracts/gameConfig';

describe('GameEngine & Siklus Hidup', () => {
  it('harus menginisialisasi state awal pada MAIN_MENU', () => {
    const engine = new GameEngine();
    const state = engine.getState();
    expect(state.screen).toBe('MAIN_MENU');
    expect(state.session).toBeNull();
  });

  it('harus memvalidasi transisi ke pembuatan karakter dan mulai usia 0', () => {
    const engine = new GameEngine();
    engine.startNewGame();
    expect(engine.getState().screen).toBe('CHARACTER_CREATION');

    engine.submitCharacter({
      name: 'Rian Pratama',
      gender: 'Pria',
      country: 'Indonesia',
    });

    const state = engine.getState();
    expect(state.screen).toBe('GAMEPLAY_ACTIVE');
    expect(state.session).not.toBeNull();
    expect(state.session?.profile.name).toBe('Rian Pratama');
    expect(state.session?.profile.age).toBe(0);
    expect(state.session?.profile.grade).toBe('Balita');
    expect(state.session?.stats.health).toBe(GAME_CONFIG.CFG_STAT_INITIAL_HEALTH);
  });

  it('harus mengunci tombol Tambah Umur saat ada event aktif yang belum dijawab', () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Tes Guard', gender: 'Wanita' });

    // Naik umur sampai event pertama terpicu
    let eventTriggered = false;
    for (let i = 0; i < 5; i++) {
      if (engine.getState().screen === 'EVENT_MODAL') {
        eventTriggered = true;
        break;
      }
      engine.ageUp();
    }

    if (eventTriggered) {
      expect(engine.getState().screen).toBe('EVENT_MODAL');
      // Memaksa ageUp saat event modal aktif harus melempar error guard
      expect(() => engine.ageUp()).toThrow(/ERR_AGE_UP_GUARD/);
    }
  });

  it('harus menjalankan siklus hidup lengkap dari usia 0 hingga kelulusan usia 18', () => {
    const engine = new GameEngine();
    engine.submitCharacter({
      name: 'Siswa Sukses',
      gender: 'Pria',
      country: 'Indonesia',
      birthYear: 2008,
      lifeSeed: 12345,
    });

    while (
      engine.getState().screen !== 'GRADUATION_SCREEN' &&
      engine.getState().screen !== 'GAME_OVER_DEATH'
    ) {
      const state = engine.getState();
      if (state.screen === 'EVENT_MODAL' && state.session?.activeEventId) {
        const activeEvent = EventEngine.getEvent(state.session.activeEventId);
        if (activeEvent && activeEvent.options[0]) {
          engine.selectEventOption(activeEvent.options[0].id);
        }
      } else if (state.screen === 'GAMEPLAY_ACTIVE') {
        engine.ageUp();
      }
    }

    const finalState = engine.getState();
    expect(finalState.session?.profile.age).toBeGreaterThanOrEqual(GAME_CONFIG.CFG_AGE_MAX_V1);
    expect(finalState.screen).toBe('GRADUATION_SCREEN');
    expect(finalState.session?.isCompleted).toBe(true);
  });

  it('harus beralih ke GAME_OVER_DEATH jika kesehatan habis (<= 0%)', () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Karakter Lemah', gender: 'Pria' });

    // Paksa kurangi kesehatan sampai 0 lewat simulasi aktivitas atau opsi
    const session = engine.getState().session!;
    const deadSession = {
      ...session,
      stats: { ...session.stats, health: 0 },
    };

    engine.loadSession(deadSession, 1);
    expect(engine.getState().screen).toBe('GAME_OVER_DEATH');
  });
});

describe('SaveService & Keamanan Checksum', () => {
  it('harus menyimpan dan memuat kembali sesi permainan dengan checksum valid', async () => {
    const saveService = new SaveService();
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Budi Save', gender: 'Pria' });

    const session = engine.getState().session!;
    const saved = await saveService.saveActiveSession(session, 1);

    expect(saved.checksum).toBeDefined();
    expect(saved.checksum.length).toBe(8);

    const loaded = await saveService.loadSlot(1);
    expect(loaded).not.toBeNull();
    expect(loaded?.profile.name).toBe('Budi Save');
    expect(loaded?.checksum).toBe(saved.checksum);
  });

  it('harus mengekspor dan mengimpor kembali JSON tanpa modifikasi', async () => {
    const saveService = new SaveService();
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Dewi Ekspor', gender: 'Wanita' });

    const session = engine.getState().session!;
    const saved = await saveService.saveActiveSession(session, 2);
    const jsonString = saveService.exportToJson(saved);

    const imported = saveService.importFromJson(jsonString);
    expect(imported.profile.name).toBe('Dewi Ekspor');
    expect(imported.checksum).toBe(saved.checksum);
  });

  it('harus menolak berkas save jika isinya dimanipulasi tanpa memperbarui checksum', async () => {
    const saveService = new SaveService();
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Anti Tamper', gender: 'Pria' });

    const session = engine.getState().session!;
    const saved = await saveService.saveActiveSession(session, 3);
    const jsonString = saveService.exportToJson(saved);

    // Manipulasi saldo secara curang
    const tamperedJson = jsonString.replace('"cash": 0', '"cash": 999999999');

    expect(() => saveService.importFromJson(tamperedJson)).toThrow(
      /ERR_SAVE_CHECKSUM_MISMATCH/
    );
  });
});
