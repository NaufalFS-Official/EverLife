/**
 * Komponen Penanganan Crash Aplikasi Root (ErrorBoundary) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S14 & manifest_v1.md M2-INFRA.
 * Menangkap exception pada React render tree dan menyediakan tombol salin log diagnostik.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Copy, RotateCcw, Check } from 'lucide-react';
import { ErrorTracker } from '../../core/observability/ErrorTracker';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
  readonly errorInfo: ErrorInfo | null;
  readonly isCopied: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isCopied: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });
    // Laporkan ke ErrorTracker telemetri
    ErrorTracker.getInstance().captureException(error, {
      componentStack: errorInfo.componentStack ? errorInfo.componentStack.substring(0, 200) : '',
    });
    // Log diagnostik ke konsol
    console.error('ErrorBoundary tertangkap:', error, errorInfo);
  }

  private handleCopyLog = async (): Promise<void> => {
    const { error, errorInfo } = this.state;
    const logPayload = [
      `=== DIAGNOSTIK CRASH EVERLIFE ===`,
      `Waktu: ${new Date().toISOString()}`,
      `Error: ${error?.name ?? 'UnknownError'}: ${error?.message ?? 'Tidak ada pesan'}`,
      `Stack:`,
      error?.stack ?? '(Tidak ada stack trace)',
      `Komponen Stack:`,
      errorInfo?.componentStack ?? '(Tidak ada info komponen)',
    ].join('\n');

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(logPayload);
        this.setState({ isCopied: true });
        setTimeout(() => this.setState({ isCopied: false }), 3000);
      }
    } catch {
      // Fallback jika akses clipboard dibatasi
    }
  };

  private handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      const { error, isCopied } = this.state;

      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 text-white">
          <div className="w-full max-w-sm rounded-3xl bg-slate-800 p-6 text-center shadow-2xl border border-slate-700">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="mt-4 text-xl font-black text-white">
              Terjadi Kendala Sistem
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Aplikasi mengalami kendala tak terduga. Data simpanan Anda di slot lokal tetap aman.
            </p>

            <div className="my-4 max-h-36 overflow-y-auto rounded-xl bg-slate-950 p-3 text-left font-mono text-[11px] text-rose-300 border border-slate-800">
              <p className="font-bold">{error?.name}: {error?.message}</p>
              {error?.stack && (
                <p className="text-[9px] text-slate-500 mt-1 whitespace-pre-wrap">
                  {error.stack}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => void this.handleCopyLog()}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-700 py-3 px-4 text-xs font-bold text-slate-200 hover:bg-slate-600 transition-all border border-slate-600"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Log Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Log Masalah</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 active:scale-[0.98] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mulai Ulang Aplikasi</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
