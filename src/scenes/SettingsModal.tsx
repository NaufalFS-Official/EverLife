/**
 * SETTINGS & PLATFORM BACKUP MODAL (EverLife)
 * Blueprint S14 & DAEL-21 s/d DAEL-25: Pengaturan Tier Grafis, Audio SFX,
 * Uji Taktil, Aksesibilitas Gerak, Ekspor/Impor Save Data aman, dan reset game.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../engine/GameContext';
import { audio } from '../engine/audioManager';
import { triggerHaptic } from '../adapter/haptics';
import { LocalSaveRepository } from '../adapter/localAdapter';
import { telemetry } from '../adapter/telemetry';
import { platform } from '../shared/platform';
import { DeviceTier, TIER_CONFIGS, detectInitialDeviceTier } from '../platform/deviceTier';
import { X, Volume2, VolumeX, Smartphone, Download, Upload, Trash2, Cpu, Check, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: DeviceTier;
  onSelectTier?: (tier: DeviceTier) => void;
}

const saveRepo = new LocalSaveRepository();

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTier = 'mid',
  onSelectTier,
}) => {
  const { restartGame } = useGame();
  const reloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMuted, setIsMuted] = useState(audio.getIsMuted());
  const [selectedTier, setSelectedTier] = useState<DeviceTier>(currentTier);
  const [importJson, setImportJson] = useState('');
  const [actionFeedback, setActionFeedback] = useState<{ msg: string; isError?: boolean } | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [telemetryConsent, setTelemetryConsent] = useState(telemetry.getConsent());
  const [reducedMotion, setReducedMotion] = useState(() => platform.storage.getItem('everlife_reduced_motion') === 'true');
  useEffect(() => () => {
    if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
  }, []);

  const handleClose = () => {
    if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
    onClose();
  };

  if (!isOpen) return null;

  const handleToggleTelemetry = () => {
    const nextVal = !telemetryConsent;
    telemetry.setConsent(nextVal);
    setTelemetryConsent(nextVal);
    audio.play('ui_click');
    setActionFeedback({
      msg: nextVal ? 'Telemetri anonim diaktifkan untuk diagnostik performa.' : 'Telemetri dinonaktifkan & log lokal dibersihkan.',
    });
  };

  const handleToggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    setActionFeedback({ msg: muted ? 'Efek suara dimatikan.' : 'Efek suara diaktifkan.' });
  };

  const handleToggleReducedMotion = () => {
    const nextVal = !reducedMotion;
    setReducedMotion(nextVal);
    platform.storage.setItem('everlife_reduced_motion', String(nextVal));
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('reduced-motion', nextVal);
    }
    audio.play('ui_click');
    setActionFeedback({ msg: nextVal ? 'Kurangi Gerakan diaktifkan.' : 'Animasi normal diaktifkan.' });
  };

  const handleTierChange = (tier: DeviceTier) => {
    setSelectedTier(tier);
    if (onSelectTier) onSelectTier(tier);
    audio.play('ui_click');
    setActionFeedback({ msg: `Profil performa disetel ke: ${TIER_CONFIGS[tier].name}` });
  };

  const handleTestHaptic = () => {
    const ok = triggerHaptic(30);
    audio.play('ui_click');
    setActionFeedback({ msg: ok ? 'Getaran berhasil dipicu!' : 'Haptik tidak didukung pada browser/perangkat ini.' });
  };

  const handleExportSave = async () => {
    audio.play('ui_click');
    const raw = await saveRepo.exportPayload();
    if (!raw) {
      setActionFeedback({ msg: 'Belum ada data permainan aktif untuk diekspor.', isError: true });
      return;
    }
    const copied = await platform.copyToClipboard(raw);
    if (copied) {
      setActionFeedback({ msg: 'Data save berhasil disalin ke clipboard!' });
    } else {
      setImportJson(raw);
      setActionFeedback({ msg: 'Gagal salin otomatis. Data ditampilkan pada kotak teks di bawah.' });
    }
  };

  const handleImportSave = async () => {
    audio.play('ui_click');
    if (!importJson.trim()) {
      setActionFeedback({ msg: 'Tempelkan data JSON save sebelum mengimpor.', isError: true });
      return;
    }
    const ok = await saveRepo.importPayload(importJson.trim());
    if (ok) {
      setActionFeedback({ msg: 'Data save valid! Memuat ulang permainan...' });
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
      reloadTimerRef.current = setTimeout(() => { platform.reload(); }, 1000);
    } else {
      setActionFeedback({ msg: 'Impor ditolak: Format JSON rusak atau Checksum tidak cocok!', isError: true });
    }
  };

  const handleConfirmReset = () => {
    if (reloadTimerRef.current) {
      clearTimeout(reloadTimerRef.current);
      reloadTimerRef.current = null;
    }
    audio.play('death');
    restartGame();
    onClose();
    platform.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="text-emerald-600" size={20} />
            <h2 className="font-bold text-slate-900 text-base">Pengaturan & Cadangan</h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Tutup Pengaturan"
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {actionFeedback && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
              actionFeedback.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {actionFeedback.isError ? <AlertCircle size={16} /> : <Check size={16} />}
              <span>{actionFeedback.msg}</span>
            </div>
          )}

          {/* 1. Device Performance Tier */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Performa & Grafis (Tier)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'mid', 'high'] as DeviceTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTierChange(t)}
                  className={`min-h-[44px] py-2 px-1 rounded-xl text-xs font-bold border transition cursor-pointer flex flex-col items-center justify-center ${
                    selectedTier === t ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="capitalize">{t}</span>
                  <span className="text-[9px] font-normal opacity-80">{TIER_CONFIGS[t].targetFps} FPS</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Deteksi otomatis: <span className="font-semibold">{detectInitialDeviceTier().toUpperCase()}</span>
            </p>
          </div>

          {/* 2. Audio, Haptics & Accessibility */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Audio, Taktil & Aksesibilitas
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleToggleMute}
                className="min-h-[44px] px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isMuted ? <VolumeX size={16} className="text-rose-500" /> : <Volume2 size={16} className="text-emerald-600" />}
                <span className="text-xs">{isMuted ? 'Muted' : 'Suara Aktif'}</span>
              </button>
              <button
                type="button"
                onClick={handleTestHaptic}
                className="min-h-[44px] px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Smartphone size={16} className="text-blue-500" />
                <span className="text-xs">Uji Haptik</span>
              </button>
              <button
                type="button"
                onClick={handleToggleReducedMotion}
                className="col-span-2 min-h-[44px] px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className={reducedMotion ? 'text-amber-500' : 'text-slate-400'} />
                  <span className="text-xs">Kurangi Gerakan (Reduced Motion)</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${reducedMotion ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                  {reducedMotion ? 'Aktif' : 'Nonaktif'}
                </span>
              </button>
              <button
                type="button"
                onClick={handleToggleTelemetry}
                className="col-span-2 min-h-[44px] px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className={telemetryConsent ? 'text-emerald-600' : 'text-slate-400'} />
                  <span className="text-xs">Telemetri Anonim & Error Crash</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${telemetryConsent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {telemetryConsent ? 'Aktif' : 'Nonaktif'}
                </span>
              </button>
            </div>
          </div>

          {/* 3. Export & Import Save Payload */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Pencadangan Data (Export/Import)
            </label>
            <button
              type="button"
              onClick={handleExportSave}
              className="w-full min-h-[44px] py-2.5 px-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-98 transition cursor-pointer"
            >
              <Download size={16} /> Salin Cadangan Save (JSON)
            </button>
            <div className="space-y-1.5 pt-1">
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Tempel data JSON save di sini untuk memulihkan..."
                className="w-full h-20 p-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500"
              />
              <button
                type="button"
                onClick={handleImportSave}
                className="w-full min-h-[44px] py-2 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 active:scale-98 transition cursor-pointer"
              >
                <Upload size={14} /> Pulihkan & Impor Save
              </button>
            </div>
          </div>

          {/* 4. Danger Zone */}
          <div className="pt-2 border-t border-slate-100">
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full min-h-[44px] py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 size={14} /> Reset / Hapus Save Game
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-center">
                <p className="text-xs font-bold text-rose-800">Yakin ingin menghapus seluruh progres?</p>
                <div className="flex gap-2">
                  <button type="button" onClick={handleConfirmReset} className="flex-1 min-h-[44px] bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 cursor-pointer">
                    Ya, Hapus
                  </button>
                  <button type="button" onClick={() => setShowConfirmReset(false)} className="flex-1 min-h-[44px] bg-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-300 cursor-pointer">
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
