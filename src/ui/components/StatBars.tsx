/**
 * Komponen Bar Indikator 4 Statistik Inti (StatBars) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4, S7.
 * Menampilkan Kesehatan, Kebahagiaan, Hubungan, dan Akademik dengan animasi transisi halus.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import { Heart, Smile, Users, GraduationCap } from 'lucide-react';
import { CharacterStats, StatKey } from '../../contracts/gameState';

export interface StatBarsProps {
  readonly stats: CharacterStats;
}

interface StatItemConfig {
  readonly key: StatKey;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly barColor: string;
  readonly textColor: string;
  readonly bgColor: string;
}

const STAT_CONFIGS: readonly StatItemConfig[] = [
  {
    key: 'health',
    label: 'Kesehatan',
    icon: <Heart className="w-3.5 h-3.5 text-emerald-600" />,
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  {
    key: 'happiness',
    label: 'Kebahagiaan',
    icon: <Smile className="w-3.5 h-3.5 text-amber-600" />,
    barColor: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
  {
    key: 'relationship',
    label: 'Hubungan',
    icon: <Users className="w-3.5 h-3.5 text-pink-600" />,
    barColor: 'bg-pink-500',
    textColor: 'text-pink-700',
    bgColor: 'bg-pink-50',
  },
  {
    key: 'academic',
    label: 'Akademik',
    icon: <GraduationCap className="w-3.5 h-3.5 text-blue-600" />,
    barColor: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
];

export const StatBars: React.FC<StatBarsProps> = ({ stats }) => {
  return (
    <section
      className="grid grid-cols-2 gap-2.5 bg-white p-3 border-b border-slate-200 shadow-xs"
      aria-label="Statistik Karakter"
    >
      {STAT_CONFIGS.map(item => {
        const value = Math.max(0, Math.min(100, stats[item.key]));
        const isCritical = value <= 20;

        return (
          <div
            key={item.key}
            className={`flex flex-col rounded-lg border border-slate-100 p-2 transition-all ${
              isCritical ? 'bg-red-50/70 border-red-200 animate-pulse' : 'bg-slate-50/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1.5">
                <span className={`p-1 rounded-md ${item.bgColor}`}>{item.icon}</span>
                <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              </div>
              <span
                className={`text-xs font-bold font-mono ${
                  isCritical ? 'text-red-600' : item.textColor
                }`}
              >
                {value}%
              </span>
            </div>

            {/* Progress Bar dengan durasi tween 300ms */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out ${
                  isCritical ? 'bg-red-500' : item.barColor
                }`}
                style={{ width: `${value}%` }}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.label} ${value}%`}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
};
