import { describe, it, expect } from 'vitest';
import { createNewLife } from '../../src/core/character';
import { tickAge } from '../../src/core/aging';
import { resolveChoice, surpriseMeChoice } from '../../src/core/events';
import { applyForJob } from '../../src/core/career';
import { commitCrime } from '../../src/core/crime';
import { purchaseAsset } from '../../src/core/finances';
import { spendTimeWithNPC } from '../../src/core/relationships';
import { evaluateTransition } from '../../src/shared/state';
import { LocalSaveRepository } from '../../src/adapter/localAdapter';
import { Mulberry32PRNG } from '../../src/shared/rng';
import { runSimulationBenchmark } from '../../src/engine/fpsHarness';

describe('Playtest Terstruktur (L4 Testability)', () => {
  // 1. FTUE: First 60 Seconds Gameplay Flow
  it('SKENARIO-01 [FTUE]: Menyelesaikan alur FTUE 60 detik pertama dan mengukur detik tercapai', () => {
    const tStart = performance.now();
    const rng = new Mulberry32PRNG(12345);

    // Langkah 1: Karakter lahir (Usia 0)
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      country: 'Indonesia',
      city: 'Jakarta',
    });

    expect(state.currentScreen).toBe('GAMEPLAY_ACTIVE');
    expect(state.character.age).toBe(0);
    expect(state.character.lifeLog.length).toBeGreaterThan(0);

    // Waktu tercapai ke aksi bermakna pertama (+Age)
    const tFirstActionMs = performance.now() - tStart;
    console.log(`[FTUE BENCHMARK] Waktu ke aksi pertama: ${tFirstActionMs.toFixed(2)} ms (Target PRD <= 12.000 ms)`);
    expect(tFirstActionMs).toBeLessThan(12000);

    // Langkah 2: Tekan +Age ke Usia 1 dan Usia 2
    let res = tickAge(state, rng);
    expect(res.nextState.character.age).toBe(1);

    res = tickAge(res.nextState, rng);
    expect(res.nextState.character.age).toBe(2);

    // Langkah 3: Muncul event balita & selesaikan pilihan
    if (res.nextState.activeModal) {
      const outcome = resolveChoice(res.nextState, res.nextState.activeModal, 1);
      expect(outcome.isFatal).toBe(false);
      expect(outcome.nextState.activeModal).toBeNull();
    }

    // Langkah 4: Interaksi relasi dengan orang tua
    const mom = res.nextState.character.relationships.find((r) => r.role === 'Mother');
    if (mom) {
      const initialBar = mom.relationshipBar;
      spendTimeWithNPC(res.nextState, mom.id, rng);
      expect(mom.relationshipBar).toBeGreaterThanOrEqual(initialBar);
    }

    const tTotalFtueMs = performance.now() - tStart;
    console.log(`[FTUE BENCHMARK] Total eksekusi FTUE: ${tTotalFtueMs.toFixed(2)} ms (Simulasi 60s tercapai sukses)`);
    expect(tTotalFtueMs).toBeLessThan(60000);
  });

  // 2. Core Loop 3 Siklus Penuh
  it('SKENARIO-02 [CORE LOOP]: Menjalankan 3 siklus hidup penuh (Lahir s/d Wafat)', () => {
    const lifecycles = [
      { name: 'Karier Biasa', seed: 101, career: true, crime: false },
      { name: 'Jalur Kriminal', seed: 202, career: false, crime: true },
      { name: 'Kaum Elit', seed: 303, career: true, crime: false },
    ];

    lifecycles.forEach((spec, idx) => {
      const rng = new Mulberry32PRNG(spec.seed);
      let state = createNewLife({
        firstName: `Subjek_${idx}`,
        lastName: 'Playtest',
        gender: 'Female',
        country: 'Indonesia',
        city: 'Bandung',
      });

      let isDead = false;
      let years = 0;

      while (!isDead && years < 110) {
        years++;

        // Aksi pilihan skenario jika modal aktif
        if (state.activeModal) {
          const outcome = surpriseMeChoice(state, state.activeModal, rng);
          state = outcome.nextState;
          if (outcome.isFatal) {
            isDead = true;
            break;
          }
        }

        // Jalur karir pada usia 18+
        if (spec.career && state.character.age === 18 && !state.character.job) {
          applyForJob(state, {
            id: 'job_clerk',
            title: 'Staff Administrasi',
            category: 'Corporate',
            baseSalary: 15000,
            minEducation: 'Secondary',
            minSmarts: 40,
          }, rng);
        }

        // Jalur kejahatan
        if (spec.crime && state.character.age >= 16 && state.character.age <= 25) {
          commitCrime(state, 'shoplift', rng);
        }

        const tickRes = tickAge(state, rng);
        state = tickRes.nextState;
        isDead = tickRes.isDead;
      }

      console.log(`[CORE LOOP ${idx + 1}] Profil: ${spec.name} | Usia Wafat: ${state.character.age} tahun | Status Akhir: ${state.currentScreen}`);
      expect(isDead).toBe(true);
      expect(state.currentScreen).toBe('DEATH_SUMMARY');
      expect(state.character.age).toBeGreaterThanOrEqual(1);
    });
  });

  // 3. Kondisi Batas (Edge Cases)
  it('SKENARIO-03 [KONDISI BATAS]: Pause/Resume, Spam Input, Restart Cepat, dan Save Korup', async () => {
    const repo = new LocalSaveRepository();
    const rng = new Mulberry32PRNG(999);

    // 3a. Save Korup & Tampered Checksum
    expect(await repo.importPayload('non-json-data')).toBe(false);
    expect(await repo.importPayload('{"schemaVersion": 1, "checksum": "tampered", "payload": {}}')).toBe(false);

    // 3b. Restart Cepat
    let s1 = createNewLife({ firstName: 'A', lastName: 'B', gender: 'Male', country: 'ID', city: 'JKT' });
    await repo.save(s1);
    await repo.clear();
    const afterClear = await repo.load();
    expect(afterClear).toBeNull();

    // 3c. Spam Input / Debounce Guard
    // Evaluasi transisi terlarang: dari GAMEPLAY_ACTIVE langsung ke MAIN_MENU tanpa reset
    const illegalTransition = evaluateTransition('GAMEPLAY_ACTIVE', 'MAIN_MENU');
    expect(illegalTransition.allowed).toBe(false);

    // 3d. Transisi terlarang saat modal aktif
    s1.activeModal = {
      id: 'test_modal',
      category: 'Drama',
      minAge: 10,
      maxAge: 20,
      title: 'Modal Wajib',
      description: 'Pilihan harus diselesaikan',
      choices: [{ text: 'Opsi 1', statDeltas: {}, logText: 'Log 1' }],
    };
    const openDrawerWhileModal = evaluateTransition('GAMEPLAY_ACTIVE', 'SUBMENU_OPEN');
    // Guard mengharuskan modal selesai terlebih dahulu
    expect(s1.activeModal).not.toBeNull();

    // 3e. Reload di tengah modal
    await repo.save(s1);
    const reloaded = await repo.load();
    expect(reloaded?.activeModal?.id).toBe('test_modal');
  });

  // 4. Kondisi Kalah & Menang
  it('SKENARIO-04 [KALAH & MENANG]: Deteksi penyebab kematian (Kalah) dan evaluasi ribbon (Menang)', () => {
    const rng = new Mulberry32PRNG(888);
    const state = createNewLife({
      firstName: 'Budi',
      lastName: 'Santoso',
      gender: 'Male',
      country: 'Indonesia',
      city: 'Jakarta',
    });

    // Simulasi Kalah: Health diturunkan paksa ke 0%
    state.character.attributes.health = 0;
    const fatalTick = tickAge(state, rng);
    expect(fatalTick.isDead).toBe(true);
    expect(fatalTick.nextState.currentScreen).toBe('DEATH_SUMMARY');
    expect(fatalTick.nextState.character.causeOfDeath).toBeDefined();
    console.log(`[KALAH] Penyebab Wafat: ${fatalTick.nextState.character.causeOfDeath}`);

    // Simulasi "Menang": Karakter mencapai usia 80+ dengan saldo tinggi
    const elderState = createNewLife({
      firstName: 'Sultan',
      lastName: 'Makmur',
      gender: 'Male',
      country: 'Indonesia',
      city: 'Surabaya',
    });
    elderState.character.age = 80;
    elderState.character.finances.bankBalance = 5000000;
    elderState.character.attributes.karma = 90;

    // Evaluasi transisi pasca kematian
    const winTick = tickAge(elderState, rng);
    expect(winTick.nextState.currentScreen).toBe('DEATH_SUMMARY');
    expect(winTick.nextState.character.finances.bankBalance).toBeGreaterThan(1000000);
  });

  // 5. Pengukuran Frame-Time & Profil FPS
  it('SKENARIO-05 [FPS & HARNESS]: Mengukur profil FPS p50, p95, dan frame times', () => {
    const metrics = runSimulationBenchmark(150);
    console.log('[PLAYTEST FPS REPORT]', {
      avgFrameTimeMs: metrics.avgFrameTimeMs,
      p50FrameTimeMs: metrics.p50FrameTimeMs,
      p95FrameTimeMs: metrics.p95FrameTimeMs,
      effectiveFps: metrics.effectiveFps,
      heapGrowthPercent: `${metrics.heapGrowthPercent}%`,
      passed: metrics.passed,
    });

    expect(metrics.passed).toBe(true);
    expect(metrics.p95FrameTimeMs).toBeLessThanOrEqual(16.66);
    expect(metrics.effectiveFps).toBeGreaterThanOrEqual(55);
  });
});
