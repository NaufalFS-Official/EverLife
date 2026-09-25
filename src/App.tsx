/**
 * MAIN APP CONTAINER & SCENE ROUTER (EverLife)
 * Web-Native Mobile Portrait Shell with Safe Areas, GameProvider, and Scene Orchestrator.
 */

import React from 'react';
import { GameProvider, useGame } from './engine/GameContext';
import { MainMenuScene } from './scenes/MainMenuScene';
import { CreationScene } from './scenes/CreationScene';
import { DashboardScene } from './scenes/DashboardScene';
import { ModalManager } from './scenes/ModalManager';
import { SubmenuDrawer } from './scenes/SubmenuDrawer';
import { DeathScene } from './scenes/DeathScene';

const SceneRouter: React.FC = () => {
  const { state } = useGame();
  const screen = state?.currentScreen ?? 'MAIN_MENU';
  const isHealthCritical = Boolean(state && state.character.attributes.health < 25 && screen !== 'DEATH_SUMMARY');

  return (
    <div
      id="everlife-viewport"
      className="w-full max-w-[430px] h-[100dvh] bg-slate-50 relative shadow-2xl flex flex-col overflow-hidden border-x border-slate-200/80 mx-auto select-none"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Red Health Vignette Overlay saat Health kritis (<25%) */}
      {isHealthCritical && (
        <div
          className="pointer-events-none absolute inset-0 z-50 ring-8 ring-inset ring-rose-600/40 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Dynamic Screen Routing */}
      {screen === 'MAIN_MENU' && <MainMenuScene />}
      {screen === 'CHARACTER_CREATION' && <CreationScene />}
      {(screen === 'GAMEPLAY_ACTIVE' || screen === 'SCENARIO_POPUP' || screen === 'SUBMENU_OPEN') && (
        <>
          <DashboardScene />
          <ModalManager />
          <SubmenuDrawer />
        </>
      )}
      {screen === 'DEATH_SUMMARY' && <DeathScene />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <SceneRouter />
    </GameProvider>
  );
};

export default App;
