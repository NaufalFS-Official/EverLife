/**
 * DASHBOARD SCENE (EverLife)
 * Core Gameplay View: Top Profile Bar, 2D Avatar, Virtualized Log, Stats Dock, Floating "+Age" FAB.
 */

import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../engine/GameContext';
import { AvatarComposer } from '../engine/avatarComposer';
import { HUD } from './HUD';
import { audio } from '../engine/audioManager';
import {
  Briefcase,
  Home,
  Users,
  Activity,
  Plus,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const DashboardScene: React.FC = () => {
  const { state, ageUp, openSubmenu } = useGame();
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [isPressingAge, setIsPressingAge] = useState(false);
  const [isMuted, setIsMuted] = useState(audio.getIsMuted());

  // Auto-scroll ke entri log terbaru
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [state?.character.lifeLog.length]);

  if (!state) return null;

  const { character } = state;
  const fullName = `${character.name.first} ${character.name.last}`;

  const handleAgeUpClick = () => {
    setIsPressingAge(true);
    setTimeout(() => setIsPressingAge(false), 100);
    ageUp();
  };

  const handleToggleSound = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden select-none bg-slate-50 relative">
      {/* 1. TOP PROFILE BAR */}
      <header className="w-full bg-white px-4 py-2.5 border-b border-slate-200/80 shadow-2xs flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-900 text-sm">{fullName}</h1>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
              {character.age} Thn
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500">
            {character.job ? character.job.title : 'Belum Bekerja'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Saldo</span>
            <span className="font-mono text-xs font-bold text-emerald-600">
              ${character.finances.bankBalance.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </header>

      {/* 2. AVATAR CARD */}
      <div className="py-2.5 bg-slate-100/70 border-b border-slate-200/60 flex items-center justify-center shrink-0">
        <AvatarComposer
          appearance={character.appearance}
          age={character.age}
          happiness={character.attributes.happiness}
          health={character.attributes.health}
          size={95}
        />
      </div>

      {/* 3. LIFE HISTORY LOG (Scrollable Virtual List) */}
      <main
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50 text-xs"
        role="log"
        aria-live="polite"
      >
        {character.lifeLog.map((entry, idx) => (
          <div
            key={idx}
            className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1 animate-fade-in"
          >
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                {entry.categoryTag}
              </span>
              <span className="text-slate-400 font-mono">Usia {entry.age}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {entry.text}
            </p>
          </div>
        ))}
      </main>

      {/* 4. REALTIME BOTTOM STATS DOCK */}
      <HUD attributes={character.attributes} />

      {/* 5. FLOATING "+AGE" FAB */}
      <div className="relative w-full flex justify-center items-center pointer-events-none pb-1">
        <button
          onClick={handleAgeUpClick}
          disabled={state.activeModal !== null}
          aria-label="Tambah Usia 1 Tahun"
          className={`pointer-events-auto -mt-6 z-20 w-16 h-16 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/40 flex flex-col items-center justify-center font-black transition-all cursor-pointer ${
            isPressingAge ? 'scale-95 bg-emerald-700' : 'hover:scale-105 active:scale-95'
          } ${character.age === 0 ? 'ring-4 ring-emerald-300 animate-pulse' : ''}`}
        >
          <Plus size={18} strokeWidth={3} className="-mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase font-extrabold">AGE</span>
        </button>
      </div>

      {/* 6. BOTTOM NAVIGATION DRAWER BAR */}
      <nav className="w-full bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around z-10">
        <button
          onClick={() => openSubmenu('occupation')}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-600 transition cursor-pointer p-1"
        >
          <Briefcase size={18} />
          <span className="text-[10px] font-bold">Pekerjaan</span>
        </button>

        <button
          onClick={() => openSubmenu('assets')}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-600 transition cursor-pointer p-1"
        >
          <Home size={18} />
          <span className="text-[10px] font-bold">Aset</span>
        </button>

        <div className="w-12" aria-hidden="true" /> {/* Spacer untuk FAB tengah */}

        <button
          onClick={() => openSubmenu('relationships')}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-600 transition cursor-pointer p-1"
        >
          <Users size={18} />
          <span className="text-[10px] font-bold">Relasi</span>
        </button>

        <button
          onClick={() => openSubmenu('activities')}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-600 transition cursor-pointer p-1"
        >
          <Activity size={18} />
          <span className="text-[10px] font-bold">Aktivitas</span>
        </button>
      </nav>
    </div>
  );
};
