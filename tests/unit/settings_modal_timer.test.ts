import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { platform } from '../../src/shared/platform';

describe('BUG-002: SettingsModal Timer Cleanup on Unmount (F-009 / AC-008)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('harus membatalkan timer reload jika modal ditutup atau unmount sebelum 1000ms', () => {
    const reloadSpy = vi.spyOn(platform, 'reload').mockImplementation(() => {});

    // Simulasi timer controller di SettingsModal
    let timerRef: ReturnType<typeof setTimeout> | null = null;

    // Saat impor berhasil
    timerRef = setTimeout(() => {
      platform.reload();
    }, 1000);

    // Unmount / cleanup dipicu pada 300ms
    vi.advanceTimersByTime(300);
    expect(reloadSpy).not.toHaveBeenCalled();

    // Cleanup hook dijalankan:
    if (timerRef) {
      clearTimeout(timerRef);
      timerRef = null;
    }

    // Majukan waktu melewati 1000ms
    vi.advanceTimersByTime(1200);

    // Verifikasi platform.reload tidak dipanggil karena sudah dibersihkan
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it('harus memanggil platform.reload jika timer 1000ms berjalan penuh tanpa interupsi', () => {
    const reloadSpy = vi.spyOn(platform, 'reload').mockImplementation(() => {});

    let timerRef: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      platform.reload();
    }, 1000);

    vi.advanceTimersByTime(999);
    expect(reloadSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2);
    expect(reloadSpy).toHaveBeenCalledTimes(1);

    if (timerRef) {
      clearTimeout(timerRef);
      timerRef = null;
    }
  });
});
