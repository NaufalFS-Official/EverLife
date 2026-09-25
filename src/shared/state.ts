/**
 * GAME STATE & STATE MACHINE GUARD CONTRACT (EverLife)
 * Menentukan antarmuka state global serta tabel guard transisi sebagai DATA yang dapat diuji otomatis.
 */

export type GameScreenState =
  | 'MAIN_MENU'
  | 'CHARACTER_CREATION'
  | 'GAMEPLAY_ACTIVE'
  | 'SCENARIO_POPUP'
  | 'SUBMENU_OPEN'
  | 'DEATH_SUMMARY';

export type Gender = 'Male' | 'Female' | 'Non-Binary';
export type SpecialTalent = 'None' | 'Music' | 'Sports' | 'Crime' | 'Acting';
export type EducationLevel = 'None' | 'Primary' | 'Secondary' | 'University';
export type Sexuality = 'Straight' | 'Bisexual' | 'Gay';
export type NPCRole = 'Father' | 'Mother' | 'Sibling' | 'Friend' | 'Partner' | 'Pet';

export interface CharacterAttributes {
  happiness: number;  // 0 - 100
  health: number;     // 0 - 100
  smarts: number;     // 0 - 100
  looks: number;      // 0 - 100
  karma: number;      // 0 - 100
  discipline: number; // 0 - 100
  fertility: number;  // 0 - 100
  sexuality: Sexuality;
}

export interface CharacterAppearance {
  skin: number;      // 0 - 5
  eyes: number;      // 0 - 5
  brows: number;     // 0 - 4
  hair: number;      // 0 - 7
  hairColor: number; // 0 - 7
}

export interface NPC {
  id: string;
  name: string;
  role: NPCRole;
  age: number;
  relationshipBar: number; // 0 - 100
  alive: boolean;
}

export interface LogEntry {
  age: number;
  text: string;
  categoryTag: string;
  iconKey: string;
}

export interface ChoiceOutcome {
  text: string;
  statDeltas: Partial<CharacterAttributes>;
  logText: string;
  karmaDelta?: number;
}

export interface ScenarioEvent {
  id: string;
  category: 'Childhood' | 'School' | 'Career' | 'Crime' | 'Health' | 'Drama';
  minAge: number;
  maxAge: number;
  title: string;
  description: string;
  choices: ChoiceOutcome[];
}

export interface GlobalGameState {
  runId: string;
  seed: number;
  currentScreen: GameScreenState;
  activeModal: ScenarioEvent | null;
  character: {
    name: { first: string; last: string };
    gender: Gender;
    age: number;
    birthLocation: { country: string; city: string };
    specialTalent: SpecialTalent;
    appearance: CharacterAppearance;
    attributes: CharacterAttributes;
    finances: {
      bankBalance: number;
      netWorth: number;
      annualSalary: number;
      livingExpenses: number;
    };
    education: { level: EducationLevel; grades: number };
    job: { id: string; title: string; salary: number; performance: number } | null;
    relationships: NPC[];
    lifeLog: LogEntry[];
  };
}

/**
 * Spesifikasi Guard Transisi State sebagai DATA untuk verifikasi otomatis.
 */
export interface StateTransitionGuard {
  from: GameScreenState;
  to: GameScreenState;
  allowed: boolean;
  guardName: string;
  rejectionReason?: string;
  isInterrupt?: boolean;
}

export const STATE_GUARD_TABLE: readonly StateTransitionGuard[] = [
  {
    from: 'MAIN_MENU',
    to: 'CHARACTER_CREATION',
    allowed: true,
    guardName: 'START_CREATION',
  },
  {
    from: 'CHARACTER_CREATION',
    to: 'GAMEPLAY_ACTIVE',
    allowed: true,
    guardName: 'CONFIRM_CHARACTER',
  },
  {
    from: 'GAMEPLAY_ACTIVE',
    to: 'SCENARIO_POPUP',
    allowed: true,
    guardName: 'TRIGGER_SCENARIO',
  },
  {
    from: 'SCENARIO_POPUP',
    to: 'GAMEPLAY_ACTIVE',
    allowed: false,
    guardName: 'PROHIBIT_UNRESOLVED_MODAL_DISMISSAL',
    rejectionReason: 'Dilarang menutup popup wajib sebelum memilih salah satu opsi resolusi',
  },
  {
    from: 'GAMEPLAY_ACTIVE',
    to: 'SUBMENU_OPEN',
    allowed: true,
    guardName: 'OPEN_DRAWER',
  },
  {
    from: 'SUBMENU_OPEN',
    to: 'GAMEPLAY_ACTIVE',
    allowed: true,
    guardName: 'CLOSE_DRAWER',
  },
  {
    from: 'GAMEPLAY_ACTIVE',
    to: 'DEATH_SUMMARY',
    allowed: true,
    guardName: 'FATAL_MORTALITY_INTERRUPT',
    isInterrupt: true,
  },
  {
    from: 'SCENARIO_POPUP',
    to: 'DEATH_SUMMARY',
    allowed: true,
    guardName: 'SCENARIO_FATAL_INTERRUPT',
    isInterrupt: true,
  },
  {
    from: 'SUBMENU_OPEN',
    to: 'DEATH_SUMMARY',
    allowed: true,
    guardName: 'SUBMENU_FATAL_INTERRUPT',
    isInterrupt: true,
  },
  {
    from: 'DEATH_SUMMARY',
    to: 'GAMEPLAY_ACTIVE',
    allowed: false,
    guardName: 'PROHIBIT_REVIVE_AFTER_DEATH',
    rejectionReason: 'Permadeath murni: Karakter yang telah meninggal tidak dapat kembali ke gameplay aktif',
  },
  {
    from: 'DEATH_SUMMARY',
    to: 'MAIN_MENU',
    allowed: true,
    guardName: 'RESTART_AFTER_DEATH',
  },
] as const;

/**
 * Mengevaluasi apakah transisi dari suatu state ke state lain diizinkan oleh guard table.
 */
export function evaluateTransition(
  from: GameScreenState,
  to: GameScreenState
): { allowed: boolean; reason?: string } {
  const matchingGuard = STATE_GUARD_TABLE.find(g => g.from === from && g.to === to);
  if (!matchingGuard) {
    return {
      allowed: false,
      reason: `Transisi dari ${from} ke ${to} tidak terdaftar dalam matriks transisi`,
    };
  }
  return {
    allowed: matchingGuard.allowed,
    reason: matchingGuard.rejectionReason,
  };
}
