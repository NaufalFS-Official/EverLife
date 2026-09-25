# ORCHESTRATION MANIFEST: EverLife (v1.0)
**Arsitektur Induk**: `docs/blueprint_final.md` (APPROVED)  
**Dokumen Kebutuhan**: `docs/game_prd_v1.1.md` (LOCKED)  
**Target Rilis**: Publik (Free-to-Play Web App / PWA)

---

## M1. PROJECT CARD

| Parameter | Nilai Proyek | Tag / Rujukan |
| --- | --- | --- |
| **Nama Proyek** | EverLife | [V] |
| **Skala** | Skala M (Multi-sistem: Atribut, Relasi, Karir, Finansial/Aset, Event Pool) | [U] |
| **Konektivitas** | C0 (Offline Penuh, Local Client-Side Execution) | [U] |
| **Build Mode** | Mode A (Zero-backend, static deployment, client-only persistence) | [U] |
| **Genre Profile** | Naratif / Visual Novel (Utama) + Prosedural (Sekunder) | [U] |
| **Niat Rilis** | Publik (Web Browser & PWA Gratis) | [U] |
| **Target Engine / Framework** | Web-Native SPA: React 19.3.0 + Vite 8.3.1 + Tailwind CSS 4.3.3 + Lucide Icons | [U] |
| **Bahasa & Type-Safety** | TypeScript 7.0.2 / 5.8 (Strict Mode, zero `any`, zero `@ts-ignore`) | [U] |
| **Jalur Aset** | Campuran (P + X): Procedural SVG internal untuk avatar (P) + Lucide MIT (X) + Kenney/Freesound CC0 (X) | [U] |
| **Package Manager** | npm (Node.js v24.16.0, npm 11.13.0, pnpm 9.15.9 terverifikasi) | [U] |
| **Viewport Target** | Mobile Portrait (390x844 px hingga 412x915 px, aspect ratio 9:19.5, centered desktop) | [U] |

### Anggaran Kinerja per Tier Perangkat (PRD §12.1)

| Parameter | Low-Tier (Budget Android Go) | Mid-Tier (iPhone 11 / Galaxy A5x) | High-Tier (PC Modern / Flagship) |
| --- | --- | --- | --- |
| **Batas Memori Heap** | < 95 MB | < 140 MB | < 190 MB |
| **Target FPS (p95)** | >= 50 FPS | >= 60 FPS | 60 FPS terkunci |
| **Waktu Muat Awal** | < 2.0 detik (4G) | < 1.2 detik | < 0.6 detik |
| **Ukuran Bundle (Gzip)**| < 450 KB (JS + CSS + SVG) | < 450 KB | < 450 KB |
| **Latensi Input** | < 45 ms | < 25 ms | < 16 ms |

### Tabel Perintah Bukti Terverifikasi

| Jenis Verifikasi | Perintah Terminal Eksak | Ambang Lulus |
| --- | --- | --- |
| **Install** | `npm ci` (atau `pnpm install --frozen-lockfile`) | Exit 0, zero vulnerability audit |
| **Typecheck** | `npm run typecheck` (`tsc --noEmit`) | Exit 0, zero type errors |
| **Lint** | `npm run lint` (`eslint .`) | Exit 0, zero warning/error |
| **Unit & Integration** | `npm run test:unit` (`vitest run --coverage`) | Exit 0, 100% tests pass, coverage >= 85% |
| **Build** | `npm run build` (`vite build`) | Exit 0, bundle size < 450 KB gzip |
| **End-to-End** | `npm run test:e2e` (`playwright test`) | Exit 0, 100% scenarios pass |
| **Dev Runner** | `npm run dev` (`vite`) | Server running at `http://localhost:5173` |

### Tabel Aktivasi 9 Agen Standar (Bab 10)

| No | Nama Agen | Status Proyek | Alasan Aktivasi / Penonaktifan |
| --- | --- | --- | --- |
| 1 | **Setup Agent** | **AKTIF** | Mengelola scaffolding awal, konfigurasi Vite, Tailwind 4, ESLint, dan runner pengujian. |
| 2 | **Contract Agent** | **AKTIF (Lite)** | Menyusun kontrak tipe data `types.ts`, `balance.ts`, JSON schema validator, dan interface repository. |
| 3 | **Client Agent** | **AKTIF** | Mengembangkan modul simulasi `core/`, state context, scenes UI, dan manajemen interaksi pemain. |
| 4 | **Platform Agent** | **AKTIF (Lite)** | Mengelola IndexedDB/LocalStorage adapter, Web Audio API, safe-area inset, dan haptic feedback. |
| 5 | **Asset-Hook Agent** | **AKTIF** | Mengintegrasikan generator procedural inline SVG avatar, ikon Lucide, dan audio triggers. |
| 6 | **Server Agent** | **TIDAK AKTIF** | [DEC-006] Proyek berjalan pada Mode A / Konektivitas C0 luring tanpa server backend aktif. |
| 7 | **Data & Security Agent** | **TIDAK AKTIF** | [DEC-006] Proyek tidak menggunakan database relasional server/RLS/OAuth pada fase MVP. |
| 8 | **Quality & Verify Agent** | **AKTIF** | Mengembangkan unit test, E2E Playwright, headless stress runner, dan validasi Lighthouse perf. |
| 9 | **Release & LiveOps Agent**| **AKTIF** | Mengonfigurasi PWA Manifest, Service Worker, CI/CD pipeline, dan deployment Cloudflare/Vercel. |

---

## M2. PETA SESI EKSEKUSI (MODE A)

Urutan sesi pengerjaan linier yang disesuaikan khusus untuk arsitektur Mode A:

```
[SESI-SETUP] -> [SESI-CONTRACT] -> [SESI-CLIENT-1] -> [SESI-CLIENT-2] -> [SESI-CLIENT-3]
                                                                               |
[SESI-GATE-FINAL] <- [SESI-RELEASE] <- [SESI-REDTEAM] <- [SESI-INFRA] <- [SESI-VERIFY] <- [SESI-ASSET-HOOK] <- [SESI-PLATFORM]
```

### Rincian Sesi Kerja

#### 1. SESI-SETUP (Ukuran: S)
* **Command**: `/resume-setup`
* **Agent Pemilik**: Setup Agent
* **Input yang Dibaca**: `AGENTS.md`, `manifest_v1.md`, `docs/blueprint_final.md`
* **Artefak Keluaran**: `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, `index.html`, harness Vitest & Playwright.
* **Checklist Tugas**:
  1. Inisialisasi scaffolding Vite React TypeScript (`npm create vite@latest . -- --template react-ts`).
  2. Kunci versi dependensi tanpa caret `^` di `package.json` (`react`, `react-dom`, `lucide-react`, `howler`, `canvas-confetti`).
  3. Konfigurasi Tailwind CSS v4 / v3.4 dan plugin Typography.
  4. Konfigurasi TypeScript strict mode (`noImplicitAny`, `noUncheckedIndexedAccess`, `strictNullChecks`).
  5. Konfigurasi harness pengujian: `vitest.config.ts` dan `playwright.config.ts` dengan mobile viewport emulation.
* **Exit Gate Terukur**: `npm run typecheck && npm run lint && npm run build` -> Exit 0.

#### 2. SESI-CONTRACT (Ukuran: S)
* **Command**: `/resume-contract`
* **Agent Pemilik**: Contract Agent
* **Input yang Dibaca**: `manifest_v1.md`, `docs/game_prd_v1.1.md`, `docs/blueprint_final.md`
* **Artefak Keluaran**: `src/core/types.ts`, `src/config/balance.ts`, `src/adapter/repository.ts`, `src/core/schemaValidator.ts`.
* **Checklist Tugas**:
  1. Tulis antarmuka TypeScript untuk seluruh domain: `GlobalGameState`, `Character`, `ScenarioEvent`, `Choice`, `JobListing`, `Relationship`, `SaveDataEnvelope`.
  2. Tulis sumber tunggal konstanta di `src/config/balance.ts` sesuai tabel S7 Blueprint.
  3. Tulis interface Repository Pattern `ISaveRepository` untuk persistensi.
  4. Tulis validator skema data event untuk menjamin integritas JSON bank skenario.
* **Exit Gate Terukur**: `npx vitest run tests/unit/schema_validator.test.ts` -> 100% validasi skema lolos, zero compile error.

#### 3. SESI-CLIENT-1: Alpha Core Loop (Ukuran: M)
* **Command**: `/resume-client`
* **Agent Pemilik**: Client Agent
* **Input yang Dibaca**: `src/core/types.ts`, `src/config/balance.ts`, `docs/blueprint_final.md`
* **Artefak Keluaran**: Modul core sim (`core/prng.ts`, `core/character.ts`, `core/aging.ts`, `core/events.ts`), scenes (`CreationScene.tsx`, `DashboardScene.tsx`, `ModalManager.tsx`, `HUD.tsx`), fitur F-001 s/d F-005.
* **Checklist Tugas**:
  1. Implementasi deterministik Mulberry32 PRNG berbasis seed 32-bit di `core/prng.ts`.
  2. Implementasi logic karakter, atribut 0-100%, dan pembuatan karakter baru di `core/character.ts` [F-001].
  3. Implementasi aging engine (+Age loop) dan penuaan tahunan di `core/aging.ts` [F-002].
  4. Implementasi virtualized narrative log di `scenes/DashboardScene.tsx` [F-003].
  5. Implementasi dialog modal keputusan interaktif dan outcome resolver di `scenes/ModalManager.tsx` [F-004].
  6. Implementasi realtime status dock progress bars di `scenes/HUD.tsx` [F-005].
* **Exit Gate Terukur**: `npx vitest run tests/unit/character_creation.test.ts tests/unit/aging_cycle.test.ts` -> 100% pass (L2). Karakter dapat lahir dan menua hingga usia 18 tahun secara interaktif.

#### 4. SESI-CLIENT-2: Life Systems (Ukuran: M)
* **Command**: `/resume-client`
* **Agent Pemilik**: Client Agent
* **Input yang Dibaca**: `src/core/types.ts`, `src/config/balance.ts`, `data/jobs.json`
* **Artefak Keluaran**: `core/career.ts`, `core/relationships.ts`, `scenes/OccupationScene.tsx`, `scenes/RelationshipsScene.tsx`, `scenes/AvatarCustomizer.tsx`, fitur F-006, F-007, F-012.
* **Checklist Tugas**:
  1. Implementasi sistem jenjang sekolah, lowongan kerja, gaji, performa kerja di `core/career.ts` [F-006].
  2. Implementasi entitas NPC (keluarga, pasangan), nilai afeksi, aksi interaksi sosial di `core/relationships.ts` [F-007].
  3. Implementasi editor visual avatar kustomisasi fisik (skin, eyes, hair) di `scenes/AvatarCustomizer.tsx` [F-012].
  4. Integrasi bottom navigation drawer untuk navigasi mulus antar tab.
* **Exit Gate Terukur**: `npx vitest run tests/integration/career_pipeline.test.ts tests/unit/relationships.test.ts` -> 100% pass (L3).

#### 5. SESI-CLIENT-3: Mortality, Finances & Risks (Ukuran: M)
* **Command**: `/resume-client`
* **Agent Pemilik**: Client Agent
* **Input yang Dibaca**: `src/core/types.ts`, `docs/blueprint_final.md`
* **Artefak Keluaran**: `core/mortality.ts`, `core/finances.ts`, `core/crime.ts`, `core/legacy.ts`, `scenes/DeathScene.tsx`, `scenes/AssetsScene.tsx`, `scenes/ActivitiesScene.tsx`, fitur F-008, F-010, F-011.
* **Checklist Tugas**:
  1. Implementasi formula mortalitas pasif tahunan dan evaluasi krisis kesehatan fatal di `core/mortality.ts`.
  2. Implementasi Layar Memorial Nisan (Tombstone Screen) dan permadeath lock di `scenes/DeathScene.tsx` [F-008].
  3. Implementasi sistem finansial tahunan, pajak, kepemilikan aset mobil/rumah di `core/finances.ts` & `scenes/AssetsScene.tsx` [F-010].
  4. Implementasi sistem aktivitas kejahatan, risiko penangkapan polisi, dan penjara di `core/crime.ts` & `scenes/ActivitiesScene.tsx` [F-011].
* **Exit Gate Terukur**: `npx vitest run tests/unit/mortality.test.ts` -> 100% pass. Kematian di Health=0% memicu transisi instan ke Layar Nisan.

#### 6. SESI-PLATFORM (Ukuran: S)
* **Command**: `/resume-platform`
* **Agent Pemilik**: Platform Agent
* **Input yang Dibaca**: `src/adapter/repository.ts`, `docs/blueprint_final.md`
* **Artefak Keluaran**: `src/adapter/storageIndexedDB.ts`, `src/adapter/haptics.ts`, `src/adapter/telemetry.ts`, fitur F-009.
* **Checklist Tugas**:
  1. Implementasi `IndexedDBSaveRepository` dengan persistensi atomik via `idb-keyval` dan fallback ke `window.localStorage` [F-009].
  2. Implementasi pembungkus envelope ber-salted SHA-256 HMAC checksum untuk deteksi tamper.
  3. Implementasi wrapper haptic feedback non-blocking (`navigator.vibrate([20])`).
  4. Penanganan safe area insets responsif mobile Safari iOS dan Chrome Android.
* **Exit Gate Terukur**: `npx vitest run tests/unit/storage.test.ts` -> Auto-save dan restore data berhasil 100%, deteksi hash korup berfungsi.

#### 7. SESI-ASSET-HOOK (Ukuran: S)
* **Command**: `/resume-asset`
* **Agent Pemilik**: Asset-Hook Agent
* **Input yang Dibaca**: `ASSETS_LICENSES.md`, `src/config/balance.ts`
* **Artefak Keluaran**: `src/engine/avatarComposer.ts`, `src/engine/audioManager.ts`, aset SVG modular, integrasi SFX CC0.
* **Checklist Tugas**:
  1. Implementasi generator inline SVG komposit wajah (base head, hair, eyes, brows) di `src/engine/avatarComposer.ts`.
  2. Implementasi `AudioManager` berbasis Howler.js dengan pool suara SFX dan audio unlock tap pertama.
  3. Pemasangan efek taktil suara: klik tombol, age tick, tangis lahir, koin kasir, dentang nisan.
  4. Integrasi efek confetti Canvas saat lulus atau promosi.
* **Exit Gate Terukur**: Rendering avatar visual terverifikasi di peramban, seluruh 7 trigger audio terhubung tanpa error console.

#### 8. SESI-VERIFY (Ukuran: M)
* **Command**: `/resume-verify`
* **Agent Pemilik**: Quality & Verify Agent
* **Input yang Dibaca**: Seluruh berkas tes di `tests/`, `docs/blueprint_final.md`
* **Artefak Keluaran**: Laporan uji `reports/test_report.md`, script stress test `tests/stress/headless_runner.ts`, E2E specs.
* **Checklist Tugas**:
  1. Eksekusi rangkaian uji unit dan integrasi L2/L3: coverage >= 85%.
  2. Eksekusi uji Playwright E2E L4: `TEST-AC-007` (Death Memorial) dan `TEST-AC-008` (Persistence Reload).
  3. Jalankan `headless_runner.ts` mengeksekusi 10.000 siklus kehidupan tanpa crash dan validasi rentang mortalitas 68-84 tahun.
  4. Pengukuran Lighthouse Performance pada simulasi mobile portrait (Skor >= 90, Heap < 95MB).
* **Exit Gate Terukur**: `npm run test:unit && npm run test:e2e` -> 100% pass, zero failure.

#### 9. SESI-INFRA (Ukuran: S)
* **Command**: `/resume-infra`
* **Agent Pemilik**: Release & LiveOps Agent
* **Input yang Dibaca**: `manifest_v1.md`, target hosting Cloudflare Pages / Vercel
* **Artefak Keluaran**: `.github/workflows/ci.yml`, konfigurasi build static deployment.
* **Checklist Tugas**:
  1. Buat GitHub Actions pipeline: lint -> typecheck -> vitest -> vite build -> playwright.
  2. Konfigurasi headers keamanan HTTP (CSP, X-Frame-Options, Permissions-Policy).
  3. Konfigurasi alur static hosting edge deployment.
* **Exit Gate Terukur**: Pipeline CI lokal diverifikasi berhasil dieksekusi tanpa error.

#### 10. SESI-REDTEAM & BLUETEAM (Ukuran: S)
* **Command**: `/resume-redteam`
* **Agent Pemilik**: Quality & Verify Agent
* **Input yang Dibaca**: `M8 SKALA PAYLOAD RED TEAM`, `src/adapter/storageIndexedDB.ts`
* **Artefak Keluaran**: `reports/security_tamper_report.md`, payload attack scripts di `security/attacks/`.
* **Checklist Tugas**:
  1. Eksekusi 15 payload serangan tamper lokal (injeksi atribut > 100, manipulasi saldo string, bypass dialog guard, modifikasi IndexedDB tanpa valid hash).
  2. Evaluasi mekanisme Blue Team: verifikasi auto-clamp 0-100%, sanitize NaN, fallback reset pada checksum mismatch.
* **Exit Gate Terukur**: 15 dari 15 serangan lokal berhasil dimitigasi oleh sistem pertahanan klien.

#### 11. SESI-RELEASE & GATE-FINAL (Ukuran: S)
* **Command**: `/resume-release`
* **Agent Pemilik**: Release & LiveOps Agent
* **Input yang Dibaca**: Seluruh artefak proyek, `docs/game_prd_v1.1.md`
* **Artefak Keluaran**: `public/manifest.json`, `public/sw.js`, build produksi `dist/`, rilis SemVer `v1.0.0`.
* **Checklist Tugas**:
  1. Konfigurasi PWA Manifest (nama, icons 192/512, background color, standalone display).
  2. Implementasi Service Worker offline cache untuk seluruh aset statis JS/CSS/SVG.
  3. Verifikasi ketiadaan debug hooks `window.__game` pada mode produksi (`npm run test:prod-hygiene`).
  4. Audit akhir seluruh 8 Kriteria Penerimaan (AC-001 s/d AC-008) berstatus ▣ DONE-VERIFIED.
* **Exit Gate Terukur**: PWA lulus audit installability Lighthouse, bundle size < 450 KB, aplikasi dapat dimainkan 100% offline.

---

## M3. KONTRAK BERSAMA (SHARED CONTRACTS)

### 3.1 Model Data Utama (`src/core/types.ts`)

```typescript
export type Gender = 'Male' | 'Female' | 'Non-Binary';
export type SpecialTalent = 'None' | 'Music' | 'Sports' | 'Crime' | 'Acting';
export type EducationLevel = 'None' | 'Primary' | 'Secondary' | 'University';
export type ScreenId = 'MAIN_MENU' | 'CREATION' | 'DASHBOARD' | 'DEATH';

export interface CharacterAttributes {
  happiness: number;  // 0 - 100
  health: number;     // 0 - 100
  smarts: number;     // 0 - 100
  looks: number;      // 0 - 100
  karma: number;      // 0 - 100
  discipline: number; // 0 - 100
  fertility: number;  // 0 - 100
  sexuality: 'Straight' | 'Bisexual' | 'Gay';
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
  role: 'Father' | 'Mother' | 'Sibling' | 'Friend' | 'Partner';
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

export interface Choice {
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
  choices: Choice[];
}

export interface GlobalGameState {
  runId: string;
  seed: number;
  currentScreen: ScreenId;
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

export interface SaveDataEnvelope {
  schemaVersion: number;
  timestamp: number;
  checksum: string; // SHA-256 HMAC
  payload: GlobalGameState;
}
```

### 3.2 Abstraksi Repository Pattern (`src/adapter/repository.ts`)

```typescript
export interface ISaveRepository {
  save(gameState: GlobalGameState): Promise<boolean>;
  load(): Promise<GlobalGameState | null>;
  clear(): Promise<void>;
  exportPayload(): Promise<string>;
  importPayload(encoded: string): Promise<boolean>;
}
```

### 3.3 Aksi Game Global (Event Triggers)

* `ACTION_START_LIFE`: Inisialisasi karakter baru pada usia 0 tahun.
* `ACTION_AGE_UP`: Menjalankan siklus pergantian tahun (+1 Age), kalkulasi finansial, dan evaluasi mortalitas.
* `ACTION_SELECT_CHOICE`: Memilih opsi keputusan modal skenario naratif.
* `ACTION_SURPRISE_ME`: Memilih opsi keputusan acak terbobot secara instan (<50ms).
* `ACTION_INTERACT_NPC`: Mengeksekusi aksi sosial (Spend Time, Compliment) pada entitas relasi.
* `ACTION_APPLY_JOB`: Mengajukan lamaran kerja entry-level atau profesional.

---

## M4. ATURAN KETERGANTUNGAN (DEPENDENCY RULES)

1. **Setup -> Contract**: Scaffolding paket dan konfigurasi build harus tuntas sebelum tipe data didefinisikan agar linter dan TypeScript engine dapat memvalidasi tipe secara real-time.
2. **Contract -> Client**: Tidak ada kode logika simulasi atau komponen React yang boleh ditulis sebelum `types.ts` dan `balance.ts` dikunci untuk mencegah anomali tipe data (D6).
3. **Client-1 -> Client-2 -> Client-3**: Core loop (usia & atribut) wajib stabil dan teruji (L2) sebelum sistem sekunder (karir, relasi, kejahatan) dihubungkan untuk menghindari ledakan bug state (State Explosion).
4. **Client -> Platform & Asset**: Abstraksi core logic 100% decoupling dari rendering dan storage, memungkinkan pengujian headless simulasi sebelum UI atau IndexedDB dipasang.
5. **Simulasi Penuh -> Verify -> RedTeam**: Pengujian adversarial tamper dan security hanya dapat dijalankan setelah persistensi dan skenario game terpasang utuh.
6. **Verify & RedTeam -> Release & Gate-Final**: Tidak ada artefak rilis PWA yang dibuat sebelum seluruh kriteria penerimaan lulus verifikasi 100%.

---

## M5. DEFINITION OF DONE (DoD) & MATRIKS TRACEABILITY

### Kriteria Selesai per Layer (DoD)
* **L1 (Kompilasi & Lint)**: `tsc --noEmit` nol error; `eslint` nol warning; kode bebas stub/TODO/any (D2, D5, D6).
* **L2 (Unit Logic)**: Seluruh formula penuaan, mortalitas, dan ekonomi lulus uji Vitest dengan deterministic PRNG seed; coverage >= 85%.
* **L3 (Integrasi Komponen)**: Modal skenario dapat dibuka, dipilih, dan menghasilkan mutasi state yang tepat dalam <200ms.
* **L4 (E2E Peramban)**: Skenario Playwright mereplikasi perjalanan dari lahir hingga mati (`TEST-AC-007`) dan reload tab (`TEST-AC-008`) tanpa kegagalan.
* **L5 (Kinerja & Perangkat Fisik)**: Uji Lighthouse PWA score >= 90; alokasi heap memori < 95 MB pada low-tier; frame rate UI stabil 60 FPS.

### Matriks Traceability (PRD -> Blueprint -> Test)

| Fitur ID | Nama Fitur | Kategori | Modul Pemilik | Sesi | Agent | AC ID | Test ID | Berkas Uji | Level |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **F-001** | Creation Wizard | **Must** | `core/character`, `scenes/CreationScene` | Sesi Client-1 | Client | AC-001 | `TEST-AC-001` | `tests/unit/character_creation.test.ts` | L2 |
| **F-002** | Core Aging Engine | **Must** | `core/aging`, `core/mortality` | Sesi Client-1 | Client | AC-002 | `TEST-AC-002` | `tests/unit/aging_cycle.test.ts` | L2 |
| **F-003** | Log Viewer | **Must** | `scenes/DashboardScene`, `engine/log` | Sesi Client-1 | Client | AC-002 | `TEST-AC-002` | `tests/unit/aging_cycle.test.ts` | L2 |
| **F-004** | Decision Modals | **Must** | `core/events`, `scenes/ModalManager` | Sesi Client-1 | Client | AC-003 | `TEST-AC-003` | `tests/integration/decision_modal.test.ts` | L3 |
| **F-005** | Dashboard Stats | **Must** | `core/character`, `scenes/HUD` | Sesi Client-1 | Client | AC-004 | `TEST-AC-004` | `tests/unit/mortality.test.ts` | L2 |
| **F-006** | Career Pipeline | **Must** | `core/career`, `scenes/OccupationScene` | Sesi Client-2 | Client | AC-005 | `TEST-AC-005` | `tests/integration/career_pipeline.test.ts` | L3 |
| **F-007** | Relationships | **Must** | `core/relationships`, `scenes/RelationshipsScene`| Sesi Client-2 | Client | AC-006 | `TEST-AC-006` | `tests/unit/relationships.test.ts` | L2 |
| **F-012** | Avatar Customizer| **Should** | `engine/avatarComposer`, `scenes/AvatarCustomizer`| Sesi Client-2 | Client | AC-001 | `TEST-AC-001` | `tests/unit/character_creation.test.ts` | L2 |
| **F-008** | Death Memorial | **Must** | `core/legacy`, `scenes/DeathScene` | Sesi Client-3 | Client | AC-007 | `TEST-AC-007` | `tests/e2e/death_memorial.spec.ts` | L4 |
| **F-009** | Persistence | **Must** | `adapter/storageIndexedDB`, `engine/GameContext` | Sesi Platform | Platform | AC-008 | `TEST-AC-008` | `tests/e2e/persistence_reload.spec.ts` | L4 |
| **F-010** | Personal Finances| **Should** | `core/finances`, `scenes/AssetsScene` | Sesi Client-3 | Client | AC-002 | `TEST-AC-002` | `tests/unit/aging_cycle.test.ts` | L2 |
| **F-011** | Crime Activities | **Should** | `core/crime`, `scenes/ActivitiesScene` | Sesi Client-3 | Client | AC-003 | `TEST-AC-003` | `tests/integration/decision_modal.test.ts` | L3 |
| **F-013** | Special Talents | **Could** | `core/talents`, `core/character` | Sesi Release | Client | AC-001 | `TEST-AC-001` | `tests/unit/character_creation.test.ts` | L2 |
| **F-014** | Sync Multiplayer | **Won't** | N/A (Out of Scope) | - | - | - | - | - | - |

---

## M6. REGISTRI RISIKO & KEPUTUSAN

### Log Keputusan Desain (DEC-001 s/d DEC-008)

| ID | Keputusan | Alasan | Alternatif yang Ditolak |
| --- | --- | --- | --- |
| **DEC-001** | Permadeath Murni (ulang dari usia 0 saat wafat) | Menjaga bobot keputusan tanpa kompleksitas save rewind pada MVP. | Fitur "Time Machine" (memutar balik tahun). |
| **DEC-002** | Sandbox Slider Bebas (0-100%) | Memberikan kebebasan bermain peran (roleplay) instan sesuai dokumen referensi. | Sistem point-buy terbatas (jatah poin kaku). |
| **DEC-003** | Penundaan Sistem Dinasti Generasi | Memfokuskan pengujian pada kekayaan percabangan satu siklus hidup penuh. | Melanjutkan permainan sebagai anak kandung. |
| **DEC-004** | Karir & Kejahatan Berbasis Teks Murni | Menjaga kesatuan genre simulasi teks tanpa beban minigame aksi fisik sekunder. | Minigame aksi arcade (kabur penjara / balapan). |
| **DEC-005** | Injeksi Test ID Eksak (TEST-AC-001 s/d 008) | Memenuhi syarat kelengkapan audit arsitektur dan penelusuran regresi. | Pengujian ad-hoc tanpa ID pelacak. |
| **DEC-006** | Peniadaan Sesi Server & Data Backend | Proyek beroperasi pada Build Mode A / Konektivitas C0 luring 100%. | Penyediaan server Node.js / database PostgreSQL. |
| **DEC-007** | Peniadaan WebSocket & Netcode Autoritatif | Permainan berformat single-player mandiri tanpa interaksi sosial real-time. | Arsitektur multiplayer client-server. |
| **DEC-008** | Konsolidasi Sesi RedTeam & BlueTeam ke Tamper Lokal | Model ancaman Mode A terfokus pada integritas save storage IndexedDB dan validasi batas input. | Uji penetrasi server API / penipuan skor jaringan. |

### Top-5 Risiko Arsitektur & Mitigasi

1. **DOM Memory Bloat pada Log Riwayat 80+ Tahun**: Mitigasi via Virtualized List (`@tanstack/react-virtual` atau custom windowing DOM) hanya merender 12-15 entri aktif di layar.
2. **Data Save Korup saat Tab Ditutup Cepat**: Mitigasi via transaksi atomik IndexedDB dengan validasi envelope salted SHA-256 HMAC dan backup instan ke LocalStorage.
3. **Deadlock / Invalid Event Branching**: Mitigasi via static schema validation script yang memindai seluruh skenario JSON sebelum build rilis.
4. **Pergeseran Tata Letak Viewport Mobile Browser**: Mitigasi via CSS units modern `100dvh` dan padding dinamis `env(safe-area-inset-*)`.
5. **Overhead Re-render Avatar Modular**: Mitigasi via React component memoization dan komposit caching ke Canvas bitmap statis di luar mode editor.

---

## M7. PROTOKOL PERGANTIAN SESI & STATE SUMMARY

### Mekanisme `/resume-[agent]`
Setiap pergantian sesi diawali dengan pemanggilan perintah slash agen spesifik (misal `/resume-setup`, `/resume-client`, `/resume-verify`). Agen yang bertugas wajib membaca `AGENTS.md`, `PROGRESS.md`, dan `manifest_v1.md` sebelum melakukan perubahan berkas.

### Format Wajib STATE SUMMARY (Append ke `PROGRESS.md`)

```markdown
## [SESI-ID] [tanggal-waktu] — status: COMPLETE | PARTIAL | BLOCKED
- Checklist: ID -> ☐/▣/▨/✖ (ringkas)
- File dibuat/diubah (path)
- Perintah bukti terakhir + hasil (1 baris tiap perintah)
- Level verifikasi tercapai (L1-L5) dan yang MENUNGGU MANUSIA
- Keputusan baru (DEC-###)
- Utang teknis / risiko diterima
- LANGKAH BERIKUTNYA: butir pertama yang belum selesai + konteks minimal untuk melanjutkan
- Gotchas: hal yang memakan waktu/menyebabkan error
```

---

## M8. SKALA PAYLOAD RED TEAM (TAMPER KLIEN LOKAL)

Sesuai Build Mode A (Konektivitas C0), model ancaman berfokus pada **Manipulasi Penyimpanan Lokal & Validasi Input Klien**. Sebanyak **15 Payload Terarah** disiapkan untuk memverifikasi ketahanan sistem:

| Payload ID | Kategori Ancaman | Deskripsi Payload Uji | Vektor Serangan | Ekspektasi Pertahanan Sistem (Pass) |
| --- | --- | --- | --- | --- |
| `PL-01` | Save Integrity | Memodifikasi saldo `bankBalance` menjadi `999999999` di IndexedDB tanpa memperbarui checksum SHA-256 | IndexedDB ObjectStore edit | Checksum mismatch terdeteksi; sistem menolak payload dan memulihkan backup aman. |
| `PL-02` | Stat Overflow | Injeksi nilai `health: 250` pada state karakter melalui console script | Direct memory mutation | Nilai dijepit (`clamp`) otomatis ke `100` pada tick komputasi berikutnya. |
| `PL-03` | Stat Underflow | Injeksi nilai `happiness: -50` pada state karakter | Direct memory mutation | Nilai dijepit (`clamp`) otomatis ke `0`. |
| `PL-04` | Nan Injection | Injeksi nilai `annualSalary: NaN` pada state finansial | Direct memory mutation | Sanitasi number parser mengoreksi nilai menjadi `0` tanpa crash UI. |
| `PL-05` | Negative Infinity | Injeksi nilai `bankBalance: -Infinity` | Direct memory mutation | Sanitasi nilai mengubah balance menjadi batas minimum aman `$0`. |
| `PL-06` | Age Rewind | Menurunkan usia karakter dari 30 tahun kembali ke usia 15 tahun | State injection | Transisi ditolak oleh guard state machine; log mencatat pelanggaran sequence. |
| `PL-07` | Age Skip | Memanipulasi usia melonjak dari 5 tahun menjadi 75 tahun dalam 1 frame | State injection | Siklus `+Age` memvalidasi increment diskrit wajib tepat `+1` tahun. |
| `PL-08` | Modal Escape | Memaksa penutupan modal wajib tanpa memilih opsi via `activeModal = null` | UI DOM tampering | Guard state mendeteksi antrean unresolved event dan membuka kembali modal. |
| `PL-09` | Multi-Click Age | Mengirim 50 event tap simultan pada tombol "+Age" dalam durasi 100ms | Rapid input spamming | Debounce / throttle controller mengabaikan tap sekunder hingga siklus tahun tuntas. |
| `PL-10` | Deadlock Event | Injeksi scenario event JSON yang memiliki `choices: []` (nol opsi) | Schema corruption | Schema validator menangkap error dan mengalihkan ke fallback generic event. |
| `PL-11` | Illegal Job Hire | Mengirim aksi melamar pekerjaan dokter bedah saat kualifikasi `smarts < 50` | Action dispatch bypass | Evaluator kualifikasi menolak lamaran dan menampilkan feedback penolakan. |
| `PL-12` | Phantom NPC | Menambahkan relasi NPC dengan afeksi `relationshipBar: 999` | Memory injection | Mutasi afeksi dijepit ke rentang aman 0-100%. |
| `PL-13` | Corrupt Save JSON | Mengisi slot penyimpanan IndexedDB dengan raw string acak non-JSON | Storage corruption | Safe JSON parser menangkap exception, menampilkan notifikasi pemulihan, dan mereset ke New Life. |
| `PL-14` | Post-Death Action | Mengirim aksi penuaan atau interaksi karir setelah karakter berstatus meninggal | Action dispatch bypass | Guard transisi mengunci seluruh interaksi kecuali tombol New Life / Restart. |
| `PL-15` | Storage Blocked | Menjalankan game pada mode Incognito ketat dengan IndexedDB dinonaktifkan | Environment limitation | Storage adapter otomatis mendeteksi kegagalan dan beralih ke `window.localStorage` tanpa crash. |

---

> **ORCHESTRATION MANIFEST v1.0 LOCKED**. Dokumen ini menjadi pedoman operasional seluruh agen dari Tahap 2 hingga Tahap 4.
