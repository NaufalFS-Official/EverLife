/**
 * INTERACTIVE MODAL & SCENARIO DIALOG MANAGER (EverLife)
 * F-004: Dialog skenario interaktif, cabang pilihan berbobot, dan outcome resolver.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../engine/GameContext';
import { Dices, Sparkles, AlertCircle } from 'lucide-react';

export const ModalManager: React.FC = () => {
  const { state, chooseOption, surpriseMe, modalAttentionNonce, triggerModalAttention } = useGame();
  const [isShaking, setIsShaking] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (modalAttentionNonce > 0) {
      setIsShaking(true);
      setShowWarning(true);
      const timer = setTimeout(() => setIsShaking(false), 250);
      const warnTimer = setTimeout(() => setShowWarning(false), 2500);
      return () => {
        clearTimeout(timer);
        clearTimeout(warnTimer);
      };
    }
  }, [modalAttentionNonce]);

  if (!state || !state.activeModal) {
    return null;
  }

  const event = state.activeModal;

  return (
    <div
      onClick={triggerModalAttention}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-scale-up transition-transform duration-100 ${
          isShaking ? 'translate-x-1 ring-4 ring-rose-400/80 animate-pulse' : ''
        }`}
      >
        {/* Modal Top Header */}
        <div className="bg-emerald-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase">
              {event.category}
            </span>
            <span className="text-xs font-semibold text-emerald-100">
              Usia {state.character.age}
            </span>
          </div>
          <button
            onClick={surpriseMe}
            className="flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 min-h-[44px] rounded-full transition cursor-pointer"
            title="Pilih Acak (Surprise Me!)"
          >
            <Dices size={16} /> Surprise Me!
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {event.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {event.description}
          </p>

          {showWarning && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-2 animate-bounce">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>Selesaikan kejadian saat ini terlebih dahulu!</span>
            </div>
          )}

          {/* Action Choices (2 - 4 pilihan) */}
          <div className="space-y-2 pt-2">
            {event.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => chooseOption(idx)}
                className="w-full min-h-[44px] text-left px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 active:scale-98 transition font-medium text-xs text-slate-800 flex items-start gap-2.5 group cursor-pointer shadow-2xs"
              >
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition">
                  {idx + 1}
                </span>
                <span className="leading-snug">{choice.text}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 justify-center pt-1 font-semibold">
            <Sparkles size={12} className="text-emerald-500" />
            Setiap pilihan membentuk takdir dan masa depan Anda
          </div>
        </div>
      </div>
    </div>
  );
};
