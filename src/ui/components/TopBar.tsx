/**
 * Komponen Bar Status Atas (TopBar) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4, S7.
 * Menampilkan nama, usia, tingkat jenjang sekolah, saldo uang saku, dan toggle audio.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import { Volume2, VolumeX, Home } from 'lucide-react';
import { CharacterProfile } from '../../contracts/gameState';
import { ProceduralAvatar } from './ProceduralAvatar';

export interface TopBarProps {
  readonly profile: CharacterProfile;
  readonly isMuted: boolean;
  readonly onToggleMute: () => void;
  readonly onOpenMainMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  profile,
  isMuted,
  onToggleMute,
  onOpenMainMenu,
}) => {
  const formattedCash = `Rp ${profile.cash.toLocaleString('id-ID')}`;

  const gradeBadgeColor = {
    Balita: 'bg-amber-100 text-amber-800 border-amber-300',
    SD: 'bg-red-100 text-red-800 border-red-300',
    SMP: 'bg-blue-100 text-blue-800 border-blue-300',
    SMA: 'bg-slate-100 text-slate-800 border-slate-400',
    'Lulus SMA': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  }[profile.grade];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md shadow-xs">
      {/* Profil Karakter & Jenjang */}
      <div className="flex items-center space-x-3">
        <ProceduralAvatar name={profile.name} gender={profile.gender} size="md" />
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 leading-tight truncate max-w-[130px]">
              {profile.name}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${gradeBadgeColor}`}
            >
              {profile.grade}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Usia: <strong className="text-slate-800">{profile.age}</strong> Tahun
          </span>
        </div>
      </div>

      {/* Saldo Uang & Kontrol Audio/Menu */}
      <div className="flex items-center space-x-2">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Tabungan
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {formattedCash}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleMute}
          title={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          aria-label={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
        </button>

        <button
          type="button"
          onClick={onOpenMainMenu}
          title="Menu Utama"
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          aria-label="Menu Utama"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
