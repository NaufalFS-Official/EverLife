/**
 * CHARACTER CREATION SCENE (EverLife)
 * F-001 & F-012: Wizard pembuatan karakter baru, kustomisasi fisik, dan sandbox slider 0-100%.
 */

import React, { useState } from 'react';
import { useGame } from '../engine/GameContext';
import { AvatarComposer } from '../engine/avatarComposer';
import { Gender, SpecialTalent, CharacterAppearance, CharacterAttributes } from '../core/types';
import { Dices, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { audio } from '../engine/audioManager';

const CITIES = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bali', 'Tokyo', 'London', 'New York'];
const TALENTS: SpecialTalent[] = ['None', 'Music', 'Sports', 'Crime', 'Acting'];

export const CreationScene: React.FC = () => {
  const { startNewLife, transitionTo } = useGame();

  const [firstName, setFirstName] = useState('Archie');
  const [lastName, setLastName] = useState('King');
  const [gender, setGender] = useState<Gender>('Male');
  const [city, setCity] = useState('Jakarta');
  const [specialTalent, setSpecialTalent] = useState<SpecialTalent>('None');

  const [appearance, setAppearance] = useState<CharacterAppearance>({
    skin: 1,
    eyes: 1,
    brows: 1,
    hair: 1,
    hairColor: 0,
  });

  const [stats, setStats] = useState<Partial<CharacterAttributes>>({
    happiness: 85,
    health: 90,
    smarts: 75,
    looks: 70,
  });

  const [errorShake, setErrorShake] = useState(false);

  const handleRandomize = () => {
    audio.play('ui_click');
    const firstNames = ['Archie', 'Leo', 'Budi', 'David', 'Emma', 'Siti', 'Diana', 'Maya', 'Kenji', 'Oliver'];
    const lastNames = ['King', 'Santoso', 'Wijaya', 'Smith', 'Tanaka', 'Miller', 'Pratama', 'Hadi'];

    setFirstName(firstNames[Math.floor(Math.random() * firstNames.length)] ?? 'Archie');
    setLastName(lastNames[Math.floor(Math.random() * lastNames.length)] ?? 'King');
    setGender(Math.random() > 0.5 ? 'Male' : 'Female');
    setCity(CITIES[Math.floor(Math.random() * CITIES.length)] ?? 'Jakarta');
    setSpecialTalent(TALENTS[Math.floor(Math.random() * TALENTS.length)] ?? 'None');

    setAppearance({
      skin: Math.floor(Math.random() * 6),
      eyes: Math.floor(Math.random() * 6),
      brows: Math.floor(Math.random() * 5),
      hair: Math.floor(Math.random() * 4),
      hairColor: Math.floor(Math.random() * 8),
    });

    setStats({
      happiness: Math.floor(Math.random() * 40) + 60,
      health: Math.floor(Math.random() * 30) + 70,
      smarts: Math.floor(Math.random() * 60) + 40,
      looks: Math.floor(Math.random() * 60) + 40,
    });
  };

  const handleStart = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setErrorShake(true);
      audio.play('fail');
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    startNewLife({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      city,
      country: 'Indonesia',
      specialTalent,
      customAppearance: appearance,
      customStats: stats,
    });
  };

  return (
    <div className="flex flex-col flex-1 p-5 overflow-y-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={() => transitionTo('MAIN_MENU')}
          className="w-11 h-11 flex items-center justify-center -ml-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition cursor-pointer"
          aria-label="Kembali ke menu"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-slate-800 text-base">Karakter Baru</h2>
        <button
          onClick={handleRandomize}
          className="min-h-[44px] px-3 -mr-2 text-emerald-600 hover:text-emerald-700 rounded-full hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
          title="Surprise Me! (Acak)"
        >
          <Dices size={18} /> Acak
        </button>
      </div>

      {/* Avatar Visualizer & Name Display */}
      <div className="flex flex-col items-center py-4">
        <AvatarComposer
          appearance={appearance}
          age={0}
          happiness={stats.happiness}
          health={stats.health}
          size={110}
        />
        <div className="mt-2 text-center">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-600">
            {gender} • {city}
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            {firstName || '—'} {lastName || '—'}
          </h3>
        </div>
      </div>

      {/* Form Inputs */}
      <div className={`space-y-4 ${errorShake ? 'animate-shake' : ''}`}>
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Depan</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nama Depan"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Belakang</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nama Belakang"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Gender Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Kelamin</label>
          <div className="grid grid-cols-3 gap-2">
            {(['Male', 'Female', 'Non-Binary'] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`min-h-[44px] py-2 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center ${
                  gender === g
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* City and Talent */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kota Kelahiran</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Bakat Khusus</label>
            <select
              value={specialTalent}
              onChange={(e) => setSpecialTalent(e.target.value as SpecialTalent)}
              className="w-full min-h-[44px] px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {TALENTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sandbox Attribute Sliders (0-100%) */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-500" /> Atribut Awal (Sandbox)
            </span>
            <span className="text-[10px] text-slate-600 font-semibold">0 - 100% Bebas</span>
          </div>

          {[
            { label: 'Happiness', key: 'happiness', color: 'accent-emerald-500' },
            { label: 'Health', key: 'health', color: 'accent-rose-500' },
            { label: 'Smarts', key: 'smarts', color: 'accent-blue-500' },
            { label: 'Looks', key: 'looks', color: 'accent-amber-500' },
          ].map((item) => (
            <div key={item.key} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">{item.label}</span>
                <span className="text-slate-800">{stats[item.key as keyof CharacterAttributes] ?? 50}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={stats[item.key as keyof CharacterAttributes] ?? 50}
                onChange={(e) =>
                  setStats({ ...stats, [item.key]: parseInt(e.target.value, 10) })
                }
                className={`w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer ${item.color}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-5 mt-auto">
        <button
          onClick={handleStart}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer text-base"
        >
          <Check size={20} /> Mulai Kehidupan {firstName}!
        </button>
      </div>
    </div>
  );
};
