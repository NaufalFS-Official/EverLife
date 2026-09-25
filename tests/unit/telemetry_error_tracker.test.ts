import { describe, it, expect, beforeEach } from 'vitest';
import { TelemetryService } from '../../src/adapter/telemetry';

describe('Telemetry & Error Tracker System', () => {
  let service: TelemetryService;

  beforeEach(() => {
    service = new TelemetryService();
    service.clearLocalData();
    service.setConsent(false);
  });

  it('harus menghormati status consent (default false / opt-in)', () => {
    expect(service.getConsent()).toBe(false);

    // Saat consent false, tracking event diabaikan
    service.trackEvent({
      eventName: 'test_event_ignored',
      runId: 'run_123',
      age: 20,
      deviceTier: 'mid',
    });

    expect(service.getRecentEvents().length).toBe(0);

    // Aktifkan consent
    service.setConsent(true);
    expect(service.getConsent()).toBe(true);

    service.trackEvent({
      eventName: 'test_event_accepted',
      runId: 'run_123',
      age: 21,
      deviceTier: 'high',
    });

    const events = service.getRecentEvents();
    expect(events.length).toBe(1);
    expect(events[0]?.eventName).toBe('test_event_accepted');
    expect(events[0]?.age).toBe(21);
  });

  it('harus mencatat error unhandled client ke dalam buffer lokal', () => {
    const error = new Error('Test unhandled client exception');
    service.recordClientError(error, { screen: 'DASHBOARD', activeAge: 35 });

    const errors = service.getRecentErrors();
    expect(errors.length).toBe(1);
    expect(errors[0]?.message).toBe('Test unhandled client exception');
    expect(errors[0]?.context?.screen).toBe('DASHBOARD');
  });

  it('harus membatasi kapasitas buffer error dan event (circular buffer)', () => {
    service.setConsent(true);

    for (let i = 0; i < 35; i++) {
      service.recordClientError(new Error(`Error ${i}`));
      service.trackEvent({
        eventName: `event_${i}`,
        runId: 'run_buffer',
        age: i,
        deviceTier: 'low',
      });
    }

    expect(service.getRecentErrors().length).toBeLessThanOrEqual(25);
    expect(service.getRecentEvents().length).toBeLessThanOrEqual(25);
  });

  it('harus mencatat sampel FPS dan menghitung rata-rata frame time secara akurat', () => {
    // 60 FPS = ~16.66ms per frame
    for (let i = 0; i < 60; i++) {
      service.recordFrameSample(16.6);
    }
    // Tambah satu spike anomali drop (> 33.3ms)
    service.recordFrameSample(45.0);

    const report = service.getFpsMetrics();
    expect(report.sampleCount).toBe(61);
    expect(report.averageFps).toBeGreaterThanOrEqual(55);
    expect(report.anomalyDropCount).toBe(1);
    expect(report.p50FrameTimeMs).toBeCloseTo(16.6, 1);
  });

  it('harus menghapus seluruh data lokal saat clearLocalData dipanggil', () => {
    service.setConsent(true);
    service.trackEvent({ eventName: 'event', runId: 'run', age: 1, deviceTier: 'mid' });
    service.recordClientError(new Error('err'));

    service.clearLocalData();
    expect(service.getRecentEvents().length).toBe(0);
    expect(service.getRecentErrors().length).toBe(0);
  });
});
