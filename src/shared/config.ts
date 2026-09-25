/**
 * GAME CONFIGURATION & FEEL SPEC CONTRACT (EverLife)
 * Sumber tunggal seluruh konstanta tunable, formula, dan timing game.
 * Seluruh konstanta memiliki satuan eksplisit dan rentang aman terdokumentasi.
 */

export const TARGET_FPS = 60 as const; // frames per second

/**
 * Konversi waktu milidetik ke frame berdasarkan target FPS game.
 * Fungsi bertipe aman untuk menghindari angka mentah di logika.
 */
export function msToFrames(ms: number, fps: number = TARGET_FPS): number {
  if (fps <= 0) throw new Error('FPS harus lebih besar dari 0');
  return Math.max(1, Math.round((ms / 1000) * fps));
}

export const GAME_CONFIG = {
  // Pacing & Teks
  /** Kecepatan cetak narasi log (0 = instan penuh per tahun). Rentang aman: 0 - 50 ms/chunk */
  FEEL_TEXT_SPEED_CPS: 0,

  // Struktur Graf Pohon Keputusan
  /** Jumlah pilihan minimum per dialog skenario. Rentang aman: 2 - 3 pilihan */
  FEEL_TREE_BRANCH_MIN: 2,
  /** Jumlah pilihan maksimum per dialog skenario. Rentang aman: 3 - 5 pilihan */
  FEEL_TREE_BRANCH_MAX: 4,

  // Persistensi & Randomness
  /** Pemicu auto-save instan. Rentang aman: enum ON_AGE_UP_AND_RESOLVE */
  FEEL_AUTOSAVE_TRIGGER: 'ON_AGE_UP_AND_RESOLVE',
  /** Latensi tombol Surprise Me! Rentang aman: 10 - 100 ms */
  FEEL_SURPRISE_ME_LATENCY_MS: 50,
  /** Ukuran bit integer PRNG deterministik. Rentang aman: 32 bit */
  FEEL_PRNG_SEED_BITS: 32,

  // Jaminan Solvabilitas & Mortalitas
  /** Jumlah pilihan bertahan hidup wajib non-fatal per modal skenario. Rentang aman: 1 - 2 pilihan */
  FEEL_MIN_SURVIVAL_CHOICES: 1,
  /** Konstanta dasar probabilitas kematian pasif. Rentang aman: 0.0005 - 0.005 rasio */
  FEEL_MORTALITY_BASE_RATE: 0.001,
  /** Eksponen laju penuaan mortalitas tahunan. Rentang aman: 0.030 - 0.060 eksponen */
  FEEL_MORTALITY_EXPONENT: 0.045,
  /** Usia mulai lonjakan skenario krisis dan penyakit. Rentang aman: 50 - 70 tahun */
  FEEL_CRISIS_START_AGE: 60,

  // Feel Spec Dekonstruksi Aksi (Timing & Latensi Input)
  /** Durasi respon tombol +Age ditekan hingga log bertambah. Rentang aman: 100 - 300 ms */
  FEEL_AGE_TAP_LATENCY_MS: 200,
  /** Durasi transisi pembukaan popup dialog skenario. Rentang aman: 80 - 250 ms */
  FEEL_DIALOG_POPUP_LATENCY_MS: 150,
  /** Durasi eksekusi pilihan dialog ke modal outcome. Rentang aman: 100 - 300 ms */
  FEEL_CHOICE_EXECUTION_LATENCY_MS: 180,
  /** Durasi animasi pembukaan drawer submenu tab. Rentang aman: 50 - 200 ms */
  FEEL_MENU_OPEN_LATENCY_MS: 100,
  /** Durasi transisi dari Start Life ke dashboard usia 0. Rentang aman: 150 - 400 ms */
  FEEL_CREATION_START_LATENCY_MS: 260,
  /** Interval throttle pembaruan slider atribut drag. Rentang aman: 10 - 33 ms */
  FEEL_SLIDER_DRAG_STEP_MS: 16.6,

  // Juice & Micro-Interactions
  /** Skala scale down tombol +Age saat ditekan. Rentang aman: 0.90 - 0.98 rasio */
  FEEL_BUTTON_BOUNCE_SCALE: 0.95,
  /** Durasi bounce kembali tombol +Age ke skala 1.0. Rentang aman: 50 - 200 ms */
  FEEL_BUTTON_BOUNCE_DURATION_MS: 100,
  /** Durasi denyut haptic getar mobile. Rentang aman: 10 - 40 ms */
  FEEL_HAPTIC_PULSE_MS: 20,
  /** Durasi micro screen shake kontainer saat krisis. Rentang aman: 80 - 250 ms */
  FEEL_SCREEN_SHAKE_DURATION_MS: 140,
  /** Simpangan getar layar horizontal/vertikal. Rentang aman: 1 - 5 px */
  FEEL_SCREEN_SHAKE_INTENSITY_PX: 2,
  /** Frekuensi getar getaran kontainer UI. Rentang aman: 15 - 40 Hz */
  FEEL_SCREEN_SHAKE_FREQUENCY_HZ: 25,
  /** Jarak vertikal naik teks delta mengapung. Rentang aman: 16 - 40 px */
  FEEL_FLOATING_TEXT_DISTANCE_PX: 24,
  /** Durasi pemudaran teks delta mengapung. Rentang aman: 350 - 800 ms */
  FEEL_FLOATING_TEXT_DURATION_MS: 550,
  /** Jumlah maksimum partikel confetti kelulusan/menang. Rentang aman: 20 - 60 partikel */
  FEEL_CONFETTI_MAX_COUNT: 35,
  /** Masa hidup partikel confetti sebelum lenyap. Rentang aman: 500 - 1200 ms */
  FEEL_CONFETTI_DURATION_MS: 750,
  /** Durasi kilatan merah tepi layar saat Health kritis. Rentang aman: 100 - 300 ms */
  FEEL_HEALTH_VIGNETTE_DURATION_MS: 180,
  /** Toleransi sinkronisasi trigger SFX pada frame awal. Rentang aman: 0 - 30 ms */
  FEEL_AUDIO_SYNC_MAX_DELAY_MS: 16,

  // Batasan Atribut & Ekonomi
  /** Nilai mutlak minimum seluruh stat atribut karakter (0%). Rentang aman: 0 */
  STAT_MIN_VALUE: 0,
  /** Nilai mutlak maksimum seluruh stat atribut karakter (100%). Rentang aman: 100 */
  STAT_MAX_VALUE: 100,
  /** Tarif default pajak tahunan pendapatan kotor. Rentang aman: 0.05 - 0.45 rasio */
  TAX_RATE_DEFAULT: 0.20,
  /** Biaya pemeliharaan tahunan aset mobil/properti (% nilai aset). Rentang aman: 0.01 - 0.05 rasio */
  ASSET_MAINTENANCE_RATE: 0.02,
  /** Biaya hidup tahunan dasar saat mandiri (dewasa). Rentang aman: 1000 - 10000 USD/tahun */
  LIVING_EXPENSE_BASE: 3600,
} as const;

export type GameConfig = typeof GAME_CONFIG;
