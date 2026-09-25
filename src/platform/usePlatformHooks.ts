/**
 * PLATFORM HOOKS (EverLife)
 * Blueprint S14 & DAEL-21 s/d DAEL-25: Hooks untuk keyboard shortcuts,
 * app lifecycle auto-save, dan responsivitas orientasi.
 */

import { useEffect } from 'react';
import { platform } from '../shared/platform';
import { GlobalGameState } from '../core/types';
import { SubmenuTab } from '../engine/types';

interface KeyboardShortcutOptions {
  state: GlobalGameState | null;
  activeSubmenu: SubmenuTab | null;
  onAgeUp: () => void;
  onChooseOption: (choiceIndex: number) => void;
  onCloseSubmenu: () => void;
}

export function usePlatformLifecycle(
  state: GlobalGameState | null,
  onAutoSave: (state: GlobalGameState) => void
): void {
  useEffect(() => {
    const unsubscribe = platform.onVisibilityChange((isVisible) => {
      if (!isVisible && state && state.currentScreen !== 'DEATH_SUMMARY') {
        onAutoSave(state);
      }
    });
    return unsubscribe;
  }, [state, onAutoSave]);
}

export function useKeyboardShortcuts({
  state,
  activeSubmenu,
  onAgeUp,
  onChooseOption,
  onCloseSubmenu,
}: KeyboardShortcutOptions): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'Escape') {
        if (activeSubmenu) onCloseSubmenu();
        return;
      }

      if (state?.activeModal) {
        const choiceNum = parseInt(e.key, 10);
        if (choiceNum >= 1 && choiceNum <= state.activeModal.choices.length) {
          onChooseOption(choiceNum - 1);
        }
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter' || e.key === 'a' || e.key === 'A') {
        if (state && (state.currentScreen === 'GAMEPLAY_ACTIVE' || state.currentScreen === 'SUBMENU_OPEN')) {
          e.preventDefault();
          onAgeUp();
        }
      }
    };

    return platform.addKeyboardListener(handleKeyDown);
  }, [state, activeSubmenu, onAgeUp, onChooseOption, onCloseSubmenu]);
}
