/**
 * Komponen Layar Akhir Hayat / Kematian (DeathModal) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S3, S5.
 * Ditampilkan saat kesehatan karakter mencapai batas terendah (0%).
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import { CharacterProfile } from '../../contracts/gameState';
import { HeartCrack, RotateCcw } from 'lucide-react';

export interface DeathModalProps {
  readonly profile: CharacterProfile;
  readonly onFinish: () => void;
}

export const DeathModal: React.FC<DeathModalProps> = ({ profile, onFinish }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 p-6 text-center text-white shadow-2xl border border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-500 ring-2 ring-rose-500/30">
          <HeartCrack className="w-8 h-8" />
        </div>

        <h2 className="mt-4 text-2xl font-black text-rose-400">
          Akhir Perjalanan
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Kesehatanmu telah menyentuh batas minimum.
        </p>

        <div className="my-5 rounded-2xl bg-slate-800/80 p-4 text-left border border-slate-700/50">
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white font-semibold">{profile.name}</strong> wafat pada usia{' '}
            <strong className="text-white font-semibold">{profile.age} tahun</strong> di tengah masa{' '}
            {profile.grade}. Perjalanan hidup ini menjadi kenangan bagi mereka yang mengenalmu.
          </p>
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-800 py-3.5 px-4 font-bold text-slate-200 hover:bg-slate-700 hover:text-white active:scale-[0.98] transition-all border border-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </button>
      </div>
    </div>
  );
};
