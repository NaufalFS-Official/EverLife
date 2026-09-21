/**
 * Tampilan Tab Profil & Pengaturan (ProfileTab) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4, S8.
 * Menampilkan rincian identitas, manajemen slot simpanan, ekspor/impor berkas JSON, dan audio.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React, { useState } from 'react';
import { CharacterProfile } from '../../../contracts/gameState';
import { ProceduralAvatar } from '../ProceduralAvatar';
import {
  Save,
  Download,
  Upload,
  Volume2,
  VolumeX,
  RotateCcw,
  Tag,
  Info,
} from 'lucide-react';

export interface ProfileTabProps {
  readonly profile: CharacterProfile;
  readonly flags: readonly string[];
  readonly activeSlotId: number | null;
  readonly isMuted: boolean;
  readonly onToggleMute: () => void;
  readonly onSaveToSlot: (slotId: number) => Promise<void>;
  readonly onExportSave: () => void;
  readonly onImportSave: (jsonStr: string) => void;
  readonly onResetGame: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  flags,
  activeSlotId,
  isMuted,
  onToggleMute,
  onSaveToSlot,
  onExportSave,
  onImportSave,
  onResetGame,
}) => {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleManualSave = async () => {
    const slot = activeSlotId ?? 1;
    try {
      await onSaveToSlot(slot);
      setSaveStatus(`Berhasil disimpan ke Slot ${slot}!`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('Gagal menyimpan permainan.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        try {
          onImportSave(text);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Berkas simpanan tidak valid.';
          alert(`Gagal mengimpor: ${msg}`);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Kartu Profil Utama */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-center">
        <div className="flex justify-center mb-3">
          <ProceduralAvatar name={profile.name} gender={profile.gender} size="lg" />
        </div>
        <h3 className="text-lg font-black text-slate-900">{profile.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {profile.gender} · {profile.country} · Lahir {profile.birthYear}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-left">
          <div className="rounded-xl bg-slate-50 p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Jenjang Pendidikan
            </span>
            <span className="text-xs font-bold text-slate-800">{profile.grade}</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Usia Karakter
            </span>
            <span className="text-xs font-bold text-slate-800">{profile.age} Tahun</span>
          </div>
        </div>
      </div>

      {/* Lencana Pencapaian / Flags */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center space-x-2 mb-2">
          <Tag className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Jejak Pencapaian & Flag Karakter
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {flags.map(flag => (
            <span
              key={flag}
              className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200"
            >
              #{flag}
            </span>
          ))}
        </div>
      </div>

      {/* Manajemen Simpanan */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Penyimpanan Data (Offline)
          </h4>
          {saveStatus && (
            <span className="text-[11px] font-bold text-emerald-600 animate-fade-in">
              {saveStatus}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleManualSave}
          className="w-full flex items-center justify-center space-x-2 rounded-xl bg-blue-50 border border-blue-200 py-2.5 px-3 text-xs font-bold text-blue-700 hover:bg-blue-100 active:scale-[0.98] transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Simpan ke Slot {activeSlotId ?? 1}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onExportSave}
            className="flex items-center justify-center space-x-1.5 rounded-xl border border-slate-200 bg-white py-2 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Ekspor JSON</span>
          </button>

          <label className="flex items-center justify-center space-x-1.5 rounded-xl border border-slate-200 bg-white py-2 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Impor JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Pengaturan Audio & Keluar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
        <button
          type="button"
          onClick={onToggleMute}
          className="w-full flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
        >
          <span className="flex items-center space-x-2">
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
            <span>Efek Suara Sintetis (Web Audio)</span>
          </span>
          <span className={`text-[11px] font-bold ${isMuted ? 'text-slate-400' : 'text-blue-600'}`}>
            {isMuted ? 'MUTE' : 'AKTIF'}
          </span>
        </button>

        <button
          type="button"
          onClick={onResetGame}
          className="w-full flex items-center justify-center space-x-2 rounded-xl bg-rose-50 border border-rose-200 py-3 text-xs font-bold text-rose-700 hover:bg-rose-100 active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </button>
      </div>

      <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-400 pt-2">
        <Info className="w-3 h-3" />
        <span>EverLife v1.0-SMA · Mode Offline Tanpa Kuota</span>
      </div>
    </div>
  );
};
