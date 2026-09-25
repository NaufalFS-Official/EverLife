/**
 * DEATH & MEMORIAL TOMBSTONE SCENE (EverLife)
 * F-008: Layar memorial nisan, evaluasi ribbon pita kehormatan, permadeath lock, dan restart trigger.
 */

import React from 'react';
import { useGame } from '../engine/GameContext';
import { RotateCcw, Award, Skull } from 'lucide-react';

export const DeathScene: React.FC = () => {
  const { state, restartGame } = useGame();

  if (!state) return null;

  const { character } = state;
  const fullName = `${character.name.first} ${character.name.last}`;
  const ribbon = character.ribbon ?? 'Mediocre';

  return (
    <div className="flex flex-col flex-1 items-center justify-between p-6 select-none bg-slate-900 text-white min-h-screen">
      {/* Top Grim Header */}
      <div className="pt-4 flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-widest">
        <Skull size={16} className="text-slate-500" /> Akhir Perjalanan Hidup
      </div>

      {/* The Memorial Tombstone (Batu Nisan) */}
      <div className="w-full max-w-xs my-auto bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-t-[100px] rounded-b-2xl p-6 pt-10 shadow-2xl border-4 border-slate-600 text-center space-y-4 relative">
        {/* Cross / Monument Motif */}
        <div className="w-8 h-8 mx-auto text-slate-400 flex items-center justify-center font-serif text-2xl font-bold">
          †
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            Rest In Peace
          </p>
          <h2 className="text-2xl font-black text-slate-100 font-serif">
            {fullName}
          </h2>
          <p className="text-xs font-mono text-emerald-400 font-semibold">
            Usia {character.age} Tahun
          </p>
        </div>

        {/* Cause of Death */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300 italic leading-relaxed">
          "{character.causeOfDeath ?? 'Meninggal dunia secara tenang.'}"
        </div>

        {/* Memorial Ribbon Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <Award size={14} /> Pita: {ribbon}
        </div>

        {/* Net Worth Stat */}
        <div className="pt-2 border-t border-slate-700 flex justify-between text-xs text-slate-400 font-medium">
          <span>Kekayaan Terakhir:</span>
          <span className="font-mono font-bold text-emerald-400">
            ${character.finances.netWorth.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs space-y-3 pb-6">
        <button
          onClick={restartGame}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <RotateCcw size={18} /> Mulai Hidup Baru
        </button>
        <p className="text-center text-[10px] text-slate-500">
          Permadeath Murni: Karakter yang telah wafat abadi dalam kenangan.
        </p>
      </div>
    </div>
  );
};
