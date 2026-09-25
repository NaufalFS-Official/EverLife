/**
 * REALTIME STATUS DOCK (EverLife)
 * F-005: 4 realtime progress bars (Happiness, Health, Smarts, Looks) dengan transisi mulus.
 */

import React from 'react';
import { CharacterAttributes } from '../core/types';
import { Smile, Heart, GraduationCap, Sparkles } from 'lucide-react';

interface HUDProps {
  attributes: CharacterAttributes;
}

export const HUD: React.FC<HUDProps> = ({ attributes }) => {
  const statList = [
    {
      label: 'Happiness',
      val: attributes.happiness,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-100',
      icon: Smile,
      textColor: 'text-emerald-700',
    },
    {
      label: 'Health',
      val: attributes.health,
      color: attributes.health < 25 ? 'bg-rose-600 animate-pulse' : 'bg-rose-500',
      bgColor: 'bg-rose-100',
      icon: Heart,
      textColor: 'text-rose-700',
    },
    {
      label: 'Smarts',
      val: attributes.smarts,
      color: 'bg-sky-500',
      bgColor: 'bg-sky-100',
      icon: GraduationCap,
      textColor: 'text-sky-700',
    },
    {
      label: 'Looks',
      val: attributes.looks,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-100',
      icon: Sparkles,
      textColor: 'text-amber-700',
    },
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md px-4 py-3 border-t border-slate-200/80 shadow-xs select-none">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {statList.map((stat) => {
          const Icon = stat.icon;
          const clamped = Math.max(0, Math.min(100, stat.val));
          return (
            <div key={stat.label} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={`flex items-center gap-1.5 ${stat.textColor}`}>
                  <Icon size={13} /> {stat.label}
                </span>
                <span className="text-slate-800 font-mono text-[11px]">{clamped}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${stat.bgColor}`}>
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${stat.color}`}
                  style={{ width: `${clamped}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
