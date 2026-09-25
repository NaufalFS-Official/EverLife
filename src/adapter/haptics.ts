/**
 * HAPTIC FEEDBACK WRAPPER (EverLife)
 * Blueprint S2 & S17: Non-blocking tactile feedback using PlatformAdapter.
 */

import { GAME_CONFIG, DefaultPlatformAdapter } from '../shared';

const platform = new DefaultPlatformAdapter();

export function triggerHaptic(durationMs: number = GAME_CONFIG.FEEL_HAPTIC_PULSE_MS): boolean {
  try {
    return platform.vibrate([durationMs]);
  } catch {
    return false;
  }
}
