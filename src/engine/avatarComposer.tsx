/**
 * MODULAR 2D SVG AVATAR COMPOSER (EverLife)
 * Blueprint S6: Layered SVG procedural face builder (120x120 px).
 */

import React from 'react';
import { CharacterAppearance } from '../core/types';

interface AvatarProps {
  appearance: CharacterAppearance;
  age: number;
  happiness?: number;
  health?: number;
  size?: number;
  className?: string;
}

const SKIN_TONES = ['#FBE3D5', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#3D2314'];
const HAIR_COLORS = ['#1A1A1A', '#3D2314', '#5C4033', '#8B4513', '#D4AF37', '#808080', '#D3D3D3', '#E6E6FA'];

export const AvatarComposer: React.FC<AvatarProps> = ({
  appearance,
  age,
  happiness = 80,
  health = 80,
  size = 120,
  className = '',
}) => {
  const skinColor = SKIN_TONES[appearance.skin % SKIN_TONES.length] ?? '#F1C27D';
  const hairColor = HAIR_COLORS[appearance.hairColor % HAIR_COLORS.length] ?? '#1A1A1A';

  // Penentuan ekspresi mulut berdasarkan Happiness & Health
  let mouthPath = 'M 48 85 Q 60 95 72 85'; // Senyum standar
  if (health < 25) {
    mouthPath = 'M 48 88 Q 60 82 72 88'; // Murung sakit
  } else if (happiness >= 80) {
    mouthPath = 'M 46 82 Q 60 98 74 82 Z'; // Tawa lebar
  } else if (happiness < 40) {
    mouthPath = 'M 48 88 Q 60 80 72 88'; // Cemberut sedih
  }

  // Bentuk mata
  const eyeY = 58;
  const isBlinkingOrSleepy = health < 20;

  // Bentuk gaya rambut
  const hairStyle = appearance.hair % 4;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`rounded-2xl shadow-inner bg-slate-100 ${className}`}
      role="img"
      aria-label="Avatar Karakter"
    >
      {/* 1. Bayangan & Leher */}
      <rect x="50" y="85" width="20" height="25" rx="4" fill={skinColor} filter="brightness(0.9)" />

      {/* 2. Base Head Oval */}
      <ellipse cx="60" cy="62" rx="36" ry="42" fill={skinColor} stroke="#2C3E50" strokeWidth="2.5" />

      {/* 3. Telinga Kiri & Kanan */}
      <circle cx="23" cy="64" r="7" fill={skinColor} stroke="#2C3E50" strokeWidth="2" />
      <circle cx="97" cy="64" r="7" fill={skinColor} stroke="#2C3E50" strokeWidth="2" />

      {/* 4. Alis */}
      <line x1="42" y1="46" x2="54" y2="48" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="48" x2="78" y2="46" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />

      {/* 5. Mata */}
      {isBlinkingOrSleepy ? (
        <>
          <line x1="44" y1={eyeY} x2="52" y2={eyeY} stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="68" y1={eyeY} x2="76" y2={eyeY} stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="48" cy={eyeY} rx="4" ry="5" fill="#1A1A1A" />
          <circle cx="49" cy={eyeY - 2} r="1.5" fill="#FFFFFF" />
          <ellipse cx="72" cy={eyeY} rx="4" ry="5" fill="#1A1A1A" />
          <circle cx="73" cy={eyeY - 2} r="1.5" fill="#FFFFFF" />
        </>
      )}

      {/* 6. Hidung */}
      <path d="M 60 62 L 58 72 L 62 72" stroke="#2C3E50" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* 7. Mulut Dinamis */}
      <path d={mouthPath} fill={happiness >= 80 ? '#C0392B' : 'none'} stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />

      {/* 8. Rona Pipi Bayi / Anak Kecil */}
      {age < 12 && (
        <>
          <ellipse cx="38" cy="70" rx="5" ry="3" fill="#E74C3C" opacity="0.3" />
          <ellipse cx="82" cy="70" rx="5" ry="3" fill="#E74C3C" opacity="0.3" />
        </>
      )}

      {/* 9. Rambut (Hair Overlay) */}
      {hairStyle === 0 && (
        // Short crop
        <path d="M 28 50 Q 60 18 92 50 Q 86 30 60 26 Q 34 30 28 50 Z" fill={hairColor} />
      )}
      {hairStyle === 1 && (
        // Side parted
        <path d="M 25 55 Q 35 20 70 22 Q 95 24 95 52 Q 80 28 60 30 Q 30 32 25 55 Z" fill={hairColor} />
      )}
      {hairStyle === 2 && (
        // Medium wavy
        <path d="M 23 58 Q 28 20 60 20 Q 92 20 97 58 Q 94 38 60 32 Q 26 38 23 58 Z" fill={hairColor} />
      )}
      {hairStyle === 3 && (
        // Top messy bun / spike
        <path d="M 28 52 Q 40 14 60 16 Q 80 14 92 52 Q 75 22 60 24 Q 45 22 28 52 Z" fill={hairColor} />
      )}
    </svg>
  );
};
