/**
 * DEBUG HOOKS REGISTRATION HOOK (EverLife)
 * Blueprint S15 & D16: Registrasi window.__game untuk lingkungan pengujian dan dev.
 */

import { useEffect } from 'react';
import { GlobalGameState } from '../core/types';
import { registerDebugHooks, computeStateHash } from '../shared';
import { executeAgeUp } from './gameActions';

export function useDebugRegistration(
  state: GlobalGameState | null,
  setState: React.Dispatch<React.SetStateAction<GlobalGameState | null>>
): void {
  useEffect(() => {
    if (!state) return;
    registerDebugHooks({
      seed: state.seed,
      getState: () => state,
      stateHash: () => computeStateHash(state),
      setState: (partial: Partial<GlobalGameState>) => {
        setState((prev) => (prev ? { ...prev, ...partial } : null));
      },
      fastForward: (years: number) => {
        if (!state?.character?.finances || state.currentScreen === 'DEATH_SUMMARY') return;
        let current = state;
        for (let i = 0; i < years; i++) {
          if (!current?.character?.finances || current.currentScreen === 'DEATH_SUMMARY') break;
          const res = executeAgeUp(current);
          current = res.nextState;
        }
        setState({ ...current });
      },
      triggerEvent: (eventId: string) => console.log('Debug triggerEvent:', eventId),
      startReplay: () => console.log('Debug startReplay'),
      getReplay: () => ({ seed: state.seed, actions: [] }),
      fps: () => 60,
    });
  }, [state, setState]);
}
