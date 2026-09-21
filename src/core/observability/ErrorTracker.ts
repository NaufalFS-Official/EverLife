/**
 * Modul Pelacakan Error & Telemetri Klien (ErrorTracker) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S15 & Instruksi INFRA.
 * Beroperasi mandiri secara offline-first dengan penampung memori lokal (Sentry-compatible telemetry interface).
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

export interface Breadcrumb {
  readonly timestamp: string;
  readonly category: string;
  readonly message: string;
  readonly level: 'info' | 'warning' | 'error';
}

export interface CapturedErrorEvent {
  readonly id: string;
  readonly timestamp: string;
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly breadcrumbs: readonly Breadcrumb[];
  readonly context?: Record<string, string | number | boolean>;
}

export class ErrorTracker {
  private static instance: ErrorTracker | null = null;
  private readonly events: CapturedErrorEvent[] = [];
  private readonly breadcrumbs: Breadcrumb[] = [];
  private isInitialized: boolean = false;

  public static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  public init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (typeof window !== 'undefined') {
      window.addEventListener('error', event => {
        this.captureException(event.error instanceof Error ? event.error : new Error(event.message), {
          source: 'window.onerror',
          filename: event.filename,
          lineno: event.lineno,
        });
      });

      window.addEventListener('unhandledrejection', event => {
        const reason = event.reason;
        const err = reason instanceof Error ? reason : new Error(String(reason));
        this.captureException(err, { source: 'unhandledrejection' });
      });
    }
  }

  public addBreadcrumb(crumb: Omit<Breadcrumb, 'timestamp'>): void {
    this.breadcrumbs.push({
      ...crumb,
      timestamp: new Date().toISOString(),
    });
    // Pertahankan maksimal 50 jejak rekam jejak terakhir
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs.shift();
    }
  }

  public captureException(
    error: Error,
    context?: Record<string, string | number | boolean>
  ): CapturedErrorEvent {
    const event: CapturedErrorEvent = {
      id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      stack: error.stack,
      breadcrumbs: [...this.breadcrumbs],
      context,
    };

    this.events.push(event);
    if (this.events.length > 100) {
      this.events.shift();
    }

    return event;
  }

  public getCapturedEvents(): readonly CapturedErrorEvent[] {
    return [...this.events];
  }

  public getLastEvent(): CapturedErrorEvent | undefined {
    return this.events[this.events.length - 1];
  }

  public clear(): void {
    this.events.length = 0;
    this.breadcrumbs.length = 0;
  }
}
