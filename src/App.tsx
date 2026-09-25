/**
 * MAIN APP CONTAINER & SCENE ROUTER (EverLife)
 * Web-Native Mobile Portrait Shell with Safe Areas, GameProvider,
 * Landscape Shield, ErrorBoundary, and Scene Orchestrator.
 */

import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './engine/GameContext';
import { ErrorBoundary } from './engine/ErrorBoundary';
import { platform } from './shared/platform';
import { MainMenuScene } from './scenes/MainMenuScene';
import { CreationScene } from './scenes/CreationScene';
import { DashboardScene } from './scenes/DashboardScene';
import { ModalManager } from './scenes/ModalManager';
import { SubmenuDrawer } from './scenes/SubmenuDrawer';
import { DeathScene } from './scenes/DeathScene';
import { Smartphone } from 'lucide-react';

const SceneRouter: React.FC = () => {
  const { state } = useGame();
  const screen = state?.currentScreen ?? 'MAIN_MENU';
  const isHealthCritical = Boolean(
    state?.character?.attributes?.health !== undefined &&
    state.character.attributes.health < 25 &&
    screen !== 'DEATH_SUMMARY'
  );

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
  const [isLandscape, setIsLandscape] = useState(platform.isLandscape());

  useEffect(() => {
    return platform.onResizeOrOrientationChange((landscape) => {
      setIsLandscape(landscape);
    });
  }, []);

  return (
    <ErrorBoundary>
      {/* Landscape Shield Overlay jika pengguna memegang perangkat secara horizontal */}
      {isLandscape && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <Smartphone size={32} className="rotate-90" />
            </div>
            <h2 className="text-lg font-bold">Putar ke Posisi Portrait</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              EverLife didesain khusus untuk simulasi mobile portrait (tegak). Silakan putar orientasi perangkat Anda tegak untuk melanjutkan simulasi.
            </p>
          </div>
        </div>
      )}

      <GameProvider>
        <SceneRouter />
      </GameProvider>
    </ErrorBoundary>
  );
};

export default App;
