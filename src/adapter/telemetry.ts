/**
 * TELEMETRY & OBSERVABILITY ADAPTER (EverLife)
 * Blueprint S14 & PRD §13.0: Consent-gated anonymized telemetry,
 * client-side error tracking buffer, and FPS performance reporter.
 */

import { DefaultPlatformAdapter } from '../shared/platform';
import { DeviceTier } from '../platform/deviceTier';

export interface TelemetryEvent {
  eventName: string;
  timestamp: number;
  runId: string;
  age: number;
  deviceTier: DeviceTier;
  metadata?: Record<string, string | number | boolean>;
}

export interface ClientErrorLog {
  timestamp: number;
  message: string;
  stack?: string;
  context?: Record<string, string | number | boolean>;
}

export interface FpsMetricsReport {
  sampleCount: number;
  averageFps: number;
  p50FrameTimeMs: number;
  p95FrameTimeMs: number;
  anomalyDropCount: number;
}

const TELEMETRY_CONSENT_KEY = 'everlife_telemetry_consent';
const TELEMETRY_LOGS_KEY = 'everlife_telemetry_events';
const ERROR_LOGS_KEY = 'everlife_client_errors';
const MAX_BUFFER_ITEMS = 25;

export class TelemetryService {
  private platform = new DefaultPlatformAdapter();
  private hasConsent: boolean = false;
  private eventBuffer: TelemetryEvent[] = [];
  private errorBuffer: ClientErrorLog[] = [];
  private frameTimes: number[] = [];
  private anomalyDropCount: number = 0;

  constructor() {
    this.loadConsent();
    this.loadBuffers();
  }

  private loadConsent(): void {
    const val = this.platform.storage.getItem(TELEMETRY_CONSENT_KEY);
    this.hasConsent = val === 'true';
  }

  private loadBuffers(): void {
    try {
      const rawErrors = this.platform.storage.getItem(ERROR_LOGS_KEY);
      if (rawErrors) {
        this.errorBuffer = JSON.parse(rawErrors);
      }
      const rawEvents = this.platform.storage.getItem(TELEMETRY_LOGS_KEY);
      if (rawEvents) {
        this.eventBuffer = JSON.parse(rawEvents);
      }
    } catch {
      this.errorBuffer = [];
      this.eventBuffer = [];
    }
  }

  public getConsent(): boolean {
    return this.hasConsent;
  }

  public setConsent(granted: boolean): void {
    this.hasConsent = granted;
    this.platform.storage.setItem(TELEMETRY_CONSENT_KEY, granted ? 'true' : 'false');
    if (!granted) {
      this.clearLocalData();
    }
  }

  public trackEvent(event: Omit<TelemetryEvent, 'timestamp'>): void {
    if (!this.hasConsent) return;

    const fullEvent: TelemetryEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.eventBuffer.push(fullEvent);
    if (this.eventBuffer.length > MAX_BUFFER_ITEMS) {
      this.eventBuffer.shift();
    }

    try {
      this.platform.storage.setItem(TELEMETRY_LOGS_KEY, JSON.stringify(this.eventBuffer));
    } catch {
      // Ignore storage quota
    }
  }

  public recordClientError(error: Error, context?: Record<string, string | number | boolean>): void {
    const errorEntry: ClientErrorLog = {
      timestamp: Date.now(),
      message: error.message,
      stack: error.stack ? error.stack.slice(0, 300) : undefined,
      context,
    };

    this.errorBuffer.push(errorEntry);
    if (this.errorBuffer.length > MAX_BUFFER_ITEMS) {
      this.errorBuffer.shift();
    }

    try {
      this.platform.storage.setItem(ERROR_LOGS_KEY, JSON.stringify(this.errorBuffer));
    } catch {
      // Ignore storage quota
    }
  }

  public recordFrameSample(frameTimeMs: number): void {
    this.frameTimes.push(frameTimeMs);
    if (frameTimeMs > 33.33) {
      this.anomalyDropCount++;
    }
    if (this.frameTimes.length > 120) {
      this.frameTimes.shift();
    }
  }

  public getFpsMetrics(): FpsMetricsReport {
    if (this.frameTimes.length === 0) {
      return {
        sampleCount: 0,
        averageFps: 60,
        p50FrameTimeMs: 16.66,
        p95FrameTimeMs: 16.66,
        anomalyDropCount: this.anomalyDropCount,
      };
    }

    const sum = this.frameTimes.reduce((acc, v) => acc + v, 0);
    const avgFrameTime = sum / this.frameTimes.length;
    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    const p50Index = Math.floor(sorted.length * 0.5);
    const p95Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));

    const p50 = sorted[p50Index] ?? 16.66;
    const p95 = sorted[p95Index] ?? 16.66;

    return {
      sampleCount: this.frameTimes.length,
      averageFps: Math.round(1000 / Math.max(1, avgFrameTime)),
      p50FrameTimeMs: Math.round(p50 * 100) / 100,
      p95FrameTimeMs: Math.round(p95 * 100) / 100,
      anomalyDropCount: this.anomalyDropCount,
    };
  }

  public getRecentErrors(): ClientErrorLog[] {
    return [...this.errorBuffer];
  }

  public getRecentEvents(): TelemetryEvent[] {
    return [...this.eventBuffer];
  }

  public clearLocalData(): void {
    this.eventBuffer = [];
    this.errorBuffer = [];
    this.platform.storage.removeItem(TELEMETRY_LOGS_KEY);
    this.platform.storage.removeItem(ERROR_LOGS_KEY);
  }
}

export const telemetry = new TelemetryService();
