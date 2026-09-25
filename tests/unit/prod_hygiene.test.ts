import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { registerDebugHooks, isDebugMode, GameDebugHooks } from '../../src/shared/debugHooks';

describe('TEST-AC-HYGIENE: Production Hygiene & Debug Hooks Isolation (D16)', () => {
  const originalWindow = (globalThis as unknown as { window?: Window }).window;

  beforeEach(() => {
    (globalThis as unknown as { window: { location: { search: string }; __game?: GameDebugHooks } }).window = {
      location: { search: '' },
      __game: undefined,
    };
  });

  afterEach(() => {
    if (originalWindow) {
      (globalThis as unknown as { window: Window }).window = originalWindow;
    } else {
      delete (globalThis as unknown as { window?: Window }).window;
    }
  });

  it('harus memastikan isDebugMode() bernilai false secara default tanpa flag ?debug=1', () => {
    expect(isDebugMode()).toBe(false);
  });

  it('harus memastikan window.__game === undefined saat debug mode tidak aktif', () => {
    const dummyHooks: GameDebugHooks = {
      seed: 12345,
      getState: () => ({} as never),
      stateHash: () => 'hash',
      setState: () => {},
      fastForward: () => {},
      triggerEvent: () => {},
      startReplay: () => {},
      getReplay: () => ({ seed: 12345, actions: [] }),
      fps: () => 60,
    };

    registerDebugHooks(dummyHooks);
    expect((globalThis as unknown as { window: { __game?: GameDebugHooks } }).window.__game).toBeUndefined();
  });

  it('harus mengaktifkan debug hooks saat URL parameter ?debug=1 diberikan', () => {
    (globalThis as unknown as { window: { location: { search: string } } }).window.location.search = '?debug=1';
    expect(isDebugMode()).toBe(true);
  });
});
