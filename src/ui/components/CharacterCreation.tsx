/**
 * Komponen Layar Pembuatan Karakter Baru (CharacterCreation) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S2, S3, S5.
 * Mengumpulkan nama, jenis kelamin, negara asal, dan pemilihan slot simpanan.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import React, { useState } from 'react';
import { Gender } from '../../contracts/gameState';
import { CreateCharacterInput } from '../../core/CharacterInitializer';
import { User, Sparkles, ArrowLeft, Dices } from 'lucide-react';
import { GAME_CONFIG } from '../../contracts/gameConfig';

export interface CharacterCreationProps {
  readonly onCancel: () => void;
  readonly onSubmit: (input: CreateCharacterInput, slotId: number) => void;
}

const NAME_SUGGESTIONS_MALE = [
  'Budi Pratama',
  'Reza Adityo',
  'Dimas Setiawan',
  'Rian Kurniawan',
  'Farhan Pratama',
] as const;

const NAME_SUGGESTIONS_FEMALE = [
  'Siti Rahma',
  'Ayu Lestari',
  'Nadia Putri',
  'Dewi Anggraini',
  'Zahra Amalia',
] as const;

export const CharacterCreation: React.FC<CharacterCreationProps> = ({
  onCancel,
  onSubmit,
}) => {
  const [name, setName] = useState('Budi Pratama');
  const [gender, setGender] = useState<Gender>('Pria');
  const [country] = useState('Indonesia');
  const [slotId, setSlotId] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleRandomizeName = () => {
    const list = gender === 'Pria' ? NAME_SUGGESTIONS_MALE : NAME_SUGGESTIONS_FEMALE;
    const picked = list[Math.floor(Math.random() * list.length)] ?? 'Karakter';
    setName(picked);
    setError(null);
  };

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    const list = newGender === 'Pria' ? NAME_SUGGESTIONS_MALE : NAME_SUGGESTIONS_FEMALE;
    setName(list[0] ?? 'Karakter');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Nama karakter minimal 2 karakter.');
      return;
    }
    if (trimmed.length > 25) {
      setError('Nama karakter maksimal 25 karakter.');
      return;
    }

    onSubmit(
      {
        name: trimmed,
        gender,
        country,
        birthYear: 2008,
      },
      slotId
    );
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50 p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Karakter Baru
        </span>
      </div>

      {/* Form Area */}
      <div className="my-auto space-y-6 py-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
            <User className="w-8 h-8" />
          </div>
          <h2 className="mt-3 text-2xl font-black text-slate-900 tracking-tight">
            Mulai Kehidupan Baru
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tentukan identitas dan takdir awal karaktermu di Indonesia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
          {/* Input Nama Karakter */}
          <div>
            <label htmlFor="char-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nama Lengkap Karakter
            </label>
            <div className="relative flex items-center">
              <input
                id="char-name"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setError(null);
                }}
                maxLength={25}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Masukkan nama..."
                required
              />
              <button
                type="button"
                onClick={handleRandomizeName}
                title="Acak Nama"
                className="absolute right-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <Dices className="w-4 h-4" />
              </button>
            </div>
            {error && <p className="text-xs font-semibold text-red-600 mt-1">{error}</p>}
          </div>

          {/* Jenis Kelamin */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Jenis Kelamin
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['Pria', 'Wanita'] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderChange(g)}
                  className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                    gender === g
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Pilihan Slot Simpanan */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Simpan ke Slot
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSlotId(slot)}
                  className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                    slotId === slot
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Slot {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3.5 px-4 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Dilahirkan ke Dunia (Usia {GAME_CONFIG.CFG_AGE_MIN})</span>
            </button>
          </div>
        </form>
      </div>

      <div className="text-center text-[11px] text-slate-400 pb-2">
        Karakter akan lahir di Indonesia dan memulai masa kanak-kanak.
      </div>
    </div>
  );
};
