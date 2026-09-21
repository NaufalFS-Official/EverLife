# PROGRESS TRACKER: EverLife (v1.0-SMA)
**Orchestration Status: Tahap 2 — Siap Eksekusi Sesi**  
*Format: Vibecoding Build System v2.2*

---

## 1. IKHTISAR PROYEK
- **Nama Game**: EverLife
- **Skala**: Small (Mode A — Pure Client / Offline Penuh)
- **Target Platform**: PWA Mobile-First + APK Android via Capacitor v6
- **Stack**: Pure TypeScript Core + React 18 + Vite + Tailwind CSS
- **Tahap Saat Ini**: **Tahap 2 Selesai** (Blueprint & Manifest Approved, Siap Memulai SESI-01)

---

## 2. PETA KEMAJUAN SESI (SESSION CHECKLIST)

| ID Sesi | Nama Sesi | Ukuran | Status | Artefak Kunci | Exit Gate |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **SESI-01** | SETUP (Toolchain & Kerangka Proyek) | S | `[ ] BELUM` | `package.json`, `tsconfig.json`, `vite.config.ts` | Typecheck 0 error, dev server aktif |
| **SESI-02** | CONTRACT (Config, State, Events, Guard) | S | `[ ] BELUM` | `src/contracts/*.ts` (45+ konstanta S7) | Typecheck 0 error, 0 DOM dependencies |
| **SESI-03** | CLIENT (Core Engine, State Machine, UI) | L | `[ ] BELUM` | `src/core/*.ts`, `src/ui/components/*.tsx` | 100% tes lolos, playthrough 0–18 tahun |
| **SESI-04** | ASSET-HOOK (Lucide Icons, Avatar, Synth) | S | `[ ] BELUM` | `ProceduralAvatar.tsx`, `SynthAudio.ts` | 0 KB gambar eksternal, audio default mute |
| **SESI-05** | INFRA (PWA Offline, Capacitor, CI/CD) | S | `[ ] BELUM` | Vite PWA, `capacitor.config.ts`, `.github/ci.yml`| Offline airplane mode lolos, CI hijau |
| **SESI-06** | REDTEAM (Anti-Tamper & Debounce Stress) | S | `[ ] BELUM` | `test/redteam/tamper.test.ts`, `RED_REPORT.md` | Save JSON tamper ditolak, 0 crash |
| **SESI-07** | RELEASE (Audit Akhir, Changelog, Docs) | S | `[ ] BELUM` | `CHANGELOG.md`, `PRE_DEPLOY_CHECKLIST.md` | 0 TODO, bundle < 350 KB, siap rilis |

---

## 3. CHECKLIST DETAIL PER-SESI

### SESI-01: SETUP (Inisialisasi Toolchain)
- [ ] S-01: Verifikasi toolchain Node.js $\ge 20$ dan npm $\ge 10$.
- [ ] S-02: Struktur folder modular (`src/core`, `src/contracts`, `src/ui`, `src/storage`, `test/`).
- [ ] S-03: Inisialisasi Git, `.gitignore`, initial commit.
- [ ] S-04: Pasang dependensi versi terkunci, verifikasi `package-lock.json`.
- [ ] S-05: Dev server Vite berjalan pada viewport 390x844 pt.
- [ ] S-06: Siapkan `.env.example` dan template env schema.
- [ ] S-07: Inisialisasi `AGENTS.md` pelacak alur kolaborasi.
- [ ] S-08: Setup generator placeholder prosedural.

### SESI-02: CONTRACT (Kontrak Data Murni)
- [ ] K-01: Implementasi `gameConfig.ts` memuat seluruh konstanta S7.
- [ ] K-02: Implementasi `gameState.ts` mendefinisikan interface typed.
- [ ] K-03: Implementasi `gameEvents.ts` mendefinisikan tipe aksi dan dilema.
- [ ] K-05: Implementasi `assetManifest.ts` inventori ikon dan audio preset.
- [ ] K-08: Implementasi `saveSchema.ts` dengan schemaVersion: 1 dan checksum FNV-1a.
- [ ] K-09: Implementasi `guardTable.ts` memuat aturan transisi sah dan terlarang.
- [ ] K-10: Verifikasi `npm run typecheck` 0 error.

### SESI-03: CLIENT (Logika Inti & Antarmuka)
- [ ] C-01: Implementasi `StatCalculator.ts` dengan boundary clamping $[0, 100]$.
- [ ] C-02: Implementasi `GameEngine.ts` siklus giliran umur 0–18 tahun.
- [ ] C-03: Implementasi Guard State Machine sesuai S3.
- [ ] C-04: Implementasi `EventEngine.ts` dengan bank 50 event SMA dan Mulberry32 PRNG.
- [ ] C-05: Implementasi `RelationEngine.ts` (keluarga, teman, guru, decay tahunan).
- [ ] C-06: Implementasi `EconomyEngine.ts` (uang saku tahunan, part-time job usia 15+).
- [ ] C-07: Implementasi `SaveService.ts` auto-save atomik dan 3 slot lokal.
- [ ] C-08: Rancang komponen UI React (TopBar, StatBars, TimelineView, ActionArea, BottomNav, EventModal, GraduationScreen).
- [ ] C-09: Implementasi alur FTUE 30 detik.
- [ ] C-10: Uji unit Vitest coverage core $\ge 90\%$.

### SESI-04: ASSET-HOOK (Aset Visual & Synth)
- [ ] A-01: Verifikasi pemetaan ikon Lucide SVG di `icons.tsx`.
- [ ] A-02: Binding ikon ke navigasi tab dan status bar.
- [ ] A-03: Implementasi `ProceduralAvatar.tsx` (avatar inisial dinamis).
- [ ] A-04: Implementasi `SynthAudio.ts` Web Audio API oscillator.
- [ ] A-05: Konfigurasi default muted (`CFG_AUDIO_DEFAULT_MUTED = true`).
- [ ] A-06: Dokumentasi lisensi open-source di `ASSETS_LICENSES.md`.

### SESI-05: INFRA (PWA, Android, & CI)
- [ ] E-01: Konfigurasi Service Worker Vite PWA dengan strategi `CacheFirst`.
- [ ] E-02: Metadata PWA (manifest, icons, theme-color, orientation).
- [ ] E-03: Konfigurasi Capacitor Android (`capacitor.config.ts`).
- [ ] E-04: GitHub Actions CI workflow (.github/workflows/ci.yml).
- [ ] E-05: Root `<ErrorBoundary>` penanganan crash lokal.
- [ ] E-06: Penyusunan panduan deployment `DEPLOY_GUIDE.md`.

### SESI-06: REDTEAM (Pengujian Integritas)
- [ ] R-01: Uji tamper file save JSON (saldo diubah tanpa update checksum).
- [ ] R-02: Uji manipulasi batas usia dan stat out-of-bounds.
- [ ] R-03: Uji spam click tombol Tambah Umur (+1) pada debounce 200 ms.
- [ ] R-04: Uji pemilihan event ID atau opsi ilegal.
- [ ] R-05: Terbitkan `RED_REPORT.md` dengan bukti uji mentah.

### SESI-07: RELEASE (Kesiapan Distribusi)
- [ ] Z-01: Verifikasi seluruh exit gate SESI 01–06 berstatus HIJAU.
- [ ] Z-02: Audit kode: 0 TODO, 0 FIXME, 0 mock stub tertinggal.
- [ ] Z-03: Pengisian `PRE_DEPLOY_CHECKLIST.md`.
- [ ] Z-04: Penyusunan `CHANGELOG.md` versi 1.0.0-rc1.
- [ ] Z-05: Finalisasi `README.md`.
- [ ] Z-06: Pembuatan Git release tag `v1.0.0-rc1`.

---

## 4. METRIK & HEALTH STATUS
- **TypeScript Errors**: `0`
- **Lint Errors**: `0`
- **Unit Test Pass**: `0 / 0` (Menunggu SESI-03)
- **Core Test Coverage**: `0%` (Target: $\ge 90\%$)
- **Bundle Size Gzip**: `-` (Target: $< 350\text{ KB}$)
- **Active Blockers**: `NIHIL`

---

## 5. LANGKAH BERIKUTNYA
> **Segera Eksekusi**: `SESI-01-SETUP`  
> *Instruksi*: Jalankan setup toolchain monorepo-lite, instalasi dependensi versi terkunci, konfigurasi Vite/TypeScript/Tailwind, dan verifikasi dev server.
