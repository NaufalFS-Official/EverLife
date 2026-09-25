# GAME BLUEPRINT: EverLife (FINAL - APPROVED)
**Role**: Senior Game Designer & Software Architect  
**Dokumen Induk**: `docs/game_prd_v1.1.md` (LOCKED)  
**Status**: APPROVED & LOCKED (Siap Eksekusi Implementasi)

---

## S1. IDENTITAS & PROFIL

| Parameter | Spesifikasi Teknis | Dasar / Tag |
| --- | --- | --- |
| **Nama Proyek** | EverLife | [V] |
| **Genre** | Text-Based Life Simulation / Branching Interactive Narrative Sandbox | [V/I] |
| **Core Loop** | Tekan "+Age" -> Evaluasi Aging & Atribut -> Render Log Naratif -> Selesaikan Modal Dilema -> Cek Refleksi Status & Neraca Finansial | [V] |
| **Panjang Sesi** | Sesi Mikro: 1 - 3 menit (2-5 tahun); Sesi Penuh: 15 - 25 menit (0 s/d 80+ tahun hingga wafat) | [A] |
| **Tone Visual & Narasi** | Satirikal, Adiktif, Eksploratif | [I] |
| **Target Audiens** | Pemain casual mobile, penikmat interactive fiction & social sim (16+) | [A] |
| **Unique Selling Point (USP)** | Moral Dilemma Matrix aktif 2-sumbu (Karma dinamis), Karir & Side-Hustle modular, sistem memori dendam/hutang relasi NPC, zero-friction mobile web | [I] |
| **Skala** | Skala M (Multi-sistem terhubung: Atribut, Relasi, Karir, Finansial/Aset, Event Pool) | [U] |
| **Konektivitas** | C0 (Offline Penuh, Local Client-Side Execution) [Standby provider cloud siap dihubungkan] | [U] |
| **Build Mode** | Mode A (Zero-backend, static deployment, client-only persistence) | [U] |
| **Genre Profile** | Naratif / Visual Novel (Utama) + Prosedural (Sekunder) | [U] |
| **Niat Rilis** | Publik (Free-to-Play Web App / PWA) | [U] |
| **Target Viewport** | Web-First Mobile Portrait (390x844 px hingga 412x915 px, aspect ratio 9:19.5, responsive centered desktop) | [U] |
| **Engine & Framework** | Web-Native SPA: React 19.3.0 + Vite 8.3.1 + Tailwind CSS 4.3.3 + Lucide Icons | [U] |
| **Bahasa** | TypeScript 7.0.2 / 5.8 (Strict Mode terkunci, zero `any`) | [U] |
| **FPS Target** | 60 FPS (Fixed Timestep 16.6 ms untuk animasi UI & tweens progress bar) | [U] |

---

## S2. FEEL SPEC

> *Sesuai Feel Spec Profil terpilih (Naratif/VN & Prosedural), lihat GEM Lampiran 1.*  
> Seluruh nilai dinyatakan menggunakan **NAMA KONSTANTA** yang terdefinisi di [S7](#s7-konfig--balance).

### Profil Utama: Naratif / Visual Novel

| Parameter | Nilai Target (Konstanta S7) | Dasar / Tag |
| --- | --- | --- |
| **Kecepatan Teks (cps)** | `FEEL_TEXT_SPEED_CPS` (0 ms / chunk per tahun, render teks log instan penuh) | [A] |
| **Graf Pilihan** | `FEEL_TREE_BRANCH_MIN` s/d `FEEL_TREE_BRANCH_MAX` cabang per node dialog | [I] |
| **Titik Save** | `FEEL_AUTOSAVE_TRIGGER` (Auto-save instan per transisi tahun & penyelesaian modal) | [A] |
| **Aturan Skip/Auto** | `FEEL_SURPRISE_ME_LATENCY_MS` (Pilihan acak berbobot instan < 50ms) | [V] |

### Profil Sekunder: Prosedural (Roguelite/Endless)

| Parameter | Nilai Target (Konstanta S7) | Dasar / Tag |
| --- | --- | --- |
| **Seed** | `FEEL_PRNG_SEED_BITS` (Integer PRNG 32-bit deterministik Mulberry32) | [A] |
| **Aturan Generator** | `FILTER_EVENT_RULES` (Filter skenario via `AgeRange`, `Gender`, `Location`, `CurrentStats`, `TagStatus`) | [I] |
| **Jaminan Solvabilitas** | `FEEL_MIN_SURVIVAL_CHOICES` (Minimal 1 opsi bertahan hidup per modal tanpa kematian langsung) | [A] |
| **Kurva Kesulitan per Kedalaman** | Mortalitas Pasif = `FORMULA_PASSIVE_MORTALITY`; krisis meningkat pasca `FEEL_CRISIS_START_AGE` | [A] |

### Game Feel & Juice Parameters

| Aksi / Respons | Nilai Target (Konstanta S7) | Toleransi | Tag |
| --- | --- | --- | --- |
| **Tap "+Age" hingga Log Bertambah** | `FEEL_AGE_TAP_LATENCY_MS` (200 ms) | +/- 2 frame | [T] |
| **Popup Dialog Skenario Muncul** | `FEEL_DIALOG_POPUP_LATENCY_MS` (150 ms) | +/- 2 frame | [T] |
| **Eksekusi Pilihan hingga Feedback** | `FEEL_CHOICE_EXECUTION_LATENCY_MS` (180 ms) | +/- 2 frame | [T] |
| **Buka Menu Tab Navigasi** | `FEEL_MENU_OPEN_LATENCY_MS` (100 ms) | +/- 1 frame | [T] |
| **Konfirmasi Karakter Baru ke Kelahiran** | `FEEL_CREATION_START_LATENCY_MS` (260 ms) | +/- 3 frame | [T] |
| **Respon Slider Drag Atribut** | `FEEL_SLIDER_DRAG_STEP_MS` (16.6 ms) | +/- 1 frame | [T] |
| **Scaling Bounce FAB "+Age"** | `FEEL_BUTTON_BOUNCE_SCALE` ke `FEEL_BUTTON_BOUNCE_DURATION_MS` | +/- 10 ms | [A] |
| **Haptic Feedback Sentuhan** | `FEEL_HAPTIC_PULSE_MS` (20 ms) | +/- 5 ms | [A] |
| **Micro Screen Shake** | `FEEL_SCREEN_SHAKE_DURATION_MS` @ `FEEL_SCREEN_SHAKE_INTENSITY_PX` | +/- 1 px | [A] |
| **Floating Stat Delta Fade** | `FEEL_FLOATING_TEXT_DURATION_MS` naik `FEEL_FLOATING_TEXT_DISTANCE_PX` | +/- 20 ms | [A] |
| **Confetti Burst Count** | `FEEL_CONFETTI_MAX_COUNT` selama `FEEL_CONFETTI_DURATION_MS` | +/- 5 partikel | [A] |

---

## S3. STATE MACHINE & GUARD

### 3.1 State Machine Lifecycle Game

```
       [BOOT]
          |
          v
   +--------------+      Reset Run
   |  MAIN_MENU   |<--------------------+
   +--------------+                     |
      |        ^                        |
Start |        | Back                   |
      v        |                        |
+-------------------+                   |
|CHARACTER_CREATION |                   |
+-------------------+                   |
      | Confirm Start Life              |
      v                                 |
+-------------------+                   |
|  GAMEPLAY_ACTIVE  |<----+             |
+-------------------+     |             |
   |        |             | Close Tab   |
   | +Age   | Tab Click   |             |
   v        v             |             |
+-------+ +-------------+ |             |
|SCENARIO| |SUBMENU_OPEN |-+             |
| POPUP | +-------------+               |
+-------+                               |
   | Resolve Choice                     |
   v                                    |
(Check Health <= 0?)                    |
   | Yes                                |
   v                                    |
+---------------+                       |
| DEATH_SUMMARY |-----------------------+
+---------------+
```

### 3.2 Tabel Transisi Guard & Otoritas

| State Asal | State Tujuan | Kondisi / Guard | Status | Mekanisme Penolakan jika Ilegal | Otoritas |
| --- | --- | --- | --- | --- | --- |
| `MAIN_MENU` | `CHARACTER_CREATION` | Tap tombol "New Life" | **SAH** | N/A | Klien [U] |
| `CHARACTER_CREATION` | `GAMEPLAY_ACTIVE` | Nama depan & belakang terisi, usia = 0, gender dipilih | **SAH** | Validasi form: outline merah pada input kosong | Klien [U] |
| `CHARACTER_CREATION` | `GAMEPLAY_ACTIVE` | Field nama kosong / spasi murni | **TERLARANG** | Tombol Start non-aktif (`disabled`), shake form 120ms | Klien [U] |
| `GAMEPLAY_ACTIVE` | `SCENARIO_POPUP` | Ada event dalam antrean `eventQueue.length > 0` | **SAH** | N/A | Klien [U] |
| `SCENARIO_POPUP` | `GAMEPLAY_ACTIVE` | Modal ditutup tanpa memilih opsi atau tombol surprise | **TERLARANG** | Dialog modal bersifat blocking (`pointer-events-none` pada backdrop) | Klien [U] |
| `GAMEPLAY_ACTIVE` | `SUBMENU_OPEN` | Tap salah satu tab bawah saat tidak ada modal | **SAH** | N/A | Klien [U] |
| `GAMEPLAY_ACTIVE` | `SUBMENU_OPEN` | Tap tab bawah saat `activeModal !== null` | **TERLARANG** | Navigasi dock di-disable dan ber-opacity 50% selama modal aktif | Klien [U] |
| `SUBMENU_OPEN` | `GAMEPLAY_ACTIVE` | Tap tombol Back (panah kiri) atau tap tab yang sama | **SAH** | N/A | Klien [U] |
| Any State | `DEATH_SUMMARY` | `character.attributes.health <= 0` atau event fatal terpicu | **INTERRUPT TERTINGGI** | Mengabaikan state lain, membersihkan modal, transisi instan ke nisan | Klien [U] |
| `DEATH_SUMMARY` | `GAMEPLAY_ACTIVE` | Mencoba kembali bermain dengan karakter yang sudah mati | **TERLARANG** | Tombol "+Age" dan tab dinonaktifkan permanen; hanya ada tombol New Life | Klien [U] |

---

## S4. BLUEPRINT NON-SPASIAL, LAYOUT UI & FTUE

### 4.1 Status Spasial & Viewport Bounds
Game ini **NON-SPASIAL** murni berbasis Graphical User Interface (DOM).
* **Viewport Base**: Mobile Portrait `390 x 844 px` (CSS logic width/height).
* **Layout Rule**: Menggunakan fixed container di tengah viewport desktop (`max-w-[430px] mx-auto min-h-screen bg-slate-50 relative shadow-2xl flex flex-col overflow-hidden`).
* **Safe Areas**: `padding-top: max(16px, env(safe-area-inset-top))`, `padding-bottom: max(16px, env(safe-area-inset-bottom))`.

### 4.2 Diagram Layout Antarmuka (ASCII UI Hierarchy)

```
+---------------------------------------------------+
| [=] EverLife    Archie King ($12,500)    Age: 18  | <- Top Profile Bar
+---------------------------------------------------+
|  [ Modular 2D SVG Avatar Component (120x120 px) ] | <- Avatar Canvas Card
+---------------------------------------------------+
|                                                   |
|  === LIFE HISTORY LOG (Scrollable Virtual List) ===|
|  * Age 18: Graduated High School with Honors      |
|  * Age 17: Started dating Sarah Jenkins           |
|  * Age 16: Got driver's license on first try      |
|  * Age 15: Adopted a stray golden retriever       |
|  * Age 0: Born in Jakarta, Indonesia              |
|                                                   |
+---------------------------------------------------+
|  Happiness [=========>       ] 65%                |
|  Health    [=============>   ] 88%                | <- Bottom Stats Dock
|  Smarts    [==========>      ] 72%                |
|  Looks     [=======>         ] 54%                |
+---------------------------------------------------+
|             (   +   )                             | <- Floating "+Age" FAB
|             (  AGE  )                             |
+---------------------------------------------------+
|  [Occupation]  [Assets]  [Relations]  [Activities]| <- Bottom Navigation Bar
+---------------------------------------------------+
```

### 4.3 FTUE 60 Detik Pertama
* **Detik 00 - 10**: Splash New Life terbuka otomatis. Pemain memilih nama ("Archie King"), gender Male, kota lahir, lalu tap tombol hijau terang `"Start Archie's life!"`. (Sinyal: SFX tangis bayi `sfx_birth`, feedback getar halus 20ms).
* **Detik 11 - 25**: Masuk Dashboard Usia 0. Log kelahiran tercetak jelas: *"I was born in Jakarta, Indonesia. My father is Budi (Age 28) and my mother is Siti (Age 26)."*. Tombol "+Age" memiliki pulsating glow hijau lembut untuk menarik perhatian.
* **Detik 26 - 40**: Pemain menekan "+Age" (Usia 1 & 2). Log bertambah secara instan. Pada usia 2, modal skenario balita muncul: *"Vaksinasi: Ibumu membawamu ke klinik untuk suntik vaksin. Apa reaksimu?"* (Pilihan: 1. Menangis histeris, 2. Mencoba tenang, 3. Menggigit dokter).
* **Detik 41 - 50**: Pemain memilih *"Mencoba tenang"*. Modal tertutup seketika (<180ms), log mencatat *"Saya bersikap berani saat disuntik."*, angka hijau melayang `+10% Health` dan `+5% Karma`. Bar Health bergerak naik mulus.
* **Detik 51 - 60**: Pemain tap tab "Relations", melihat kartu profil Ayah dan Ibu dengan bar afeksi 85%. Pemain mengeksekusi "Spend Time" bersama Ibu, bar relasi naik menjadi 95%.
* **Target Detik ke Aksi Bermakna Pertama**: `<= 12 detik` (dari tap Start Life ke penekanan pertama tombol "+Age").

---

## S5. ARSITEKTUR KLIEN & STRUKTUR KODE

### 5.1 Layering Modular & Pure Dependencies
Dependensi runtime dikunci murni client-side: `react`, `react-dom`, `lucide-react`, `canvas-confetti`, `howler`.

```
src/
├── core/                   # 100% Pure TypeScript (Zero DOM, runnable in Node.js)
│   ├── types.ts            # Definisi model entitas: Character, Event, Relationship, Career, Asset
│   ├── prng.ts             # Deterministic Mulberry32 32-bit generator
│   ├── character.ts        # State holder dan mutator atribut karakter
│   ├── aging.ts            # Algoritma siklus tahunan (+Age), amortisasi aset, kalkulasi biaya hidup
│   ├── mortality.ts        # Formula mortalitas pasif & evaluasi krisis kesehatan
│   ├── events.ts           # Event selection engine, condition evaluator, outcome resolver
│   ├── career.ts           # Job application, promotion rules, salary calculation
│   ├── relationships.ts    # NPC generation, affection decay, interaction resolver
│   ├── finances.ts         # Cashflow calculation, tax brackets, asset valuation
│   └── legacy.ts           # Ribbon evaluation, net worth audit, memorial tombstone builder
│
├── engine/                 # State management & bridge ke rendering
│   ├── GameContext.tsx     # React State Context & Actions Provider
│   ├── useGameLoop.ts      # Hook kontrol perputaran state dan queue event
│   ├── audioManager.ts     # Howler.js audio player, sound pool, mute controls
│   └── avatarComposer.ts   # Layered SVG generator untuk komposit wajah 2D
│
├── adapter/                # Platform adapters & storage repositories
│   ├── repository.ts       # ISaveRepository interface (Repository Pattern)
│   ├── storageIndexedDB.ts # IndexedDB + LocalStorage fallback dengan salted SHA-256
│   ├── storageCloud.ts     # Standby provider REST/Supabase (C1/C2 ready)
│   ├── haptics.ts          # Vibration API wrapper (aman di browser non-mobile)
│   └── telemetry.ts        # Opt-in client telemetry reporter (zero-PII)
│
├── scenes/                 # Layar & komponen UI berbasis Tailwind CSS
│   ├── MainMenuScene.tsx   # Layar pembuka & resume saved run
│   ├── CreationScene.tsx   # Layar New Life wizard & visualizer
│   ├── DashboardScene.tsx  # Layar utama: Top HUD, Virtualized Log, Bottom Stats Dock
│   ├── SubmenuDrawer.tsx   # Container bottom-sheet untuk Occupation, Assets, Relations, Activities
│   ├── ModalManager.tsx    # Dialog skenario interaktif & outcome cards
│   └── DeathScene.tsx      # Layar nisan memorial & restart trigger
│
├── config/                 # Konfigurasi & konstanta tunable
│   ├── balance.ts          # Sumber tunggal seluruh konstanta game (S7)
│   └── data/               # Static JSON content banks (events, jobs, assets, names)
│
└── index.tsx               # Entry point aplikasi
```

---

## S6. ASET & PIPELINE PENYEDIAAN

| Asset Key | Kategori | Format | Dimensi / Durasi | Tier | Fallback Placeholder | Lisensi / Sumber |
| --- | --- | --- | --- | --- | --- | --- |
| `avatar_base_head` | 2D Vector | Inline SVG | 120x120 px | P | Oval `#F1C27D` berlabel "HEAD" | Internal Procedural (MIT) |
| `avatar_hair_set` | 2D Vector | Inline SVG | 120x120 px (8 variasi x 8 warna) | P | Poligon rambut berlabel "HAIR" | Internal Procedural (MIT) |
| `avatar_eyes_set` | 2D Vector | Inline SVG | 40x20 px (6 variasi bentuk/warna) | P | 2 Titik hitam `#000000` | Internal Procedural (MIT) |
| `avatar_brows_set` | 2D Vector | Inline SVG | 40x10 px (5 variasi alis) | P | Garis persegi `#2C3E50` | Internal Procedural (MIT) |
| `ui_icon_pack` | UI Icon | SVG (Lucide) | 24x24 px (120 ikon aktivitas/pekerjaan) | H | Box abu-abu teks inisial | Lucide-React (ISC/MIT) |
| `sfx_ui_click` | Audio SFX | WebM / MP3 | 40 ms | H | Silent fallback (tanpa audio) | CC0 Kenney UI Audio |
| `sfx_age_tick` | Audio SFX | WebM / MP3 | 120 ms | H | Silent fallback (tanpa audio) | CC0 Kenney Audio |
| `sfx_birth` | Audio SFX | WebM / MP3 | 800 ms | H | Silent fallback (tanpa audio) | CC0 Freesound Baby Chime |
| `sfx_death` | Audio SFX | WebM / MP3 | 1500 ms | H | Silent fallback (tanpa audio) | CC0 Freesound Melancholy Bell |
| `sfx_cash` | Audio SFX | WebM / MP3 | 250 ms | H | Silent fallback (tanpa audio) | CC0 Kenney Casino/Cash |
| `sfx_fail` | Audio SFX | WebM / MP3 | 300 ms | H | Silent fallback (tanpa audio) | CC0 Kenney Negative Tone |

---

## S7. KONFIG & BALANCE

| Nama Konstanta | Nilai Awal | Satuan | Rentang Aman | Dampak Desain & Sistem | Tag |
| --- | --- | --- | --- | --- | --- |
| `FEEL_TEXT_SPEED_CPS` | 0 | ms/chunk | 0 - 50 | Kecepatan cetak narasi tahunan (0 = instan) | [A] |
| `FEEL_TREE_BRANCH_MIN` | 2 | pilihan | 2 - 3 | Jumlah minimum cabang pilihan per dialog | [I] |
| `FEEL_TREE_BRANCH_MAX` | 4 | pilihan | 3 - 5 | Jumlah maksimum cabang pilihan per dialog | [I] |
| `FEEL_AUTOSAVE_TRIGGER` | "ON_AGE_UP_AND_RESOLVE" | string | enum | Titik waktu auto-save dieksekusi | [A] |
| `FEEL_SURPRISE_ME_LATENCY_MS` | 50 | ms | 10 - 100 | Waktu respon tombol 'Surprise Me!' | [V] |
| `FEEL_PRNG_SEED_BITS` | 32 | bit | 32 - 64 | Ukuran integer seed deterministik | [A] |
| `FEEL_MIN_SURVIVAL_CHOICES` | 1 | pilihan | 1 - 2 | Jaminan pilihan non-fatal per modal skenario | [A] |
| `FEEL_MORTALITY_BASE_RATE` | 0.001 | rasio | 0.0005 - 0.005 | Konstanta dasar probabilitas kematian pasif | [A] |
| `FEEL_MORTALITY_EXPONENT` | 0.045 | eksponen | 0.030 - 0.060 | Laju percepatan mortalitas seiring penuaan | [A] |
| `FEEL_CRISIS_START_AGE` | 60 | tahun | 50 - 70 | Batas usia mulai melonjaknya krisis penyakit | [A] |
| `FEEL_AGE_TAP_LATENCY_MS` | 200 | ms | 100 - 300 | Animasi & render waktu tombol "+Age" ditekan | [T] |
| `FEEL_DIALOG_POPUP_LATENCY_MS` | 150 | ms | 80 - 250 | Durasi transisi pembukaan dialog modal | [T] |
| `FEEL_CHOICE_EXECUTION_LATENCY_MS` | 180 | ms | 100 - 300 | Durasi eksekusi pilihan ke outcome sheet | [T] |
| `FEEL_MENU_OPEN_LATENCY_MS` | 100 | ms | 50 - 200 | Kecepatan buka drawer submenu tab | [T] |
| `FEEL_CREATION_START_LATENCY_MS` | 260 | ms | 150 - 400 | Transisi dari form Start Life ke dashboard | [T] |
| `FEEL_SLIDER_DRAG_STEP_MS` | 16.6 | ms | 10 - 33 | Throttle refresh tampilan slider atribut | [T] |
| `FEEL_BUTTON_BOUNCE_SCALE` | 0.95 | rasio | 0.90 - 0.98 | Skala tekan tombol "+Age" saat diklik | [A] |
| `FEEL_BUTTON_BOUNCE_DURATION_MS` | 100 | ms | 50 - 200 | Durasi animasi bounce tombol kembali ke 1.0 | [A] |
| `FEEL_HAPTIC_PULSE_MS` | 20 | ms | 10 - 40 | Durasi getar getaran haptic mobile browser | [A] |
| `FEEL_SCREEN_SHAKE_DURATION_MS` | 140 | ms | 80 - 250 | Durasi getar kontainer saat terjadi krisis | [A] |
| `FEEL_SCREEN_SHAKE_INTENSITY_PX` | 2 | px | 1 - 5 | Jarak simpangan getar layar | [A] |
| `FEEL_SCREEN_SHAKE_FREQUENCY_HZ` | 25 | Hz | 15 - 40 | Frekuensi getar getaran kontainer UI | [A] |
| `FEEL_FLOATING_TEXT_DISTANCE_PX` | 24 | px | 16 - 40 | Jarak vertikal angka indikator delta melayang | [A] |
| `FEEL_FLOATING_TEXT_DURATION_MS` | 550 | ms | 350 - 800 | Durasi pemudaran angka melayang di stat bar | [A] |
| `FEEL_CONFETTI_MAX_COUNT` | 35 | partikel | 20 - 60 | Jumlah partikel canvas saat sukses/lulus | [A] |
| `FEEL_CONFETTI_DURATION_MS` | 750 | ms | 500 - 1200 | Masa hidup partikel confetti sebelum hilang | [A] |
| `FEEL_HEALTH_VIGNETTE_DURATION_MS` | 180 | ms | 100 - 300 | Durasi flash merah tepi layar saat krisis | [A] |
| `FEEL_AUDIO_SYNC_MAX_DELAY_MS` | 16 | ms | 0 - 30 | Ambang toleransi sinkronisasi trigger SFX | [A] |
| `STAT_MIN_VALUE` | 0 | % | 0 | Batas mutlak bawah seluruh stat atribut | [V] |
| `STAT_MAX_VALUE` | 100 | % | 100 | Batas mutlak atas seluruh stat atribut | [V] |
| `TAX_RATE_DEFAULT` | 0.20 | rasio | 0.05 - 0.45 | Tarif pajak pendapatan default tahunan | [A] |
| `ASSET_MAINTENANCE_RATE` | 0.02 | rasio | 0.01 - 0.05 | Biaya pemeliharaan aset tahunan (% nilai aset) | [A] |
| `LIVING_EXPENSE_BASE` | 3600 | USD/tahun | 1000 - 10000 | Biaya hidup dasar tahunan saat dewasa | [A] |

---

## S8. PERSISTENSI, REPOSITORY PATTERN & SAVE DATA

### 8.1 Abstraksi Repository Pattern

```typescript
export interface ISaveRepository {
  save(gameState: GlobalGameState): Promise<boolean>;
  load(): Promise<GlobalGameState | null>;
  clear(): Promise<void>;
  exportPayload(): Promise<string>;
  importPayload(encoded: string): Promise<boolean>;
}
```

* **Implementasi Default (MVP)**: `IndexedDBSaveRepository` (IDB via `idb-keyval` + LocalStorage fallback).
* **Implementasi Standby (C1 Cloud)**: `CloudSaveRepository` (REST API `/api/v1/save` + JWT Token).
* **Enkripsi Integritas Lokal**: Salted SHA-256 HMAC envelope.

```typescript
export interface SaveDataEnvelope {
  schemaVersion: number;
  timestamp: number;
  checksum: string; // SHA-256 (payload + salt)
  payload: GlobalGameState;
}
```

---

## S9 s/d S13. BAGIAN MODULAR TIDAK AKTIF (MODE A / C0)

* **S9 AUTH & IDENTITAS [B/C]**: **TIDAK AKTIF** (Build Mode A / C0: Single-player mandiri tanpa akun server).
* **S10 DATA & API [B/C]**: **TIDAK AKTIF** (Build Mode A / C0: JSON data statis di-bundle via Vite).
* **S11 ANTI-CHEAT & KEAMANAN**: **AKTIF (LOKAL)**: Clamping nilai atribut 0-100%, sanitize saldo `NaN`/`Infinity`, salted SHA-256 checksum envelope.
* **S12 CACHE & LEADERBOARD [B/C]**: **TIDAK AKTIF** (Build Mode A / C0: Leaderboard tidak digunakan pada MVP).
* **S13 NETCODE & SKALA [C]**: **TIDAK AKTIF** (Konektivitas C0: Permainan offline penuh).

---

## S14. HOSTING, CI/CD & OBSERVABILITAS

* **Target Hosting**: Cloudflare Pages / Vercel (Edge static CDN, otomatisasi build GitHub CI/CD, HTTPS default) [U].
* **CI/CD Pipeline**: Lint -> Typecheck -> Unit Test (Vitest) -> Build (Vite) -> E2E (Playwright Mobile) -> Cloudflare Pages Deploy.
* **Observabilitas**: Opt-in zero-PII client telemetry (`life_start`, `life_milestone`, `life_death`) via `navigator.sendBeacon`.

---

## S15. RENCANA UJI & BUKTI

| Modul | Level | Perintah Verifikasi Eksak | Ambang Lulus |
| --- | --- | --- | --- |
| **Core Logic (Aging & Atribut)** | L1 / L2 | `npx vitest run tests/unit/aging_cycle.test.ts` | 100% pass, durasi < 150ms |
| **Formula Mortalitas & Finansial** | L2 | `npx vitest run tests/unit/mortality.test.ts` | 100% pass, zero division handled |
| **Database & Schema Validator** | L2 | `npx vitest run tests/unit/schema_validator.test.ts` | 100% validasi skema 100+ event JSON |
| **Modal & Decision Resolver** | L3 | `npx vitest run tests/integration/decision_modal.test.ts` | 100% pass, state terisolasi |
| **Career & Education Pipeline** | L3 | `npx vitest run tests/integration/career_pipeline.test.ts` | 100% pass, syarat kualifikasi valid |
| **E2E Karakter s/d Kematian** | L4 | `npx playwright test tests/e2e/death_memorial.spec.ts` | UI render nisan memorial valid |
| **E2E Persistensi & Reload** | L4 | `npx playwright test tests/e2e/persistence_reload.spec.ts` | State 100% identik pasca reload |
| **Performance & Memory Gate** | L5 | `npx playwright test tests/perf/lighthouse.spec.ts` | Memory < 95MB, FPS >= 55, Score >= 90 |

---

## S16. PRA-LIVEOPS

* **SemVer**: `v1.0.0`.
* **Balance Config**: Seluruh formula terisolasi di `src/config/balance.ts`.
* **Feature Flagging**: Fitur baru dibungkus boolean flags di config.
* **Rollback Strategy**: 1-Click Rollback via Cloudflare Pages deployment history.

---

## S17. PLATFORM, DEVICE & LEGAL

### 17.1 Matriks Uji Perangkat Fisik (Level L5)
1. **Desktop Chrome**: Resolusi referensi 390x844 px centered layout.
2. **Mobile Safari iOS 16+**: Verifikasi viewport iPhone & penanganan safe-area insets (`env(safe-area-inset-top)` & `bottom`).
3. **Mobile Chrome Android**: Verifikasi performa budget/mid-tier Android (RAM 2-4GB, scroll virtual list tanpa lag).

### 17.2 Legal & Privasi (Niat Rilis: Publik)
* Zero-PII, mematuhi GDPR & COPPA, rating target 16+, lisensi kode MIT, aset CC0/MIT.

---

## S18. MATRIKS TRACEABILITY & ALOKASI SESI

| Fitur ID | Nama Fitur | Kategori | Modul Pemilik | Sesi | Agent Penanggung Jawab | AC ID | Test ID | Path Berkas Tes | Level |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **F-001** | Character Creation Wizard | **Must** | `core/character`, `scenes/CreationScene` | **Sesi 1** (Alpha) | UI & Core Sim Agent | AC-001 | `TEST-AC-001` | `tests/unit/character_creation.test.ts` | L2 |
| **F-002** | Core Aging Engine | **Must** | `core/aging`, `core/mortality` | **Sesi 1** (Alpha) | Core Sim Agent | AC-002 | `TEST-AC-002` | `tests/unit/aging_cycle.test.ts` | L2 |
| **F-003** | Main Narrative Log Viewer | **Must** | `scenes/DashboardScene`, `engine/log` | **Sesi 1** (Alpha) | UI & Audio Agent | AC-002 | `TEST-AC-002` | `tests/unit/aging_cycle.test.ts` | L2 |
| **F-004** | Interactive Decision Modals | **Must** | `core/events`, `scenes/ModalManager` | **Sesi 1** (Alpha) | Content & UI Agent | AC-003 | `TEST-AC-003` | `tests/integration/decision_modal.test.ts` | L3 |
| **F-005** | Realtime Stat Dashboard | **Must** | `core/character`, `scenes/HUD` | **Sesi 1** (Alpha) | UI & Audio Agent | AC-004 | `TEST-AC-004` | `tests/unit/mortality.test.ts` | L2 |
| **F-006** | Education & Career Pipeline | **Must** | `core/career`, `scenes/OccupationScene` | **Sesi 2** | Content & Core Sim Agent | AC-005 | `TEST-AC-005` | `tests/integration/career_pipeline.test.ts` | L3 |
| **F-007** | Basic Relationship System | **Must** | `core/relationships`, `scenes/RelationshipsScene`| **Sesi 2** | Core Sim & UI Agent | AC-006 | `TEST-AC-006` | `tests/unit/relationships.test.ts` | L2 |
| **F-012** | Modular Avatar Customizer | **Should** | `engine/avatarComposer`, `scenes/AvatarCustomizer`| **Sesi 2** | UI & Audio Agent | AC-001 | `TEST-AC-001` | `tests/unit/character_creation.test.ts` | L2 |
| **F-008** | Death & Memorial Tombstone | **Must** | `core/legacy`, `scenes/DeathScene` | **Sesi 3** | UI & Core Sim Agent | AC-007 | `TEST-AC-007` | `tests/e2e/death_memorial.spec.ts` | L4 |
| **F-009** | Local Persistence Engine | **Must** | `adapter/storageIndexedDB`, `engine/GameContext` | **Sesi 3** | Core Sim Agent | AC-008 | `TEST-AC-008` | `tests/e2e/persistence_reload.spec.ts` | L4 |
| **F-010** | Personal Finances & Assets | **Should** | `core/finances`, `scenes/AssetsScene` | **Sesi 3** | Core Sim & UI Agent | AC-002 | `TEST-AC-002` | `tests/unit/aging_cycle.test.ts` | L2 |
| **F-011** | Crime & Risky Activities | **Should** | `core/crime`, `scenes/ActivitiesScene` | **Sesi 3** | Content & Core Sim Agent | AC-003 | `TEST-AC-003` | `tests/integration/decision_modal.test.ts` | L3 |
| **F-013** | Special Talent System | **Could** | `core/talents`, `core/character` | **Sesi 4** | Content & Core Sim Agent | AC-001 | `TEST-AC-001` | `tests/unit/character_creation.test.ts` | L2 |
| **F-014** | Synchronous Multiplayer | **Won't** | N/A (Out of Scope) | - | - | - | - | - | - |
