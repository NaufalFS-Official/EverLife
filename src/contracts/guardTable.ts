/**
 * Tabel Guard Transisi Sah & Terlarang EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S3 (State Machine & Guard Matrix).
 * Memenuhi Aturan: "transisi sah/terlarang (Blueprint S3) sebagai DATA agar dapat diuji otomatis; nol any".
 */

import { AppScreenState } from './gameState';

export interface TransitionRule {
  readonly from: AppScreenState;
  readonly to: AppScreenState;
  readonly allowed: boolean;
  readonly errorCode?: string;
  readonly reason: string;
}

/**
 * Matriks seluruh transisi layar yang didefinisikan secara eksplisit sebagai DATA.
 */
export const SCREEN_TRANSITION_MATRIX: readonly TransitionRule[] = [
  // --- Transisi Sah ---
  {
    from: 'BOOT',
    to: 'MAIN_MENU',
    allowed: true,
    reason: 'Aplikasi selesai memuat konfigurasi dan siap di menu utama.',
  },
  {
    from: 'MAIN_MENU',
    to: 'CHARACTER_CREATION',
    allowed: true,
    reason: 'Pemain memilih untuk memulai kehidupan baru.',
  },
  {
    from: 'MAIN_MENU',
    to: 'GAMEPLAY_ACTIVE',
    allowed: true,
    reason: 'Pemain memuat sesi tersimpan dari slot lokal.',
  },
  {
    from: 'CHARACTER_CREATION',
    to: 'GAMEPLAY_ACTIVE',
    allowed: true,
    reason: 'Form karakter berhasil divalidasi dan sesi dimulai di usia 0.',
  },
  {
    from: 'CHARACTER_CREATION',
    to: 'MAIN_MENU',
    allowed: true,
    reason: 'Pemain membatalkan pembuatan karakter dan kembali ke menu utama.',
  },
  {
    from: 'GAMEPLAY_ACTIVE',
    to: 'EVENT_MODAL',
    allowed: true,
    reason: 'Generator memicu kartu dilema kejadian tahunan.',
  },
  {
    from: 'EVENT_MODAL',
    to: 'GAMEPLAY_ACTIVE',
    allowed: true,
    reason: 'Pemain menyelesaikan opsi dilema dan kembali ke dashboard.',
  },
  {
    from: 'GAMEPLAY_ACTIVE',
    to: 'GRADUATION_SCREEN',
    allowed: true,
    reason: 'Karakter berhasil menyelesaikan usia 18 tahun (tamat SMA).',
  },
  {
    from: 'GAMEPLAY_ACTIVE',
    to: 'GAME_OVER_DEATH',
    allowed: true,
    reason: 'Kesehatan karakter menyentuh batas minimum (CFG_STAT_MIN).',
  },
  {
    from: 'GRADUATION_SCREEN',
    to: 'MAIN_MENU',
    allowed: true,
    reason: 'Pemain mengakhiri tinjauan kelulusan dan kembali ke menu utama.',
  },
  {
    from: 'GAME_OVER_DEATH',
    to: 'MAIN_MENU',
    allowed: true,
    reason: 'Pemain menutup layar kematian dan kembali ke menu utama.',
  },

  // --- Transisi Terlarang (Explicit Negative Guard Data) ---
  {
    from: 'EVENT_MODAL',
    to: 'GRADUATION_SCREEN',
    allowed: false,
    errorCode: 'ERR_BLOCKED_BY_EVENT',
    reason: 'Wajib menyelesaikan dialog dilema sebelum transisi ke kelulusan.',
  },
  {
    from: 'EVENT_MODAL',
    to: 'CHARACTER_CREATION',
    allowed: false,
    errorCode: 'ERR_BLOCKED_BY_EVENT',
    reason: 'Tidak dapat membuka form karakter saat dialog peristiwa aktif.',
  },
  {
    from: 'GAMEPLAY_ACTIVE',
    to: 'CHARACTER_CREATION',
    allowed: false,
    errorCode: 'ERR_ACTIVE_SESSION_EXISTS',
    reason: 'Sesi hidup aktif harus disimpan atau dibuang secara eksplisit.',
  },
  {
    from: 'BOOT',
    to: 'GAMEPLAY_ACTIVE',
    allowed: false,
    errorCode: 'ERR_UNINITIALIZED_BOOT',
    reason: 'Tidak dapat melompat langsung ke gameplay dari boot tanpa memuat save.',
  },
  {
    from: 'GRADUATION_SCREEN',
    to: 'EVENT_MODAL',
    allowed: false,
    errorCode: 'ERR_SESSION_COMPLETED',
    reason: 'Kehidupan SMA telah usai; tidak ada event tahunan baru.',
  },
  {
    from: 'GAME_OVER_DEATH',
    to: 'GAMEPLAY_ACTIVE',
    allowed: false,
    errorCode: 'ERR_PLAYER_DECEASED',
    reason: 'Karakter telah meninggal dunia; giliran waktu tidak dapat dilanjutkan.',
  },
] as const;

/**
 * Aturan prioritas penanganan interupsi sistem sesuai Blueprint S3.4.
 * Angka lebih kecil = prioritas lebih tinggi.
 */
export const INTERRUPT_PRIORITIES = {
  FATAL_HEALTH_DEPLETED: 1, // Kematian / Darurat medis
  EVENT_MODAL: 2,           // Dilema narasi tahunan wajib
  ACTIVITY_MODAL: 3,        // Kegiatan santai / eksplorasi
  AUTO_SAVE_WORKER: 4,      // I/O Latar belakang
} as const;

export type InterruptType = keyof typeof INTERRUPT_PRIORITIES;

/**
 * Memvalidasi apakah transisi antar-layar diizinkan menurut matriks guard.
 */
export function validateScreenTransition(
  from: AppScreenState,
  to: AppScreenState
): { allowed: boolean; errorCode?: string; reason: string } {
  // Transisi ke state yang sama selalu dianggap valid (no-op)
  if (from === to) {
    return { allowed: true, reason: 'Transisi ke state yang sama diizinkan (idempotent).' };
  }

  const match = SCREEN_TRANSITION_MATRIX.find(rule => rule.from === from && rule.to === to);

  if (match) {
    return {
      allowed: match.allowed,
      errorCode: match.errorCode,
      reason: match.reason,
    };
  }

  // Secara default tolak setiap transisi yang tidak terdaftar di matriks
  return {
    allowed: false,
    errorCode: 'ERR_INVALID_TRANSITION',
    reason: `Transisi dari '${from}' ke '${to}' tidak terdefinisi dalam matriks guard sah.`,
  };
}

/**
 * Memvalidasi aksi Tambah Umur (+1) terhadap kondisi guard saat ini.
 */
export function validateAgeUpAction(params: {
  readonly currentScreen: AppScreenState;
  readonly currentAge: number;
  readonly maxAge: number;
  readonly health: number;
  readonly hasActiveEvent: boolean;
}): { allowed: boolean; errorCode?: string; reason?: string } {
  if (params.hasActiveEvent || params.currentScreen === 'EVENT_MODAL') {
    return {
      allowed: false,
      errorCode: 'ERR_ACTION_BLOCKED_BY_EVENT',
      reason: 'Tombol Tambah Umur terkunci: selesaikan event dilema terlebih dahulu.',
    };
  }

  if (params.health <= 0) {
    return {
      allowed: false,
      errorCode: 'ERR_PLAYER_DECEASED',
      reason: 'Kesehatan 0%: karakter tidak dapat menambah umur.',
    };
  }

  if (params.currentAge >= params.maxAge) {
    return {
      allowed: false,
      errorCode: 'ERR_MAX_AGE_REACHED',
      reason: `Karakter telah mencapai batas usia tamat SMA (${params.maxAge} tahun).`,
    };
  }

  return { allowed: true };
}
