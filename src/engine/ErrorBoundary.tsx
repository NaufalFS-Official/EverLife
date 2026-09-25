/**
 * GLOBAL ERROR BOUNDARY (EverLife)
 * Blueprint S14 & DAEL-24: Menangkap error unhandled render React,
 * menampilkan UI pemulihan yang ramah, dan menyediakan tombol ekspor save darurat.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { LocalSaveRepository } from '../adapter/localAdapter';
import { telemetry } from '../adapter/telemetry';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  emergencySave: string;
  copyFeedback: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    emergencySave: '',
    copyFeedback: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      emergencySave: '',
      copyFeedback: '',
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled render error caught by EverLife ErrorBoundary:', error, errorInfo);
    telemetry.recordClientError(error, {
      componentStack: (errorInfo.componentStack ?? '').slice(0, 200),
    });
  }

  private handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleExportEmergencySave = async (): Promise<void> => {
    try {
      const repo = new LocalSaveRepository();
      const payload = await repo.exportPayload();
      if (!payload) {
        this.setState({ copyFeedback: 'Tidak ada data save aktif yang ditemukan.' });
        return;
      }

      this.setState({ emergencySave: payload });

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(payload);
        this.setState({ copyFeedback: 'Data save berhasil disalin ke clipboard!' });
      } else {
        this.setState({ copyFeedback: 'Data ditampilkan di bawah. Silakan salin manual.' });
      }
    } catch {
      this.setState({ copyFeedback: 'Gagal mengekspor data save.' });
    }
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              !
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-100">
                Terjadi Kesalahan Tak Terduga
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                EverLife mengalami kendala saat merender tampilan. Data permainan Anda tetap tersimpan dengan aman di penyimpanan lokal.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950 p-3 rounded-lg text-left text-xs font-mono text-rose-300 max-h-24 overflow-y-auto break-all border border-slate-800">
                {this.state.error.message}
              </div>
            )}

            {this.state.emergencySave && (
              <div className="space-y-2 text-left">
                <label className="text-xs text-slate-400 font-semibold block">
                  Data Save Darurat (JSON):
                </label>
                <textarea
                  readOnly
                  value={this.state.emergencySave}
                  className="w-full h-24 bg-slate-950 text-xs font-mono text-emerald-400 p-2 rounded-lg border border-slate-700 select-all"
                />
              </div>
            )}

            {this.state.copyFeedback && (
              <p className="text-xs text-amber-400 font-medium">
                {this.state.copyFeedback}
              </p>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center"
              >
                Muat Ulang Permainan
              </button>

              <button
                type="button"
                onClick={this.handleExportEmergencySave}
                className="w-full min-h-[44px] px-4 py-2.5 bg-slate-700 hover:bg-slate-600 active:scale-[0.98] rounded-xl font-semibold text-slate-200 transition-all flex items-center justify-center"
              >
                Ekspor Save Darurat
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
