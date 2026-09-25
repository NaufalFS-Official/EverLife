/**
 * DEVICE PERFORMANCE TIER SYSTEM (EverLife)
 * Blueprint S1 & PRD §12.1: Presets Low/Mid/High, deteksi hardware, dan adaptasi runtime berbasis FPS.
 */

export type DeviceTier = 'low' | 'mid' | 'high';

export interface TierConfig {
  tier: DeviceTier;
  name: string;
  targetFps: number;
  enableConfetti: boolean;
  enableBackdropBlur: boolean;
  enableVignetteFlash: boolean;
  maxLogRenderItems: number;
}

export const TIER_CONFIGS: Record<DeviceTier, TierConfig> = {
  low: {
    tier: 'low',
    name: 'Low-Tier (Hemat Daya)',
    targetFps: 50,
    enableConfetti: false,
    enableBackdropBlur: false,
    enableVignetteFlash: false,
    maxLogRenderItems: 30,
  },
  mid: {
    tier: 'mid',
    name: 'Mid-Tier (Seimbang)',
    targetFps: 60,
    enableConfetti: true,
    enableBackdropBlur: false,
    enableVignetteFlash: true,
    maxLogRenderItems: 60,
  },
  high: {
    tier: 'high',
    name: 'High-Tier (Grafis Maksimal)',
    targetFps: 60,
    enableConfetti: true,
    enableBackdropBlur: true,
    enableVignetteFlash: true,
    maxLogRenderItems: 120,
  },
};

interface NavigatorWithHardware extends Navigator {
  deviceMemory?: number;
}

/**
 * Mendeteksi tier awal perangkat berdasarkan kapabilitas perangkat keras yang dilaporkan peramban.
 */
export function detectInitialDeviceTier(): DeviceTier {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'mid';
  }

  const nav = navigator as NavigatorWithHardware;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;

  // Perangkat hemat daya / budget (cores < 4 atau RAM < 3GB)
  if (cores < 4 || memory < 3) {
    return 'low';
  }

  // Perangkat flagship / desktop modern (cores >= 8 dan RAM >= 8GB)
  if (cores >= 8 && memory >= 8) {
    return 'high';
  }

  return 'mid';
}

/**
 * Adaptasi runtime dinamis: Menurunkan tier grafis jika FPS p50 anjlok di bawah ambang batas kenyamanan.
 */
export function evaluateRuntimeTierAdaptation(
  currentTier: DeviceTier,
  averageFps: number
): DeviceTier {
  if (currentTier === 'high' && averageFps < 50) {
    return 'mid';
  }
  if (currentTier === 'mid' && averageFps < 42) {
    return 'low';
  }
  return currentTier;
}
