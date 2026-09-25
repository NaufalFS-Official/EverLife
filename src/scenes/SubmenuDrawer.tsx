/**
 * SUBMENU DRAWER & LIFE ACTIVITIES (EverLife)
 * F-006, F-007, F-010, F-011: Bottom sheet untuk Pekerjaan, Aset, Relasi, dan Aktivitas.
 */

import React from 'react';
import { useGame } from '../engine/GameContext';
import { OccupationTab } from './drawers/OccupationTab';
import { AssetsTab } from './drawers/AssetsTab';
import { RelationshipsTab } from './drawers/RelationshipsTab';
import { ActivitiesTab } from './drawers/ActivitiesTab';
import { Briefcase, Home, Users, Activity, X } from 'lucide-react';

export const SubmenuDrawer: React.FC = () => {
  const { state, activeSubmenu, closeSubmenu } = useGame();

  if (!state || !activeSubmenu) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex flex-col justify-end select-none">
      <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Drawer Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            {activeSubmenu === 'occupation' && <Briefcase size={18} className="text-emerald-600" />}
            {activeSubmenu === 'assets' && <Home size={18} className="text-emerald-600" />}
            {activeSubmenu === 'relationships' && <Users size={18} className="text-emerald-600" />}
            {activeSubmenu === 'activities' && <Activity size={18} className="text-emerald-600" />}
            <h3 className="font-bold text-slate-800 text-sm capitalize">
              {activeSubmenu === 'occupation' && 'Karir & Pendidikan'}
              {activeSubmenu === 'assets' && 'Keuangan & Aset'}
              {activeSubmenu === 'relationships' && 'Keluarga & Relasi'}
              {activeSubmenu === 'activities' && 'Aktivitas & Gaya Hidup'}
            </h3>
          </div>
          <button
            onClick={closeSubmenu}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition cursor-pointer"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeSubmenu === 'occupation' && <OccupationTab />}
          {activeSubmenu === 'assets' && <AssetsTab />}
          {activeSubmenu === 'relationships' && <RelationshipsTab />}
          {activeSubmenu === 'activities' && <ActivitiesTab />}
        </div>
      </div>
    </div>
  );
};
