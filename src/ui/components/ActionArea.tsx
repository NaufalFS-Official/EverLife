/**
 * Komponen Tombol Aksi Tambah Umur (ActionArea) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S4, S7.
 * Dilengkapi pengaman debounce CFG_INPUT_DEBOUNCE_MS (200 ms) untuk mencegah multi-trigger.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React, { useState, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import { GAME_CONFIG } from '../../contracts/gameConfig';

export interface ActionAreaProps {
  readonly currentAge: number;
  readonly maxAge: number;
  readonly disabled?: boolean;
  readonly onAgeUp: () => void;
}

export const ActionArea: React.FC<ActionAreaProps> = ({
  currentAge,
  maxAge,
  disabled = false,
  onAgeUp,
}) => {
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);

  const handlePress = () => {
    if (disabled || isDebouncing) return;

    setIsDebouncing(true);
    onAgeUp();

    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      setIsDebouncing(false);
      debounceTimerRef.current = null;
    }, GAME_CONFIG.CFG_INPUT_DEBOUNCE_MS);
  };

  const isMaxAge = currentAge >= maxAge;
  const buttonText = isMaxAge ? 'Tamat Masa SMA' : 'Tambah Umur (+1 Tahun)';

  return (
    <div className="sticky bottom-14 z-20 bg-gradient-to-t from-white via-white/90 to-transparent p-3 pt-2">
      <button
        type="button"
        onClick={handlePress}
        disabled={disabled || isDebouncing || isMaxAge}
        className={`w-full flex items-center justify-center space-x-2 rounded-xl py-3.5 px-4 font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
          disabled || isDebouncing || isMaxAge
            ? 'bg-slate-300 cursor-not-allowed shadow-none'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-500/25 ring-2 ring-blue-500/20'
        }`}
        aria-label={buttonText}
      >
        <PlusCircle className="w-5 h-5" />
        <span className="text-base tracking-wide">{buttonText}</span>
      </button>
    </div>
  );
};
