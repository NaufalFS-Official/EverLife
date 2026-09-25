/**
 * ASSET MANIFEST CONTRACT (EverLife)
 * Daftar stabil kunci aset, kategori, spesifikasi, dan fallback placeholder sesuai S6.
 */

export type AssetCategory = '2D Vector' | 'UI Icon' | 'Audio SFX';
export type AssetTier = 'H' | 'P' | 'X';

export interface AssetDefinition {
  key: string;
  category: AssetCategory;
  format: 'SVG' | 'WAV' | 'WebM';
  dimensions?: { width: number; height: number };
  durationMs?: number;
  tier: AssetTier;
  fallbackPlaceholder: string;
  license: string;
}

export const ASSET_MANIFEST = {
  // Visual Vectors
  avatar_base_head: {
    key: 'avatar_base_head',
    category: '2D Vector',
    format: 'SVG',
    dimensions: { width: 120, height: 120 },
    tier: 'P',
    fallbackPlaceholder: 'Oval #F1C27D berlabel HEAD',
    license: 'Internal Procedural (MIT)',
  },
  avatar_hair_set: {
    key: 'avatar_hair_set',
    category: '2D Vector',
    format: 'SVG',
    dimensions: { width: 120, height: 120 },
    tier: 'P',
    fallbackPlaceholder: 'Poligon rambut berlabel HAIR',
    license: 'Internal Procedural (MIT)',
  },
  avatar_eyes_set: {
    key: 'avatar_eyes_set',
    category: '2D Vector',
    format: 'SVG',
    dimensions: { width: 40, height: 20 },
    tier: 'P',
    fallbackPlaceholder: '2 Titik hitam #000000',
    license: 'Internal Procedural (MIT)',
  },
  avatar_brows_set: {
    key: 'avatar_brows_set',
    category: '2D Vector',
    format: 'SVG',
    dimensions: { width: 40, height: 10 },
    tier: 'P',
    fallbackPlaceholder: 'Garis persegi #2C3E50',
    license: 'Internal Procedural (MIT)',
  },
  ui_icon_pack: {
    key: 'ui_icon_pack',
    category: 'UI Icon',
    format: 'SVG',
    dimensions: { width: 24, height: 24 },
    tier: 'H',
    fallbackPlaceholder: 'Box abu-abu teks inisial',
    license: 'Lucide-React (ISC/MIT)',
  },

  // Audio SFX
  sfx_ui_click: {
    key: 'sfx_ui_click',
    category: 'Audio SFX',
    format: 'WAV',
    durationMs: 40,
    tier: 'H',
    fallbackPlaceholder: 'Silent fallback',
    license: 'CC0 Kenney UI Audio',
  },
  sfx_age_tick: {
    key: 'sfx_age_tick',
    category: 'Audio SFX',
    format: 'WAV',
    durationMs: 120,
    tier: 'H',
    fallbackPlaceholder: 'Silent fallback',
    license: 'CC0 Kenney Audio',
  },
  sfx_birth: {
    key: 'sfx_birth',
    category: 'Audio SFX',
    format: 'WAV',
    durationMs: 800,
    tier: 'H',
    fallbackPlaceholder: 'Silent fallback',
    license: 'CC0 Freesound Baby Chime',
  },
  sfx_death: {
    key: 'sfx_death',
    category: 'Audio SFX',
    format: 'WAV',
    durationMs: 1500,
    tier: 'H',
    fallbackPlaceholder: 'Silent fallback',
    license: 'CC0 Freesound Melancholy Bell',
  },
  sfx_cash: {
    key: 'sfx_cash',
    category: 'Audio SFX',
    format: 'WAV',
    durationMs: 250,
    tier: 'H',
    fallbackPlaceholder: 'Silent fallback',
    license: 'CC0 Kenney Casino/Cash',
  },
  sfx_fail: {
    key: 'sfx_fail',
    category: 'Audio SFX',
    format: 'WAV',
    durationMs: 300,
    tier: 'H',
    fallbackPlaceholder: 'Silent fallback',
    license: 'CC0 Kenney Negative Tone',
  },
} as const satisfies Record<string, AssetDefinition>;

export type AssetKey = keyof typeof ASSET_MANIFEST;
