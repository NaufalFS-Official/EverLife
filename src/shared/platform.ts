/**
 * PLATFORM ADAPTER CONTRACT (PRD §12.3 & D19)
 * Seluruh akses ke API peramban/hardware melewati adapter ini.
 * Lingkungan tanpa window/navigator (misal Node.js headless) jatuh ke fallback aman.
 */

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IPlatformStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

export interface IPlatformAdapter {
  isBrowser(): boolean;
  storage: IPlatformStorage;
  vibrate(ms: number | number[]): boolean;
  getSafeArea(): SafeAreaInsets;
  onVisibilityChange(callback: (visible: boolean) => void): () => void;
  copyToClipboard(text: string): Promise<boolean>;
  reload(): void;
  addKeyboardListener(listener: (e: KeyboardEvent) => void): () => void;
  isLandscape(): boolean;
  onResizeOrOrientationChange(callback: (isLandscape: boolean) => void): () => void;
}

/**
 * Memory Storage fallback untuk lingkungan Node.js atau saat localStorage diblokir.
 */
export class MemoryStorage implements IPlatformStorage {
  private memoryMap = new Map<string, string>();

  getItem(key: string): string | null {
    return this.memoryMap.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.memoryMap.set(key, value);
  }
  removeItem(key: string): void {
    this.memoryMap.delete(key);
  }
  clear(): void {
    this.memoryMap.clear();
  }
}

class BrowserLocalStorage implements IPlatformStorage {
  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore quota error fallback
    }
  }
  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  }
  clear(): void {
    try {
      window.localStorage.clear();
    } catch {
      // Ignore
    }
  }
}

export class DefaultPlatformAdapter implements IPlatformAdapter {
  public readonly storage: IPlatformStorage;

  constructor() {
    if (this.isBrowser() && typeof window.localStorage !== 'undefined') {
      this.storage = new BrowserLocalStorage();
    } else {
      this.storage = new MemoryStorage();
    }
  }

  public isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  public vibrate(ms: number | number[]): boolean {
    if (!this.isBrowser()) return false;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        return navigator.vibrate(ms);
      }
    } catch {
      // Silent ignore jika tidak didukung
    }
    return false;
  }

  public getSafeArea(): SafeAreaInsets {
    // Fallback safe area statis sesuai PRD §12.3 jika CSS env() bernilai 0
    return {
      top: 16,
      right: 0,
      bottom: 20,
      left: 0,
    };
  }

  public onVisibilityChange(callback: (visible: boolean) => void): () => void {
    if (!this.isBrowser()) return () => {};

    const handler = () => {
      callback(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }

  public async copyToClipboard(text: string): Promise<boolean> {
    if (!this.isBrowser()) return false;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback
    }
    return false;
  }

  public reload(): void {
    if (this.isBrowser()) {
      window.location.reload();
    }
  }

  public addKeyboardListener(listener: (e: KeyboardEvent) => void): () => void {
    if (!this.isBrowser()) return () => {};
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }

  public isLandscape(): boolean {
    if (!this.isBrowser()) return false;
    // Deteksi mobile landscape: lebar > tinggi dan tinggi layar <= 550px
    return window.innerWidth > window.innerHeight && window.innerHeight <= 550;
  }

  public onResizeOrOrientationChange(callback: (isLandscape: boolean) => void): () => void {
    if (!this.isBrowser()) return () => {};
    const handler = () => {
      callback(this.isLandscape());
    };
    window.addEventListener('resize', handler);
    window.addEventListener('orientationchange', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('orientationchange', handler);
    };
  }
}

export const platform = new DefaultPlatformAdapter();
