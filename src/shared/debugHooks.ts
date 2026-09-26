/**
 * DEBUG HOOKS & REPLAY CONTRACT (D16)
 * Antarmuka debugging global window.__game untuk verifikasi E2E dan pengujian headless.
 * HANYA aktif pada build debug atau URL flag ?debug=1.
 */

import { GlobalGameState } from './state';

export interface ReplayAction {
  year: number;
  actionType: string;
  payload?: unknown;
}

export interface ReplayLog {
  seed: number;
  actions: ReplayAction[];
}

export interface GameDebugHooks {
  seed: number;
  getState: () => GlobalGameState;
  stateHash: () => string;
  setState: (partial: Partial<GlobalGameState>) => void;
  fastForward: (years: number) => void;
  triggerEvent: (eventId: string) => void;
  startReplay: () => void;
  getReplay: () => ReplayLog;
  fps: () => number;
}

declare global {
  interface Window {
    __game?: GameDebugHooks;
  }
}

/**
 * Memeriksa apakah mode debug aktif (URL parameter ?debug=1 atau env VITE_DEBUG_MODE).
 * Secara tegas mengembalikan false pada mode produksi untuk mengeliminasi dead code.
 */
export function isDebugMode(): boolean {
  if (import.meta.env.PROD) return false;
  if (typeof window === 'undefined') return false;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('debug') === '1' || import.meta.env?.VITE_DEBUG_MODE === 'true';
  } catch {
    return false;
  }
}

/**
 * Mendaftarkan hooks debug ke window.__game hanya jika mode debug aktif dan bukan build produksi.
 */
export function registerDebugHooks(hooks: GameDebugHooks): void {
  if (!import.meta.env.PROD && typeof window !== 'undefined' && isDebugMode()) {
    (window as unknown as { __game?: GameDebugHooks }).__game = hooks;
  }
}

/**
 * Melepas hooks debug dari window.__game.
 */
export function unregisterDebugHooks(): void {
  if (!import.meta.env.PROD && typeof window !== 'undefined') {
    delete (window as unknown as { __game?: GameDebugHooks }).__game;
  }
}
