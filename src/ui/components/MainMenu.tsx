/**
 * Komponen Layar Menu Utama (MainMenu) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S2, S3, S5.
 * Menyediakan tombol mulai baru, pemuatan 3 slot simpanan mandiri, dan toggle audio.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React, { useEffect, useState } from 'react';
import { EverLifeSaveData } from '../../contracts/saveSchema';
import { SaveService } from '../../storage/SaveService';
import { Sparkles, Play, Trash2, Volume2, VolumeX, History } from 'lucide-react';
import { ProceduralAvatar } from './ProceduralAvatar';

export interface MainMenuProps {
  readonly saveService: SaveService;
  readonly isMuted: boolean;
  readonly onToggleMute: () => void;
  readonly onStartNewGame: () => void;
  readonly onLoadSlot: (saveData: EverLifeSaveData) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  saveService,
  isMuted,
  onToggleMute,
  onStartNewGame,
  onLoadSlot,
}) => {
  const [slots, setSlots] = useState<readonly (EverLifeSaveData | null)[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSlots = async () => {
    try {
      const data = await saveService.listAllSlots();
      setSlots(data);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshSlots();
  }, []);

  const handleDelete = async (slotId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Hapus simpanan pada Slot ${slotId}? Tindakan ini tidak dapat dibatalkan.`)) {
      await saveService.deleteSlot(slotId);
      await refreshSlots();
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 text-white max-w-md mx-auto">
      {/* Kontrol Atas (Audio) */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onToggleMute}
          className="flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md hover:bg-white/20 transition-all"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-blue-400" />}
          <span>{isMuted ? 'Suara Senyap' : 'Suara Aktif'}</span>
        </button>
      </div>

      {/* Hero / Logo */}
      <div className="my-auto text-center space-y-3 py-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-xl shadow-blue-500/25 ring-4 ring-white/10">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white">
          Ever<span className="text-blue-400">Life</span>
        </h1>
        <p className="text-xs font-medium text-slate-300 max-w-xs mx-auto">
          Simulasi Kehidupan Sekolah Indonesia. Tentukan jalan hidupmu dari lahir hingga kelulusan SMA.
        </p>

        {/* Tombol Mulai Hidup Baru */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onStartNewGame}
            className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-blue-600 py-4 px-6 font-extrabold text-white shadow-lg shadow-blue-500/40 hover:bg-blue-500 active:scale-[0.98] transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span className="text-base tracking-wide">Mulai Kehidupan Baru</span>
          </button>
        </div>
      </div>

      {/* Daftar Slot Simpanan */}
      <div className="space-y-2.5 pb-4">
        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          <History className="w-3.5 h-3.5" />
          <span>Lanjutkan Permainan (Slot Lokal)</span>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white/5 p-4 text-center text-xs text-slate-400">
            Memeriksa slot simpanan...
          </div>
        ) : (
          <div className="space-y-2">
            {[1, 2, 3].map(slotNum => {
              const saveData = slots[slotNum - 1];

              if (!saveData) {
                return (
                  <div
                    key={slotNum}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3.5 text-slate-500 text-xs"
                  >
                    <span className="font-semibold">Slot {slotNum}</span>
                    <span className="italic">Kosong</span>
                  </div>
                );
              }

              return (
                <div
                  key={slotNum}
                  onClick={() => onLoadSlot(saveData)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/10 p-3.5 hover:bg-white/15 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <ProceduralAvatar
                      name={saveData.profile.name}
                      gender={saveData.profile.gender}
                      size="sm"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">
                          {saveData.profile.name}
                        </span>
                        <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
                          Slot {slotNum}
                        </span>
                      </div>
                      <span className="text-xs text-slate-300">
                        Usia {saveData.profile.age} Thn · {saveData.profile.grade}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={e => void handleDelete(slotNum, e)}
                      title={`Hapus Slot ${slotNum}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-center text-[10px] text-slate-500 pb-1">
        EverLife v1.0-SMA · Mode Offline Tanpa Kuota · Purwarupa
      </div>
    </div>
  );
};
