/**
 * Tampilan Tab Aktivitas Tahunan (ActivitiesTab) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4, S7.
 * Menyajikan kegiatan belajar, olahraga, bimbingan les, part-time, dan gym.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import { ANNUAL_ACTIVITIES, ActivityDefinition } from '../../../core/EconomyEngine';
import { Briefcase, Lock, CheckCircle2 } from 'lucide-react';

export interface ActivitiesTabProps {
  readonly currentAge: number;
  readonly currentCash: number;
  readonly onPerformActivity: (activityId: string) => void;
}

export const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
  currentAge,
  currentCash,
  onPerformActivity,
}) => {
  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center space-x-2 px-1 text-slate-800">
        <Briefcase className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Aktivitas Pengembangan Diri & Karir
        </h3>
      </div>

      <div className="space-y-3">
        {ANNUAL_ACTIVITIES.map((activity: ActivityDefinition) => {
          const isUnlocked = currentAge >= activity.minAge;
          const canAfford = activity.cost === 0 || currentCash >= activity.cost;
          const isPlayable = isUnlocked && canAfford;

          return (
            <div
              key={activity.id}
              className={`rounded-2xl border p-4 transition-all ${
                isUnlocked
                  ? 'border-slate-200 bg-white shadow-xs hover:shadow-md'
                  : 'border-slate-200/60 bg-slate-50/80 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-slate-900 leading-snug">
                      {activity.title}
                    </h4>
                    {!isUnlocked && (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        <Lock className="w-3 h-3" />
                        <span>Usia {activity.minAge}+</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activity.description}
                  </p>
                </div>
              </div>

              {/* Efek Stat & Biaya/Penghasilan */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 mt-2">
                <div className="flex flex-wrap gap-1">
                  {Object.entries(activity.statDeltas).map(([k, v]) => {
                    if (v === undefined) return null;
                    const isPositive = v > 0;
                    return (
                      <span
                        key={k}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {k.toUpperCase()}: {isPositive ? `+${v}` : v}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-700">
                    {activity.cost > 0 && (
                      <span className="text-rose-600">
                        Biaya: Rp {activity.cost.toLocaleString('id-ID')}
                      </span>
                    )}
                    {activity.income > 0 && (
                      <span className="text-emerald-600">
                        Gaji: +Rp {activity.income.toLocaleString('id-ID')}
                      </span>
                    )}
                    {activity.cost === 0 && activity.income === 0 && (
                      <span className="text-slate-400">Gratis</span>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => onPerformActivity(activity.id)}
                    disabled={!isPlayable}
                    className={`inline-flex items-center space-x-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-[0.97] ${
                      isPlayable
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lakukan</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
