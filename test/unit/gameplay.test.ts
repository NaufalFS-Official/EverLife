/**
 * Suite Pengujian Unit Logika Core Permainan EverLife (v1.0-SMA).
 * Memverifikasi kalkulator stat, pool 50 event, ekonomi, dan relasi sosial.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { describe, it, expect } from 'vitest';
import { StatCalculator } from '../../src/core/StatCalculator';
import { MASTER_EVENT_POOL, findEventById, getEventsForAge } from '../../src/core/EventPool';
import { EventEngine } from '../../src/core/EventEngine';
import { RelationEngine } from '../../src/core/RelationEngine';
import { EconomyEngine, ANNUAL_ACTIVITIES } from '../../src/core/EconomyEngine';
import { createMulberry32 } from '../../src/core/prng';
import { GAME_CONFIG } from '../../src/contracts/gameConfig';

describe('StatCalculator', () => {
  it('harus melakukan clamping statistik dalam batas [0, 100]', () => {
    expect(StatCalculator.clamp(-15)).toBe(0);
    expect(StatCalculator.clamp(120)).toBe(100);
    expect(StatCalculator.clamp(50)).toBe(50);
  });

  it('harus menerapkan delta statistik dengan batas aman', () => {
    const initial = { health: 90, happiness: 85, relationship: 80, academic: 50 };
    const updated = StatCalculator.applyDeltas(initial, {
      health: 20,
      happiness: -30,
      academic: 10,
    });

    expect(updated.health).toBe(100);
    expect(updated.happiness).toBe(55);
    expect(updated.academic).toBe(60);
    expect(updated.relationship).toBe(80);
  });

  it('harus menentukan jenjang pendidikan berdasarkan umur secara tepat', () => {
    expect(StatCalculator.resolveGrade(0)).toBe('Balita');
    expect(StatCalculator.resolveGrade(5)).toBe('Balita');
    expect(StatCalculator.resolveGrade(6)).toBe('SD');
    expect(StatCalculator.resolveGrade(11)).toBe('SD');
    expect(StatCalculator.resolveGrade(12)).toBe('SMP');
    expect(StatCalculator.resolveGrade(14)).toBe('SMP');
    expect(StatCalculator.resolveGrade(15)).toBe('SMA');
    expect(StatCalculator.resolveGrade(17)).toBe('SMA');
    expect(StatCalculator.resolveGrade(18)).toBe('Lulus SMA');
  });

  it('harus memberikan uang saku sesuai jenjang usia', () => {
    expect(StatCalculator.resolveAnnualAllowance(4)).toBe(0);
    expect(StatCalculator.resolveAnnualAllowance(7)).toBe(GAME_CONFIG.CFG_ALLOWANCE_BASE_SD);
    expect(StatCalculator.resolveAnnualAllowance(13)).toBe(GAME_CONFIG.CFG_ALLOWANCE_BASE_SMP);
    expect(StatCalculator.resolveAnnualAllowance(16)).toBe(GAME_CONFIG.CFG_ALLOWANCE_BASE_SMA);
  });

  it('harus menerapkan penalti kebahagiaan saat kesehatan kritis (<20%)', () => {
    const criticalStats = { health: 15, happiness: 80, relationship: 70, academic: 50 };
    const result = StatCalculator.evaluateHealthPenalty(criticalStats);
    expect(result.penaltyApplied).toBe(true);
    expect(result.penaltyAmount).toBe(GAME_CONFIG.CFG_HEALTH_PENALTY_DEPLETION);
    expect(result.stats.happiness).toBe(80 - GAME_CONFIG.CFG_HEALTH_PENALTY_DEPLETION);
  });
});

describe('EventEngine & EventPool', () => {
  it('harus memuat tepat 50 kartu event SMA v1.0', () => {
    expect(MASTER_EVENT_POOL.length).toBe(GAME_CONFIG.CFG_EVENT_POOL_SIZE_V1);
  });

  it('setiap event harus memiliki ID unik dan minimal 2 opsi jawaban', () => {
    const ids = new Set<string>();
    MASTER_EVENT_POOL.forEach(event => {
      expect(ids.has(event.id)).toBe(false);
      ids.add(event.id);
      expect(event.options.length).toBeGreaterThanOrEqual(2);
      expect(event.minAge).toBeLessThanOrEqual(event.maxAge);
    });
  });

  it('harus dapat menemukan event berdasarkan ID spesifik', () => {
    const first = findEventById('evt-001');
    expect(first).toBeDefined();
    expect(first?.title).toBe('Langkah Pertama');

    const last = findEventById('evt-050');
    expect(last).toBeDefined();
    expect(last?.title).toBe('Upacara Wisuda & Kelulusan Tamat SMA');
  });

  it('harus dapat memfilter event berdasarkan usia', () => {
    const toddlerEvents = getEventsForAge(2);
    expect(toddlerEvents.length).toBeGreaterThan(0);
    toddlerEvents.forEach(e => {
      expect(e.minAge).toBeLessThanOrEqual(2);
      expect(e.maxAge).toBeGreaterThanOrEqual(2);
    });
  });

  it('harus memilih event secara deterministik menggunakan PRNG', () => {
    const prng1 = createMulberry32(42);
    const prng2 = createMulberry32(42);

    const event1 = EventEngine.selectEventForAge({
      age: 7,
      prng: prng1,
      pastFlags: [],
      pastEventIds: [],
    });

    const event2 = EventEngine.selectEventForAge({
      age: 7,
      prng: prng2,
      pastFlags: [],
      pastEventIds: [],
    });

    expect(event1).not.toBeNull();
    expect(event1?.id).toBe(event2?.id);
  });

  it('harus mengeksekusi opsi event dan mencatat delta statistik ke log', () => {
    const event = findEventById('evt-001')!;
    const resolution = EventEngine.resolveOption({
      event,
      optionId: 'opt-1a',
      currentStats: { health: 90, happiness: 80, relationship: 80, academic: 50 },
      currentCash: 0,
      currentAge: 1,
    });

    expect(resolution.nextStats.happiness).toBe(90);
    expect(resolution.nextStats.relationship).toBe(90);
    expect(resolution.logEntry.age).toBe(1);
    expect(resolution.logEntry.title).toBe('Langkah Pertama');
  });
});

describe('RelationEngine', () => {
  it('harus menginisialisasi relasi default Ayah dan Ibu', () => {
    const family = RelationEngine.createInitialFamily();
    expect(family.length).toBe(2);
    expect(family.some(n => n.role === 'Ayah')).toBe(true);
    expect(family.some(n => n.role === 'Ibu')).toBe(true);
  });

  it('harus menerapkan penurunan relasi tahunan (annual decay)', () => {
    const family = RelationEngine.createInitialFamily();
    const decayed = RelationEngine.applyAnnualDecay(family);
    expect(decayed[0]!.relationshipScore).toBe(
      family[0]!.relationshipScore - GAME_CONFIG.CFG_RELATION_DECAY_ANNUAL
    );
  });

  it('harus mengeksekusi interaksi mengobrol dan meningkatkan keakraban', () => {
    const family = RelationEngine.createInitialFamily();
    const result = RelationEngine.interact({
      relations: family,
      targetId: 'npc-dad',
      actionType: 'chat',
      currentCash: 0,
    });

    expect(result.scoreDelta).toBe(10);
    const dad = result.updatedRelations.find(n => n.id === 'npc-dad');
    expect(dad?.relationshipScore).toBe(family[0]!.relationshipScore + 10);
  });
});

describe('EconomyEngine', () => {
  it('harus menyaring aktivitas yang terbuka sesuai umur', () => {
    const earlyActs = EconomyEngine.getAvailableActivities(5);
    expect(earlyActs.length).toBe(0);

    const sdActs = EconomyEngine.getAvailableActivities(8);
    expect(sdActs.length).toBeGreaterThan(0);

    const smaActs = EconomyEngine.getAvailableActivities(16);
    expect(smaActs.length).toBe(ANNUAL_ACTIVITIES.length);
  });

  it('harus mengeksekusi aktivitas belajar mandiri dengan benar', () => {
    const result = EconomyEngine.executeActivity({
      activityId: 'act-study-self',
      currentAge: 10,
      currentCash: 0,
    });

    expect(result.success).toBe(true);
    expect(result.statDeltas['academic']).toBe(10);
  });
});
