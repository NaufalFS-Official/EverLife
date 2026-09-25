/**
 * GAME CONTEXT & STATE ACTIONS PROVIDER (EverLife)
 * Blueprint S3, S5, S8 & D9: React context state holder, transition guards, and auto-persistence.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GlobalGameState, GameScreenState, CharacterCreationParams } from '../core/types';
import { createNewLife } from '../core/character';
import { spendTimeWithNPC, giveGiftToNPC } from '../core/relationships';
import { JobDefinition, applyForJob, resignJob, workHarder } from '../core/career';
import { purchaseAsset, sellAsset } from '../core/finances';
import { LocalSaveRepository } from '../adapter/localAdapter';
import { audio } from './audioManager';
import { triggerHaptic } from '../adapter/haptics';
import { Mulberry32PRNG, evaluateTransition, registerDebugHooks, computeStateHash } from '../shared';
import {
  executeAgeUp,
  executeChoice,
  executeSurpriseMe,
  executeDoctor,
  executeGym,
  executeCrime,
} from './gameActions';

import { SubmenuTab, GameContextValue } from './types';
export type { SubmenuTab, GameContextValue };

const saveRepo = new LocalSaveRepository();

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlobalGameState | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<SubmenuTab | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);

  useEffect(() => {
    saveRepo.load().then((saved) => {
      if (saved && saved.currentScreen !== 'DEATH_SUMMARY') {
        setHasSavedGame(true);
      }
    });
  }, []);

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
        let current = state;
        for (let i = 0; i < years; i++) {
          if (current.currentScreen === 'DEATH_SUMMARY') break;
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
  }, [state]);

  const saveCurrentState = useCallback(async (stateToSave: GlobalGameState) => {
    setIsSaving(true);
    await saveRepo.save(stateToSave);
    setIsSaving(false);
    setHasSavedGame(true);
  }, []);

  const transitionTo = useCallback(
    (toScreen: GameScreenState): boolean => {
      if (!state) return false;
      const result = evaluateTransition(state.currentScreen, toScreen);
      if (!result.allowed) {
        console.warn('Transisi state ditolak oleh guard table:', result.reason);
        return false;
      }
      const updated = { ...state, currentScreen: toScreen };
      setState(updated);
      return true;
    },
    [state]
  );

  const startNewLife = useCallback(
    (params: CharacterCreationParams) => {
      audio.play('birth');
      triggerHaptic(20);
      const newState = createNewLife(params);
      setState(newState);
      saveCurrentState(newState);
    },
    [saveCurrentState]
  );

  const ageUp = useCallback(() => {
    if (!state || state.currentScreen === 'DEATH_SUMMARY' || state.activeModal !== null) return;
    const { nextState, isFatal } = executeAgeUp(state);
    if (isFatal) {
      saveRepo.clear();
      setHasSavedGame(false);
    } else {
      saveCurrentState(nextState);
    }
    setState({ ...nextState });
  }, [state, saveCurrentState]);

  const chooseOption = useCallback(
    (choiceIndex: number) => {
      if (!state || !state.activeModal) return;
      const { nextState, isFatal } = executeChoice(state, choiceIndex);
      if (isFatal) {
        saveRepo.clear();
        setHasSavedGame(false);
      } else {
        saveCurrentState(nextState);
      }
      setState({ ...nextState });
    },
    [state, saveCurrentState]
  );

  const surpriseMe = useCallback(() => {
    if (!state || !state.activeModal) return;
    const { nextState, isFatal } = executeSurpriseMe(state);
    if (isFatal) {
      saveRepo.clear();
      setHasSavedGame(false);
    } else {
      saveCurrentState(nextState);
    }
    setState({ ...nextState });
  }, [state, saveCurrentState]);

  const spendTime = useCallback(
    (npcId: string) => {
      if (!state) return;
      audio.play('ui_click');
      const rng = new Mulberry32PRNG(state.seed + state.character.age * 777);
      spendTimeWithNPC(state, npcId, rng);
      setState({ ...state });
      saveCurrentState(state);
    },
    [state, saveCurrentState]
  );

  const giveGift = useCallback(
    (npcId: string) => {
      if (!state) return;
      const res = giveGiftToNPC(state, npcId, 100);
      if (res.success) {
        audio.play('cash');
        setState({ ...state });
        saveCurrentState(state);
      } else {
        audio.play('fail');
      }
    },
    [state, saveCurrentState]
  );

  const applyJobAction = useCallback(
    (job: JobDefinition): boolean => {
      if (!state) return false;
      const rng = new Mulberry32PRNG(state.seed + state.character.age * 999);
      const res = applyForJob(state, job, rng);
      if (res.success) {
        audio.play('cash');
        setState({ ...state });
        saveCurrentState(state);
        return true;
      }
      audio.play('fail');
      return false;
    },
    [state, saveCurrentState]
  );

  const quitJobAction = useCallback(() => {
    if (!state) return;
    resignJob(state);
    audio.play('ui_click');
    setState({ ...state });
    saveCurrentState(state);
  }, [state, saveCurrentState]);

  const workHardAction = useCallback(() => {
    if (!state) return;
    const res = workHarder(state);
    if (res.success) {
      audio.play('ui_click');
      setState({ ...state });
      saveCurrentState(state);
    }
  }, [state, saveCurrentState]);

  const buyAssetAction = useCallback(
    (asset: { id: string; name: string; category: 'Vehicle' | 'RealEstate'; value: number; maintenanceAnnual: number }): boolean => {
      if (!state) return false;
      const success = purchaseAsset(state, asset);
      if (success) {
        audio.play('cash');
        setState({ ...state });
        saveCurrentState(state);
        return true;
      }
      audio.play('fail');
      return false;
    },
    [state, saveCurrentState]
  );

  const sellOwnedAsset = useCallback(
    (assetId: string) => {
      if (!state) return;
      const success = sellAsset(state, assetId);
      if (success) {
        audio.play('cash');
        setState({ ...state });
        saveCurrentState(state);
      }
    },
    [state, saveCurrentState]
  );

  const doCrimeAction = useCallback(
    (crimeType: 'shoplift' | 'robbery' | 'heist'): boolean => {
      if (!state) return false;
      const success = executeCrime(state, crimeType);
      setState({ ...state });
      saveCurrentState(state);
      return success;
    },
    [state, saveCurrentState]
  );

  const visitDoctor = useCallback(() => {
    if (!state) return;
    const success = executeDoctor(state);
    if (success) {
      setState({ ...state });
      saveCurrentState(state);
    }
  }, [state, saveCurrentState]);

  const goToGym = useCallback(() => {
    if (!state) return;
    const success = executeGym(state);
    if (success) {
      setState({ ...state });
      saveCurrentState(state);
    }
  }, [state, saveCurrentState]);

  const resumeSavedGame = useCallback(async (): Promise<boolean> => {
    const loaded = await saveRepo.load();
    if (loaded && loaded.currentScreen !== 'DEATH_SUMMARY') {
      audio.play('ui_click');
      setState(loaded);
      return true;
    }
    return false;
  }, []);

  const restartGame = useCallback(() => {
    audio.play('ui_click');
    saveRepo.clear();
    setHasSavedGame(false);
    setState(null);
    setActiveSubmenu(null);
  }, []);

  const openSubmenu = useCallback((tab: SubmenuTab) => {
    audio.play('ui_click');
    setActiveSubmenu(tab);
  }, []);

  const closeSubmenu = useCallback(() => {
    audio.play('ui_click');
    setActiveSubmenu(null);
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        activeSubmenu,
        isSaving,
        hasSavedGame,
        startNewLife,
        ageUp,
        chooseOption,
        surpriseMe,
        spendTime,
        giveGift,
        applyJob: applyJobAction,
        quitJob: quitJobAction,
        workHard: workHardAction,
        buyAsset: buyAssetAction,
        sellOwnedAsset,
        doCrime: doCrimeAction,
        visitDoctor,
        goToGym,
        openSubmenu,
        closeSubmenu,
        resumeSavedGame,
        restartGame,
        transitionTo,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame harus digunakan di dalam GameProvider');
  return ctx;
}
