# GAME PRD: EverLife - v1.0 (DRAFT)

## 1. Identitas & Ikhtisar

* **Working Title**: EverLife [V].
* **Genre / Sub-genre**: Text-Based Life Simulator [V] / Branching Interactive Narrative Sandbox [I: narasi pilihan bercabang].
* **High-Concept**: Simulator kehidupan berbasis teks modular di mana pemain mengendalikan takdir karakter dari lahir hingga wafat melalui pilihan diskrit tahunan, manajemen relasi, dan manipulasi atribut moral [V].
* **Design Pillars**:
  1. *Meaningful Causality*: Setiap keputusan memiliki dampak berantai jangka pendek dan panjang pada relasi, atribut, dan reputasi [V].
  2. *Emergent Storytelling*: Perpaduan skenario acak berbobot menghasilkan drama satirikal unik pada setiap playthrough [V].
  3. *Zero-Friction Gameplay*: Antarmuka berbasis list vertikal yang responsif, minim jeda, dan instan dieksekusi [I: interaksi berbasis menu cepat].
* **Pembeda vs Referensi (BitLife)**:
  1. *Moral Dilemma Matrix*: Sistem Karma aktif 2-sumbu (Order vs Chaos, Altruism vs Greed) yang membuka faksi rahasia, bukan sekadar stat pasif persentase [I: pembeda originalitas].
  2. *Modular Career & Hustle Tree*: Pemain dapat memadukan pekerjaan formal dengan usaha rintisan mikro (side-hustle) tanpa batasan kaku karir korporat tunggal [I: pembeda originalitas].
  3. *NPC Memory & Grudge System*: NPC keluarga dan rekan memiliki status afeksi dinamis dengan sistem memori dendam/hutang budi yang memicu pembalasan acak di masa depan [I: pembeda originalitas].
* **Non-Goals**:
  1. Tidak menyediakan pergerakan spasial real-time 2D/3D (non-spasial sandbox) [A].
  2. Tidak menyediakan mode multiplayer sinkronus real-time (fokus single-player mandiri) [A].
  3. Tidak menggunakan animasi 3D kompleks atau rendering grafis berat (UI clean flat-vector native) [A].
* **Target Audiens**: Penggemar simulasi sosial, interactive fiction, dan casual mobile gamers usia 16+ [A: tema drama, kejahatan, dan romansa].
* **Panjang Sesi**:
  * *Sesi Mikro*: 1 - 3 menit (memainkan 2-5 tahun kehidupan secara cepat saat jeda santai) [A].
  * *Sesi Penuh*: 15 - 25 menit (menyelesaikan 1 siklus kehidupan penuh 0 hingga 80+ tahun) [A].
* **Core Loop**:
  * *30 Detik*: Tekan "+Age" -> Baca log peristiwa tahunan -> Tanggapi 1 modal skenario dilema hidup -> Evaluasi perubahan status bar [V].
  * *Sesi (15-25 menit)*: Ambil jalur pendidikan -> Rintis karir/kejahatan -> Akumulasi kekayaan dan aset -> Bangun jejaring relasi keluarga/sosial -> Hadapi krisis usia tua -> Wafat [V].
  * *Meta-Progresi*: Buka pencapaian permanen (Achievements), koleksi pita/gelar kematian (Ribbons), dan unlockable bloodline legacy [I: loop simulator hidup].

---

## 2. Profil & Keputusan Arsitektur

| Keputusan | Pilihan | Alasan | Tag |
| --- | --- | --- | --- |
| **Skala** | Skala M | Melibatkan multi-sistem terhubung (atribut, relasi, karir, inventaris aset, dan database event bercabang). | [I: kompleksitas sistem sedang] |
| **Konektivitas** | C0 (Offline Penuh) | Game naratif single-player mandiri tanpa dependensi server atau leaderboard real-time. | [A: offline-first] |
| **Build Mode** | Mode A | Arsitektur client-side murni, zero-backend, zero-network overhead. | [I: turunan C0] |
| **Genre Profile** | Naratif / VN (Utama) + Prosedural (Sekunder) | Alur pilihan teks bercabang dengan distribusi event berbasis generator terbobot. | [I: berbasis teks & seed acak] |
| **Niat Rilis** | Publik | Rilis publik web gratis, responsif mobile, didukung PWA. | [I: teks "simulator gratis"] |
| **Platform & Viewport** | Web-First (Mobile Portrait Viewport) | Target rasio aspek 9:19.5 (resolusi canvas/CSS 390x844 px hingga 412x915 px). | [V: tata letak mobile portrait] |
| **Engine / Framework** | Web-Native SPA (React / Solid.js + TypeScript + Tailwind) | Virtual DOM cepat, rendering teks dense bebas lag, struktur form/modal mudah diuji via unit test. | [A: efisiensi UI teks] |
| **Bahasa & Type-Safety** | TypeScript (Strict Mode) | Menjamin integritas skema data event naratif, relasi NPC, dan payload aksi. | [A: reliabilitas kode] |
| **Physics** | N/A (Non-Spasial) | Tidak ada interaksi tabrakan fisik atau kalkulasi gaya kinematik. | [V: simulasi teks murni] |
| **Netcode** | N/A (Konektivitas C0) | Tidak ada sinkronisasi jaringan antar pemain. | [I: turunan C0] |
| **Audio Stack** | Web Audio API / Howler.js | Audio triggering ringan untuk SFX UI pendek (klik, chime, notifikasi). | [A: web standard] |
| **Storage / Save** | IndexedDB / LocalStorage | Auto-save state penuh terenkripsi JSON lokal setiap transisi tahun (+Age). | [A: persistensi offline] |
| **Target FPS & Step** | 60 FPS (Fixed Timestep 16.6 ms untuk UI tweens) | Menjamin animasi transisi progress bar dan modal terasa licin (snappy). | [A: standar UI modern] |

### Testability & Verification Setup

* **RNG Ber-seed**: Menggunakan implementasi PRNG deterministik (Mulberry32 / PCG32) berbasis integer seed 32-bit untuk mereplikasi seluruh perjalanan hidup karakter secara identik [A].
* **Headless Logic Decoupling**: Logika engine simulasi hidup (`LifeSimulationCore`) terisolasi 100% dari layer render DOM/React, dapat dieksekusi via Node.js tanpa browser untuk stress test jutaan siklus hidup [A].
* **Hooks Debug Global (`window.__game`)**:
  * `window.__game.setSeed(seed: number)`: Mengunci seed RNG simulasi [A].
  * `window.__game.getState()`: Mengambil snapshot state hidup karakter saat ini [A].
  * `window.__game.setState(statePartial: object)`: Menginjeksi state atribut/usia karakter [A].
  * `window.__game.fastForward(years: number)`: Mengeksekusi penuaan otomatis sejumlah tahun dengan pilihan acak deterministik [A].
  * `window.__game.triggerEvent(eventId: string)`: Membuka modal skenario tertentu secara instan [A].
* **Replay Deterministik**: Log input berupa array `[Seed, Array<ChoiceAction>]` untuk verifikasi regresi bug [A].
* **Flag `?debug=1`**: Menampilkan overlay status tersembunyi (Karma, Craziness, Internal NPC Affection, FPS monitor) [A].
* **Perintah Verifikasi Otomatis**:
  * `npm run typecheck`: Validasi ketat skema data naratif dan type system [A].
  * `npm run lint`: Pemeriksaan code style dan security linting [A].
  * `npm run test:unit`: Pengujian formula ekonomi, kalkulasi mortalitas, dan rule engine [A].
  * `npm run test:e2e`: Otomasi Playwright untuk alur pembuatan karakter hingga kematian [A].

---

## 3. Spesifikasi Mekanika

### 3.1 Peta Kontrol

| Aksi | Touch (Mobile) | Mouse Click (Desktop) | Keyboard Binding (Desktop) | Tag |
| --- | --- | --- | --- | --- |
| **Age Up (+Age)** | Tap FAB tombol hijau bawah | Left Click FAB | `Space` / `Enter` | [V/A] |
| **Buka Menu Tab** | Tap ikon bar bawah (4 tab) | Left Click ikon tab | `Digit1` s/d `Digit4` | [V/A] |
| **Pilih Opsi Dialog** | Tap tombol card pilihan | Left Click card pilihan | `KeyA`, `KeyB`, `KeyC`, `KeyD` | [V/A] |
| **Surprise Me!** | Tap tombol shuffle bawah | Left Click tombol shuffle | `KeyR` | [V/A] |
| **Tutup Modal / Batal** | Tap ikon 'X' / luar area | Left Click ikon 'X' | `Escape` | [V/A] |
| **Scroll Log Teks** | Vertical Swipe drag | Mouse Wheel vertical | `ArrowUp` / `ArrowDown` | [V/A] |

### 3.2 Feel Spec Final

*Profil Utama: Naratif / Visual Novel*

| Parameter | Nilai Target | Tag |
| --- | --- | --- |
| Kecepatan teks (cps) | Instan (0 ms / chunk per tahun), teks dialog langsung dirender penuh | [A: menjaga pacing cepat game teks] |
| Graf pilihan | Tree terdistribusi acak (1 Root per tahun -> 1 Node Skenario -> 2 hingga 4 Cabang Hasil) | [I: struktur modal event di video] |
| Titik save | Auto-save otomatis setiap kali state tahun bertambah (+Age) atau aksi penting selesai | [A: mencegah save-scumming instan] |
| Aturan skip/auto | Tidak ada auto-play; tombol skip/surprise me memilih opsi acak berbobot secara instan (<50ms) | [V: tombol 'Surprise me!'] |

*Profil Sekunder: Prosedural (roguelite/endless)*

| Parameter | Nilai Target | Tag |
| --- | --- | --- |
| Seed | Integer PRNG 32-bit (mis. PCG / Mulberry32) per kehidupan karakter | [A: replikasi run identik] |
| Aturan generator | Filter kejadian berdasarkan `AgeRange`, `Gender`, `Location`, `CurrentStats`, dan `TagStatus` | [I: event anak tidak muncul saat dewasa] |
| Jaminan solvabilitas | Setiap skenario wajib memiliki minimal 1 opsi netral/bertahan hidup tanpa instan Game Over | [A: standar fairness narratif] |
| Kurva kesulitan per kedalaman | Probabilitas mortalitas pasif = $0.001 \times e^{0.045 \times Age}$; skenario krisis meningkat frekuensinya setelah usia 60 | [A: kalibrasi saat prototipe] |

### 3.3 Parameter Gerak & Fisika

* **Status Fisika**: N/A - Game bergenre simulasi teks dan UI tabular. Tidak terdapat entitas fisika, massa, akselerasi spasial, maupun gaya gravitasi [V].

### 3.4 Matriks Tabrakan & Hitbox

* **Status Tabrakan**: N/A - Non-spasial layout. Seluruh deteksi interaksi ditangani via UI event boundary (DOM bounding-box click/tap events) [V].

### 3.5 Skor, Ekonomi, dan Kesulitan

* **Sistem Atribut Dasar (0 - 100%)**:
  * `Happiness`: Mengukur kepuasan batin. Berkurang akibat depresi, isolasi, penyakit (-5% s/d -30%). Bertambah via hiburan, relasi positif (+5% s/d +20%) [V].
  * `Health`: Mengukur ketahanan fisik. Merosot saat sakit, terluka, atau usia lanjut. Mencapai 0% memicu kematian [V].
  * `Smarts`: Menentukan keberhasilan akademik, penerimaan kerja, dan efektivitas riset [V].
  * `Looks`: Mempengaruhi daya tarik sosial, modeling, dan kemudahan mencari pasangan [V].
  * `Hidden Stats`: `Karma` (0-100%, mempengaruhi peluang selamat dari krisis), `Discipline` (0-100%, retensi performa kerja), `Fertility` (0-100%, peluang konsepsi anak) [V].
* **Formula Finansial Tahunan**:
  $$\text{Net Income} = \text{Annual Salary} - \text{Taxes} - \text{Living Expenses} - \text{Asset Maintenance}$$ [A]
  * $\text{Taxes} = \text{Annual Salary} \times \text{TaxRate}_{\text{Country}}$ (rentang 0% - 45% tergantung negara kelahiran) [A].
  * $\text{Asset Maintenance} = \sum (\text{Asset Value}_i \times 0.02)$ [A].
  * $\text{Balance}_{t+1} = \text{Balance}_t + \text{Net Income} + (\text{Investments}_t \times \text{YieldRate})$ [A].
* **Formula Mortalitas Pasif Tahunan**:
  $$P(\text{Death}) = \max\left(0, \frac{100 - \text{Health}}{100}\right) \times 0.25 + (0.001 \times e^{0.045 \times \text{Age}})$$ [A]
  * Jika `Health` = 0%, $P(\text{Death}) = 1.0$ (Kematian instan) [A].
  * Jika lolos evaluasi mortalitas, karakter bertahan ke tahun berikutnya [A].

### 3.6 Kondisi Menang, Kalah, dan Akhir Game

* **Sifat Alur**: Non-linear Endless Sandbox (tanpa kondisi menang biner) [V].
* **Kondisi Kalah / Selesai (Game Over)**:
  * Karakter mengalami kematian (`Health` habis, eksekusi hukuman mati, kecelakaan fatal, atau komplikasi usia lanjut) [V].
  * Saat mati, layar game beralih ke Layar Memorial/Nisan (Tombstone Screen) [I: standar life sim].
* **Kriteria Evaluasi Akhir (Legacy Evaluation)**:
  * Total Kekayaan Bersih (Net Worth) [V].
  * Usia Akhir Hidup (Final Age) [V].
  * Gelar Nisan Kehidupan (Ribbon earned: misal "Hero", "Scoundrel", "Loaded", "Mediocre", "Wicked") berdasarkan matriks akumulasi Karma dan aset [I: sistem pencapaian].

---

## 4. State Machine

### 4.1 Entitas Game Lifecycle

| State | Masuk dari | Keluar ke | Otoritas |
| --- | --- | --- | --- |
| **MAIN_MENU** | Boot / Reset | CHARACTER_CREATION, GAMEPLAY_ACTIVE | Client [A] |
| **CHARACTER_CREATION** | MAIN_MENU | GAMEPLAY_ACTIVE, MAIN_MENU | Client [A] |
| **GAMEPLAY_ACTIVE** | CHARACTER_CREATION, DIALOG_RESOLVED | SCENARIO_POPUP, SUBMENU_OPEN, DEATH_SUMMARY | Client [A] |
| **SCENARIO_POPUP** | GAMEPLAY_ACTIVE (saat +Age atau trigger aktivitas) | DIALOG_RESOLVED, DEATH_SUMMARY | Client [A] |
| **SUBMENU_OPEN** | GAMEPLAY_ACTIVE (tap tab navigasi) | GAMEPLAY_ACTIVE, SUBMENU_DETAIL, SCENARIO_POPUP | Client [A] |
| **DEATH_SUMMARY** | SCENARIO_POPUP, GAMEPLAY_ACTIVE (kematian terverifikasi) | MAIN_MENU, CHARACTER_CREATION | Client [A] |

### 4.2 Guard Matrix & Prioritas Transisi

| State Asal | State Tujuan | Status | Alasan / Aturan Guard |
| --- | --- | --- | --- |
| `CHARACTER_CREATION` | `GAMEPLAY_ACTIVE` | **SAH** | Seluruh field nama terisi dan usia awal disetel ke 0 [V]. |
| `GAMEPLAY_ACTIVE` | `SCENARIO_POPUP` | **SAH** | Terpicu jika terdapat antrean event skenario aktif [V]. |
| `SCENARIO_POPUP` | `GAMEPLAY_ACTIVE` | **TERLARANG** | Dilarang menutup popup wajib sebelum memilih salah satu opsi resolusi [V]. |
| `GAMEPLAY_ACTIVE` | `SUBMENU_OPEN` | **TERLARANG** | Terlarang membuka tab navigasi jika terdapat modal popup skenario terbuka [V]. |
| Any State | `DEATH_SUMMARY` | **INTERRUPT TERTINGGI** | Dipicu instan saat `Health` <= 0 atau fatal event resolver terpanggil [A]. |

---

## 5. Alur Layar & State Global

### 5.1 Alur Navigasi Layar

```
[Boot / Preload]
       |
       v
[Main Menu] --------> [New Life Wizard]
       |                      | (Start Life!)
       v                      v
[Saved Runs] -------> [Life Dashboard (HUD + Main Log)]
                             |  ^
           +-----------------+  | (Tutup Modal / Selesai Aksi)
           |                    |
           +--> [Occupation / School Screen]
           +--> [Assets & Net Worth Screen]
           +--> [Relationships Screen] -> [NPC Detail Action Menu]
           +--> [Activities Screen]    -> [Activity Execution Flow]
           +--> [Scenario Popup Modal] -> [Outcome Feedback Sheet]
           |
           +--> (Karakter Meninggal)
           |
           v
   [Memorial / Tombstone Summary] ---> [Kembali ke Main Menu]
```

### 5.2 Antarmuka State Global (TypeScript)

```typescript
interface GlobalGameState {
  runId: string;
  seed: number;
  isPaused: boolean;
  gameSpeed: number; // multiplier untuk animasi dialog
  currentScreen: 'MAIN_MENU' | 'CREATION' | 'DASHBOARD' | 'DEATH';
  activeModal: ScenarioDialog | null;
  character: {
    name: { first: string; last: string };
    gender: 'Male' | 'Female' | 'Non-Binary';
    age: number;
    birthLocation: { country: string; city: string };
    specialTalent: 'None' | 'Music' | 'Sports' | 'Crime' | 'Acting';
    appearance: { skin: number; eyes: number; brows: number; hair: number; hairColor: number };
    attributes: {
      happiness: number;  // 0 - 100
      health: number;     // 0 - 100
      smarts: number;     // 0 - 100
      looks: number;      // 0 - 100
      karma: number;      // 0 - 100
      discipline: number; // 0 - 100
      fertility: number;  // 0 - 100
      sexuality: 'Straight' | 'Bisexual' | 'Gay';
    };
    finances: {
      bankBalance: number;
      netWorth: number;
      annualIncome: number;
      monthlyOutflow: number;
    };
    education: { level: 'None' | 'Primary' | 'Secondary' | 'University'; grades: number };
    job: { title: string; salary: number; performance: number } | null;
    relationships: Array<{
      id: string;
      name: string;
      role: 'Father' | 'Mother' | 'Sibling' | 'Friend' | 'Partner' | 'Pet';
      age: number;
      relationshipBar: number; // 0 - 100
      alive: boolean;
    }>;
    lifeLog: Array<{ age: number; text: string; categoryTag: string; iconKey: string }>;
  };
}
```

---

## 6. Blueprint Ruang, FTUE & Onboarding

### 6.1 Status Blueprint Spasial

* **Status Blueprint**: N/A - Non-Spasial [V]. EverLife adalah game berbasis graphical user interface (GUI) murni yang dirender via list DOM. Tidak terdapat arena spasial, sistem ubin (tilemap), zonasi fisik, maupun koordinat kamera [V].

### 6.2 FTUE 60 Detik Pertama (First-Time User Experience)

| Detik | Peristiwa / Tampilan | Yang Dipelajari Pemain | Sinyal Umpan Balik | Tag |
| --- | --- | --- | --- | --- |
| **00 - 10** | Layar New Life terbuka; pemain memilih Nama, Negara, dan Gender lalu tap "Start Life!" | Cara inisialisasi karakter dasar dan personalisasi tampilan. | SFX tangis bayi; layar bergetar halus saat dunia digenerate. | [V/A] |
| **11 - 25** | Tiba di Dashboard Usia 0; log kelahiran muncul menjelaskan orang tua dan kota lahir. FAB "+Age" berkedip lembut. | Pemain memahami bahwa narasi utama ada di log tengah dan tombol utama adalah "+Age". | Glow hijau pada FAB "+Age"; tooltip penunjuk berdenyut. | [V/A] |
| **26 - 40** | Pemain menekan "+Age" (Usia 1 & 2); log baru tercetak; muncul skenario masa balita pertama (mis. disuruh minum obat/vaksinasi). | Setiap tahun membawa peristiwa baru; pemain harus membuat keputusan hidup melalui popup pilihan. | Suara denting lembut; dialog modal muncul memblokir layar background. | [V/A] |
| **41 - 50** | Pemain memilih satu opsi (mis. "Try to stay calm"); popup tertutup dan log mencatat aksi. Bar Health & Happiness bergerak naik. | Pilihan memiliki konsekuensi langsung pada status visual karakter. | Nilai numerik hijau melayang di atas bar status; SFX konfirmasi positif. | [V/A] |
| **51 - 60** | Pemain mengeksplorasi tab bawah "Relationships" dan melihat profil kedua orang tua serta hewan peliharaan. | Pemain menyadari ada dunia sosial dan relasi yang dapat dipelihara di tab terpisah. | Kartu orang tua terbuka dengan menu interaksi (Spend Time, Compliment). | [V/A] |

* **Target Waktu ke Aksi Bermakna Pertama**: <= 15 detik dari tap tombol "Start Life!" hingga penekanan pertama tombol "+Age" [A].
* **Aturan Lewati Tutorial**: Tutorial berkonsep organik non-intrusif (tersirat dalam desain antarmuka). Tidak ada overlay tutorial panjang yang wajib di-skip pemain [A].
* **Format Pesan Kematian**:
  * Wajib menampilkan penyebab pasti kematian + ringkasan hidup + saran reflektif [I].
  * *Contoh Pesan*: "Kamu meninggal pada usia 42 tahun akibat komplikasi serangan jantung karena bekerja terlalu keras dengan kesehatan rendah. Saran: Jangan abaikan pemeriksaan medis di menu Doctor saat Health berada di bawah 30%!" [A].

---

## 7. Manifest Aset & Scope Honesty

### 7.1 Daftar Aset Visual & Audio

| Asset Key | Aset | Kategori | Dimensi / Poly | Format | Tier | Fallback Placeholder | Lisensi / Atribusi |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `avatar_base_head` | Bentuk kepala dasar karakter | 2D Vector | 120x120 px | SVG | P | Oval berlabel "HEAD" | Kode kustom internal (MIT) [A] |
| `avatar_hair_set` | 8 Model rambut x 8 warna | 2D Vector | 120x120 px | SVG | P | Poligon rambut berlabel "HAIR" | Kode kustom internal (MIT) [A] |
| `avatar_eyes_set` | 6 Variasi bentuk & warna mata | 2D Vector | 40x20 px | SVG | P | Dua lingkaran hitam | Kode kustom internal (MIT) [A] |
| `avatar_brows_set` | 5 Variasi bentuk alis | 2D Vector | 40x10 px | SVG | P | Garis horizontal tebal | Kode kustom internal (MIT) [A] |
| `ui_icon_pack` | 120 Ikon navigasi, aktivitas, aset | UI Icon | 24x24 px | SVG | H | Kotak abu-abu berlabel teks | Lucide / Heroicons (MIT) [A] |
| `sfx_ui_click` | Klik tombol antarmuka taktil | Audio SFX | N/A (40 ms) | WebM/WAV | H | Hening (silent fallback) | CC0 Kenney / Freesound [A] |
| `sfx_age_tick` | Denting penuaan tahunan (+Age) | Audio SFX | N/A (120 ms) | WebM/WAV | H | Hening (silent fallback) | CC0 Kenney [A] |
| `sfx_birth` | Tangisan bayi saat lahir | Audio SFX | N/A (800 ms) | WebM/WAV | H | Hening (silent fallback) | CC0 Freesound [A] |
| `sfx_death` | Nada murung dentang kematian | Audio SFX | N/A (1500 ms) | WebM/WAV | H | Hening (silent fallback) | CC0 Freesound [A] |
| `sfx_cash` | Gemerincing koin/kasir finansial | Audio SFX | N/A (250 ms) | WebM/WAV | H | Hening (silent fallback) | CC0 Kenney [A] |
| `sfx_fail` | Nada rendah kegagalan / denda | Audio SFX | N/A (300 ms) | WebM/WAV | H | Hening (silent fallback) | CC0 Kenney [A] |

* **Mood & Desain BGM**: N/A - Keheningan atmosferik murni tanpa musik latar looping berkepanjangan agar pemain fokus membaca narasi teks secara rileks [A].

---

## 8. Juice & Polish

* **Screen Shake**: Micro-shake pada kontainer layar (durasi 140 ms, intensitas 2 px, frekuensi 25 Hz) hanya saat terjadi krisis fatal, penangkapan polisi, atau kecelakaan berat [A].
* **Hit-Stop**: N/A - Game berbasis antarmuka non-combat [A].
* **Floating Text**: Teks indikator stat delta melayang (misal `+10% Happiness` warna hijau `#2ECC71`, `-15% Health` warna merah `#E74C3C`) naik vertikal 24 px lalu memudar selama 550 ms [A].
* **Sistem Partikel**: Confetti burst 2D Canvas (maksimal 35 partikel kotak warna-warni, durasi 750 ms) saat lulus sekolah, promosi jabatan, atau menang lotre [A].
* **Flash / Tint**: Flash merah lembut pada tepi viewport (`rgba(231, 76, 60, 0.15)`, durasi 180 ms) saat Health menyentuh batas kritis (<20%) [A].
* **Sinkronisasi Audio**: Suara dipicu seketika pada frame 0 pendaftaran event tap (<16 ms) [A].
* **Aksesibilitas Gerak**: Toggle "Reduce Motion" di menu pengaturan untuk mematikan micro-shake, meniadakan partikel confetti, dan mengganti transisi progress bar menjadi pembaruan angka instan [A]. Layar bebas efek strobing (frekuensi kilatan 0 kali/detik) [A].

---

## 9. Cakupan MVP & Daftar Fitur

| F-ID | Fitur | Kategori | Dependensi | Tag |
| --- | --- | --- | --- | --- |
| **F-001** | Character Creation Wizard (Nama, Gender, Lokasi, Atribut, Tampilan) | **Must** | - | [V] |
| **F-002** | Core Aging Engine (+Age loop, penuaan biologis, kalkulasi mortalitas) | **Must** | F-001 | [V] |
| **F-003** | Main Narrative Log Viewer (daftar vertikal riwayat hidup terurut usia) | **Must** | F-002 | [V] |
| **F-004** | Interactive Decision Modals (skenario acak/terjadwal dengan 2-4 pilihan) | **Must** | F-002 | [V] |
| **F-005** | Realtime Stat Dashboard (Happiness, Health, Smarts, Looks progress bars) | **Must** | F-001 | [V] |
| **F-006** | Education & Career Pipeline (Sekolah, drop-out, cari kerja, gaji, promosi) | **Must** | F-002, F-005 | [V] |
| **F-007** | Basic Relationship System (Orang tua & saudara, bar relasi, aksi sosial) | **Must** | F-001, F-002 | [V] |
| **F-008** | Death & Memorial Tombstone Screen (Penyebab mati, net worth, tombol restart) | **Must** | F-002 | [V/A] |
| **F-009** | Local Persistence Engine (Auto-save via IndexedDB per penambahan tahun) | **Must** | F-002 | [A] |
| **F-010** | Personal Finances & Basic Assets (Tabungan bank, beli mobil, beli rumah) | **Should** | F-006 | [V] |
| **F-011** | Crime & Risky Activities (Pencurian, perampokan, penangkapan polisi, penjara) | **Should** | F-004, F-005 | [V] |
| **F-012** | Modular Avatar Customizer UI (Preview avatar realtime saat edit fisik) | **Should** | F-001 | [V] |
| **F-013** | Special Talent System (Bonus bawaan atletik, musik, kejahatan, modeling) | **Could** | F-001, F-006 | [V] |
| **F-014** | Synchronous Multiplayer Social Mode | **Won't** | - | [A] |

---

## 10. Kriteria Penerimaan, Performa & Risiko

### 10.1 Tabel Acceptance Criteria (AC)

| AC-ID | F-ID | Given | When | Then | Level | Test ID | Tag |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **AC-001** | F-001 | Layar pembuatan karakter aktif | Pemain menginput nama "Archie King", memilih gender Male, lalu tap "Start Archie's life!" | Karakter terinisialisasi pada Age=0, Health=100%, log kelahiran tercetak, layar beralih ke dashboard | L2 |  | [V/A] |
| **AC-002** | F-002 | Karakter berada di dashboard pada usia $N$ | Pemain menekan tombol bulat hijau "+Age" | Usia bertambah menjadi $N+1$, kalkulasi keuangan diproses, dan log baru ditambahkan ke riwayat | L2 |  | [V/A] |
| **AC-003** | F-004 | Modal keputusan skenario balita muncul di layar | Pemain menekan opsi "Try to stay calm" | Health/Happiness disesuaikan, modal tertutup dalam <200ms, dan hasil tercatat di log | L3 |  | [V/A] |
| **AC-004** | F-005 | Health karakter mencapai nilai 0% | Engine mengeksekusi siklus tahunan (+Age) | Karakter dinyatakan meninggal seketika dan layar nisan memorial ditampilkan | L2 |  | [A] |
| **AC-005** | F-006 | Karakter berusia 18 tahun dengan nilai Smarts >= 70 | Karakter melamar pekerjaan entry-level dari daftar lowongan | Status pekerjaan aktif, gaji tahunan dialokasikan ke neraca finansial pemain | L3 |  | [V/A] |
| **AC-006** | F-007 | Relasi dengan entitas Father berada pada 50% | Pemain memilih menu Father lalu mengeksekusi "Spend Time" | Relasi meningkat minimal +10% dan log mencatat aktivitas kebersamaan | L2 |  | [V/A] |
| **AC-007** | F-008 | Karakter wafat pada usia 78 tahun dengan saldo $250,000 | Layar Memorial Nisan dibuka | Menampilkan ringkasan umur, penyebab kematian, total kekayaan, dan tombol New Life | L4 |  | [V/A] |
| **AC-008** | F-009 | Permainan sedang berjalan di usia 24 tahun | Tab browser di-refresh atau ditutup lalu dibuka kembali | State permainan pulih 100% pada usia 24 tahun tanpa kehilangan progres data | L4 |  | [A] |

### 10.2 Kriteria Performa per Tier Perangkat

| Parameter Performa | Low-Tier (Budget Android Go) [A] | Mid-Tier (iPhone 11 / Snapdragon 7xx) [A] | High-Tier (PC Modern / Flagship) [A] |
| --- | --- | --- | --- |
| **Target FPS (p95)** | >= 50 FPS | >= 60 FPS | 60 FPS terkunci |
| **Initial Load Time** | < 2.0 detik (koneksi 4G) | < 1.2 detik | < 0.6 detik |
| **Bundle Size (Gzip)** | < 450 KB (kode + SVG UI) | < 450 KB | < 450 KB |
| **Input Response Latency** | < 45 ms | < 25 ms | < 16 ms |
| **Memory Ceiling** | < 95 MB Heap | < 140 MB Heap | < 190 MB Heap |

### 10.3 Manajemen Risiko Teknis Top-5

| Risiko | Dampak | Strategi Mitigasi |
| --- | --- | --- |
| **R-1: DOM Memory Bloat akibat Log Teks Panjang** | Perangkat low-tier melambat setelah memainkan 80+ tahun riwayat hidup. | Gunakan Virtualized List (hanya merender 15 baris log yang aktif di area scroll viewport). |
| **R-2: Data Korup saat Auto-Save IndexedDB Terputus** | Save file rusak bila browser ditutup saat proses penulisan state. | Terapkan atomic write dengan transaksi snapshot terisolasi dan validasi checksum JSON. |
| **R-3: Deadlock Pohon Keputusan Skenario Event** | Pemain terjebak pada modal dialog tanpa opsi keluar yang valid. | Headless test validator memverifikasi setiap node JSON event wajib memiliki minimal 1 target resolusi. |
| **R-4: Inkonsistensi Viewport Mobile Browser** | Bar navigasi browser terpotong oleh address bar dinamis Safari/Chrome. | Kunci layout menggunakan CSS viewport units modern (`100dvh`) dan `env(safe-area-inset-*)`. |
| **R-5: Penurunan Kinerja Render Avatar Modular** | Re-render SVG multi-layer berulang kali menurunkan frame rate saat scrolling. | Cache hasil komposit avatar ke dalam Canvas bitmap tunggal di luar mode kustomisasi fisik. |

---

## 11. Content Schema (Data-Driven)

### 11.1 Skema Data Entitas

*Skema Event Skenario (`ScenarioEvent`)*

| Field | Tipe Data | Batasan Nilai | Wajib | Contoh Data |
| --- | --- | --- | --- | --- |
| `id` | string | Format regex `^[a-z0-9_]+$` | Ya | `"childhood_vaccine"` |
| `category` | string | `"Childhood" | "School" | "Crime" | "Health"` | Ya | `"Childhood"` |
| `minAge` | integer | 0 - 120 | Ya | `2` |
| `maxAge` | integer | 0 - 120 (>= minAge) | Ya | `5` |
| `title` | string | 3 - 40 karakter | Ya | `"Vaccination"` |
| `description` | string | 10 - 250 karakter | Ya | `"Your mother is taking you to the doctor."` |
| `choices` | Array | 2 - 4 elemen | Ya | `[ChoiceA, ChoiceB, ChoiceC]` |

*Skema Opsi Keputusan (`Choice`)*

| Field | Tipe Data | Batasan Nilai | Wajib | Contoh Data |
| --- | --- | --- | --- | --- |
| `text` | string | 2 - 60 karakter | Ya | `"Try to stay calm"` |
| `statDeltas` | object | Delta persentase (-50 s/d +50) | Ya | `{"health": 5, "happiness": -2}` |
| `logText` | string | 5 - 150 karakter | Ya | `"I remained calm during vaccination."` |
| `karmaDelta` | integer | -20 s/d +20 | Ya | `5` |

*Skema Pekerjaan (`JobListing`)*

| Field | Tipe Data | Batasan Nilai | Wajib | Contoh Data |
| --- | --- | --- | --- | --- |
| `id` | string | Format regex `^[a-z0-9_]+$` | Ya | `"marine_biologist"` |
| `title` | string | 3 - 50 karakter | Ya | `"Marine Biologist"` |
| `minSmarts` | integer | 0 - 100 | Ya | `65` |
| `minEducation` | string | `"None" | "Secondary" | "University"` | Ya | `"University"` |
| `baseSalary` | integer | $5,000 s/d $5,000,000 | Ya | `52000` |

* **Integritas & Lokalisasi**: Seluruh string teks dipisahkan dalam file JSON i18n (`/locales/id.json`). Gagal parsing skema saat booting menampilkan error banner deskriptif tanpa crash aplikasi [A].
* **Kuantitas Konten MVP**: 100 Skenario Acak Unik, 25 Jenis Pekerjaan, 6 Tahap Pendidikan, 12 Aktivitas Kriminal, 15 Aset Properti & Kendaraan [A].

---

## 12. Device & Distribusi

### 12.1 Device Matrix

| Parameter | Low-Tier Mobile | Mid-Tier Mobile | Desktop Browser |
| --- | --- | --- | --- |
| **Model Acuan** | Budget Android (2GB RAM, Android 11) [A] | iPhone 12 / Galaxy A54 (4-6GB RAM) [A] | Mac / PC Chrome (8GB+ RAM) [A] |
| **Target Viewport** | 360x640 hingga 390x844 px | 390x844 hingga 412x915 px | 1080x1920 (Centered Container) |
| **Alat Input** | Capacitive Touchscreen | Capacitive Touchscreen | Mouse Click & Keyboard Shortcuts |
| **Orientasi** | Kunci Portrait (CSS Portrait Shield) | Kunci Portrait (CSS Portrait Shield) | Centered 9:19.5 Portrait Box |
| **Budget Memori** | < 95 MB | < 140 MB | < 190 MB |

### 12.2 Target Distribusi

* **Web Browser (Standard)**: Wajib. Hosting statis via CDN global (Cloudflare Pages / Vercel) [A].
* **PWA (Progressive Web App)**: Wajib. Manifest web app dan Service Worker untuk fungsionalitas instalasi homescreen & bermain offline penuh [A].
* **Android TWA (Trusted Web Activity)**: Opsional. Pembungkusan via Google Play Store bila dibutuhkan di masa mendatang [A].
* **iOS Safari PWA**: Wajib. Kompatibel penuh dengan menu "Add to Home Screen" Safari iOS [A].
* **Repositori Mandiri GitHub**: Wajib. Repositori bersih yang langsung dapat di-clone dan di-build lokal melalui `npm install && npm run build` [A].

### 12.3 Kebutuhan Platform Adapter

| Kemampuan | Diperlukan | Solusi Fallback jika API Tidak Tersedia |
| --- | --- | --- |
| **Input Handler** | Ya | Standard Pointer Events (otomatis menangani Touch dan Mouse click) [A]. |
| **Display Safe-Area** | Ya | CSS fallback padding statis (top 16px, bottom 20px) jika CSS env() bernilai 0 [A]. |
| **Persistent Storage** | Ya | Fallback otomatis ke `window.localStorage` jika `IndexedDB` diblokir [A]. |
| **Audio Unlock** | Ya | AudioContext diinisialisasi dalam status suspend dan di-resume saat tap pertama [A]. |
| **Lifecycle Hooks** | Ya | Listener `document.visibilitychange` untuk menjeda timer interval [A]. |
| **Haptic Feedback** | Ya | Panggilan `navigator.vibrate([15])` dibungkus try/catch; silent bila tidak didukung [A]. |

### 12.4 Aksesibilitas

* Ukuran font minimum 14 px untuk teks body log; rasio kontras teks terhadap latar belakang minimal 4.5:1 (memenuhi standar WCAG AA) [A].
* Struktur log teks menggunakan atribut `aria-live="polite"` untuk kompatibilitas pembaca layar (screen reader) penyandang disabilitas netra [A].

---

## 13. Legal, Telemetri & Niat Rilis

### 13.0 Status Niat Rilis

* **Niat Rilis**: Publik (Portal Permainan Web Gratis) [I: teks "gratis untuk dimainkan"]. Bagian §13 berlaku penuh.

### 13.1 Monetisasi

* **Model**: 100% Free-to-Play Sandbox [I: teks rilis].
* **Iklan / IAP**: Tidak ada paywall progres inti. Opsi banner iklan web non-intrusif di luar area canvas atau mock donasi opsional [A]. Bebas mekanik lootbox berbayar atau gambling mata uang riil [A].

### 13.2 Data & Privasi

* **Prinsip**: Zero Personal Identifiable Information (Zero-PII). Seluruh komputasi berjalan di client browser [A].
* **Target Usia**: 16+ tahun (memuat unsur satirikal, skenario kejahatan, dan drama sosial dewasa tanpa materi pornografi grafis) [A].
* **Kepatuhan**: Mematuhi kaidah privasi GDPR / COPPA dengan tidak menyimpan kuki pelacak pihak ketiga [A].

### 13.3 Konten & Hak Cipta

* **Pencegahan Pelanggaran IP**: Dilarang menggunakan nama merek, selebritas nyata, atau aset grafis BitLife [A]. Semua penamaan entitas, institusi, dan dialog ditulis original secara satirikal [A].
* **Lisensi Perangkat Lunak**: Core engine berlisensi MIT; font menggunakan Open Font License (OFL); audio dan ikon bersumber dari domain publik CC0 / MIT [A].

### 13.4 Telemetri (Opt-In Anonim)

| Event Telemetri | Pemicu (When) | Properti Payload |
| --- | --- | --- |
| `life_start` | Pemain menekan tombol "Start Life!" | `birthCountry`, `gender`, `seed` |
| `life_milestone` | Karakter mencapai umur 18, 50, dan 80 tahun | `currentAge`, `netWorth`, `health`, `karma` |
| `life_death` | Karakter meninggal dunia | `finalAge`, `deathCause`, `totalNetWorth`, `ribbonId` |

---

## 14. Asumsi & Pertanyaan Terbuka

### 14.1 Tabel Asumsi Kunci

| AS-ID | Asumsi Kunci [A] | Dampak Desain / Arsitektur |
| --- | --- | --- |
| **AS-01** | Game berjalan murni di client-side menggunakan browser local storage tanpa server backend [A]. | Arsitektur sangat hemat biaya, latensi instan, namun progres tidak tersinkronisasi antar-perangkat [A]. |
| **AS-02** | Avatar 2D disusun dari layering path SVG statis tanpa animasi rangka (skeletal rigging) [A]. | Waktu muat sangat instan dan rendering ringan, namun ekspresi karakter bersifat diskrit [A]. |
| **AS-03** | Kematian karakter bersifat permadeath permanen (pemain mengulang dari umur 0 dengan karakter baru) [A]. | Menjaga bobot setiap keputusan hidup dan ketegangan saat Health karakter berada di level rendah [A]. |
| **AS-04** | Semua atribut awal dapat dimaksimalkan hingga 100% pada pembuatan karakter baru seperti pada mode sandbox [V/A]. | Memberikan kebebasan bermain peran (roleplay) instan tanpa hambatan grinding poin [V/A]. |

### 14.2 Pertanyaan Terbuka (/grill-me)

1. **Q1 [CRITICAL]**: Apakah sistem kematian harus menerapkan permadeath murni di mana pemain wajib memulai dari usia 0 tahun lagi, atau perlu disediakan fitur "Time Machine" untuk memutar balik waktu 1-5 tahun ke belakang? -> *Dampak jika tak dijawab*: Menentukan kompleksitas arsitektur riwayat snapshot save-state di IndexedDB [A].
2. **Q2 [CRITICAL]**: Pada pembuatan karakter baru, apakah pemain bebas memaksimalkan seluruh slider atribut ke 100% secara instan (seperti God Mode di video referensi), ataukah versi default harus menggunakan sistem jatah poin terbatas (point-buy system) demi keseimbangan game? -> *Dampak jika tak dijawab*: Mempengaruhi balancing probabilitas keberhasilan di awal permainan [A].
3. **Q3 [IMPORTANT]**: Apakah EverLife memerlukan sistem warisan generasi (Generational Bloodline), di mana pemain dapat memilih untuk melanjutkan hidup sebagai anak kandung setelah karakter utama wafat? -> *Dampak jika tak dijawab*: Mempengaruhi relasi entitas karakter dan sistem pewarisan kekayaan bersih di akhir hidup [A].
4. **Q4 [IMPORTANT]**: Seberapa dalam sistem karir interaktif yang diinginkan (apakah cukup minigame performa kerja berbasis teks atau perlu task interaktif khusus untuk profesi unik seperti aktor/musisi)? -> *Dampak jika tak dijawab*: Menentukan estimasi jumlah logic branch pada sistem karir F-006 [A].
