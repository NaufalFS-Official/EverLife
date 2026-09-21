/**
 * Komponen Bar Navigasi Bawah (BottomNav) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4, S7.
 * Menavigasikan 4 tab utama: Hidup (LIFE), Relasi (RELATIONS), Aktivitas (ACTIVITIES), Profil (PROFILE).
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import { ActiveTab } from '../../contracts/gameState';
import { Sparkles, Users, Briefcase, UserCheck } from 'lucide-react';

export interface BottomNavProps {
  readonly activeTab: ActiveTab;
  readonly onTabChange: (tab: ActiveTab) => void;
}

interface TabItemConfig {
  readonly key: ActiveTab;
  readonly label: string;
  readonly icon: React.ReactNode;
}

const TAB_ITEMS: readonly TabItemConfig[] = [
  {
    key: 'LIFE',
    label: 'Hidup',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    key: 'RELATIONS',
    label: 'Relasi',
    icon: <Users className="w-5 h-5" />,
  },
  {
    key: 'ACTIVITIES',
    label: 'Aktivitas',
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    key: 'PROFILE',
    label: 'Profil',
    icon: <UserCheck className="w-5 h-5" />,
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-md border-t border-slate-200 bg-white/95 px-3 py-1 backdrop-blur-md shadow-lg"
      aria-label="Navigasi Menu Bawah"
    >
      <div className="grid grid-cols-4 gap-1">
        {TAB_ITEMS.map(tab => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 font-bold bg-blue-50/80 scale-105'
                  : 'text-slate-500 font-medium hover:text-slate-800 hover:bg-slate-50'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                {tab.icon}
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
