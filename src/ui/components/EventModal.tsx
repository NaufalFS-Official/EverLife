/**
 * Komponen Dialog Modal Dilema Kejadian (EventModal) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4, S7.
 * Menyajikan kartu peristiwa tahunan dengan 2 s.d. 4 opsi respons bertema warna.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import { EventDilemma, EventTheme } from '../../contracts/gameEvents';
import { Sparkles, HelpCircle } from 'lucide-react';

export interface EventModalProps {
  readonly event: EventDilemma;
  readonly onSelectOption: (optionId: string) => void;
}

const THEME_BUTTON_STYLES: Record<EventTheme, string> = {
  positive:
    'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 active:bg-emerald-200 focus:ring-emerald-400',
  rational:
    'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100 active:bg-blue-200 focus:ring-blue-400',
  rebellious:
    'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100 active:bg-rose-200 focus:ring-rose-400',
  passive:
    'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-400',
};

export const EventModal: React.FC<EventModalProps> = ({ event, onSelectOption }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Lencana Kategori */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Peristiwa: {event.category}</span>
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            Usia {event.minAge}–{event.maxAge}
          </span>
        </div>

        {/* Judul & Narasi */}
        <h2 id="event-modal-title" className="text-lg font-extrabold text-slate-900 leading-snug mb-2">
          {event.title}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          {event.narrative}
        </p>

        {/* Opsi Pilihan Respons */}
        <div className="space-y-2.5">
          <div className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Bagaimana Kamu Merespons?</span>
          </div>

          {event.options.map((option, idx) => {
            const style = THEME_BUTTON_STYLES[option.theme] ?? THEME_BUTTON_STYLES.passive;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectOption(option.id)}
                className={`w-full text-left rounded-xl border-2 p-3.5 font-semibold text-sm transition-all focus:outline-none focus:ring-2 active:scale-[0.98] ${style}`}
              >
                <div className="flex items-start space-x-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/80 text-[11px] font-bold shadow-xs">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
