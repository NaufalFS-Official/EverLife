/**
 * Definisi Bentuk Data State Permainan EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S3, S5, S8.
 * Direktif D6: 100% strict type-safe, nol any.
 */

export type Gender = 'Pria' | 'Wanita';

export type EducationGrade = 'Balita' | 'SD' | 'SMP' | 'SMA' | 'Lulus SMA';

export type RelationRole = 'Ayah' | 'Ibu' | 'Saudara' | 'Teman' | 'Guru';

export type EventCategory = 'Keluarga' | 'Sekolah' | 'Kesehatan' | 'Dilema' | 'Acak';

/**
 * Profil identitas inti karakter pemain.
 */
export interface CharacterProfile {
  readonly name: string;
  readonly gender: Gender;
  readonly country: string;
  readonly birthYear: number;
  readonly age: number;
  readonly cash: number;
  readonly grade: EducationGrade;
}

/**
 * Parameter 4 statistik hidup inti karakter. Nilai selalu berada dalam rentang [0, 100].
 */
export interface CharacterStats {
  readonly health: number;
  readonly happiness: number;
  readonly relationship: number;
  readonly academic: number;
}

export type StatKey = keyof CharacterStats;

/**
 * Entitas karakter NPC yang memiliki ikatan sosial dengan pemain.
 */
export interface RelationNPC {
  readonly id: string;
  readonly name: string;
  readonly role: RelationRole;
  readonly relationshipScore: number;
  readonly isAlive: boolean;
}

/**
 * Catatan linimasa peristiwa riwayat hidup pemain.
 */
export interface TimelineLogEntry {
  readonly age: number;
  readonly title: string;
  readonly description: string;
  readonly category: EventCategory;
  readonly statDeltas?: Partial<Record<StatKey | 'cash', number>>;
}

/**
 * State layar tampilan global aplikasi sesuai State Machine S3.
 */
export type AppScreenState =
  | 'BOOT'
  | 'MAIN_MENU'
  | 'CHARACTER_CREATION'
  | 'GAMEPLAY_ACTIVE'
  | 'EVENT_MODAL'
  | 'GRADUATION_SCREEN'
  | 'GAME_OVER_DEATH';

/**
 * Tab navigasi aktif pada dashboard gameplay.
 */
export type ActiveTab = 'LIFE' | 'RELATIONS' | 'ACTIVITIES' | 'PROFILE';

/**
 * Seluruh data sesi hidup karakter yang sedang aktif di memori.
 */
export interface ActiveSession {
  readonly lifeSeed: number;
  readonly profile: CharacterProfile;
  readonly stats: CharacterStats;
  readonly relations: readonly RelationNPC[];
  readonly timelineHistory: readonly TimelineLogEntry[];
  readonly flags: readonly string[];
  readonly activeEventId: string | null;
  readonly isCompleted: boolean;
}

/**
 * Root state aplikasi EverLife pada sisi antarmuka dan sesi bermain.
 */
export interface EverLifeAppState {
  readonly screen: AppScreenState;
  readonly activeTab: ActiveTab;
  readonly activeSlotId: number | null;
  readonly session: ActiveSession | null;
}
