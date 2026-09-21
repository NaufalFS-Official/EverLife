/**
 * Komponen Induk Aplikasi EverLife (v1.0-SMA).
 * Sumber: Game Blueprint S3, S4, S5, S7, S8.
 * Menyatukan GameEngine, SaveService, SynthAudio, dan Komponen Tampilan Mobile-First.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { GameEngine } from './core/GameEngine';
import { SaveService } from './storage/SaveService';
import { SynthAudio } from './ui/audio/SynthAudio';
import { TopBar } from './ui/components/TopBar';
import { StatBars } from './ui/components/StatBars';
import { ActionArea } from './ui/components/ActionArea';
import { BottomNav } from './ui/components/BottomNav';
import { EventModal } from './ui/components/EventModal';
import { MainMenu } from './ui/components/MainMenu';
import { CharacterCreation } from './ui/components/CharacterCreation';
import { GraduationModal } from './ui/components/GraduationModal';
import { DeathModal } from './ui/components/DeathModal';
import { LifeTab } from './ui/components/Tabs/LifeTab';
import { RelationsTab } from './ui/components/Tabs/RelationsTab';
import { ActivitiesTab } from './ui/components/Tabs/ActivitiesTab';
import { ProfileTab } from './ui/components/Tabs/ProfileTab';
import { EverLifeSaveData } from './contracts/saveSchema';
import { EventEngine } from './core/EventEngine';
import { GAME_CONFIG } from './contracts/gameConfig';
import { CreateCharacterInput } from './core/CharacterInitializer';

export const App: React.FC = () => {
  const engine = useMemo(() => new GameEngine(), []);
  const saveService = useMemo(() => new SaveService(), []);
  const audio = useMemo(() => SynthAudio.getInstance(), []);

  const [gameState, setGameState] = useState(() => engine.getState());
  const [isMuted, setIsMuted] = useState(() => audio.isMuted());

  useEffect(() => {
    const unsubscribe = engine.subscribe(newState => {
      setGameState(newState);
      // Auto-save jika ada sesi dan umur bertambah
      if (newState.session && newState.activeSlotId) {
        void saveService.triggerAutoSave(newState.session, newState.activeSlotId);
      }
    });
    return unsubscribe;
  }, [engine, saveService]);

  const handleToggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handleStartNewGame = () => {
    audio.playTap();
    engine.startNewGame();
  };

  const handleCancelCreation = () => {
    audio.playTap();
    engine.resetGame();
  };

  const handleSubmitCharacter = (input: CreateCharacterInput, slotId: number) => {
    audio.playTap();
    engine.submitCharacter(input, slotId);
  };

  const handleLoadSlot = (saveData: EverLifeSaveData) => {
    audio.playTap();
    const session = {
      lifeSeed: saveData.lifeSeed,
      profile: saveData.profile,
      stats: saveData.stats,
      relations: saveData.relations,
      timelineHistory: saveData.timelineHistory,
      flags: saveData.flags,
      activeEventId: null,
      isCompleted: saveData.isCompleted,
    };
    engine.loadSession(session, saveData.slotId);
  };

  const handleAgeUp = () => {
    audio.playTap();
    try {
      engine.ageUp();
    } catch {
      audio.playAlert();
    }
  };

  const handleSelectOption = (optionId: string) => {
    audio.playTap();
    try {
      engine.selectEventOption(optionId);
    } catch {
      audio.playAlert();
    }
  };

  const handlePerformActivity = (activityId: string) => {
    audio.playTap();
    try {
      engine.performActivity(activityId);
    } catch {
      audio.playAlert();
    }
  };

  const handleInteractRelation = (
    targetNpcId: string,
    actionType: 'chat' | 'spend_time' | 'ask_allowance'
  ) => {
    audio.playTap();
    try {
      engine.interactRelation(targetNpcId, actionType);
    } catch {
      audio.playAlert();
    }
  };

  const handleManualSave = async (slotId: number) => {
    audio.playTap();
    if (gameState.session) {
      await saveService.saveActiveSession(gameState.session, slotId);
    }
  };

  const handleExportSave = () => {
    audio.playTap();
    if (!gameState.session || !gameState.activeSlotId) return;
    void saveService.saveActiveSession(gameState.session, gameState.activeSlotId).then(data => {
      const json = saveService.exportToJson(data);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `everlife_save_slot_${data.slotId}_${data.profile.name}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleImportSave = (jsonStr: string) => {
    audio.playTap();
    const imported = saveService.importFromJson(jsonStr);
    handleLoadSlot(imported);
  };

  // 1. Layar Menu Utama
  if (gameState.screen === 'MAIN_MENU') {
    return (
      <MainMenu
        saveService={saveService}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onStartNewGame={handleStartNewGame}
        onLoadSlot={handleLoadSlot}
      />
    );
  }

  // 2. Layar Pembuatan Karakter
  if (gameState.screen === 'CHARACTER_CREATION') {
    return (
      <CharacterCreation
        onCancel={handleCancelCreation}
        onSubmit={handleSubmitCharacter}
      />
    );
  }

  const { session } = gameState;
  if (!session) {
    return null;
  }

  const activeEvent = session.activeEventId
    ? EventEngine.getEvent(session.activeEventId)
    : undefined;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-100 shadow-2xl border-x border-slate-200 relative">
      {/* Bar Atas Profil */}
      <TopBar
        profile={session.profile}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenMainMenu={() => engine.resetGame()}
      />

      {/* 4 Bar Statistik */}
      <StatBars stats={session.stats} />

      {/* Konten Tab Aktif */}
      <main className="flex-1 p-3.5 overflow-y-auto">
        {gameState.activeTab === 'LIFE' && (
          <LifeTab
            profile={session.profile}
            timelineHistory={session.timelineHistory}
          />
        )}
        {gameState.activeTab === 'RELATIONS' && (
          <RelationsTab
            relations={session.relations}
            currentCash={session.profile.cash}
            onInteract={handleInteractRelation}
          />
        )}
        {gameState.activeTab === 'ACTIVITIES' && (
          <ActivitiesTab
            currentAge={session.profile.age}
            currentCash={session.profile.cash}
            onPerformActivity={handlePerformActivity}
          />
        )}
        {gameState.activeTab === 'PROFILE' && (
          <ProfileTab
            profile={session.profile}
            flags={session.flags}
            activeSlotId={gameState.activeSlotId}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onSaveToSlot={handleManualSave}
            onExportSave={handleExportSave}
            onImportSave={handleImportSave}
            onResetGame={() => engine.resetGame()}
          />
        )}
      </main>

      {/* Tombol Tambah Umur (+1 Tahun) */}
      <ActionArea
        currentAge={session.profile.age}
        maxAge={GAME_CONFIG.CFG_AGE_MAX_V1}
        disabled={session.activeEventId !== null || session.isCompleted}
        onAgeUp={handleAgeUp}
      />

      {/* Navigasi Bawah */}
      <BottomNav
        activeTab={gameState.activeTab}
        onTabChange={tab => engine.switchTab(tab)}
      />

      {/* Dialog Modal Dilema Event */}
      {gameState.screen === 'EVENT_MODAL' && activeEvent && (
        <EventModal
          event={activeEvent}
          onSelectOption={handleSelectOption}
        />
      )}

      {/* Layar Kelulusan Tamat SMA */}
      {gameState.screen === 'GRADUATION_SCREEN' && (
        <GraduationModal
          profile={session.profile}
          stats={session.stats}
          flags={session.flags}
          onFinish={() => engine.resetGame()}
        />
      )}

      {/* Layar Kematian Hayat */}
      {gameState.screen === 'GAME_OVER_DEATH' && (
        <DeathModal
          profile={session.profile}
          onFinish={() => engine.resetGame()}
        />
      )}
    </div>
  );
};

export default App;
