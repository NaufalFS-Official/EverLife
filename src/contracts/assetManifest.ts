/**
 * Manifest Aset UI dan Audio Presets EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S6 dan M3.
 * Direktif D6: 100% strict type-safe, nol any.
 */

export interface IconAssetEntry {
  readonly id: string;
  readonly label: string;
  readonly lucideName: 'Heart' | 'Smile' | 'Users' | 'BookOpen' | 'Coins' | 'PlusCircle' | 'Settings';
  readonly tier: 'H';
  readonly fallbackText: string;
}

export const ICON_MANIFEST: readonly IconAssetEntry[] = [
  { id: 'icon-heart', label: 'Kesehatan', lucideName: 'Heart', tier: 'H', fallbackText: '♥' },
  { id: 'icon-smile', label: 'Kebahagiaan', lucideName: 'Smile', tier: 'H', fallbackText: ':)' },
  { id: 'icon-users', label: 'Relasi', lucideName: 'Users', tier: 'H', fallbackText: '[U]' },
  { id: 'icon-book', label: 'Akademik', lucideName: 'BookOpen', tier: 'H', fallbackText: '[B]' },
  { id: 'icon-coins', label: 'Uang Saku', lucideName: 'Coins', tier: 'H', fallbackText: '$' },
  { id: 'icon-calendar', label: 'Tambah Umur', lucideName: 'PlusCircle', tier: 'H', fallbackText: '[+]' },
  { id: 'icon-settings', label: 'Pengaturan', lucideName: 'Settings', tier: 'H', fallbackText: '[*]' },
] as const;

export type IconId = (typeof ICON_MANIFEST)[number]['id'];

export interface SynthAudioPreset {
  readonly id: string;
  readonly waveform: OscillatorType;
  readonly frequencies: readonly number[];
  readonly durationMs: number;
}

export const SYNTH_PRESETS = {
  tap: {
    id: 'synth-tap',
    waveform: 'sine',
    frequencies: [440],
    durationMs: 30,
  },
  alert: {
    id: 'synth-alert',
    waveform: 'sawtooth',
    frequencies: [150, 110],
    durationMs: 150,
  },
  success: {
    id: 'synth-success',
    waveform: 'sine',
    frequencies: [523, 659, 784],
    durationMs: 120,
  },
} as const satisfies Record<string, SynthAudioPreset>;

export type SynthPresetKey = keyof typeof SYNTH_PRESETS;
