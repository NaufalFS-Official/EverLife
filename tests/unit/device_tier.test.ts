import { describe, it, expect } from 'vitest';
import {
  detectInitialDeviceTier,
  evaluateRuntimeTierAdaptation,
  TIER_CONFIGS,
  DeviceTier,
} from '../../src/platform/deviceTier';

describe('Device Performance Tier System', () => {
  it('harus memuat konfigurasi lengkap untuk tier low, mid, dan high', () => {
    const tiers: DeviceTier[] = ['low', 'mid', 'high'];

    tiers.forEach((tier) => {
      const config = TIER_CONFIGS[tier];
      expect(config).toBeDefined();
      expect(config.tier).toBe(tier);
      expect(config.targetFps).toBeGreaterThanOrEqual(50);
      expect(typeof config.enableConfetti).toBe('boolean');
      expect(typeof config.enableBackdropBlur).toBe('boolean');
      expect(config.maxLogRenderItems).toBeGreaterThan(0);
    });

    expect(TIER_CONFIGS.low.enableConfetti).toBe(false);
    expect(TIER_CONFIGS.low.enableBackdropBlur).toBe(false);
    expect(TIER_CONFIGS.high.enableConfetti).toBe(true);
    expect(TIER_CONFIGS.high.enableBackdropBlur).toBe(true);
  });

  it('harus mendeteksi tier awal dengan aman tanpa melempar exception', () => {
    const detected = detectInitialDeviceTier();
    expect(['low', 'mid', 'high']).toContain(detected);
  });

  it('harus mengadaptasi runtime tier ke bawah saat frame rate anjlok', () => {
    // High tier anjlok ke bawah 50 FPS -> adaptasi ke mid
    expect(evaluateRuntimeTierAdaptation('high', 45)).toBe('mid');
    // High tier stabil di 58 FPS -> tetap high
    expect(evaluateRuntimeTierAdaptation('high', 58)).toBe('high');

    // Mid tier anjlok ke bawah 42 FPS -> adaptasi ke low
    expect(evaluateRuntimeTierAdaptation('mid', 38)).toBe('low');
    // Mid tier stabil di 48 FPS -> tetap mid
    expect(evaluateRuntimeTierAdaptation('mid', 48)).toBe('mid');

    // Low tier tetap low pada FPS rendah
    expect(evaluateRuntimeTierAdaptation('low', 25)).toBe('low');
  });
});
