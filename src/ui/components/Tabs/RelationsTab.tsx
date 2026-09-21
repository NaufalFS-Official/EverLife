/**
 * Tampilan Tab Relasi Sosial (RelationsTab) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S3, S4, S7.
 * Menampilkan daftar relasi keluarga/teman dan aksi interaksi sosial.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import { RelationNPC } from '../../../contracts/gameState';
import { ProceduralAvatar } from '../ProceduralAvatar';
import { MessageSquare, Utensils, HandCoins, HeartHandshake } from 'lucide-react';

export interface RelationsTabProps {
  readonly relations: readonly RelationNPC[];
  readonly currentCash: number;
  readonly onInteract: (
    targetNpcId: string,
    actionType: 'chat' | 'spend_time' | 'ask_allowance'
  ) => void;
}

export const RelationsTab: React.FC<RelationsTabProps> = ({
  relations,
  currentCash,
  onInteract,
}) => {
  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center space-x-2 px-1 text-slate-800">
        <HeartHandshake className="w-4 h-4 text-pink-600" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Lingkaran Sosial & Keluarga
        </h3>
      </div>

      {relations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
          <p className="text-sm">Belum ada relasi yang terdaftar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {relations.map(npc => {
            const isParent = npc.role === 'Ayah' || npc.role === 'Ibu';
            const canAffordMeal = currentCash >= 10000;

            return (
              <div
                key={npc.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-md"
              >
                {/* Info NPC */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <ProceduralAvatar
                      name={npc.name}
                      gender={npc.role === 'Ibu' ? 'Wanita' : 'Pria'}
                      size="md"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">
                        {npc.name}
                      </h4>
                      <span className="text-xs text-slate-500">{npc.role}</span>
                    </div>
                  </div>

                  {/* Nilai Keakraban */}
                  <div className="text-right">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                      Keakraban
                    </span>
                    <span className="text-xs font-bold text-pink-600">
                      {npc.relationshipScore}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar Keakraban */}
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100 mb-3.5">
                  <div
                    className="h-full rounded-full bg-pink-500 transition-all duration-300"
                    style={{ width: `${npc.relationshipScore}%` }}
                  />
                </div>

                {/* Tombol Aksi Interaksi */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onInteract(npc.id, 'chat')}
                    disabled={!npc.isAlive}
                    className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-2 px-1 text-slate-700 hover:bg-slate-100 active:scale-[0.97] transition-all disabled:opacity-50"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600 mb-1" />
                    <span className="text-[11px] font-semibold">Ngobrol</span>
                    <span className="text-[9px] text-slate-400">Gratis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onInteract(npc.id, 'spend_time')}
                    disabled={!npc.isAlive || !canAffordMeal}
                    className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-2 px-1 text-slate-700 hover:bg-slate-100 active:scale-[0.97] transition-all disabled:opacity-50"
                  >
                    <Utensils className="w-3.5 h-3.5 text-amber-600 mb-1" />
                    <span className="text-[11px] font-semibold">Makan Bareng</span>
                    <span className="text-[9px] text-slate-400">Rp 10 rb</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onInteract(npc.id, 'ask_allowance')}
                    disabled={!npc.isAlive || !isParent}
                    className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-2 px-1 text-slate-700 hover:bg-slate-100 active:scale-[0.97] transition-all disabled:opacity-50"
                  >
                    <HandCoins className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                    <span className="text-[11px] font-semibold">Minta Saku</span>
                    <span className="text-[9px] text-slate-400">Ortu</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
