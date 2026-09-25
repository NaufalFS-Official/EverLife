import React from 'react';
import { useGame } from '../../engine/GameContext';
import { Stethoscope, Dumbbell, ShieldAlert } from 'lucide-react';

export const ActivitiesTab: React.FC = () => {
  const { state, visitDoctor, goToGym, doCrime } = useGame();
  if (!state) return null;
  const { character } = state;

  return (
    <div className="space-y-4">
      {/* Healthy Lifestyle */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kesehatan & Kebugaran</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={visitDoctor}
            className="min-h-[44px] p-3 bg-white border border-slate-200 rounded-xl text-left hover:border-emerald-300 transition cursor-pointer shadow-2xs"
          >
            <Stethoscope size={18} className="text-rose-500 mb-1" />
            <p className="font-bold text-xs text-slate-900">Pergi ke Dokter</p>
            <p className="text-[10px] text-slate-600">Biaya: $200 (+15% Health)</p>
          </button>

          <button
            onClick={goToGym}
            className="min-h-[44px] p-3 bg-white border border-slate-200 rounded-xl text-left hover:border-emerald-300 transition cursor-pointer shadow-2xs"
          >
            <Dumbbell size={18} className="text-sky-500 mb-1" />
            <p className="font-bold text-xs text-slate-900">Gym Kebugaran</p>
            <p className="text-[10px] text-slate-600">Biaya: $20 (+5% Health)</p>
          </button>
        </div>
      </div>

      {/* Risky Activities */}
      {character.age >= 14 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert size={14} /> Aktivitas Berisiko & Kejahatan
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => doCrime('shoplift')}
              className="w-full min-h-[44px] p-3 bg-white border border-rose-200 rounded-xl text-left hover:bg-rose-50/50 transition cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-xs text-slate-900">Mencopet di Pasar</p>
                <p className="text-[10px] text-slate-600">Hasil: $50 - $250 • Vonis: 1 Thn</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-lg">Risiko Rendah</span>
            </button>

            <button
              onClick={() => doCrime('robbery')}
              className="w-full min-h-[44px] p-3 bg-white border border-rose-200 rounded-xl text-left hover:bg-rose-50/50 transition cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-xs text-slate-900">Merampok Toko Perhiasan</p>
                <p className="text-[10px] text-slate-600">Hasil: $2,500 - $8,000 • Vonis: 3 Thn</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-lg">Risiko Sedang</span>
            </button>

            <button
              onClick={() => doCrime('heist')}
              className="w-full min-h-[44px] p-3 bg-white border border-rose-200 rounded-xl text-left hover:bg-rose-50/50 transition cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-xs text-slate-900">Pembobolan Brankas Bank</p>
                <p className="text-[10px] text-slate-600">Hasil: $25,000 - $100,000 • Vonis: 7 Thn</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-lg">Risiko Tinggi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
