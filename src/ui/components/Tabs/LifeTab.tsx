/**
 * Tampilan Tab Hidup (LifeTab) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4.
 * Menampilkan linimasa perjalanan hidup karakter secara runut dari tahun ke tahun.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import { TimelineLogEntry, CharacterProfile } from '../../../contracts/gameState';
import { TimelineView } from '../TimelineView';
import { Calendar } from 'lucide-react';

export interface LifeTabProps {
  readonly profile: CharacterProfile;
  readonly timelineHistory: readonly TimelineLogEntry[];
}

export const LifeTab: React.FC<LifeTabProps> = ({ profile, timelineHistory }) => {
  return (
    <div className="space-y-4 pb-20">
      {/* Banner Ringkasan Usia & Status */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
              Tahun Berjalan
            </span>
            <h2 className="text-xl font-black">
              {profile.birthYear + profile.age} M ({profile.age} Tahun)
            </h2>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-xs text-right border border-white/20">
            <span className="text-[10px] uppercase tracking-wider text-blue-100 block">
              Status Hidup
            </span>
            <span className="text-xs font-bold">{profile.grade}</span>
          </div>
        </div>
      </div>

      {/* Header Linimasa */}
      <div className="flex items-center space-x-2 px-1 text-slate-800">
        <Calendar className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Linimasa Peristiwa Kehidupan
        </h3>
      </div>

      {/* Daftar Linimasa */}
      <TimelineView history={timelineHistory} />
    </div>
  );
};
