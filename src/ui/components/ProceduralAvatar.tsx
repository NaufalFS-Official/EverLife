/**
 * Komponen Avatar Prosedural Inisial Huruf (Tier P) EverLife (v1.0-SMA).
 * Menghasilkan lencana visual dengan inisial dan warna gradien deterministik berbasis nama.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import { Gender } from '../../contracts/gameState';

export interface ProceduralAvatarProps {
  readonly name: string;
  readonly gender?: Gender;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
}

const GRADIENT_PALETTES = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
] as const;

export const ProceduralAvatar: React.FC<ProceduralAvatarProps> = ({
  name,
  gender,
  size = 'md',
}) => {
  const initial = (name.trim().charAt(0) || 'E').toUpperCase();

  // Hitung hash deterministik dari nama untuk memilih gradien warna
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const paletteIndex = Math.abs(hash) % GRADIENT_PALETTES.length;
  const gradient = GRADIENT_PALETTES[paletteIndex] ?? 'from-blue-500 to-indigo-600';

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-14 h-14 text-xl font-bold',
    xl: 'w-20 h-20 text-3xl font-extrabold',
  }[size];

  const genderRing = gender === 'Wanita' ? 'ring-pink-300' : 'ring-blue-300';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white shadow-md ring-2 ${genderRing} ${sizeClasses} select-none shrink-0`}
      title={name}
      aria-label={`Avatar ${name}`}
    >
      <span>{initial}</span>
    </div>
  );
};
