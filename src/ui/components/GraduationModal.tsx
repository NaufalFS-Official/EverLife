/**
 * Komponen Layar Kelulusan Tamat SMA (GraduationModal) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4, S5, S7.
 * Merangkum pencapaian kelulusan usia 18 tahun dengan animasi selebrasi confetti.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CharacterProfile, CharacterStats } from '../../contracts/gameState';
import { ProceduralAvatar } from './ProceduralAvatar';
import { GraduationCap, Award, Sparkles, Home } from 'lucide-react';

export interface GraduationModalProps {
  readonly profile: CharacterProfile;
  readonly stats: CharacterStats;
  readonly flags: readonly string[];
  readonly onFinish: () => void;
}

export const GraduationModal: React.FC<GraduationModalProps> = ({
  profile,
  stats,
  flags,
  onFinish,
}) => {
  useEffect(() => {
    // Ledakkan confetti selebrasi kelulusan
    try {
      void confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Abaikan jika lingkungan tidak mendukung canvas
    }
  }, []);

  // Gelar kelulusan berdasarkan statistik akhir
  let honorTitle = 'Lulusan SMA EverLife';
  if (stats.academic >= 85) {
    honorTitle = 'Bintang Pelajar Teladan (Cum Laude)';
  } else if (stats.relationship >= 85) {
    honorTitle = 'Tokoh Populer & Sahabat Terbaik Sekolah';
  } else if (stats.happiness >= 85) {
    honorTitle = 'Generasi Muda Ceria & Penuh Optimisme';
  } else if (profile.cash >= 100000) {
    honorTitle = 'Wirausahawan Muda Berdikari';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
        {/* Ikon Selebrasi */}
        <div className="mx-auto -mt-12 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-xl shadow-amber-500/30 ring-4 ring-white">
          <GraduationCap className="w-10 h-10" />
        </div>

        <div className="mt-4">
          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Masa Sekolah Telah Usai!</span>
          </span>
          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Selamat Lulus SMA!
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kamu telah menuntaskan perjalanan usia 0 s.d. 18 tahun.
          </p>
        </div>

        {/* Profil & Gelar */}
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-left">
          <div className="flex items-center space-x-3 mb-3">
            <ProceduralAvatar name={profile.name} gender={profile.gender} size="md" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{profile.name}</h3>
              <span className="text-xs text-slate-500">{profile.country}</span>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-2.5 border border-amber-200 text-center mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
              Predikat Kelulusan
            </span>
            <span className="text-xs font-black text-amber-900">{honorTitle}</span>
          </div>

          {/* Rangkuman 4 Nilai Akhir */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white p-2 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Nilai Akademik</span>
              <span className="font-bold text-blue-600">{stats.academic} Poin</span>
            </div>
            <div className="rounded-lg bg-white p-2 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Kebugaran Fisik</span>
              <span className="font-bold text-emerald-600">{stats.health} Poin</span>
            </div>
            <div className="rounded-lg bg-white p-2 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Indeks Kebahagiaan</span>
              <span className="font-bold text-amber-600">{stats.happiness} Poin</span>
            </div>
            <div className="rounded-lg bg-white p-2 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Saldo Tabungan</span>
              <span className="font-bold text-emerald-700">
                Rp {profile.cash.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {flags.length > 0 && (
            <div className="mt-3 text-[10px] text-slate-400 flex items-center justify-center space-x-1">
              <Award className="w-3 h-3" />
              <span>Membuka {flags.length} jejak pencapaian selama sekolah</span>
            </div>
          )}
        </div>

        {/* Tombol Selesai */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onFinish}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3.5 px-4 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
