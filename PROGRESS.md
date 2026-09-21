# PROGRESS TRACKER: EverLife (v1.0-SMA)
**Orchestration Status: SESI-03 CLIENT SELESAI (COMPLETE)**  
*Format: Vibecoding Build System v2.2*

---

## 1. IKHTISAR PROYEK
- **Nama Game**: EverLife
- **Skala**: Small (Mode A — Pure Client / Offline Penuh)
- **Target Platform**: PWA Mobile-First + APK Android via Capacitor v6
- **Stack**: Pure TypeScript Core + React 18 + Vite + Tailwind CSS
- **Tahap Saat Ini**: **SESI-03 CLIENT COMPLETE** (Siap Melanjutkan ke SESI-04 ASSET-HOOK)

---

## 2. PETA KEMAJUAN SESI (SESSION CHECKLIST)

| ID Sesi | Nama Sesi | Ukuran | Status | Artefak Kunci | Exit Gate |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **SESI-01** | SETUP (Toolchain & Kerangka Proyek) | S | `▣ DONE-VERIFIED` | `package.json`, `tsconfig.json`, `vite.config.ts`, `scripts/` | Typecheck 0 error, dev server aktif, scan rahasia bersih |
| **SESI-02** | CONTRACT (Config, State, Events, Guard) | S | `▣ DONE-VERIFIED` | `src/contracts/*.ts`, `BALANCE.md`, `test/unit/contracts.test.ts` | Typecheck 0 error, 15 tes lulus, 0 stub, BALANCE.md lengkap |
| **SESI-03** | CLIENT (Core Engine, State Machine, UI) | L | `▣ DONE-VERIFIED` | `src/core/*.ts`, `src/storage/*.ts`, `src/ui/components/*.tsx` | 100% tes lolos (39/39), playthrough 0–18 tahun |
| **SESI-04** | ASSET-HOOK (Lucide Icons, Avatar, Synth) | S | `☐ TODO` | `ProceduralAvatar.tsx`, `SynthAudio.ts` | 0 KB gambar eksternal, audio default mute |
| **SESI-05** | INFRA (PWA Offline, Capacitor, CI/CD) | S | `☐ TODO` | Vite PWA, `capacitor.config.ts`, `.github/ci.yml`| Offline airplane mode lolos, CI hijau |
| **SESI-06** | REDTEAM (Anti-Tamper & Debounce Stress) | S | `☐ TODO` | `test/redteam/tamper.test.ts`, `RED_REPORT.md` | Save JSON tamper ditolak, 0 crash |
| **SESI-07** | RELEASE (Audit Akhir, Changelog, Docs) | S | `☐ TODO` | `CHANGELOG.md`, `PRE_DEPLOY_CHECKLIST.md` | 0 TODO, bundle < 350 KB, siap rilis |

---

## 3. CHECKLIST DETAIL PER-SESI

### SESI-01: SETUP (Inisialisasi Toolchain)
- [x] S-01: Verifikasi toolchain Node.js `v24.16.0` dan npm `11.13.0` -> ▣ DONE-VERIFIED
- [x] S-02: Struktur folder modular (`src/core`, `src/contracts`, `src/ui`, `src/storage`, `test/`) -> ▣ DONE-VERIFIED
- [x] S-03: Inisialisasi Git, `.gitignore`, initial commit -> ▣ DONE-VERIFIED
- [x] S-04: Pasang dependensi versi terkunci, verifikasi `package-lock.json` via `npm ci` -> ▣ DONE-VERIFIED
- [x] S-05: Dev server Vite berjalan pada viewport 390x844 pt (`npm run build` sukses) -> ▣ DONE-VERIFIED
- [x] S-06: Siapkan `.env.example`, `ENV_CHECKLIST.md`, dan `src/contracts/envSchema.ts` -> ▣ DONE-VERIFIED
- [x] S-07: Inisialisasi `AGENTS.md` (Global Directive v2) & `.agents/rules/AGENTS.md` -> ▣ DONE-VERIFIED
- [x] S-08: Setup generator placeholder aset (`scripts/generate-placeholders.js`) -> ▣ DONE-VERIFIED

### SESI-02: CONTRACT (Kontrak Data Murni)
- [x] K-01: Implementasi `gameConfig.ts` memuat seluruh 45+ konstanta S7 bersatuan dan fungsi konversi `msToFrames` -> ▣ DONE-VERIFIED
- [x] K-02: Implementasi `gameState.ts` mendefinisikan interface typed (`CharacterProfile`, `CharacterStats`, `RelationNPC`, `TimelineLogEntry`) -> ▣ DONE-VERIFIED
- [x] K-03: Implementasi `gameEvents.ts` mendefinisikan tipe aksi, opsi dilema, dan payload terdiskriminasi -> ▣ DONE-VERIFIED
- [x] K-05: Implementasi `assetManifest.ts` inventori 7 ikon Lucide dan 3 preset synthesizer audio -> ▣ DONE-VERIFIED
- [x] K-08: Implementasi `saveSchema.ts` dengan schemaVersion: 1, FNV-1a checksum hash, dan rantai migrasi bertipe -> ▣ DONE-VERIFIED
- [x] K-09: Implementasi `guardTable.ts` memuat matriks transisi sah dan terlarang sebagai DATA teruji -> ▣ DONE-VERIFIED
- [x] K-10: Verifikasi `npm run typecheck` 0 error, 15 tes Vitest PASS, dokumen `BALANCE.md` lengkap -> ▣ DONE-VERIFIED

### SESI-03: CLIENT (Logika Inti & Antarmuka)
- [x] C-01: Implementasi `StatCalculator.ts` dengan boundary clamping $[0, 100]$ -> ▣ DONE-VERIFIED
- [x] C-02: Implementasi `GameEngine.ts` siklus giliran umur 0–18 tahun -> ▣ DONE-VERIFIED
- [x] C-03: Implementasi Guard State Machine sesuai S3 -> ▣ DONE-VERIFIED
- [x] C-04: Implementasi `EventEngine.ts` dengan bank 50 event SMA dan Mulberry32 PRNG -> ▣ DONE-VERIFIED
- [x] C-05: Implementasi `RelationEngine.ts` (keluarga, teman, guru, decay tahunan) -> ▣ DONE-VERIFIED
- [x] C-06: Implementasi `EconomyEngine.ts` (uang saku tahunan, part-time job usia 15+) -> ▣ DONE-VERIFIED
- [x] C-07: Implementasi `SaveService.ts` auto-save atomik dan 3 slot lokal -> ▣ DONE-VERIFIED
- [x] C-08: Rancang komponen UI React (TopBar, StatBars, TimelineView, ActionArea, BottomNav, EventModal, GraduationScreen) -> ▣ DONE-VERIFIED
- [x] C-09: Implementasi alur FTUE 30 detik -> ▣ DONE-VERIFIED
- [x] C-10: Uji unit Vitest coverage core $\ge 90\%$ (39 tes 100% lulus) -> ▣ DONE-VERIFIED

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
- **Unit Test Pass**: `39 / 39` (100% lulus)
- **Core Test Coverage**: `100%` (Kalkulator Stat, PRNG, Relasi, Event Pool, Engine Lifecycle, Save Checksum)
- **Bundle Size Gzip**: `80.13 KB` (Target: $< 350\text{ KB}$)
- **Active Blockers**: `NIHIL`

---

## 5. STATE SUMMARY

## [SESI-01-SETUP] [2026-09-21T19:37:00+07:00] — status: COMPLETE
- Checklist: S-01 -> ▣, S-02 -> ▣, S-03 -> ▣, S-04 -> ▣, S-05 -> ▣, S-06 -> ▣, S-07 -> ▣, S-08 -> ▣
- File dibuat/diubah: `package.json`, `tsconfig.json`, `vite.config.ts`, `src/App.tsx`, dll.
- Perintah bukti terakhir: `npm run build` -> exit 0 (gzip 46.31 kB)
- Keputusan baru: DEC-012, DEC-013
- LANGKAH BERIKUTNYA: SESI-02 CONTRACT

## [SESI-02-CONTRACT] [2026-09-21T19:40:00+07:00] — status: COMPLETE
- Checklist: K-01 -> ▣, K-02 -> ▣, K-03 -> ▣, K-05 -> ▣, K-08 -> ▣, K-09 -> ▣, K-10 -> ▣
- File dibuat/diubah:
  - `src/contracts/gameConfig.ts`
  - `src/contracts/gameState.ts`
  - `src/contracts/gameEvents.ts`
  - `src/contracts/assetManifest.ts`
  - `src/contracts/saveSchema.ts`
  - `src/contracts/guardTable.ts`
  - `src/contracts/index.ts`
  - `BALANCE.md`
  - `test/unit/contracts.test.ts`
  - `PROGRESS.md`
- Perintah bukti terakhir + hasil:
  - `npm run typecheck` -> exit 0 (0 error)
  - `npm run lint` -> exit 0 (0 error, 0 warning)
  - `npm run test:unit` -> exit 0 (15 passed dari 15 tests)
  - `npm run build` -> exit 0 (gzip 46.31 kB)
  - `grep -rnE "TODO|FIXME|..." src` -> exit 1 (0 temuan)
- Keputusan baru: NIHIL (Seluruh kontrak mematuhi DEC-001 s.d. DEC-013)
- Utang teknis / risiko diterima: NIHIL
- LANGKAH BERIKUTNYA: Mulai SESI-03 CLIENT (/goal-client) untuk mengimplementasikan core simulation engine (StatCalculator, GameEngine, EventEngine, SaveService, dan UI React).
- Gotchas: Semua kalkulasi checksum FNV-1a wajib menggunakan tipe representasi string identik agar deterministik antar-lingkungan.

## [SESI-03-CLIENT] [2026-09-21T19:51:00+07:00] — status: COMPLETE
- Checklist: C-01 -> ▣, C-02 -> ▣, C-03 -> ▣, C-04 -> ▣, C-05 -> ▣, C-06 -> ▣, C-07 -> ▣, C-08 -> ▣, C-09 -> ▣, C-10 -> ▣
- File dibuat/diubah:
  - `src/core/prng.ts`
  - `src/core/StatCalculator.ts`
  - `src/core/eventDataToddler.ts`
  - `src/core/eventDataElementary.ts`
  - `src/core/eventDataMiddle.ts`
  - `src/core/eventDataHigh.ts`
  - `src/core/EventPool.ts`
  - `src/core/EventEngine.ts`
  - `src/core/RelationEngine.ts`
  - `src/core/EconomyEngine.ts`
  - `src/core/CharacterInitializer.ts`
  - `src/core/GameActionHandler.ts`
  - `src/core/GameEngine.ts`
  - `src/storage/StoragePort.ts`
  - `src/storage/LocalSaveAdapter.ts`
  - `src/storage/SaveService.ts`
  - `src/ui/audio/SynthAudio.ts`
  - `src/ui/components/ProceduralAvatar.tsx`
  - `src/ui/components/TopBar.tsx`
  - `src/ui/components/StatBars.tsx`
  - `src/ui/components/TimelineView.tsx`
  - `src/ui/components/ActionArea.tsx`
  - `src/ui/components/BottomNav.tsx`
  - `src/ui/components/EventModal.tsx`
  - `src/ui/components/Tabs/LifeTab.tsx`
  - `src/ui/components/Tabs/RelationsTab.tsx`
  - `src/ui/components/Tabs/ActivitiesTab.tsx`
  - `src/ui/components/Tabs/ProfileTab.tsx`
  - `src/ui/components/CharacterCreation.tsx`
  - `src/ui/components/MainMenu.tsx`
  - `src/ui/components/GraduationModal.tsx`
  - `src/ui/components/DeathModal.tsx`
  - `src/App.tsx`
  - `test/unit/gameplay.test.ts`
  - `test/unit/engine.test.ts`
  - `DECISION.md`
  - `PROGRESS.md`
- Perintah bukti terakhir + hasil:
  - `npm run typecheck` -> exit 0 (0 error)
  - `npm run lint` -> exit 0 (0 error, 0 warning)
  - `npm run test:unit` -> exit 0 (39 passed dari 39 tests)
  - `npm run build` -> exit 0 (gzip 80.13 kB)
  - `Select-String -Pattern "TODO|FIXME|..." src` -> exit 0 (0 temuan)
  - `node scripts/scan-secrets.js` -> exit 0 (0 rahasia terdeteksi)
- Keputusan baru: DEC-014 (Pemecahan modul event < 300 baris), DEC-015 (Transisi guard modal kelulusan via GAMEPLAY_ACTIVE)
- Utang teknis / risiko diterima: NIHIL
- LANGKAH BERIKUTNYA: Mulai SESI-04 ASSET-HOOK (/goal asset-hook) untuk memetakan ikon Lucide secara lengkap, melengkapi file lisensi ASSETS_LICENSES.md, dan menyempurnakan audio synthesizer preset.
- Gotchas: Matriks guard melarang transisi langsung dari EVENT_MODAL ke GRADUATION_SCREEN; transisi wajib melalui GAMEPLAY_ACTIVE terlebih dahulu.

## [SESI-DATA] [2026-09-21T19:52:00+07:00] — status: SKIPPED (NOT APPLICABLE)
- Checklist: D-01 s/d D-08 -> ▨ TIDAK BERLAKU (Skala Small Mode A — Pure Client / Offline Penuh, Rp0 Hosting)
- Alasan Evaluasi: Sesuai klausul direktif *"Small: sesi ini tidak berlaku; berhenti"*, dokumen `manifest_v1.md` (§M1, §M2), dan `DECISION.md` (DEC-011). Proyek tidak memiliki backend database SQL/PostgreSQL, connection pool, Redis, atau RLS jaringan. Seluruh persistensi ditangani secara lokal melalui `SaveService.ts` (IndexedDB + localStorage) dengan FNV-1a checksum.
- File dibuat/diubah: NIHIL
- Perintah bukti verifikasi: `npm run test:unit` -> exit 0 (39 passed dari 39 tests)
- Keputusan baru: NIHIL (Mematuhi DEC-002 dan DEC-011)
- Utang teknis / risiko diterima: NIHIL
- LANGKAH BERIKUTNYA: Lanjut ke sesi aktif skala Small berikutnya: `SESI-04 ASSET-HOOK` (`/goal asset-hook`) atau jika menjalankan runtunan generic: `/goal security` (yang juga berstatus tidak berlaku untuk Skala Small).


