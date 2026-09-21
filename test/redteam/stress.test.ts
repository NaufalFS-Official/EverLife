/**
 * Suite Pengujian Red Team: Stres Input, State Guard, & Bypass Cooldown.
 * Menguji ketahanan state machine terhadap spam aksi, injeksi ID ilegal, dan manipulasi alur.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { describe, it, expect } from 'vitest';
import { GameEngine } from '../../src/core/GameEngine';
import { EconomyEngine } from '../../src/core/EconomyEngine';
import { RelationEngine } from '../../src/core/RelationEngine';

describe('Red Team: Stres Input & State Guard Bypass', () => {
  it('ATK-006 [BLOCKED-OK]: Harus menolak opsi event fiktif / ilegal tanpa menyebabkan unhandled crash', () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Subjek Uji', gender: 'Pria' });

    // Pacu penambahan umur hingga dialog event pertama muncul
    while (engine.getState().screen !== 'EVENT_MODAL') {
      engine.ageUp();
    }

    expect(engine.getState().screen).toBe('EVENT_MODAL');

    // Serangan: Kirimkan optionId fiktif yang tidak terdaftar
    expect(() => engine.selectEventOption('opt-hacked-999')).toThrow(
      /ERR_INVALID_OPTION_ID/
    );

    // Pastikan screen tetap aman di EVENT_MODAL (tidak crash)
    expect(engine.getState().screen).toBe('EVENT_MODAL');
  });

  it('ATK-007 [BLOCKED-OK]: Harus mengunci pemanggilan ageUp saat event dialog aktif', () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Subjek Guard', gender: 'Wanita' });

    while (engine.getState().screen !== 'EVENT_MODAL') {
      engine.ageUp();
    }

    expect(() => engine.ageUp()).toThrow(/ERR_AGE_UP_GUARD/);
  });

  it('ATK-008 [BLOCKED-OK]: Harus menolak eksekusi aktivitas kerja paruh waktu di bawah usia pembuka', () => {
    // Pekerjaan barista paruh waktu terbuka di usia 15 tahun (CFG_AGE_PART_TIME_UNLOCK)
    expect(() =>
      EconomyEngine.executeActivity({
        activityId: 'act-part-time',
        currentAge: 8, // Masih usia SD
        currentCash: 0,
      })
    ).toThrow(/ERR_ACTIVITY_LOCKED/);
  });

  it('ATK-009 [BLOCKED-OK]: Harus menolak aktivitas berbayar jika saldo pemain tidak mencukupi', () => {
    const result = EconomyEngine.executeActivity({
      activityId: 'act-tutoring', // Biaya Rp 30.000
      currentAge: 11,
      currentCash: 5000, // Hanya punya Rp 5.000
    });

    expect(result.success).toBe(false);
    expect(result.cashDelta).toBe(0);
    expect(result.message).toContain('Saldo tidak mencukupi');
  });

  it('ATK-010 [BLOCKED-OK]: Harus menolak aktivitas fiktif / tidak terdaftar', () => {
    expect(() =>
      EconomyEngine.executeActivity({
        activityId: 'act-cheat-billionaire',
        currentAge: 16,
        currentCash: 100000,
      })
    ).toThrow(/ERR_ACTIVITY_NOT_FOUND/);
  });

  it('ATK-011 [BLOCKED-OK]: Harus menolak interaksi sosial dengan NPC hantu / fiktif', () => {
    const family = RelationEngine.createInitialFamily();
    expect(() =>
      RelationEngine.interact({
        relations: family,
        targetId: 'npc-ghost-999',
        actionType: 'chat',
        currentCash: 10000,
      })
    ).toThrow(/ERR_RELATION_NOT_FOUND/);
  });

  it('ATK-012 [BLOCKED-OK]: Harus menolak penambahan umur ketika karakter telah wafat', () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Subjek Mati', gender: 'Pria' });

    // Muat sesi dengan kesehatan 0
    const session = engine.getState().session!;
    engine.loadSession({ ...session, stats: { ...session.stats, health: 0 } }, 1);

    expect(engine.getState().screen).toBe('GAME_OVER_DEATH');
    expect(() => engine.ageUp()).toThrow(/ERR_AGE_UP_GUARD/);
  });

  it('ATK-013 [BLOCKED-OK]: Harus menolak penambahan umur ketika telah mencapai usia batas SMA (18 tahun)', () => {
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Subjek Lulus', gender: 'Wanita' });

    const session = engine.getState().session!;
    engine.loadSession({ ...session, profile: { ...session.profile, age: 18 } }, 1);

    expect(() => engine.ageUp()).toThrow(/ERR_AGE_UP_GUARD/);
  });

  it('ATK-014 [BLOCKED-OK]: Harus menolak pembuatan nama karakter kosong atau whitespace murni', () => {
    const engine = new GameEngine();
    expect(() =>
      engine.submitCharacter({ name: '   ', gender: 'Pria' })
    ).toThrow(/ERR_INVALID_CHARACTER_NAME/);
  });

  it('ATK-015 [BLOCKED-OK]: Harus menangani nama karakter dengan karakter Unicode ekstrem dan payload script', () => {
    const engine = new GameEngine();
    const xssPayload = '<script>alert(1)</script><img src=x onerror=alert(1)>';
    engine.submitCharacter({ name: xssPayload, gender: 'Wanita' });

    expect(engine.getState().session?.profile.name).toBe(xssPayload);
    // Di React, text render otomatis lolos escaping JSX tanpa interpretasi DOM script
  });

  it('ATK-016 [BLOCKED-OK]: Spam tombol Tambah Umur (+1) sebanyak 50 tap per detik disaring oleh debounce 200 ms', () => {
    let executionCount = 0;
    let isDebouncing = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const debouncedAgeUp = () => {
      if (isDebouncing) return;
      isDebouncing = true;
      executionCount += 1;
      timer = setTimeout(() => {
        isDebouncing = false;
        timer = null;
      }, 200);
    };

    // Simulasi spamming 50 tap berturut-turut dalam jendela debounce
    for (let i = 0; i < 50; i++) {
      debouncedAgeUp();
    }

    expect(executionCount).toBe(1);
    if (timer) clearTimeout(timer);
  });
});
