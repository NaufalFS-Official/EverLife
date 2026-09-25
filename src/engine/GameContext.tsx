/**
 * GAME CONTEXT & STATE ACTIONS PROVIDER (EverLife)
 * Blueprint S3, S5, S8 & D9: React context state holder, transition guards,
 * auto-persistence, and platform lifecycle integration.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GlobalGameState, GameScreenState, CharacterCreationParams } from '../core/types';
import { createNewLife } from '../core/character';
import { LocalSaveRepository } from '../adapter/localAdapter';
import { telemetry } from '../adapter/telemetry';
import { audio } from './audioManager';
import { triggerHaptic } from '../adapter/haptics';
import { evaluateTransition } from '../shared';
import { usePlatformLifecycle, useKeyboardShortcuts } from '../platform/usePlatformHooks';
import { useDebugRegistration } from './useDebugRegistration';
import {
  executeAgeUp, executeChoice, executeSurpriseMe, executeDoctor,
  executeGym, executeCrime, executeSpendTime, executeGiveGift,
  executeApplyJob, executeQuitJob, executeWorkHard, executeBuyAsset, executeSellAsset,
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

  const saveCurrentState = useCallback(async (stateToSave: GlobalGameState) => {
    setIsSaving(true);
    await saveRepo.save(stateToSave);
    setIsSaving(false);
    setHasSavedGame(true);
  }, []);

  // Platform Lifecycle: Auto-save saat tab ke latar belakang
  usePlatformLifecycle(state, saveCurrentState);

  // Debug Hooks registration untuk dev/harness
  useDebugRegistration(state, setState);

  const transitionTo = useCallback(
    (toScreen: GameScreenState): boolean => {
      if (!state) return false;
      const result = evaluateTransition(state.currentScreen, toScreen);
      if (!result.allowed) {
        console.warn('Transisi state ditolak oleh guard table:', result.reason);
        return false;
      }
      setState({ ...state, currentScreen: toScreen });
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
      telemetry.trackEvent({
        eventName: 'life_started',
        runId: newState.runId,
        age: 0,
        deviceTier: 'mid',
      });
    },
    [saveCurrentState]
  );

  const ageUp = useCallback(() => {
    if (!state || state.currentScreen === 'DEATH_SUMMARY' || state.activeModal !== null) return;
    const { nextState, isFatal } = executeAgeUp(state);
    if (isFatal) {
      saveRepo.clear();
      setHasSavedGame(false);
      telemetry.trackEvent({
        eventName: 'life_ended',
        runId: state.runId,
        age: nextState.character.age,
        deviceTier: 'mid',
      });
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

  const spendTime = useCallback((npcId: string) => {
    if (!state) return;
    executeSpendTime(state, npcId);
    setState({ ...state });
    saveCurrentState(state);
  }, [state, saveCurrentState]);

  const giveGift = useCallback((npcId: string): boolean => {
    if (!state) return false;
    const success = executeGiveGift(state, npcId);
    if (success) {
      setState({ ...state });
      saveCurrentState(state);
    }
    return success;
  }, [state, saveCurrentState]);

  const applyJobAction = useCallback((job: import('../core/career').JobDefinition): boolean => {
    if (!state) return false;
    const success = executeApplyJob(state, job);
    if (success) {
      setState({ ...state });
      saveCurrentState(state);
    }
    return success;
  }, [state, saveCurrentState]);

  const quitJobAction = useCallback(() => {
    if (!state) return;
    executeQuitJob(state);
    setState({ ...state });
    saveCurrentState(state);
  }, [state, saveCurrentState]);

  const workHardAction = useCallback(() => {
    if (!state) return;
    executeWorkHard(state);
    setState({ ...state });
    saveCurrentState(state);
  }, [state, saveCurrentState]);

  const buyAssetAction = useCallback((asset: { id: string; name: string; category: 'Vehicle' | 'RealEstate'; value: number; maintenanceAnnual: number }): boolean => {
    if (!state) return false;
    const success = executeBuyAsset(state, asset);
    if (success) {
      setState({ ...state });
      saveCurrentState(state);
    }
    return success;
  }, [state, saveCurrentState]);

  const sellOwnedAsset = useCallback((assetId: string) => {
    if (!state) return;
    const success = executeSellAsset(state, assetId);
    if (success) {
      setState({ ...state });
      saveCurrentState(state);
    }
  }, [state, saveCurrentState]);

  const doCrimeAction = useCallback((crimeType: 'shoplift' | 'robbery' | 'heist'): boolean => {
    if (!state) return false;
    const success = executeCrime(state, crimeType);
    setState({ ...state });
    saveCurrentState(state);
    return success;
  }, [state, saveCurrentState]);

  const visitDoctor = useCallback(() => {
    if (!state) return;
    if (executeDoctor(state)) {
      setState({ ...state });
      saveCurrentState(state);
    }
  }, [state, saveCurrentState]);

  const goToGym = useCallback(() => {
    if (!state) return;
    if (executeGym(state)) {
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

  // Keyboard Shortcuts: Space/Enter/A -> +Age, 1-4 -> choice, Esc -> close
  useKeyboardShortcuts({
    state,
    activeSubmenu,
    onAgeUp: ageUp,
    onChooseOption: chooseOption,
    onCloseSubmenu: closeSubmenu,
  });

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
