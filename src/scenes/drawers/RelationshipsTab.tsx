import React from 'react';
import { useGame } from '../../engine/GameContext';

export const RelationshipsTab: React.FC = () => {
  const { state, spendTime, giveGift } = useGame();
  if (!state) return null;
  const { character } = state;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Daftar Relasi Keluarga & Teman</h4>
      {character.relationships.map((npc) => (
        <div
          key={npc.id}
          className={`p-3.5 bg-white border rounded-2xl space-y-2 ${
            npc.alive ? 'border-slate-200' : 'border-slate-100 opacity-60 bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-slate-900">
                {npc.name} ({npc.role})
              </p>
              <p className="text-[10px] text-slate-600">
                {npc.alive ? `Usia: ${npc.age} tahun` : 'Almarhum/Almarhumah'}
              </p>
            </div>
            {npc.alive && (
              <span className="text-[11px] font-bold text-emerald-700 font-mono">
                {npc.relationshipBar}%
              </span>
            )}
          </div>

          {npc.alive && (
            <>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${npc.relationshipBar}%` }}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => spendTime(npc.id)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-800 text-[11px] font-bold rounded-lg transition cursor-pointer"
                >
                  Luangkan Waktu
                </button>
                <button
                  onClick={() => giveGift(npc.id)}
                  className="py-1.5 px-3 bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-800 text-[11px] font-bold rounded-lg transition cursor-pointer"
                >
                  Beri Hadiah ($100)
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
