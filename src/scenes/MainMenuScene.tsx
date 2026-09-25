/**
 * MAIN MENU SCENE (EverLife)
 * Layar pembuka aplikasi, pemilihan hidup baru atau melanjutkan save game aktif.
 */

import React from 'react';
import { useGame } from '../engine/GameContext';
import { audio } from '../engine/audioManager';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

export const MainMenuScene: React.FC = () => {
  const { hasSavedGame, resumeSavedGame, transitionTo } = useGame();
  const [isMuted, setIsMuted] = React.useState(audio.getIsMuted());

  const handleToggleSound = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handleStartNewLife = () => {
    audio.play('ui_click');
    transitionTo('CHARACTER_CREATION');
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-between p-6 text-center select-none">
      {/* Sound Toggle Header */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleToggleSound}
          aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          className="p-3 bg-white/80 backdrop-blur rounded-full shadow-md text-slate-700 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Hero Title & Branding */}
      <div className="my-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
          <Sparkles size={14} /> Life Simulator Sandbox
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 drop-shadow-sm">
          Ever<span className="text-emerald-600">Life</span>
        </h1>
        <p className="text-slate-600 text-sm max-w-[280px] mx-auto leading-relaxed">
          Kendalikan setiap pilihan hidup Anda dari lahir, berkarir, hingga ajal menjemput.
        </p>
      </div>

      {/* Menu Actions */}
      <div className="w-full max-w-xs space-y-3 pb-8">
        {hasSavedGame && (
          <button
            onClick={() => resumeSavedGame()}
            className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-98 transition flex items-center justify-center gap-3 cursor-pointer"
          >
            <RotateCcw size={20} /> Lanjutkan Hidup
          </button>
        )}

        <button
          onClick={handleStartNewLife}
          className="w-full py-4 px-6 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 active:scale-98 transition flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play size={20} fill="currentColor" /> Mulai Hidup Baru
        </button>

        <p className="text-[11px] text-slate-600 font-medium">
          Versi 1.0.0 (Mode A - Offline Penuh)
        </p>
      </div>
    </div>
  );
};
