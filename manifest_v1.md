# ORCHESTRATION MANIFEST (manifest_v1.md)
**Game: EverLife (v1.0-SMA)**  
*Vibecoding Orchestration System v2.2 — Tahap 2*  
*Skala: Small | Mode: Mode A (Pure Client / Offline Penuh) | Target: PWA + Android Capacitor*

---

## M1. PROJECT CARD

| Parameter | Nilai Spesifikasi | Rujukan Blueprint |
| :--- | :--- | :--- |
| **Nama Proyek** | `everlife` (EverLife) | S1 [V] |
| **Genre Primer / Sub** | Life Simulation / Text-based Choice-driven RPG | S1 [V] |
| **Skala Proyek** | **Small** (Mode A — Pure Client, Offline-First, Rp0 Hosting) | S1, DEC-002 [I] |
| **Target Platform** | PWA Mobile-First (utama), Android APK (Capacitor sideload), Desktop PWA | S1, DEC-003 [I/REV] |
| **Viewport Standar** | 390 x 844 pt (Rasio 19.5:9 portrait), Safe Area Top 47pt / Bottom 34pt | S4, S7 [V] |
| **Engine / Stack** | Pure TypeScript Core (Headless Engine) + Vite + React 18 + Capacitor v6 | S1, DEC-003 [I/REV] |
| **Bahasa & Lokalisasi** | TypeScript (ES2022+), Teks Antarmuka: Bahasa Indonesia | S1 [V] |
| **Jalur Aset (Asset Pipeline)**| Campuran: **Tier H** (Ikon Lucide MIT) + **Tier P** (Avatar inisial prosedural, Web Audio API synth, Tailwind CSS). Tanpa gambar bitmap eksternal. | S6, DEC-008 [REV] |
| **Package Manager** | `npm` (Node.js $\ge 20.12.0$, npm $\ge 10.5.0$) | M1 [I] |
| **FPS Target** | `CFG_FPS_TARGET` = 60 FPS (Fixed UI frame rate) | S1, S7 [A] |

### Versi Toolchain & Dependensi Inti (Terkunci)
```json
{
  "engines": {
    "node": ">=20.12.0",
    "npm": ">=10.5.0"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "lucide-react": "0.441.0",
    "idb-keyval": "6.2.1",
    "canvas-confetti": "1.9.3",
    "@capacitor/core": "6.1.2",
    "@capacitor/android": "6.1.2"
  },
  "devDependencies": {
    "typescript": "5.5.4",
    "vite": "5.4.8",
    "vite-plugin-pwa": "0.20.5",
    "@vitejs/plugin-react": "4.3.1",
    "@capacitor/cli": "6.1.2",
    "tailwindcss": "3.4.10",
    "autoprefixer": "10.4.20",
    "postcss": "8.4.47",
    "vitest": "2.1.1",
    "@types/react": "18.3.5",
    "@types/react-dom": "18.3.0",
    "@types/canvas-confetti": "1.9.0",
    "eslint": "9.10.0"
  }
}
```

### Tabel Perintah Bukti (Verification Commands)
| Perintah | Script NPM | Perintah Shell Eksak | Ambang Lulus (Gate Criteria) |
| :--- | :--- | :--- | :--- |
| **install** | `npm ci` | `npm ci` | Lockfile terverifikasi, 0 error instalasi |
| **typecheck**| `npm run typecheck` | `npx tsc --noEmit` | 0 error kompilasi TypeScript |
| **lint** | `npm run lint` | `npx eslint src --ext .ts,.tsx` | 0 error, 0 warning kritis |
| **test** | `npm run test:unit` | `npx vitest run test/unit` | 100% tes lulus, coverage core $\ge 90\%$ |
| **build** | `npm run build` | `npx vite build` | Direktori `dist/` terbuat, bundle gzip $< 350\text{ KB}$ |
| **e2e** | `npm run test:e2e` | `npx vitest run test/e2e` | Playthrough simulasi usia 0–18 tamat tanpa crash |
| **run** | `npm run dev` | `npx vite --host` | Dev server menyala pada `http://localhost:5173` |
| **android** | `npm run cap:sync` | `npx cap sync android` | Aset web tersinkronisasi ke modul Android Capacitor |

---

## M2. PETA SESI (SKALA SMALL: 7 SESI)

```
[SESI-01-SETUP] ──► [SESI-02-CONTRACT] ──► [SESI-03-CLIENT] ──► [SESI-04-ASSET-HOOK]
                                                                        │
[SESI-07-RELEASE] ◄── [SESI-06-REDTEAM] ◄── [SESI-05-INFRA] ◄───────────┘
```

---

### SESI-01: SETUP (Inisialisasi Toolchain & Kerangka Proyek)
- **ID Sesi**: `SESI-01-SETUP`
- **Tujuan**: Membangun fondasi workspace, mengonfigurasi toolchain monorepo-lite, memasang dependensi versi terkunci, dan memverifikasi dev server berjalan.
- **Ukuran Sesi**: **S (Small)**
- **Input yang Dibaca**: `GAME_BLUEPRINT.md` S1, S5; `manifest_v1.md` M1.
- **Artefak Keluaran**:
  - `package.json` & `package-lock.json` (dependensi terkunci)
  - `tsconfig.json` & `vite.config.ts` (konfigurasi bundler & path aliases)
  - `tailwind.config.js` & `postcss.config.js` (desain sistem UI modern)
  - `index.html` (viewport mobile-friendly 390x844 pt)
  - `.gitignore`, `.env.example`
  - `PROGRESS.md`, `AGENTS.md`
- **Checklist Aktivitas**:
  - [ ] S-01: Verifikasi ketersediaan Node.js $\ge 20$ dan npm $\ge 10$.
  - [ ] S-02: Buat struktur direktori bersih:
    ```
    everlife/
    ├── public/
    ├── src/
    │   ├── core/         # Pure TypeScript logic (Tanpa DOM)
    │   ├── contracts/    # Schema, config constants, event definitions
    │   ├── storage/      # IndexedDB / LocalStorage / SaveService
    │   ├── ui/           # React components, tabs, dialogs
    │   └── main.tsx
    ├── test/
    │   ├── unit/
    │   ├── e2e/
    │   └── redteam/
    └── docs/
    ```
  - [ ] S-03: Inisialisasi Git repo, konfigurasi `.gitignore` (node_modules, dist, .cap, .DS_Store).
  - [ ] S-04: Pasang dependensi via `npm install` sesuai daftar versi M1, hasilkan `package-lock.json`.
  - [ ] S-05: Buat halaman bootstrap minimal di `src/main.tsx` dan `src/App.tsx`, verifikasi `npm run dev` aktif.
  - [ ] S-06: Buat `.env.example` untuk konfigurasi environment klien.
  - [ ] S-07: Inisialisasi `PROGRESS.md` dan `AGENTS.md` pelacak progres.
  - [ ] S-08: Siapkan helper generator fallback prosedural untuk ikon dan avatar.
- **Exit Gate Terukur**:
  1. `npm run typecheck` mengembalikan status 0 error.
  2. `npm run dev` dapat diakses via HTTP localhost tanpa error console.
  3. Git working tree bersih dengan commit awal: `chore: initial project setup and toolchain`.

---

### SESI-02: CONTRACT (Konfigurasi, State, Event, & Save Schema)
- **ID Sesi**: `SESI-02-CONTRACT`
- **Tujuan**: Menulis seluruh tipe data, konstanta penyeimbang S7, dan kontrak data murni TypeScript sebelum mengimplementasikan logika permainan.
- **Ukuran Sesi**: **S (Small)**
- **Input yang Dibaca**: `GAME_BLUEPRINT.md` S2, S3, S7, S8; `DECISION.md`.
- **Artefak Keluaran**:
  - `src/contracts/gameConfig.ts` (seluruh konstanta `CFG_*` dari S7)
  - `src/contracts/gameState.ts` (interface typed profile, stats, relations, timeline)
  - `src/contracts/gameEvents.ts` (tipe aksi, dilema event, opsi pilihan)
  - `src/contracts/saveSchema.ts` (interface save data, schemaVersion, algoritma checksum FNV-1a)
  - `src/contracts/guardTable.ts` (matriks transisi sah dan terlarang sebagai typed data)
  - `src/contracts/assetManifest.ts` (daftar ID aset ikon dan synthesizer audio)
- **Checklist Aktivitas**:
  - [ ] K-01: Tulis `gameConfig.ts` memuat 45+ konstanta `CFG_*` dari S7 (beserta komentar satuan dan batas aman).
  - [ ] K-02: Tulis `gameState.ts` mendefinisikan `CharacterProfile`, `CharacterStats`, `RelationNPC`, `TimelineLogEntry`.
  - [ ] K-03: Tulis `gameEvents.ts` mendefinisikan `EventDilemma`, `EventOption`, `YearSummary`, `GameActionPayload`.
  - [ ] K-05: Tulis `assetManifest.ts` mendefinisikan tipe dan pemetaan ikon Lucide serta preset synthesizer Web Audio API.
  - [ ] K-08: Tulis `saveSchema.ts` dengan `schemaVersion: 1`, interface `EverLifeSaveData`, dan implementasi fungsi murni `calculateChecksum()`.
  - [ ] K-09: Tulis `guardTable.ts` yang memuat aturan validasi transisi antar-state (`CANNOT_AGE_UP_DURING_EVENT`, dll.).
  - [ ] K-10: Jalankan `npm run typecheck` untuk menjamin 0 kesalahan tipe data antar-kontrak.
- **Exit Gate Terukur**:
  1. 100% file kontrak di `src/contracts/` terkompilasi tanpa error (`npx tsc --noEmit`).
  2. Seluruh file kontrak bebas dari dependensi DOM/React (100% pure TypeScript).
  3. Uji unit fixture checksum save mengembalikan hash string yang konsisten dan deterministik.

---

### SESI-03: CLIENT (Logika Inti, State Machine, UI, & Game Loop)
- **ID Sesi**: `SESI-03-CLIENT`
- **Tujuan**: Mengimplementasikan core engine murni (simulasi umur, kalkulasi stat, generator event, relasi, ekonomi saku) dan menghubungkannya ke antarmuka React yang responsif.
- **Ukuran Sesi**: **L (Large)**
- **Input yang Dibaca**: `src/contracts/*`, `GAME_BLUEPRINT.md` S2, S3, S4, S5.
- **Artefak Keluaran**:
  - `src/core/StatCalculator.ts` (clamping matematis $[0, 100]$, decay relasi tahunan)
  - `src/core/GameEngine.ts` (lifecycle state machine, age up turn, graduation review)
  - `src/core/EventEngine.ts` (Mulberry32 PRNG seed, bank 50 event SMA, condition filtering)
  - `src/core/RelationEngine.ts` (interaksi keluarga, teman, guru, kalkulasi relasi)
  - `src/core/EconomyEngine.ts` (uang saku tahunan, part-time job usia 15+)
  - `src/storage/SaveService.ts` (IndexedDB / localStorage wrapper, auto-save atomik, export/import JSON)
  - `src/ui/components/` (TopBar, StatBars, TimelineView virtualized, ActionArea, BottomNav, EventModal, GraduationScreen)
  - `test/unit/*.test.ts` (suite uji unit Vitest untuk seluruh modul core)
- **Checklist Aktivitas**:
  - [ ] C-01: Bangun `StatCalculator.ts` dengan clamping kaku `CFG_STAT_MIN` s.d. `CFG_STAT_MAX`.
  - [ ] C-02: Bangun `GameEngine.ts` mengelola alur giliran usia (0 s.d. `CFG_AGE_MAX_V1` / 18 tahun).
  - [ ] C-03: Terapkan State Machine dan Guard sesuai S3 (cegah age up saat event aktif, dll.).
  - [ ] C-04: Bangun `EventEngine.ts` dengan PRNG Mulberry32 dan kumpulan minimal 50 kartu dilema masa kecil hingga tamat SMA.
  - [ ] C-05: Bangun `RelationEngine.ts` (anggota keluarga awal, pertemanan sekolah, penurunan alami tahunan `CFG_RELATION_DECAY_ANNUAL`).
  - [ ] C-06: Bangun `EconomyEngine.ts` (uang saku otomatis berjenjang SD/SMP/SMA dan pembukaan kerja paruh waktu di usia 15).
  - [ ] C-07: Bangun `SaveService.ts` dengan auto-save per tahun, 3 slot mandiri, dan ekspor/impor berkas JSON ber-checksum.
  - [ ] C-08: Rancang komponen UI:
    - `TopBar`: Profil inisial, nama, usia, tingkat sekolah, saldo uang.
    - `StatBars`: 5 bar statistik dengan interpolasi halus `CFG_TWEEN_BAR_DURATION_MS` (300 ms) dan flash indikator angka `CFG_COLOR_FLASH_MS` (200 ms).
    - `TimelineView`: Daftar peristiwa virtualized list (DOM nodes $< 300$).
    - `ActionArea`: Tombol Tambah Umur (+1 Tahun) dengan debounce `CFG_INPUT_DEBOUNCE_MS` (200 ms).
    - `BottomNav`: Navigasi 4 tab (Hidup, Relasi, Aktivitas, Profil).
    - `EventModalDialog`: Pop-up dilema dengan 2–4 opsi bertema warna.
    - `GraduationScreen`: Layar kelulusan tamat SMA merangkum pencapaian dan nilai akhir.
  - [ ] C-09: Terapkan FTUE 30 detik dari Usia 0 (Bayi) hingga event pilihan pertama.
  - [ ] C-10: Tulis suite pengujian unit Vitest mencakup kalkulator stat, siklus umur, generator event, dan relasi.
- **Exit Gate Terukur**:
  1. `npm run test:unit` lulus 100% dengan cakupan pengujian (test coverage) core $\ge 90\%$.
  2. Pemain dapat memulai hidup baru, menekan Tambah Umur, memilih respons event, dan menamatkan SMA pada usia 18 tahun tanpa exception.
  3. Auto-save berhasil menyimpan progres tiap tahun dan dapat dimuat kembali setelah refresh halaman.

---

### SESI-04: ASSET-HOOK (Integrasi Ikon, Avatar Prosedural, & Audio Synth)
- **ID Sesi**: `SESI-04-ASSET-HOOK`
- **Tujuan**: Mengintegrasikan seluruh aset visual berbasis kode dan ikon open-source MIT Lucide serta modul audio sintetis Web Audio API tanpa beban file media eksternal.
- **Ukuran Sesi**: **S (Small)**
- **Input yang Dibaca**: `src/contracts/assetManifest.ts`, `GAME_BLUEPRINT.md` S5.4, S6.
- **Artefak Keluaran**:
  - `src/ui/assets/icons.tsx` (binding tree-shaken SVG Lucide Icons: heart, smile, users, book, coins, calendar, settings)
  - `src/ui/components/ProceduralAvatar.tsx` (avatar inisial nama dengan warna gradien HSL dinamis)
  - `src/ui/audio/SynthAudio.ts` (Web Audio API oscillator untuk click tap, alert, dan selebrasi)
  - `ASSETS_LICENSES.md` (atribusi lisensi resmi open-source MIT Lucide Icons)
- **Checklist Aktivitas**:
  - [ ] A-01: Verifikasi pemetaan ikon pada `icons.tsx` terhadap `assetManifest.ts` (0 kunci hilang).
  - [ ] A-02: Pasang ikon SVG ke masing-masing indikator stat dan tombol tab navigasi bawah.
  - [ ] A-03: Implementasikan `ProceduralAvatar.tsx` yang secara deterministik mengubah nama karakter menjadi inisial huruf dan palet warna latar unik.
  - [ ] A-04: Implementasikan `SynthAudio.ts` dengan oscillator Web Audio API (sine 440Hz untuk tap, sawtooth 150Hz untuk penalti, arpeggio ceria untuk kelulusan).
  - [ ] A-05: Pastikan audio berstatus bawaan nonaktif (`CFG_AUDIO_DEFAULT_MUTED = true`) dengan toggle mute di pengaturan.
  - [ ] A-06: Buat berkas `ASSETS_LICENSES.md` mencatat lisensi open-source MIT untuk Lucide Icons.
- **Exit Gate Terukur**:
  1. Semua ikon dan avatar ter-render tajam pada layar resolusi retina tanpa layout shift (CLS = 0).
  2. Ukuran direktori aset eksternal tetap 0 KB (semua dihasilkan via skrip/vektor).
  3. Audio synthesizer berbunyi halus tanpa distorsi saat tombol suara diaktifkan pemain.

---

### SESI-05: INFRA (PWA Offline, Capacitor Android, & CI/CD)
- **ID Sesi**: `SESI-05-INFRA`
- **Tujuan**: Mengonfigurasi kapabilitas offline PWA melalui Service Worker, menyiapkan pembungkus Android native via Capacitor v6, dan mengotomasi pipeline pengujian CI.
- **Ukuran Sesi**: **S (Small)**
- **Input yang Dibaca**: `GAME_BLUEPRINT.md` S14; `manifest_v1.md` M1.
- **Artefak Keluaran**:
  - `vite.config.ts` (konfigurasi Vite PWA plugin & CacheFirst caching strategy)
  - `capacitor.config.ts` (konfigurasi Capacitor Android app id: `com.everlife.game`)
  - `.github/workflows/ci.yml` (pipeline otomatis GitHub Actions)
  - `src/ui/components/ErrorBoundary.tsx` (root crash handler lokal)
  - `DEPLOY_GUIDE.md` (petunjuk deployment web statis & build APK sideload)
- **Checklist Aktivitas**:
  - [ ] E-01: Konfigurasi Service Worker Vite PWA dengan aturan cache `CacheFirst` agar game dapat berjalan 100% dalam kondisi airplane mode (tanpa internet).
  - [ ] E-02: Konfigurasi metadata PWA (`manifest.webmanifest`, theme-color `#0A2540`, background `#F5F7FB`, orientasi portrait).
  - [ ] E-03: Inisialisasi konfigurasi Capacitor (`capacitor.config.ts`) dengan nama aplikasi `EverLife` dan target Android.
  - [ ] E-04: Susun pipeline CI di `.github/workflows/ci.yml` yang menjalankan `npm ci`, `npm run lint`, `npm run test:unit`, dan `npm run build`.
  - [ ] E-05: Implementasikan `<ErrorBoundary>` pada tingkat root aplikasi dengan dialog ramah pengguna dan tombol "Salin Log Masalah".
  - [ ] E-06: Tulis `DEPLOY_GUIDE.md` menjelaskan cara deploy statis ke GitHub Pages/Vercel dan cara mengekspor APK Android via Android Studio/Capacitor CLI.
- **Exit Gate Terukur**:
  1. Build produksi `npm run build` menghasilkan Service Worker yang lolos audit PWA Lighthouse.
  2. GitHub Actions CI pipeline berhasil mengeksekusi seluruh tahapan verifikasi secara hijau.
  3. Sinkronisasi aset Capacitor `npx cap sync android` berhasil tanpa error skrip Gradle.

---

### SESI-06: REDTEAM (Pengujian Integritas, Anti-Tamper, & Stress Test)
- **ID Sesi**: `SESI-06-REDTEAM`
- **Tujuan**: Menguji ketahanan klien game terhadap manipulasi data simpanan lokal, input ekstrem, dan spamming tombol aksi.
- **Ukuran Sesi**: **S (Small)**
- **Input yang Dibaca**: `GAME_BLUEPRINT.md` S15.3; `src/storage/SaveService.ts`, `src/core/GameEngine.ts`.
- **Artefak Keluaran**:
  - `test/redteam/tamper.test.ts` (suite uji manipulasi save dan batas state)
  - `test/redteam/stress.test.ts` (suite uji spamming input dan race conditions)
  - `RED_REPORT.md` (laporan hasil uji Red Team beserta bukti mentah eksekusi)
- **Checklist Aktivitas**:
  - [ ] R-01: Uji modifikasi manual saldo uang pada file save JSON (saldo diubah tanpa update checksum -> sistem wajib menolak dan menampilkan status korup).
  - [ ] R-02: Uji manipulasi usia pada file save JSON (`age = 99` atau `age = -5` -> validator menolak save file saat diimpor).
  - [ ] R-03: Uji spam tombol Tambah Umur (+1) sebanyak 50 tap per detik -> debounce `CFG_INPUT_DEBOUNCE_MS` (200 ms) menyaring tap berlebih dan hanya 1 giliran diproses per jeda cooldown.
  - [ ] R-04: Uji injeksi pilihan event ilegal (indeks opsi pilihan di luar rentang -> watchdog mencegah crash dan mengeksekusi fallback aman).
  - [ ] R-05: Dokumentasikan seluruh temuan dan bukti mentah penolakan pada berkas `RED_REPORT.md`.
- **Exit Gate Terukur**:
  1. 100% skenario manipulasi data dan stres input ditolak/ditangani secara anggun tanpa unhandled crash.
  2. `RED_REPORT.md` terbit dengan status kelulusan lengkap (Pass).

---

### SESI-07: RELEASE (Verifikasi Akhir, Checklist Rilis, & Dokumentasi)
- **ID Sesi**: `SESI-07-RELEASE`
- **Tujuan**: Menjalankan audit final seluruh sistem, membersihkan kode sementara/stub, menyusun catatan rilis, dan mengunci versi `v1.0.0-rc1`.
- **Ukuran Sesi**: **S (Small)**
- **Input yang Dibaca**: Seluruh keluaran sesi 1–6, `GAME_BLUEPRINT.md`, `PROGRESS.md`.
- **Artefak Keluaran**:
  - `CHANGELOG.md` (catatan rilis versi 1.0.0-rc1)
  - `PRE_DEPLOY_CHECKLIST.md` (daftar periksa kesiapan distribusi)
  - `README.md` (dokumentasi lengkap proyek, gameplay, arsitektur, dan cara instalasi)
- **Checklist Aktivitas**:
  - [ ] Z-01: Verifikasi bahwa seluruh exit gate dari SESI-01 hingga SESI-06 berstatus HIJAU.
  - [ ] Z-02: Pemindaian codebase menyeluruh: pastikan 0 `TODO`, 0 `FIXME`, dan 0 mock/stub yang belum tuntas.
  - [ ] Z-03: Lengkapi dan tandatangani berkas `PRE_DEPLOY_CHECKLIST.md`.
  - [ ] Z-04: Susun `CHANGELOG.md` merangkum fitur v1.0 (Lahir hingga Tamat SMA, 50 Kartu Event, Relasi, Tab Aktivitas, 3 Slot Save ber-checksum).
  - [ ] Z-05: Perbarui `README.md` dengan instruksi cara bermain, arsitektur decoupled, dan petunjuk build PWA/Android.
  - [ ] Z-06: Buat Git release tag `v1.0.0-rc1`.
- **Exit Gate Terukur**:
  1. Build produksi akhir berukuran $< 350\text{ KB}$ gzipped tanpa ada peringatan kompilasi.
  2. `PRE_DEPLOY_CHECKLIST.md` terisi penuh dengan status lulus 100%.
  3. Seluruh dokumen proyek sinkron dan siap diserahkan kepada pengguna.

---

## M3. KONTRAK BERSAMA (SHARED CONTRACTS)

### 3.1 `src/contracts/gameConfig.ts`
```typescript
/**
 * Seluruh konstanta penyeimbang dan konfigurasi teknis EverLife v1.0.
 * Semua nilai merujuk langsung ke Game Blueprint Bagian S7.
 */
export const GAME_CONFIG = {
  // --- Kinerja & Viewport ---
  CFG_FPS_TARGET: 60,
  CFG_VIEWPORT_WIDTH_PT: 390,
  CFG_VIEWPORT_HEIGHT_PT: 844,
  CFG_SAFE_AREA_TOP_PT: 47,
  CFG_SAFE_AREA_BOTTOM_PT: 34,
  CFG_ANIM_DELTA_CLAMP_MS: 33.33,
  CFG_INPUT_DEBOUNCE_MS: 200,

  // --- Polish & Game Feel ---
  CFG_TWEEN_BAR_DURATION_MS: 300,
  CFG_COLOR_FLASH_MS: 200,

  // --- Waktu Aksi 4-Fase (Milidetik) ---
  CFG_TIME_EVENT_TAP_WINDUP: 0,
  CFG_TIME_EVENT_TAP_ACTIVE: 50,
  CFG_TIME_EVENT_TAP_RECOVERY: 150,
  CFG_TIME_EVENT_TAP_COOLDOWN: 100,

  CFG_TIME_AGE_UP_WINDUP: 50,
  CFG_TIME_AGE_UP_ACTIVE: 200,
  CFG_TIME_AGE_UP_RECOVERY: 100,
  CFG_TIME_AGE_UP_COOLDOWN: 300,

  CFG_TIME_ACTION_TAP_WINDUP: 0,
  CFG_TIME_ACTION_TAP_ACTIVE: 50,
  CFG_TIME_ACTION_TAP_RECOVERY: 100,
  CFG_TIME_ACTION_TAP_COOLDOWN: 100,

  CFG_TIME_SOCIAL_TAP_WINDUP: 0,
  CFG_TIME_SOCIAL_TAP_ACTIVE: 50,
  CFG_TIME_SOCIAL_TAP_RECOVERY: 150,
  CFG_TIME_SOCIAL_TAP_COOLDOWN: 200,

  CFG_TIME_NAV_TAP_WINDUP: 0,
  CFG_TIME_NAV_TAP_ACTIVE: 30,
  CFG_TIME_NAV_TAP_RECOVERY: 70,
  CFG_TIME_NAV_TAP_COOLDOWN: 50,

  CFG_TIME_CHAR_GEN_WINDUP: 0,
  CFG_TIME_CHAR_GEN_ACTIVE: 100,
  CFG_TIME_CHAR_GEN_RECOVERY: 200,
  CFG_TIME_CHAR_GEN_COOLDOWN: 300,

  CFG_TIME_SAVE_IO_WINDUP: 0,
  CFG_TIME_SAVE_IO_ACTIVE: 100,
  CFG_TIME_SAVE_IO_RECOVERY: 100,
  CFG_TIME_SAVE_IO_COOLDOWN: 200,

  // --- Batas Usia & Tahapan Pendidikan ---
  CFG_AGE_MIN: 0,
  CFG_AGE_MAX_V1: 18,
  CFG_AGE_PRIMARY_SCHOOL: 6,
  CFG_AGE_MIDDLE_SCHOOL: 12,
  CFG_AGE_HIGH_SCHOOL: 15,
  CFG_AGE_PART_TIME_UNLOCK: 15,

  // --- Statistik Karakter ---
  CFG_STAT_MIN: 0,
  CFG_STAT_MAX: 100,
  CFG_STAT_INITIAL_HEALTH: 90,
  CFG_STAT_INITIAL_HAPPINESS: 85,
  CFG_STAT_INITIAL_RELATION: 80,
  CFG_STAT_INITIAL_ACADEMIC: 50,
  CFG_RELATION_DECAY_ANNUAL: 3,
  CFG_HEALTH_PENALTY_DEPLETION: 5,

  // --- Ekonomi Saku & Pekerjaan ---
  CFG_ALLOWANCE_BASE_SD: 20000,
  CFG_ALLOWANCE_BASE_SMP: 60000,
  CFG_ALLOWANCE_BASE_SMA: 150000,

  // --- Sistem Event & Simpanan ---
  CFG_EVENT_POOL_SIZE_V1: 50,
  CFG_SAVE_SLOT_COUNT: 3,
  CFG_AUTO_SAVE_ENABLED: true,
  CFG_AUDIO_DEFAULT_MUTED: true,
} as const;

export type GameConfig = typeof GAME_CONFIG;
```

### 3.2 `src/contracts/gameState.ts`
```typescript
export type Gender = 'Pria' | 'Wanita';
export type EducationGrade = 'Balita' | 'SD' | 'SMP' | 'SMA' | 'Lulus SMA';
export type RelationRole = 'Ayah' | 'Ibu' | 'Saudara' | 'Teman' | 'Guru';
export type EventCategory = 'Keluarga' | 'Sekolah' | 'Kesehatan' | 'Dilema' | 'Acak';

export interface CharacterProfile {
  name: string;
  gender: Gender;
  country: string;
  birthYear: number;
  age: number; // CFG_AGE_MIN s.d. CFG_AGE_MAX_V1
  cash: number; // Saldo riil IDR
  grade: EducationGrade;
}

export interface CharacterStats {
  health: number;       // Range: CFG_STAT_MIN s.d. CFG_STAT_MAX
  happiness: number;    // Range: CFG_STAT_MIN s.d. CFG_STAT_MAX
  relationship: number; // Nilai rata-rata relasi sosial [0, 100]
  academic: number;     // Prestasi kognitif / belajar [0, 100]
}

export interface RelationNPC {
  id: string;
  name: string;
  role: RelationRole;
  relationshipScore: number; // Range: [0, 100]
  isAlive: boolean;
}

export interface TimelineLogEntry {
  age: number;
  title: string;
  description: string;
  category: EventCategory;
  statDeltas?: Partial<Record<keyof CharacterStats | 'cash', number>>;
}

export type AppScreenState =
  | 'BOOT'
  | 'MAIN_MENU'
  | 'CHARACTER_CREATION'
  | 'GAMEPLAY_ACTIVE'
  | 'EVENT_MODAL'
  | 'GRADUATION_SCREEN'
  | 'GAME_OVER_DEATH';

export type ActiveTab = 'LIFE' | 'RELATIONS' | 'ACTIVITIES' | 'PROFILE';
```

### 3.3 `src/contracts/gameEvents.ts`
```typescript
import { CharacterStats, EventCategory } from './gameState';

export interface EventOption {
  id: string;
  label: string;
  theme: 'positive' | 'rational' | 'rebellious' | 'passive';
  statDeltas: Partial<Record<keyof CharacterStats | 'cash', number>>;
  resultLog: string;
  requiredFlag?: string;
  grantFlag?: string;
}

export interface EventDilemma {
  id: string;
  minAge: number;
  maxAge: number;
  category: EventCategory;
  title: string;
  narrative: string;
  options: EventOption[];
  requiresSchool?: boolean;
  requiredFlag?: string;
  isUnique?: boolean;
}
```

### 3.4 `src/contracts/saveSchema.ts`
```typescript
import { CharacterProfile, CharacterStats, RelationNPC, TimelineLogEntry } from './gameState';

export const CURRENT_SCHEMA_VERSION = 1;

export interface EverLifeSaveData {
  schemaVersion: number; // CURRENT_SCHEMA_VERSION
  slotId: number;        // 1, 2, atau 3
  updatedAt: string;     // ISO 8601 string
  lifeSeed: number;      // Seed PRNG Mulberry32
  profile: CharacterProfile;
  stats: CharacterStats;
  relations: RelationNPC[];
  timelineHistory: TimelineLogEntry[];
  flags: string[];
  isCompleted: boolean;
  checksum: string;      // FNV-1a hash
}

export function calculateChecksum(data: Omit<EverLifeSaveData, 'checksum'>): string {
  const str = JSON.stringify(data);
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
```

### 3.5 `src/contracts/guardTable.ts`
```typescript
import { AppScreenState } from './gameState';

export interface TransitionRule {
  from: AppScreenState;
  to: AppScreenState;
  allowed: boolean;
  errorCode?: string;
  reason?: string;
}

export const GUARD_TRANSITION_RULES: TransitionRule[] = [
  { from: 'BOOT', to: 'MAIN_MENU', allowed: true },
  { from: 'MAIN_MENU', to: 'CHARACTER_CREATION', allowed: true },
  { from: 'MAIN_MENU', to: 'GAMEPLAY_ACTIVE', allowed: true },
  { from: 'CHARACTER_CREATION', to: 'GAMEPLAY_ACTIVE', allowed: true },
  { from: 'GAMEPLAY_ACTIVE', to: 'EVENT_MODAL', allowed: true },
  { from: 'EVENT_MODAL', to: 'GAMEPLAY_ACTIVE', allowed: true },
  { from: 'GAMEPLAY_ACTIVE', to: 'GRADUATION_SCREEN', allowed: true },
  { from: 'GAMEPLAY_ACTIVE', to: 'GAME_OVER_DEATH', allowed: true },
  // Transisi Terlarang:
  {
    from: 'EVENT_MODAL',
    to: 'GRADUATION_SCREEN',
    allowed: false,
    errorCode: 'ERR_BLOCKED_BY_EVENT',
    reason: 'Wajib memilih respons dilema sebelum evaluasi kelulusan.',
  },
  {
    from: 'GAMEPLAY_ACTIVE',
    to: 'CHARACTER_CREATION',
    allowed: false,
    errorCode: 'ERR_ACTIVE_SESSION_EXISTS',
    reason: 'Sesi aktif harus disimpan atau dibuang terlebih dahulu.',
  },
];
```

### 3.6 `src/contracts/assetManifest.ts`
```typescript
export interface IconAssetEntry {
  id: string;
  label: string;
  lucideName: string;
  tier: 'H';
  fallbackText: string;
}

export const ICON_MANIFEST: IconAssetEntry[] = [
  { id: 'icon-heart', label: 'Kesehatan', lucideName: 'Heart', tier: 'H', fallbackText: '♥' },
  { id: 'icon-smile', label: 'Kebahagiaan', lucideName: 'Smile', tier: 'H', fallbackText: ':)' },
  { id: 'icon-users', label: 'Relasi', lucideName: 'Users', tier: 'H', fallbackText: '[U]' },
  { id: 'icon-book', label: 'Akademik', lucideName: 'BookOpen', tier: 'H', fallbackText: '[B]' },
  { id: 'icon-coins', label: 'Uang Saku', lucideName: 'Coins', tier: 'H', fallbackText: '$' },
  { id: 'icon-calendar', label: 'Tambah Umur', lucideName: 'PlusCircle', tier: 'H', fallbackText: '[+]' },
  { id: 'icon-settings', label: 'Pengaturan', lucideName: 'Settings', tier: 'H', fallbackText: '[*]' },
];

export interface SynthAudioPreset {
  id: 'synth-tap' | 'synth-alert' | 'synth-success';
  waveform: OscillatorType;
  frequencies: number[];
  durationMs: number;
}

export const SYNTH_PRESETS: Record<string, SynthAudioPreset> = {
  tap: { id: 'synth-tap', waveform: 'sine', frequencies: [440], durationMs: 30 },
  alert: { id: 'synth-alert', waveform: 'sawtooth', frequencies: [150, 110], durationMs: 150 },
  success: { id: 'synth-success', waveform: 'sine', frequencies: [523, 659, 784], durationMs: 120 },
};
```

---

## M4. ATURAN KETERGANTUNGAN (DEPENDENCY GRAPH)

```
[M1: Toolchain/Setup]
          │
          ▼
[M2: Contracts (Config, State, Events, Guard)]
          │
          ▼
[M3: Core Engine (Pure TS, Testable)]
          │
          ▼
[M4: UI Components & Game Loop]
          │
          ▼
[M5: Assets & Synth Audio Hooks]
          │
          ▼
[M6: Infra (PWA & Capacitor Packaging)]
          │
          ▼
[M7: Red Team (Anti-Tamper & Debounce Stress)]
          │
          ▼
[M8: Release Candidate & Docs]
```

### Rationale:
1. **Contracts First**: Menjamin seluruh nama konstanta `CFG_*`, tipe data state, dan struktur save file telah terkunci rapat sebelum satu baris kode fungsional ditulis.
2. **Headless Engine Before UI**: Logika kalkulasi stat, seed PRNG, dan pergantian tahun diuji dan dibuktikan terlebih dahulu via Vitest tanpa dependensi browser DOM.
3. **Feel Before Features**: Memastikan transisi nilai bar stat (300 ms) dan filter debounce (200 ms) responsif sebelum menginjeksi seluruh 50 kartu peristiwa.
4. **Infra & Red Team Prior to Release**: Kemampuan offline PWA dan keandalan proteksi checksum diverifikasi sebelum game siap dirilis.

---

## M5. DEFINITION OF DONE (DOD) & KRITERIA SUKSES

### DoD Global (Wajib Terpenuhi Sebelum Rilis)
- [x] **0 TypeScript Errors**: `npx tsc --noEmit` lolos bersih.
- [x] **0 Linter Errors**: `npx eslint src` bersih tanpa error atau peringatan kritis.
- [x] **100% Test Pass**: Semua pengujian unit Vitest lulus tanpa skip.
- [x] **Ukuran Bundle Ringan**: Total aset terkompresi `dist/` $< 350\text{ KB}$ gzipped.
- [x] **60 FPS Stabil**: Pengujian runtime UI menjaga frametime $p95 < 16.66\text{ ms}$ pada viewport 390x844 pt.
- [x] **100% Offline Playable**: Aplikasi dapat dimuat ulang dan dimainkan dalam kondisi airplane mode via Service Worker.

### DoD Per-Layer Aktif
1. **Contract Layer**:
   - Semua konstanta dari Blueprint S7 terdokumentasi dengan tipe yang tepat.
   - Tidak ada ketergantungan terhadap pustaka eksternal UI di dalam folder `src/contracts/`.
2. **Core Engine Layer**:
   - Deterministik: Seed PRNG yang sama selalu menghasilkan urutan peristiwa yang identik.
   - Clamping kaku: Tidak ada operasi matematika yang dapat membuat stat bernilai $< 0$ atau $> 100$.
   - Transisi terlarang ditolak dan mengembalikan kode error spesifik.
3. **UI / Presentation Layer**:
   - Komponen terisolasi dan merender dalam batas aman viewport portrait 390x844 pt.
   - Debounce tap mencegah pemicuan ganda dalam jendela 200 ms.
   - Linimasa peristiwa menggunakan virtualized list untuk mencegah kebocoran memori saat entri log bertambah banyak.
4. **Storage Layer**:
   - Auto-save terpanggil secara atomik setiap kali umur bertambah 1 tahun.
   - Modifikasi berkas save JSON tanpa pembaruan checksum ditolak secara tegas.

---

## M6. REGISTRI RISIKO & KEPUTUSAN ARSITEKTURAL

### Top-5 Risiko Proyek (Dari Blueprint Bagian B)
| No | Risiko | Dampak | Strategi Mitigasi Terintegrasi |
| :---: | :--- | :--- | :--- |
| **1** | **Kebosanan Peristiwa Berulang** | Pemain cepat jenuh karena variasi kejadian minim. | Kuota minimal 50 kartu event bertingkat usia dengan filter flag masa lalu di `EventEngine.ts`. |
| **2** | **Hilangnya Save Akibat Bersih Cache** | Progres karakter pemain terhapus oleh OS. | Dual storage (`IndexedDB` + backup) serta fitur ekspor berkas `.json` mandiri ke penyimpanan fisik HP/PC. |
| **3** | **Spam Klik Tombol Tambah Umur** | Pemain melewati tahun tanpa sadar atau race conditions. | Debounce 200 ms di tingkat UI + guard state machine yang mengunci aksi selama turn sedang aktif. |
| **4** | **Memory Bloat Linimasa Panjang** | Aplikasi menjadi lambat di usia 18 tahun. | Implementasi virtualized list pada komponen linimasa log peristiwa (DOM nodes $< 300$). |
| **5** | **Kematian Dini yang Tidak Adil** | Pemain pemula mati mendadak di usia anak-anak. | Grace period usia 0–12 tahun dengan pembatasan maksimal penalti kesehatan per tahun serta peringatan visual kedipan merah saat kesehatan $< 25\%$. |

### Registri Keputusan Kunci (Tercatat di `DECISION.md`)
- `DEC-001`: Ruang lingkup v1 dibatasi dari lahir (0 tahun) hingga tamat SMA (18 tahun).
- `DEC-002`: Skala Small, Mode A (Pure Client / Offline Penuh, Rp0 Hosting).
- `DEC-003`: PWA Mobile-First + Capacitor Android APK + Desktop PWA. Inti logika pure TypeScript tanpa DOM.
- `DEC-004`: Anonim selamanya tanpa akun atau OAuth.
- `DEC-005`: Auto-save 3 slot lokal + ekspor/impor JSON dengan checksum FNV-1a.
- `DEC-006`: Progresi stat-driven tanpa level angka atau currency premium.
- `DEC-007`: Rilis 100% gratis bersih tanpa iklan maupun IAP di v1.
- `DEC-008`: Aset visual kode prosedural (Tier P) + Ikon Lucide MIT (Tier H) + Web Audio synth (Tier P), tanpa avatar gambar manual/AI.
- `DEC-009`: Generator peristiwa dengan PRNG Mulberry32 berbasis seed per kehidupan.
- `DEC-010`: Pengujian headless menyeluruh menggunakan Vitest.
- `DEC-011`: Pengecualian sesi backend, auth, dan server (DATA, SECURITY, SERVER, INTEGRATE, BLUETEAM) karena game berskala Small offline-first.

---

## M7. PROTOKOL PERGANTIAN SESI & FORMAT STATE SUMMARY

### Mekanisme Kerja `/resume-[agent]`
Setiap sesi dieksekusi secara mandiri. Sebelum sesi ditutup, agen wajib:
1. Memperbarui checklist pada `PROGRESS.md`.
2. Menjalankan verifikasi exit gate sesi yang sedang aktif.
3. Mencatat ringkasan status ke dalam `PROGRESS.md` menggunakan format STATE SUMMARY di bawah ini.
4. Melakukan Git commit rapi untuk sesi tersebut.

### Format Standar State Summary
```markdown
### STATE SUMMARY (Akhir Sesi [ID_SESI])
- **Sesi Selesai**: [ID_SESI - Nama Sesi]
- **Status Exit Gate**: [HIJAU / MERAH] (Bukti: [Perintah verifikasi + hasil])
- **Artefak Dibuat / Diubah**:
  - `path/to/file1.ts`
  - `path/to/file2.ts`
- **Keputusan Baru / Perubahan**: [DEC-### jika ada, atau NIHIL]
- **Blocker / Isu Terbuka**: [NIHIL / Deskripsi blocker]
- **Sesi Berikutnya**: [ID_SESI_SELANJUTNYA - Nama Sesi]
```

---
*Manifest v1.0 diorkestrasi untuk eksekusi terstruktur, aman, dan dapat diverifikasi secara modular.*
