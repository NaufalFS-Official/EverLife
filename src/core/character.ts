/**
 * CHARACTER GENERATION & ATTRIBUTE MUTATION (EverLife)
 * Layer 1 Core: Pure logic, zero DOM, deterministic RNG.
 */

import { GAME_CONFIG, Mulberry32PRNG } from '../shared';
import {
  CharacterAttributes,
  CharacterAppearance,
  NPC,
  Gender,
  SpecialTalent,
  GlobalGameState,
} from './types';

/**
 * Memastikan nilai atribut selalu berada di dalam rentang aman [0, 100].
 * Mencegah eksploitasi angka negatif maupun integer overflow.
 */
export function clampStat(
  val: number,
  min: number = GAME_CONFIG.STAT_MIN_VALUE,
  max: number = GAME_CONFIG.STAT_MAX_VALUE
): number {
  if (Number.isNaN(val) || !Number.isFinite(val)) return min;
  return Math.max(min, Math.min(max, Math.round(val)));
}

/**
 * Menerapkan perubahan delta atribut secara atomik dan ter-clamp.
 */
export function applyStatDeltas(
  current: CharacterAttributes,
  deltas: Partial<CharacterAttributes>
): CharacterAttributes {
  return {
    happiness: clampStat(current.happiness + (deltas.happiness ?? 0)),
    health: clampStat(current.health + (deltas.health ?? 0)),
    smarts: clampStat(current.smarts + (deltas.smarts ?? 0)),
    looks: clampStat(current.looks + (deltas.looks ?? 0)),
    karma: clampStat(current.karma + (deltas.karma ?? 0)),
    discipline: clampStat(current.discipline + (deltas.discipline ?? 0)),
    fertility: clampStat(current.fertility + (deltas.fertility ?? 0)),
    sexuality: current.sexuality,
  };
}

export interface CharacterCreationParams {
  firstName: string;
  lastName: string;
  gender: Gender;
  country?: string;
  city?: string;
  specialTalent?: SpecialTalent;
  customStats?: Partial<CharacterAttributes>;
  customAppearance?: Partial<CharacterAppearance>;
  seed?: number;
}

/**
 * Menghasilkan keluarga awal (Ayah & Ibu) menggunakan PRNG deterministik.
 */
export function generateInitialFamily(rng: Mulberry32PRNG, lastName: string): NPC[] {
  const fatherAge = rng.nextInt(22, 38);
  const motherAge = rng.nextInt(20, 36);

  const maleFirstNames = ['Budi', 'David', 'James', 'Michael', 'Arthur', 'Leo', 'John'];
  const femaleFirstNames = ['Siti', 'Sarah', 'Emma', 'Diana', 'Grace', 'Anna', 'Maya'];

  const fatherName = `${maleFirstNames[rng.nextInt(0, maleFirstNames.length - 1)] ?? 'Budi'} ${lastName}`;
  const motherName = `${femaleFirstNames[rng.nextInt(0, femaleFirstNames.length - 1)] ?? 'Siti'} ${lastName}`;

  return [
    {
      id: 'npc_father',
      name: fatherName,
      role: 'Father',
      age: fatherAge,
      relationshipBar: rng.nextInt(75, 95),
      alive: true,
    },
    {
      id: 'npc_mother',
      name: motherName,
      role: 'Mother',
      age: motherAge,
      relationshipBar: rng.nextInt(80, 98),
      alive: true,
    },
  ];
}

export const MAX_NAME_LENGTH = 30;

/**
 * Sanitasi nama karakter: memotong ke MAX_NAME_LENGTH (30 char),
 * membersihkan tag HTML/skrip, dan menjamin string aman.
 */
export function sanitizeName(input: unknown, fallback: string = 'Karakter'): string {
  if (typeof input !== 'string') return fallback;
  // 1. Bersihkan seluruh tag HTML / XML (<script>, <img ...>, dll.)
  const stripped = input.replace(/<[^>]*>?/gm, '').trim();
  // 2. Potong panjang maksimal ke MAX_NAME_LENGTH
  const truncated = stripped.slice(0, MAX_NAME_LENGTH).trim();
  return truncated.length > 0 ? truncated : fallback;
}

/**
 * Membuat state karakter baru lengkap dengan jaminan sandbox dan log kelahiran.
 */
export function createNewLife(params: CharacterCreationParams): GlobalGameState {
  const seed = params.seed ?? 123456789;
  const rng = new Mulberry32PRNG(seed);

  if (
    typeof params.firstName !== 'string' ||
    typeof params.lastName !== 'string' ||
    params.firstName.trim().length === 0 ||
    params.lastName.trim().length === 0
  ) {
    throw new Error('Nama depan dan belakang tidak boleh kosong');
  }

  const firstName = sanitizeName(params.firstName, 'Fulan');
  const lastName = sanitizeName(params.lastName, 'Fulana');

  const initialAttributes: CharacterAttributes = {
    happiness: clampStat(params.customStats?.happiness ?? rng.nextInt(60, 95)),
    health: clampStat(params.customStats?.health ?? rng.nextInt(70, 100)),
    smarts: clampStat(params.customStats?.smarts ?? rng.nextInt(40, 90)),
    looks: clampStat(params.customStats?.looks ?? rng.nextInt(35, 85)),
    karma: clampStat(params.customStats?.karma ?? rng.nextInt(50, 75)),
    discipline: clampStat(params.customStats?.discipline ?? rng.nextInt(40, 80)),
    fertility: clampStat(params.customStats?.fertility ?? rng.nextInt(50, 90)),
    sexuality: 'Straight',
  };

  const initialAppearance: CharacterAppearance = {
    skin: params.customAppearance?.skin ?? rng.nextInt(0, 5),
    eyes: params.customAppearance?.eyes ?? rng.nextInt(0, 5),
    brows: params.customAppearance?.brows ?? rng.nextInt(0, 4),
    hair: params.customAppearance?.hair ?? rng.nextInt(0, 7),
    hairColor: params.customAppearance?.hairColor ?? rng.nextInt(0, 7),
  };

  const country = params.country ?? 'Indonesia';
  const city = params.city ?? 'Jakarta';
  const family = generateInitialFamily(rng, lastName);

  const birthLog = `Saya lahir di ${city}, ${country}. Ayah saya bernama ${family[0]?.name ?? 'Bapak'} dan Ibu saya bernama ${family[1]?.name ?? 'Ibu'}.`;

  return {
    runId: `run_${seed}`,
    seed,
    currentScreen: 'GAMEPLAY_ACTIVE',
    activeModal: null,
    character: {
      name: { first: firstName, last: lastName },
      gender: params.gender,
      age: 0,
      birthLocation: { country, city },
      specialTalent: params.specialTalent ?? 'None',
      appearance: initialAppearance,
      attributes: initialAttributes,
      finances: {
        bankBalance: 0,
        netWorth: 0,
        annualSalary: 0,
        livingExpenses: 0,
      },
      education: {
        level: 'None',
        grades: 80,
      },
      job: null,
      relationships: family,
      lifeLog: [
        {
          age: 0,
          text: birthLog,
          categoryTag: 'Birth',
          iconKey: 'icon_birth',
        },
      ],
      assets: [],
      prisonYears: 0,
    },
  };
}
