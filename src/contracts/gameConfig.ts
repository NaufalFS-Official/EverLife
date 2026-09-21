/**
 * Konfigurasi Utama & Konstanta Penyeimbang EverLife (v1.0-SMA).
 * Sumber data: Game Blueprint Bagian S7.
 * Semua nilai memiliki satuan eksplisit dan komentar rentang aman.
 */

export const GAME_CONFIG = {
  // ==========================================
  // 1. KINERJA, VIEWPORT & ANIMASI
  // ==========================================
  /** Target frame rate per detik. Rentang aman: 30 - 120 FPS. */
  CFG_FPS_TARGET: 60,
  /** Lebar acuan viewport layar dalam point. Rentang aman: 320 - 430 pt. */
  CFG_VIEWPORT_WIDTH_PT: 390,
  /** Tinggi acuan viewport layar dalam point. Rentang aman: 640 - 932 pt. */
  CFG_VIEWPORT_HEIGHT_PT: 844,
  /** Inset area aman atas (notch/status bar) dalam point. Rentang aman: 0 - 60 pt. */
  CFG_SAFE_AREA_TOP_PT: 47,
  /** Inset area aman bawah (home indicator) dalam point. Rentang aman: 0 - 40 pt. */
  CFG_SAFE_AREA_BOTTOM_PT: 34,
  /** Pembatas lonjakan delta time animasi UI dalam milidetik. Rentang aman: 16.6 - 50.0 ms. */
  CFG_ANIM_DELTA_CLAMP_MS: 33.33,
  /** Filter debounce sentuhan tombol aksi dalam milidetik. Rentang aman: 100 - 350 ms. */
  CFG_INPUT_DEBOUNCE_MS: 200,

  // ==========================================
  // 2. POLISH & GAME FEEL
  // ==========================================
  /** Durasi animasi interpolasi bar statistik dalam milidetik. Rentang aman: 150 - 500 ms. */
  CFG_TWEEN_BAR_DURATION_MS: 300,
  /** Durasi kedip warna perubahan statistik (+/-) dalam milidetik. Rentang aman: 100 - 400 ms. */
  CFG_COLOR_FLASH_MS: 200,

  // ==========================================
  // 3. WAKTU AKSI 4-FASE (Milidetik)
  // ==========================================
  /** Windup sentuhan tombol pilihan event (ms). Rentang aman: 0 - 50 ms. */
  CFG_TIME_EVENT_TAP_WINDUP: 0,
  /** Waktu aktif pemicuan event callback (ms). Rentang aman: 30 - 100 ms. */
  CFG_TIME_EVENT_TAP_ACTIVE: 50,
  /** Waktu pemulihan penutupan modal dialog (ms). Rentang aman: 100 - 250 ms. */
  CFG_TIME_EVENT_TAP_RECOVERY: 150,
  /** Cooldown input setelah memilih opsi event (ms). Rentang aman: 50 - 200 ms. */
  CFG_TIME_EVENT_TAP_COOLDOWN: 100,

  /** Jeda windup tombol Tambah Umur (ms). Rentang aman: 0 - 100 ms. */
  CFG_TIME_AGE_UP_WINDUP: 50,
  /** Waktu proses pergantian tahun dan generator event (ms). Rentang aman: 100 - 350 ms. */
  CFG_TIME_AGE_UP_ACTIVE: 200,
  /** Waktu pembaruan linimasa dan status bar (ms). Rentang aman: 50 - 200 ms. */
  CFG_TIME_AGE_UP_RECOVERY: 100,
  /** Jeda pengaman antar pergantian tahun (ms). Rentang aman: 150 - 500 ms. */
  CFG_TIME_AGE_UP_COOLDOWN: 300,

  /** Windup tombol menu aktivitas tahunan (ms). Rentang aman: 0 - 50 ms. */
  CFG_TIME_ACTION_TAP_WINDUP: 0,
  /** Waktu eksekusi efek aktivitas terpilih (ms). Rentang aman: 30 - 100 ms. */
  CFG_TIME_ACTION_TAP_ACTIVE: 50,
  /** Waktu penutupan modal aktivitas (ms). Rentang aman: 50 - 200 ms. */
  CFG_TIME_ACTION_TAP_RECOVERY: 100,
  /** Cooldown input menu aktivitas (ms). Rentang aman: 50 - 200 ms. */
  CFG_TIME_ACTION_TAP_COOLDOWN: 100,

  /** Windup interaksi kontak relasi sosial (ms). Rentang aman: 0 - 50 ms. */
  CFG_TIME_SOCIAL_TAP_WINDUP: 0,
  /** Waktu kalkulasi relasi sosial (ms). Rentang aman: 30 - 100 ms. */
  CFG_TIME_SOCIAL_TAP_ACTIVE: 50,
  /** Waktu penutupan dialog interaksi sosial (ms). Rentang aman: 100 - 250 ms. */
  CFG_TIME_SOCIAL_TAP_RECOVERY: 150,
  /** Cooldown tombol interaksi sosial (ms). Rentang aman: 100 - 300 ms. */
  CFG_TIME_SOCIAL_TAP_COOLDOWN: 200,

  /** Windup sentuhan tab navigasi bawah (ms). Rentang aman: 0 - 30 ms. */
  CFG_TIME_NAV_TAP_WINDUP: 0,
  /** Waktu aktif pergantian view tab (ms). Rentang aman: 20 - 60 ms. */
  CFG_TIME_NAV_TAP_ACTIVE: 30,
  /** Transisi geser tab antarmuka (ms). Rentang aman: 50 - 120 ms. */
  CFG_TIME_NAV_TAP_RECOVERY: 70,
  /** Cooldown perpindahan tab navigasi (ms). Rentang aman: 30 - 100 ms. */
  CFG_TIME_NAV_TAP_COOLDOWN: 50,

  /** Windup validasi form pembuatan karakter (ms). Rentang aman: 0 - 50 ms. */
  CFG_TIME_CHAR_GEN_WINDUP: 0,
  /** Waktu inisialisasi seed dan profil karakter (ms). Rentang aman: 50 - 200 ms. */
  CFG_TIME_CHAR_GEN_ACTIVE: 100,
  /** Waktu transisi layar masuk ke gameplay (ms). Rentang aman: 100 - 350 ms. */
  CFG_TIME_CHAR_GEN_RECOVERY: 200,
  /** Cooldown jeda aman gameplay perdana (ms). Rentang aman: 150 - 500 ms. */
  CFG_TIME_CHAR_GEN_COOLDOWN: 300,

  /** Persiapan serialisasi JSON berkas simpanan (ms). Rentang aman: 0 - 50 ms. */
  CFG_TIME_SAVE_IO_WINDUP: 0,
  /** Waktu penulisan atomik data ke storage (ms). Rentang aman: 50 - 300 ms. */
  CFG_TIME_SAVE_IO_ACTIVE: 100,
  /** Waktu pemulihan penutupan modal kelola save (ms). Rentang aman: 50 - 200 ms. */
  CFG_TIME_SAVE_IO_RECOVERY: 100,
  /** Cooldown operasi I/O file penyimpanan (ms). Rentang aman: 100 - 400 ms. */
  CFG_TIME_SAVE_IO_COOLDOWN: 200,

  // ==========================================
  // 4. BATAS USIA & JENJANG PENDIDIKAN
  // ==========================================
  /** Usia awal karakter dilahirkan dalam tahun. Rentang aman: 0 tahun. */
  CFG_AGE_MIN: 0,
  /** Batas usia kelulusan tamat SMA versi 1.0 dalam tahun. Rentang aman: 18 tahun. */
  CFG_AGE_MAX_V1: 18,
  /** Usia masuk Sekolah Dasar (SD) dalam tahun. Rentang aman: 6 - 7 tahun. */
  CFG_AGE_PRIMARY_SCHOOL: 6,
  /** Usia masuk Sekolah Menengah Pertama (SMP) dalam tahun. Rentang aman: 12 - 13 tahun. */
  CFG_AGE_MIDDLE_SCHOOL: 12,
  /** Usia masuk Sekolah Menengah Atas (SMA) dalam tahun. Rentang aman: 15 - 16 tahun. */
  CFG_AGE_HIGH_SCHOOL: 15,
  /** Usia minimal membuka kerja paruh waktu dalam tahun. Rentang aman: 14 - 16 tahun. */
  CFG_AGE_PART_TIME_UNLOCK: 15,

  // ==========================================
  // 5. PARAMETER STATISTIK & PENYEIMBANG
  // ==========================================
  /** Batas mutlak terendah semua parameter statistik (poin). Rentang aman: 0 poin. */
  CFG_STAT_MIN: 0,
  /** Batas mutlak tertinggi semua parameter statistik (poin). Rentang aman: 100 poin. */
  CFG_STAT_MAX: 100,
  /** Modal awal kesehatan karakter saat lahir (poin). Rentang aman: 70 - 100 poin. */
  CFG_STAT_INITIAL_HEALTH: 90,
  /** Modal awal kebahagiaan karakter saat lahir (poin). Rentang aman: 60 - 100 poin. */
  CFG_STAT_INITIAL_HAPPINESS: 85,
  /** Modal awal keharmonisan keluarga saat lahir (poin). Rentang aman: 50 - 100 poin. */
  CFG_STAT_INITIAL_RELATION: 80,
  /** Potensi akademik awal karakter (poin). Rentang aman: 30 - 70 poin. */
  CFG_STAT_INITIAL_ACADEMIC: 50,
  /** Penurunan alami relasi tahunan jika tidak berinteraksi (poin). Rentang aman: 1 - 6 poin. */
  CFG_RELATION_DECAY_ANNUAL: 3,
  /** Penalti kebahagiaan jika kesehatan < 20% (poin). Rentang aman: 2 - 10 poin. */
  CFG_HEALTH_PENALTY_DEPLETION: 5,

  // ==========================================
  // 6. EKONOMI SAKU & PEKERJAAN
  // ==========================================
  /** Uang saku tahunan rata-rata saat SD dalam IDR. Rentang aman: 5000 - 50000 IDR. */
  CFG_ALLOWANCE_BASE_SD: 20000,
  /** Uang saku tahunan rata-rata saat SMP dalam IDR. Rentang aman: 20000 - 150000 IDR. */
  CFG_ALLOWANCE_BASE_SMP: 60000,
  /** Uang saku tahunan rata-rata saat SMA dalam IDR. Rentang aman: 50000 - 400000 IDR. */
  CFG_ALLOWANCE_BASE_SMA: 150000,

  // ==========================================
  // 7. SISTEM EVENT & PERSISTENSI
  // ==========================================
  /** Kuota minimal kartu dilema kejadian v1.0. Rentang aman: 40 - 100 unit. */
  CFG_EVENT_POOL_SIZE_V1: 50,
  /** Jumlah slot simpanan lokal mandiri. Rentang aman: 1 - 5 slot. */
  CFG_SAVE_SLOT_COUNT: 3,
  /** Status auto-save aktif otomatis tiap pertambahan umur (+1 tahun). */
  CFG_AUTO_SAVE_ENABLED: true,
  /** Audio bawaan nonaktif saat pertama kali aplikasi dibuka. */
  CFG_AUDIO_DEFAULT_MUTED: true,
} as const;

export type GameConfig = typeof GAME_CONFIG;
export type GameConfigKey = keyof GameConfig;

/**
 * Mengonversi durasi waktu dalam milidetik menjadi jumlah frame berdasarkan FPS target.
 * Memenuhi Aturan: "Konversi ms->frame dari FPS target dilakukan fungsi bertipe, bukan angka mentah."
 */
export function msToFrames(ms: number, fps: number = GAME_CONFIG.CFG_FPS_TARGET): number {
  if (ms <= 0) return 0;
  return Math.round((ms / 1000) * fps);
}

/**
 * Mengonversi jumlah frame menjadi durasi milidetik berdasarkan FPS target.
 */
export function framesToMs(frames: number, fps: number = GAME_CONFIG.CFG_FPS_TARGET): number {
  if (frames <= 0) return 0;
  return Math.round((frames / fps) * 1000);
}
