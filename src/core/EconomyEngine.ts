/**
 * Engine Ekonomi Saku & Aktivitas Tahunan EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S7.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import { StatKey } from '../contracts/gameState';
import { GAME_CONFIG } from '../contracts/gameConfig';
import { StatCalculator } from './StatCalculator';

export interface ActivityDefinition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly minAge: number;
  readonly cost: number;
  readonly income: number;
  readonly statDeltas: Partial<Record<StatKey, number>>;
}

export const ANNUAL_ACTIVITIES: readonly ActivityDefinition[] = [
  {
    id: 'act-study-self',
    title: 'Belajar Mandiri di Kamar',
    description: 'Membaca buku pelajaran dan merangkum materi sekolah.',
    minAge: 6,
    cost: 0,
    income: 0,
    statDeltas: { academic: 10, happiness: -2 },
  },
  {
    id: 'act-exercise',
    title: 'Olahraga & Senam Pagi',
    description: 'Lari pagi mengelilingi perumahan untuk menjaga stamina.',
    minAge: 6,
    cost: 0,
    income: 0,
    statDeltas: { health: 10, happiness: 5 },
  },
  {
    id: 'act-tutoring',
    title: 'Bimbingan Belajar / Les Privat',
    description: 'Mengikuti kelas intensif bimbel sore hari bersama guru ahli.',
    minAge: 10,
    cost: 30000,
    income: 0,
    statDeltas: { academic: 20, health: -5 },
  },
  {
    id: 'act-hangout',
    title: 'Nongkrong Bersama Kawan',
    description: 'Makan jajanan dan bercengkerama santai di warung kopi.',
    minAge: 12,
    cost: 15000,
    income: 0,
    statDeltas: { relationship: 15, happiness: 15 },
  },
  {
    id: 'act-part-time',
    title: 'Kerja Paruh Waktu (Barista Kafe)',
    description: 'Bekerja shift sore di kedai kopi untuk tabungan mandiri.',
    minAge: GAME_CONFIG.CFG_AGE_PART_TIME_UNLOCK,
    cost: 0,
    income: 50000,
    statDeltas: { health: -5, academic: -5, happiness: 5 },
  },
  {
    id: 'act-gym',
    title: 'Latihan Kebugaran di Gym',
    description: 'Melatih otot dan kardiovaskular dengan alat kebugaran modern.',
    minAge: 15,
    cost: 25000,
    income: 0,
    statDeltas: { health: 20, happiness: 10 },
  },
];

export class EconomyEngine {
  /**
   * Mengambil daftar aktivitas yang memenuhi syarat batas umur karakter.
   */
  public static getAvailableActivities(age: number): readonly ActivityDefinition[] {
    return ANNUAL_ACTIVITIES.filter(act => age >= act.minAge);
  }

  /**
   * Mengeksekusi aktivitas tahunan dan menghitung mutasi uang dan statistik.
   */
  public static executeActivity(params: {
    readonly activityId: string;
    readonly currentAge: number;
    readonly currentCash: number;
  }): {
    readonly success: boolean;
    readonly activity: ActivityDefinition;
    readonly cashDelta: number;
    readonly statDeltas: Partial<Record<StatKey, number>>;
    readonly message: string;
  } {
    const activity = ANNUAL_ACTIVITIES.find(a => a.id === params.activityId);
    if (!activity) {
      throw new Error(`ERR_ACTIVITY_NOT_FOUND: Aktivitas '${params.activityId}' tidak terdaftar.`);
    }

    if (params.currentAge < activity.minAge) {
      throw new Error(
        `ERR_ACTIVITY_LOCKED: Aktivitas '${activity.title}' baru terbuka pada usia ${activity.minAge} tahun.`
      );
    }

    if (activity.cost > 0 && params.currentCash < activity.cost) {
      return {
        success: false,
        activity,
        cashDelta: 0,
        statDeltas: {},
        message: `Saldo tidak mencukupi. Butuh Rp ${activity.cost.toLocaleString('id-ID')}, saldo saat ini Rp ${params.currentCash.toLocaleString('id-ID')}.`,
      };
    }

    const cashDelta = activity.income - activity.cost;
    return {
      success: true,
      activity,
      cashDelta,
      statDeltas: activity.statDeltas,
      message: `Berhasil menjalankan ${activity.title}.`,
    };
  }

  /**
   * Menghitung total pembagian uang saku tahunan dari orang tua.
   */
  public static processAnnualAllowance(age: number): number {
    return StatCalculator.resolveAnnualAllowance(age);
  }
}
