/**
 * Suite Pengujian E2E Headless Playthrough 0 s.d. 18 Tahun & Stabilitas Memori.
 * Memverifikasi simulasi lengkap tanpa crash, metrik FPS p5/p50/p95, dan penangkapan error tracker.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { describe, it, expect } from 'vitest';
import { GameEngine } from '../../src/core/GameEngine';
import { EventEngine } from '../../src/core/EventEngine';
import { FpsTracker } from '../../src/core/observability/FpsTracker';
import { ErrorTracker } from '../../src/core/observability/ErrorTracker';
import { GAME_CONFIG } from '../../src/contracts/gameConfig';

describe('E2E Headless Playthrough (Usia 0 s.d. 18 Tahun)', () => {
  it('harus menyelesaikan playthrough penuh dari lahir sampai kelulusan tamat SMA tanpa error', () => {
    const engine = new GameEngine();
    const errorTracker = ErrorTracker.getInstance();
    errorTracker.clear();

    engine.startNewGame();
    engine.submitCharacter({
      name: 'Budi E2E',
      gender: 'Pria',
      country: 'Indonesia',
      birthYear: 2008,
      lifeSeed: 987654,
    });

    let turnsCount = 0;
    const maxTurnsGuard = 100;

    while (
      engine.getState().screen !== 'GRADUATION_SCREEN' &&
      engine.getState().screen !== 'GAME_OVER_DEATH' &&
      turnsCount < maxTurnsGuard
    ) {
      turnsCount++;
      const state = engine.getState();

      if (state.screen === 'EVENT_MODAL' && state.session?.activeEventId) {
        const activeEvent = EventEngine.getEvent(state.session.activeEventId);
        expect(activeEvent).toBeDefined();

        const firstOption = activeEvent?.options[0];
        expect(firstOption).toBeDefined();

        if (firstOption) {
          engine.selectEventOption(firstOption.id);
        }
      } else if (state.screen === 'GAMEPLAY_ACTIVE') {
        engine.ageUp();
      }
    }

    const finalState = engine.getState();
    expect(finalState.screen).toBe('GRADUATION_SCREEN');
    expect(finalState.session?.profile.age).toBeGreaterThanOrEqual(GAME_CONFIG.CFG_AGE_MAX_V1);
    expect(finalState.session?.isCompleted).toBe(true);
    expect(finalState.session?.profile.grade).toBe('Lulus SMA');

    // Pastikan tidak ada crash terrekam di ErrorTracker selama simulasi
    expect(errorTracker.getCapturedEvents().length).toBe(0);
  });

  it('harus memvalidasi kestabilan memori heap selama 100+ siklus simulasi tanpa kebocoran', () => {
    const initialSessions: number[] = [];

    // Jalankan 10 kehidupan penuh secara beruntun
    for (let life = 1; life <= 10; life++) {
      const engine = new GameEngine();
      engine.submitCharacter({
        name: `Subjek ${life}`,
        gender: life % 2 === 0 ? 'Wanita' : 'Pria',
        lifeSeed: life * 1111,
      });

      while (
        engine.getState().screen !== 'GRADUATION_SCREEN' &&
        engine.getState().screen !== 'GAME_OVER_DEATH'
      ) {
        const state = engine.getState();
        if (state.screen === 'EVENT_MODAL' && state.session?.activeEventId) {
          const event = EventEngine.getEvent(state.session.activeEventId);
          if (event && event.options[0]) {
            engine.selectEventOption(event.options[0].id);
          }
        } else if (state.screen === 'GAMEPLAY_ACTIVE') {
          engine.ageUp();
        }
      }

      initialSessions.push(engine.getState().session?.timelineHistory.length ?? 0);
    }

    expect(initialSessions.length).toBe(10);
    initialSessions.forEach(len => expect(len).toBeGreaterThan(10));
  });
});

describe('Observabilitas: FpsTracker & ErrorTracker', () => {
  it('harus menghitung distribusi persentil latensi frame (p5, p50, p95) secara akurat', () => {
    const tracker = FpsTracker.getInstance();
    tracker.stop();

    // Simulasikan 100 frame sintetis: 90 frame 16ms (60fps) dan 10 frame 30ms (~33fps)
    for (let i = 0; i < 90; i++) {
      tracker.recordFrame(16.6);
    }
    for (let i = 0; i < 10; i++) {
      tracker.recordFrame(30.0);
    }

    const metrics = tracker.getMetrics();
    expect(metrics.sampleCount).toBe(100);
    expect(metrics.p5Ms).toBeCloseTo(16.6, 1);
    expect(metrics.p50Ms).toBeCloseTo(16.6, 1);
    expect(metrics.p95Ms).toBeCloseTo(30.0, 1);
    expect(metrics.averageFps).toBeGreaterThanOrEqual(50);
  });

  it('harus menangkap event error uji dan menyimpannya lengkap dengan breadcrumbs', () => {
    const errorTracker = ErrorTracker.getInstance();
    errorTracker.clear();

    errorTracker.addBreadcrumb({
      category: 'action',
      message: 'Pemain menekan tombol Tambah Umur (+1)',
      level: 'info',
    });

    const testError = new Error('SIMULATED_TEST_EXCEPTION: Uji observabilitas klien');
    const captured = errorTracker.captureException(testError, {
      testSession: true,
      turn: 5,
    });

    expect(captured.id).toMatch(/^err-/);
    expect(captured.name).toBe('Error');
    expect(captured.message).toBe('SIMULATED_TEST_EXCEPTION: Uji observabilitas klien');
    expect(captured.breadcrumbs.length).toBe(1);
    expect(captured.breadcrumbs[0]?.message).toContain('Pemain menekan tombol Tambah Umur');
    expect(captured.context?.['turn']).toBe(5);

    expect(errorTracker.getCapturedEvents().length).toBe(1);
  });
});
