/**
 * Komponen Linimasa Peristiwa (TimelineView) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4, S7.
 * Menampilkan catatan perjalanan hidup dengan daftar terikat (DOM nodes < 300) agar performa 60 FPS terjaga.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import { TimelineLogEntry, EventCategory } from '../../contracts/gameState';
import { Calendar, School, HeartPulse, Sparkles, Users } from 'lucide-react';

export interface TimelineViewProps {
  readonly history: readonly TimelineLogEntry[];
}

const CATEGORY_BADGES: Record<
  EventCategory,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  Keluarga: {
    label: 'Keluarga',
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    icon: <Users className="w-3 h-3 text-pink-700" />,
  },
  Sekolah: {
    label: 'Sekolah',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: <School className="w-3 h-3 text-blue-700" />,
  },
  Kesehatan: {
    label: 'Kesehatan',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    icon: <HeartPulse className="w-3 h-3 text-emerald-700" />,
  },
  Dilema: {
    label: 'Dilema',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    icon: <Sparkles className="w-3 h-3 text-amber-700" />,
  },
  Acak: {
    label: 'Kehidupan',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    icon: <Calendar className="w-3 h-3 text-slate-700" />,
  },
};

export const TimelineView: React.FC<TimelineViewProps> = ({ history }) => {
  // Batasi render maksimal 100 entri terbaru untuk menjamin DOM nodes < 300
  const visibleEntries = history.slice(0, 100);

  if (visibleEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-400">
        <Calendar className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
        <p className="text-sm font-medium">Belum ada catatan peristiwa hidup.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-200 ml-4 pl-4 space-y-4 py-2">
      {visibleEntries.map((entry, index) => {
        const badge = CATEGORY_BADGES[entry.category] ?? CATEGORY_BADGES.Acak;
        const entryKey = `entry-${entry.age}-${index}`;

        return (
          <article
            key={entryKey}
            className="relative rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md"
          >
            {/* Titik indikator pada garis vertikal */}
            <span
              className="absolute -left-[23px] top-4 flex h-3 w-3 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white"
              aria-hidden="true"
            />

            <header className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 rounded px-2 py-0.5 text-[11px] font-bold text-slate-900 bg-slate-100">
                  <span>Usia {entry.age}</span>
                </span>
                <span
                  className={`inline-flex items-center space-x-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
              </div>
            </header>

            <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
              {entry.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {entry.description}
            </p>

            {/* Indikator Delta Stat jika ada */}
            {entry.statDeltas && Object.keys(entry.statDeltas).length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {Object.entries(entry.statDeltas).map(([key, delta]) => {
                  if (delta === undefined || delta === 0) return null;
                  const isPositive = delta > 0;
                  const isCash = key === 'cash';
                  const formattedValue = isCash
                    ? `${isPositive ? '+' : ''}Rp ${Math.abs(delta).toLocaleString('id-ID')}`
                    : `${isPositive ? '+' : ''}${delta}`;

                  return (
                    <span
                      key={key}
                      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        isPositive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {key.toUpperCase()}: {formattedValue}
                    </span>
                  );
                })}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};
