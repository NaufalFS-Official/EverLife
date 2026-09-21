# GAME BLUEPRINT: EverLife (v1.0-SMA)
**Tahap 1B — Final Executable Specification**
*Dokumen Arsitektur & Game Design Lengkap untuk Eksekusi Per Sesi*

---

## DAFTAR KONFLIK PRD VS JAWABAN DESAIN (TRANSPARENCY AUDIT)
Berikut adalah daftar konflik antara analisis awal (PRD 1A) dengan arahan jawaban desain (Q1–Q10) yang telah direkonsiliasi:

1. **Rentang Kehidupan [KONFLIK-01]**:
   - *PRD 1A*: Lahir hingga wafat usia tua (0 s.d. 80+ tahun) dengan layar Akhir Kehidupan (Batu Nisan) [V].
   - *Jawaban Q1*: Lahir hingga tamat SMA (0 s.d. 18 tahun) [REV: Usia 0–18].
   - *Resolusi*: Ruang lingkup v1 difokuskan pada kedalaman fase balita, anak, dan remaja (0–18 tahun) yang berakhir di *Graduation/Life Evaluation Screen*. Fase karier dewasa 19–80+ dialokasikan ke versi v1.x.
2. **Kebutuhan Aset Avatar [KONFLIK-02]**:
   - *PRD 1A*: 24 variasi ilustrasi avatar karakter 2D gaya manhwa/anime (Tier H) [V].
   - *Jawaban Q10*: Tanpa avatar gambar external [REV: Tier P - Avatar Prosedural].
   - *Resolusi*: Avatar menggunakan representasi prosedural (inisial nama dinamis + latar belakang gradien warna berbasis sifat/kebahagiaan) yang dihasilkan 100% oleh kode (Tier P).
3. **Engine & Target Platform [KONFLIK-03]**:
   - *PRD 1A*: Flutter 3.x atau React Native [A].
   - *Jawaban Q3*: PWA mobile-first (utama) + Capacitor Android APK + Desktop PWA. Inti logika pure TypeScript tanpa DOM [REV: TypeScript + Vite + React + Capacitor].
   - *Resolusi*: Arsitektur decoupled: `everlife-core` (TypeScript murni) + `everlife-ui` (React + Tailwind CSS/CSS Modules) + Capacitor v6.
4. **Pipeline Audio [KONFLIK-04]**:
   - *PRD 1A*: 12 file SFX WAV + 2 loop BGM OGG [A].
   - *Jawaban Q10*: Audio opsional, minimal, dan default mati [REV: Web Audio Synth Procedural Muted].
   - *Resolusi*: Menggunakan synth osilator Web Audio API prosedural (0 KB aset eksternal), dengan status bawaan nonaktif (`CFG_AUDIO_DEFAULT_MUTED = true`).

---

## S1. IDENTITAS
| Parameter | Spesifikasi | Tag |
| :--- | :--- | :--- |
| **Nama Game** | EverLife | [V] |
| **Genre Primer** | Life Simulation | [V] |
| **Sub-Genre** | Text-based Choice-driven RPG | [V] |
| **Core Loop (30 Detik)** | Membaca kartu dilema tahunan -> Memilih 1 dari 2–4 cabang respons -> Stat & relasi diperbarui -> Log kronologis bertambah | [V] |
| **Core Loop (Sesi 5–30 Menit)** | Memilih aktivitas tahunan (Belajar, Olahraga, Sosialisasi) -> Menekan tombol Tambah Umur (+1 Tahun) -> Mengembangkan karakter dari usia `CFG_AGE_MIN` hingga `CFG_AGE_MAX_V1` -> Evaluasi Akhir Kelulusan SMA | [V/REV] |
| **Meta-Progresi** | Pengarsipan riwayat hidup di `CFG_SAVE_SLOT_COUNT` slot lokal, ekspor/impor JSON save file ber-checksum | [REV] |
| **Panjang Sesi** | 5–30 menit per kehidupan penuh SMA (atau 30–60 detik per giliran tahunan) | [I] |
| **Tone & Suasana** | Modern, Reflektif, Kasual | [I] |
| **Target Audiens** | Usia 16–35 tahun penikmat game teks, casual life-sim, roleplay naratif | [A] |
| **USP (Unique Selling Point)** | 1. Simulasi masa muda mendalam (0–18 tahun) dengan sistem relasi keluarga & pertemanan multi-layer [REV]<br>2. Arsitektur decoupled: Inti game TypeScript murni tanpa dependensi DOM (portable PWA & mobile) [I]<br>3. Pilihan 4 jalur bertema moral/emosional dengan konsekuensi deterministik dan transparan [V] | [V/I/REV] |
| **Scale** | Small (Skala Kecil) | [I] |
| **Build Mode** | Mode A (Pure Client / Offline penuh) | [I] |
| **Target Platform** | PWA Mobile-First (utama), Android APK (Capacitor sideload), Desktop PWA | [I/REV] |
| **Engine / Framework** | Pure TypeScript Core + Vite + React (Web/PWA) + Capacitor (Android Native Wrapper) | [I/REV] |
| **Bahasa Pemrograman & Teks** | TypeScript (ES2022+), Teks Antarmuka: Bahasa Indonesia | [V] |
| **FPS Target** | `CFG_FPS_TARGET` (60 FPS fixed UI frame rate) | [A] |

---

## S2. DEKONSTRUKSI MEKANIK 4-FASE
Semua durasi waktu dan siklus frame dikonfigurasi melalui konstanta S7. Basis frame dihitung pada `CFG_FPS_TARGET` (60 FPS, 1 frame $\approx$ 16.66 ms).

| Aksi | Windup | Active | Recovery | Cooldown | Jendela Cancel | Buffer Input | Hitbox Aktif | Biaya Resource | Efek Game Feel |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Pilih Respons Event** | `CFG_TIME_EVENT_TAP_WINDUP` (0ms / 0f) | `CFG_TIME_EVENT_TAP_ACTIVE` (50ms / 3f) | `CFG_TIME_EVENT_TAP_RECOVERY` (150ms / 9f) | `CFG_TIME_EVENT_TAP_COOLDOWN` (100ms / 6f) | Sebelum sentuhan layar terlepas | `CFG_INPUT_DEBOUNCE_MS` | Bounding Box Tombol Opsi | Membutuhkan event aktif | Tween stat bar, angka berkedip hijau/merah (`CFG_COLOR_FLASH_MS`), pop modal tertutup |
| **Tambah Umur (+1 Tahun)** | `CFG_TIME_AGE_UP_WINDUP` (50ms / 3f) | `CFG_TIME_AGE_UP_ACTIVE` (200ms / 12f) | `CFG_TIME_AGE_UP_RECOVERY` (100ms / 6f) | `CFG_TIME_AGE_UP_COOLDOWN` (300ms / 18f) | Tidak dapat dibatalkan setelah pointer up | `CFG_INPUT_DEBOUNCE_MS` | Bounding Box Tombol Utama | 1 Giliran Siklus | Animasi transisi angka umur bertambah, auto-save terpicu, generate event pool baru |
| **Pilih Aktivitas Tahunan** | `CFG_TIME_ACTION_TAP_WINDUP` (0ms / 0f) | `CFG_TIME_ACTION_TAP_ACTIVE` (50ms / 3f) | `CFG_TIME_ACTION_TAP_RECOVERY` (100ms / 6f) | `CFG_TIME_ACTION_TAP_COOLDOWN` (100ms / 6f) | Sebelum konfirmasi modal aktivitas | `CFG_INPUT_DEBOUNCE_MS` | Bounding Box Kartu Aktivitas | Biaya Energi/Uang (sesuai aksi) | Haptic light impact, penambahan log aktivitas instan, perubahan stat |
| **Interaksi Relasi** | `CFG_TIME_SOCIAL_TAP_WINDUP` (0ms / 0f) | `CFG_TIME_SOCIAL_TAP_ACTIVE` (50ms / 3f) | `CFG_TIME_SOCIAL_TAP_RECOVERY` (150ms / 9f) | `CFG_TIME_SOCIAL_TAP_COOLDOWN` (200ms / 12f) | Sebelum opsi interaksi dikonfirmasi | `CFG_INPUT_DEBOUNCE_MS` | Bounding Box Baris Kontak | 1 Aksi Sosial / Kuota Interaksi | Ikon hati meletup kecil, relasi bar bertambah/berkurang, log sosial tercatat |
| **Ganti Tab Navigasi** | `CFG_TIME_NAV_TAP_WINDUP` (0ms / 0f) | `CFG_TIME_NAV_TAP_ACTIVE` (30ms / 2f) | `CFG_TIME_NAV_TAP_RECOVERY` (70ms / 4f) | `CFG_TIME_NAV_TAP_COOLDOWN` (50ms / 3f) | Sebelum sentuhan terlepas | `CFG_INPUT_DEBOUNCE_MS` | Bounding Box Tab Item | Tanpa biaya | Transisi slide halus horizontal, indikator tab aktif berubah warna |
| **Buat Karakter Baru** | `CFG_TIME_CHAR_GEN_WINDUP` (0ms / 0f) | `CFG_TIME_CHAR_GEN_ACTIVE` (100ms / 6f) | `CFG_TIME_CHAR_GEN_RECOVERY` (200ms / 12f) | `CFG_TIME_CHAR_GEN_COOLDOWN` (300ms / 18f) | Tombol batal/kembali | `CFG_INPUT_DEBOUNCE_MS` | Bounding Box Tombol "Mulai Hidup" | Form validasi terisi | Inisialisasi seed RNG, alokasi memori state, transisi fade ke Dashboard Usia 0 |
| **Simpan / Ekspor Save** | `CFG_TIME_SAVE_IO_WINDUP` (0ms / 0f) | `CFG_TIME_SAVE_IO_ACTIVE` (100ms / 6f) | `CFG_TIME_SAVE_IO_RECOVERY` (100ms / 6f) | `CFG_TIME_SAVE_IO_COOLDOWN` (200ms / 12f) | Tidak dapat dibatalkan | `CFG_INPUT_DEBOUNCE_MS` | Bounding Box Tombol Ekspor/Simpan | Akses storage lokal | Teks snackbar konfirmasi "Berhasil Disimpan", unduhan file JSON ber-checksum |

---

## S3. STATE MACHINE & GUARD

### 3.1 Entitas Game Lifecycle State Machine
```
[BOOT / INIT]
      │
      ▼
 [MAIN_MENU] ◄─────────────────────────────────────────────┐
      │                                                     │
      ├───► [CHARACTER_CREATION] ───┐                       │
      │                             ▼                       │
      ├───► [LOAD_GAME_MODAL] ──► [GAMEPLAY_ACTIVE] ────────┤
      │                                 │                   │
      │                                 ├──► [EVENT_MODAL]  │
      │                                 │         │         │
      │                                 │◄────────┘         │
      │                                 ▼                   │
      └─────────────────────────► [GRADUATION_SCREEN] ──────┘
```

### 3.2 Tabel Transisi Sah & Guard Conditions

| Entitas | State Asal | State Tujuan | Trigger / Event | Guard Condition (Syarat Wajib) |
| :--- | :--- | :--- | :--- | :--- |
| **App** | `BOOT` | `MAIN_MENU` | `APP_LOADED` | File konfigurasi valid & storage driver terinisialisasi |
| **App** | `MAIN_MENU` | `CHARACTER_CREATION` | `BTN_NEW_GAME` | Tidak ada event modal blocking |
| **App** | `MAIN_MENU` | `GAMEPLAY_ACTIVE` | `BTN_LOAD_SLOT` | Slot save terverifikasi memiliki checksum valid |
| **Game** | `CHARACTER_CREATION`| `GAMEPLAY_ACTIVE` | `SUBMIT_CHARACTER` | `name.trim().length > 0` dan atribut gender/asal valid |
| **Game** | `GAMEPLAY_ACTIVE` | `EVENT_MODAL` | `TRIGGER_EVENT` | `activeEvent !== null` dan modal lain tertutup |
| **Game** | `EVENT_MODAL` | `GAMEPLAY_ACTIVE` | `RESOLVE_OPTION` | Opsi yang dipilih valid dalam daftar indeks cabang pilihan |
| **Game** | `GAMEPLAY_ACTIVE` | `GAMEPLAY_ACTIVE` | `AGE_UP` | `activeEvent === null` dan `stats.health > CFG_STAT_MIN` dan `profile.age < CFG_AGE_MAX_V1` |
| **Game** | `GAMEPLAY_ACTIVE` | `GRADUATION_SCREEN` | `FINISH_HIGH_SCHOOL` | `profile.age >= CFG_AGE_MAX_V1` dan `activeEvent === null` |
| **Game** | `GAMEPLAY_ACTIVE` | `GAME_OVER_DEATH` | `FATAL_HEALTH_DEPLETED` | `stats.health <= CFG_STAT_MIN` |
| **UI** | `TAB_LIFE` | `TAB_RELATIONS` | `TAP_TAB_RELATIONS` | Tidak ada modal event blocking |
| **UI** | `TAB_RELATIONS` | `TAB_ACTIVITIES` | `TAP_TAB_ACTIVITIES`| Tidak ada modal event blocking |

### 3.3 Daftar Transisi Terlarang & Mekanisme Penolakan
1. **Maju Umur saat Event Aktif Sedang Terbuka**:
   - *Transisi Terlarang*: `EVENT_MODAL` -> `AGE_UP`
   - *Mekanisme*: Tombol `AGE_UP` terkunci (disabled), state mesin melempar error `ERR_ACTION_BLOCKED_BY_EVENT`.
   - *Unit Test Wajib*: `test_cannot_age_up_while_event_modal_open()`
2. **Membuat Karakter Baru Saat Sesi Hidup Sedang Berjalan Tanpa Konfirmasi**:
   - *Transisi Terlarang*: `GAMEPLAY_ACTIVE` -> `CHARACTER_CREATION` (langsung)
   - *Mekanisme*: Pemanggilan langsung dibatalkan; mewajibkan melewati state `CONFIRM_DISCARD_MODAL`.
   - *Unit Test Wajib*: `test_cannot_create_character_without_saving_or_discarding_active_session()`
3. **Mengambil Aktivitas yang Melebihi Batas Usia atau Biaya**:
   - *Transisi Terlarang*: `SELECT_ACTIVITY` (Part-Time Job) saat `profile.age < CFG_AGE_PART_TIME_UNLOCK`
   - *Mekanisme*: Opsi aktivitas tersembunyi atau terkunci dengan tooltip "Terbuka di usia 15 tahun".
   - *Unit Test Wajib*: `test_part_time_activity_locked_under_age_15()`
4. **Mutasi Stat Melebihi Batas Minimum/Maksimum**:
   - *Transisi Terlarang*: Penurunan stat `< CFG_STAT_MIN` (0) atau penambahan `> CFG_STAT_MAX` (100).
   - *Mekanisme*: Seluruh kalkulator mutasi menerapkan fungsi clamping deterministik: `Math.max(CFG_STAT_MIN, Math.min(CFG_STAT_MAX, value))`.
   - *Unit Test Wajib*: `test_stat_clamping_strict_boundaries()`

### 3.4 Prioritas Interrupt & Pencegahan State-Lock
- **Tingkat Prioritas Interrupt**:
  1. *Prioritas 1 (Maksimal - Fatal)*: `FATAL_HEALTH_DEPLETED` (`stats.health <= 0`). Menghentikan seluruh alur dan langsung membuka modal darurat/kematian.
  2. *Prioritas 2 (High - Naratif)*: `EVENT_MODAL` (Dilema tahunan wajib). Mengunci tombol navigasi bawah dan tombol tambah usia hingga pilihan dibuat.
  3. *Prioritas 3 (Normal - Interaktif)*: `ACTIVITY_MODAL` / `INTERACTION_MODAL`. Dapat dibatalkan kapan saja via tombol kembali/silang.
  4. *Prioritas 4 (Background)*: `AUTO_SAVE_WORKER`. Berjalan asinkronus tanpa memblokir input UI.
- **Pencegahan State-Lock (Failsafe Watchdog)**:
  - Jika `activeEvent` berada dalam kondisi corrupt (misal opsi kosong), watchdog otomatis menginjeksi opsi fallback "Lewati hari ini" dan mencatat error ke konsol, mencegah aplikasi hang.

---

## S4. BLUEPRINT SPASIAL & FTUE

### 4.1 Parameter Viewport & Sistem Koordinat
Game ini menggunakan antarmuka 2D non-spasial (Screen-Space Layout) portrait.
- **Acuan Dimensi Layar Target**: `CFG_VIEWPORT_WIDTH_PT` x `CFG_VIEWPORT_HEIGHT_PT` (390 x 844 pt, rasio aspek 19.5:9) [V].
- **Safe Area Insets**: Top Inset `CFG_SAFE_AREA_TOP_PT` (47 pt), Bottom Inset `CFG_SAFE_AREA_BOTTOM_PT` (34 pt).
- **Sistem Grid**: 8-point baseline grid. Padding kontainer standar `16 pt`, border radius kartu `12–16 pt` [V].

### 4.2 Diagram Tata Letak Layar Utama (ASCII Architecture)
```
+---------------------------------------------+ (390 pt x 844 pt)
| [TOP BAR] Status & Profil                   | <-- Y: 47 - 110 pt
| (Initials) Budi Santoso | Usia: 16 | SMA    |
| Saldo Uang: Rp 150.000                      |
+---------------------------------------------+
| [STAT BARS CONTAINER]                       | <-- Y: 112 - 250 pt
| Kesehatan    [========--] 80% (Hijau)       |
| Kebahagiaan  [=======---] 70% (Kuning)      |
| Hubungan     [========= ] 90% (Pink)        |
| Akademik     [======----] 65% (Biru)        |
| Uang / Saku  [====------] 40% (Oranye)      |
+---------------------------------------------+
| [TIMELINE & EVENT LOG VIEWPORT]             | <-- Y: 252 - 620 pt
| (Scrollable Virtualized List)               |
| - Usia 15: Masuk SMA Negeri 1               |
| - Usia 15: Menang lomba catur sekolah       |
| - Usia 16: Dimarahi guru karena telat       |
|                                             |
| [KARTU PERISTIWA TAHUN BERJALAN]            |
| "Ujian semester sudah di depan mata. Apa    |
|  fokus utamamu minggu ini?"                 |
+---------------------------------------------+
| [PRIMARY ACTION AREA]                       | <-- Y: 622 - 740 pt
| +-----------------------------------------+ |
| |       [ TOMBOL: TAMBAH UMUR (+1) ]      | | <-- H: 56 pt
| +-----------------------------------------+ |
+---------------------------------------------+
| [BOTTOM TAB NAVIGATION]                     | <-- Y: 742 - 810 pt
| [ Hidup ]   [ Relasi ]   [ Aktivitas ]   [ Profil ]
+---------------------------------------------+
| SAFE AREA BOTTOM RESERVED                   | <-- Y: 810 - 844 pt
+---------------------------------------------+
```

### 4.3 Tabel Koordinat Area Sentuh Presisi
| Komponen UI | Posisi Anchor X | Posisi Anchor Y | Lebar (W) | Tinggi (H) | Toleransi Min Touch Target |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Top Profile Area** | 0 pt | `CFG_SAFE_AREA_TOP_PT` | 390 pt | 64 pt | $\ge 48 \times 48\text{ pt}$ |
| **Stat Bar Item (x5)**| 16 pt | 115 pt (step 26pt) | 358 pt | 20 pt | Visual indicator (non-tap) |
| **Timeline Log Area**| 16 pt | 252 pt | 358 pt | 368 pt | Swipe vertical scroll |
| **Tombol Tambah Umur**| 16 pt | 640 pt | 358 pt | 56 pt | $358 \times 56\text{ pt}$ (Touch Target Utama) |
| **Tombol Tab Bawah (x4)**| 0 pt, 97.5 pt, 195 pt, 292.5 pt | 744 pt | 97.5 pt | 56 pt | $97.5 \times 56\text{ pt}$ per tab |
| **Tombol Pilihan Event (Modal)**| 20 pt | 400 pt (step 60pt) | 350 pt | 52 pt | $350 \times 52\text{ pt}$ per opsi |

### 4.4 Tabel FTUE 30 Detik (First-Time User Experience)
| Detik | Peristiwa / Tampilan | Yang Dipelajari Pemain | Umpan Balik Sistem |
| :--- | :--- | :--- | :--- |
| **00–05** | Layar Splash menampilkan logo "EverLife" lalu bertransisi ke Main Menu | Judul game dan premis simulasi hidup santai | Tombol "Mulai Hidup Baru" menyala dengan pulse halus |
| **05–15** | Form pembuatan karakter (Input nama, pilih jenis kelamin, kota asal) | Pemain menentukan identitas awal sang karakter | Validasi input teks realtime, tombol konfirmasi aktif hijau |
| **15–20** | Masuk ke Dashboard Usia 0 (Bayi): Tampil 5 bar stat penuh, log: "Kamu lahir ke dunia di keluarga sederhana." | Memahami indikator stat utama yang harus dijaga | Bar stat menganimasi terisi dari 0% ke 100% (`CFG_TWEEN_BAR_DURATION_MS`) |
| **20–25** | Tombol "Tambah Umur (+1)" membesar sedikit (highlight prompt) | Mengetahui bahwa waktu melangkah maju melalui tombol ini | Sentuhan memicu haptic light dan transisi angka umur ke 1 |
| **25–30** | Pop-up peristiwa pertama muncul: "Kamu belajar berjalan. Ke mana kamu melangkah?" (4 opsi warna) | Setiap aksi memiliki konsekuensi stat yang berbeda | Memilih opsi langsung mengubah bar stat dan menambah log timeline |

### 4.5 Aturan Generator Peristiwa Prosedural (Rule-Based Seeded PRNG)
- **Seed Generator**: Setiap kehidupan baru membangkitkan `lifeSeed` 32-bit integer via algoritma Mulberry32.
- **Filter Kondisi Peristiwa**:
  1. *Usia*: `event.minAge <= profile.age <= event.maxAge`
  2. *Status Wajib*: misal `event.requiresSchool === true` saat usia 7–18 tahun.
  3. *Prasyarat Flag*: `profile.flags.includes(event.requiredFlag)`
  4. *Cooldown Peristiwa*: Peristiwa dengan tag `unique` hanya dapat terpicu 1 kali per kehidupan.
- **Probabilitas Pembobotan**:
  Bobot kemunculan peristiwa dihitung dengan:
  $$W_{\text{final}} = W_{\text{base}} \times \text{PengaliStat}(\text{Kesehatan}, \text{Kebahagiaan}, \text{Relasi})$$

---

## S5. KLIEN

### 5.1 Daftar Layar & Hirarki Tampilan
1. `SplashScreen`: Booting aset, verifikasi database lokal, pengecekan save state.
2. `MainMenuScreen`: Tombol Mulai Hidup Baru, Lanjut (Slot Aktif), Kelola Slot Save, Pengaturan (Audio/Tema).
3. `CharacterCreationScreen`: Form identitas karakter (Nama depan, nama belakang, gender, kota kelahiran).
4. `DashboardScreen`: Tampilan operasional utama dengan 4 sub-tab:
   - `TabLife`: Log linimasa peristiwa dan kartu peristiwa tahunan aktif.
   - `TabRelations`: Daftar kontak relasi (Ayah, Ibu, Saudara, Teman Sekelas, Guru).
   - `TabActivities`: Menu kegiatan tahunan (Belajar mandiri, Ekstrakurikuler, Les, Hobi, Olahraga, Kerja Part-time).
   - `TabProfileLog`: Riwayat profil medis, nilai akademik sekolah, dan inventori barang.
5. `EventModalDialog`: Pop-up kartu dilema wajib berisi narasi dan 2–4 tombol pilihan.
6. `ActivityDetailModal`: Pop-up detail konfirmasi sebelum mengeksekusi aktivitas tahunan.
7. `SaveManagerModal`: Antarmuka manajemen 3 slot penyimpanan, ekspor file JSON, impor file JSON.
8. `GraduationScreen`: Layar kelulusan tamat SMA (Usia 18) yang merangkum pencapaian hidup, nilai akhir, dan takdir masa depan.

### 5.2 Game Loop & Timestep
- **Model Loop**: Turn-based State Driven (Event-driven architecture). Komputasi logika hanya dijalankan saat ada aksi input pemain atau transisi giliran umur (+1).
- **UI Animation Loop**: Menggunakan browser `requestAnimationFrame` untuk transisi bar stat dan spring animation dengan delta clamping (`CFG_ANIM_DELTA_CLAMP_MS` $\le 33.33\text{ ms}$) untuk mencegah lonjakan frame saat aplikasi diminimalkan.

### 5.3 Skema Input & Remap
- **Pointer/Touch (Utama)**: Pointer tap, drag scroll vertikal dengan filter debounce `CFG_INPUT_DEBOUNCE_MS` (200 ms).
- **Keyboard (Desktop PWA Accessibility)**:
  - `Space` / `Enter`: Memicu tombol Tambah Umur (+1).
  - `1`, `2`, `3`, `4`: Memilih opsi 1 sampai 4 pada modal peristiwa yang sedang aktif.
  - `Escape`: Menutup modal sekunder (Aktivitas/Profil).
  - `Tab`: Navigasi fokus elemen UI untuk pembaca layar (Screen Reader).

### 5.4 Audio Manager (Procedural Web Audio API)
- **Zero External Audio Assets**: Tidak menggunakan file WAV/MP3 eksternal. Semua suara di-generate langsung oleh `AudioContext` Web Audio API.
- **Autoplay Policy Unlock**: `AudioContext` berada dalam status suspended hingga pointer down pertama pemain pada layar.
- **Konfigurasi Default**: `CFG_AUDIO_DEFAULT_MUTED = true` (audio bawaan mati sesuai arahan Q10).
- **Tone Presets**:
  - *Click*: Sine wave 440 Hz, durasi 30 ms, decay cepat.
  - *Success / Milestone*: Arpeggio 523 Hz -> 659 Hz -> 784 Hz, durasi 120 ms.
  - *Penalty / Negative*: Sawtooth wave 150 Hz -> 110 Hz, durasi 150 ms.

### 5.5 Object Pooling & Virtualisasi
- **Virtualized Timeline List**: Mengingat riwayat hidup dapat memuat puluhan catatan peristiwa, log linimasa dirender menggunakan teknik virtualized list (hanya merender item yang berada dalam viewport tampak $\pm 3$ elemen buffer) untuk menjamin jumlah DOM node selalu $< 300$ elemen.

### 5.6 Aksesibilitas & Anggaran Performa
- **Aksesibilitas**: Kontras rasio teks minimum $4.5:1$ (WCAG AA), label ARIA lengkap pada semua progress bar stat (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`).
- **Anggaran Performa**:
  - JS Bundle Size: $< 350\text{ KB}$ (gzipped).
  - First Contentful Paint (FCP): $< 800\text{ ms}$.
  - Frametime Target: $p95 < 16.66\text{ ms}$ (60 FPS stabil).
  - Penggunaan Memori Heap: $< 40\text{ MB}$.

---

## S6. ASET & /asset-hook

### 6.1 Scope Honesty & Kebijakan Aset
Sesuai arahan jawaban Q10, pada v1:
- **Tanpa Avatar Gambar Manual / AI**: Ditiadakan pada rilis awal. Digantikan avatar huruf/warna prosedural (Tier P).
- **Tanpa File Audio Eksternal**: Menggunakan Web Audio API sintetis (Tier P).
- **Ikon UI**: Menggunakan library SVG open-source MIT Lucide Icons (Tier H).

### 6.2 Tabel Inventori Aset v1
| ID Aset | Kategori | Spesifikasi Teknis | Tier | Fallback Placeholder | Lisensi / Sumber |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `icon-heart` | Ikon UI | 24x24 Vector SVG, Stroke 2px | H | Karakter teks "♥" | Lucide Icons (MIT) |
| `icon-smile` | Ikon UI | 24x24 Vector SVG, Stroke 2px | H | Karakter teks ":)" | Lucide Icons (MIT) |
| `icon-users` | Ikon UI | 24x24 Vector SVG, Stroke 2px | H | Karakter teks "[U]" | Lucide Icons (MIT) |
| `icon-book` | Ikon UI | 24x24 Vector SVG, Stroke 2px | H | Karakter teks "[B]" | Lucide Icons (MIT) |
| `icon-coins` | Ikon UI | 24x24 Vector SVG, Stroke 2px | H | Karakter teks "$" | Lucide Icons (MIT) |
| `icon-calendar`| Ikon UI | 24x24 Vector SVG, Stroke 2px | H | Karakter teks "[+]" | Lucide Icons (MIT) |
| `icon-settings`| Ikon UI | 24x24 Vector SVG, Stroke 2px | H | Karakter teks "[*]" | Lucide Icons (MIT) |
| `avatar-procedural`| Avatar Karakter | Canvas/SVG Lingkaran + Inisial Nama Teks + Warna HSL dinamis | P | Lingkaran abu-abu | Dihasilkan dari kode (Tier P) |
| `sfx-synth-tap` | Audio UI | Web Audio Oscillator Sine 440Hz (0 KB) | P | Senyap (Mute) | Kode Web Audio API murni |
| `sfx-synth-alert`| Audio UI | Web Audio Oscillator Sawtooth 150Hz (0 KB) | P | Senyap (Mute) | Kode Web Audio API murni |

### 6.3 Asset Production & Quality Checklist
- [x] **Format Vektor**: Seluruh ikon menggunakan SVG inline yang di-bundle secara tree-shaken tanpa membebani network request.
- [x] **Font Stack Bawaan Sistem**: Menggunakan font stack sistem native: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` untuk latensi unduh font 0 ms.
- [x] **Ukuran Total Direktori Aset**: $< 50\text{ KB}$ (di luar bundel skrip JS/CSS).

---

## S7. KONFIG & BALANCE (GAME-CONFIG)
Semua angka dan variabel penyeimbang dikumpulkan dalam tabel ini. Seluruh modul lain merujuk pada nama konstanta berikut.

| Nama Konstanta | Nilai Awal | Satuan | Rentang Aman | Dampak Terhadap Gameplay | Tag |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `CFG_FPS_TARGET` | 60 | FPS | 30 – 120 | Basis kalkulasi frame rate dan durasi animasi | [A] |
| `CFG_VIEWPORT_WIDTH_PT` | 390 | pt | 320 – 430 | Lebar acuan kontainer aplikasi pada layar | [V] |
| `CFG_VIEWPORT_HEIGHT_PT` | 844 | pt | 640 – 932 | Tinggi acuan kontainer aplikasi pada layar | [V] |
| `CFG_SAFE_AREA_TOP_PT` | 47 | pt | 0 – 60 | Inset atas untuk notch dan status bar perangkat | [A] |
| `CFG_SAFE_AREA_BOTTOM_PT`| 34 | pt | 0 – 40 | Inset bawah untuk home indicator perangkat | [A] |
| `CFG_INPUT_DEBOUNCE_MS` | 200 | ms | 100 – 350 | Mencegah sentuhan ganda tak sengaja pada tombol aksi | [A] |
| `CFG_ANIM_DELTA_CLAMP_MS`| 33.33 | ms | 16.6 – 50.0 | Pembatas delta time animasi UI saat lag | [I] |
| `CFG_TWEEN_BAR_DURATION_MS`| 300 | ms | 150 – 500 | Durasi animasi penyesuaian nilai bar statistik | [A] |
| `CFG_COLOR_FLASH_MS` | 200 | ms | 100 – 400 | Durasi kedip warna hijau/merah pada angka perubahan stat | [A] |
| `CFG_TIME_EVENT_TAP_WINDUP` | 0 | ms | 0 – 50 | Waktu windup saat menekan tombol pilihan event | [A] |
| `CFG_TIME_EVENT_TAP_ACTIVE` | 50 | ms | 30 – 100 | Waktu aktif pemicuan event callback | [A] |
| `CFG_TIME_EVENT_TAP_RECOVERY`| 150 | ms | 100 – 250 | Waktu animasi penutupan modal dialog | [A] |
| `CFG_TIME_EVENT_TAP_COOLDOWN`| 100 | ms | 50 – 200 | Jeda tombol terkunci sebelum input baru diterima | [A] |
| `CFG_TIME_AGE_UP_WINDUP` | 50 | ms | 0 – 100 | Jeda awal tombol Tambah Umur sebelum kalkulasi tahun | [A] |
| `CFG_TIME_AGE_UP_ACTIVE` | 200 | ms | 100 – 350 | Pemrosesan pergantian tahun dan generator peristiwa | [A] |
| `CFG_TIME_AGE_UP_RECOVERY` | 100 | ms | 50 – 200 | Pembaruan visual linimasa dan status bar | [A] |
| `CFG_TIME_AGE_UP_COOLDOWN` | 300 | ms | 150 – 500 | Proteksi jeda antar pergantian tahun | [A] |
| `CFG_TIME_ACTION_TAP_WINDUP`| 0 | ms | 0 – 50 | Waktu respons tombol menu aktivitas | [A] |
| `CFG_TIME_ACTION_TAP_ACTIVE`| 50 | ms | 30 – 100 | Pemrosesan efek aktivitas tahunan terpilih | [A] |
| `CFG_TIME_ACTION_TAP_RECOVERY`| 100 | ms | 50 – 200 | Penutupan modal aktivitas | [A] |
| `CFG_TIME_ACTION_TAP_COOLDOWN`| 100 | ms | 50 – 200 | Cooldown input menu aktivitas | [A] |
| `CFG_TIME_SOCIAL_TAP_WINDUP`| 0 | ms | 0 – 50 | Waktu respons interaksi sosial | [A] |
| `CFG_TIME_SOCIAL_TAP_ACTIVE`| 50 | ms | 30 – 100 | Eksekusi kalkulasi relasi karakter | [A] |
| `CFG_TIME_SOCIAL_TAP_RECOVERY`| 150 | ms | 100 – 250 | Penutupan menu relasi | [A] |
| `CFG_TIME_SOCIAL_TAP_COOLDOWN`| 200 | ms | 100 – 300 | Proteksi spam tombol interaksi keluarga/teman | [A] |
| `CFG_TIME_NAV_TAP_WINDUP` | 0 | ms | 0 – 30 | Respons tombol tab bawah | [A] |
| `CFG_TIME_NAV_TAP_ACTIVE` | 30 | ms | 20 – 60 | Pergantian view tab aktif | [A] |
| `CFG_TIME_NAV_TAP_RECOVERY` | 70 | ms | 50 – 120 | Transisi animasi geser tab | [A] |
| `CFG_TIME_NAV_TAP_COOLDOWN` | 50 | ms | 30 – 100 | Cooldown perpindahan tab | [A] |
| `CFG_TIME_CHAR_GEN_WINDUP`| 0 | ms | 0 – 50 | Validasi form buat karakter | [A] |
| `CFG_TIME_CHAR_GEN_ACTIVE`| 100 | ms | 50 – 200 | Inisialisasi seed dan struktur data awal hidup | [A] |
| `CFG_TIME_CHAR_GEN_RECOVERY`| 200 | ms | 100 – 350 | Transisi layar dari menu ke dashboard | [A] |
| `CFG_TIME_CHAR_GEN_COOLDOWN`| 300 | ms | 150 – 500 | Jeda aman masuk ke gameplay pertama | [A] |
| `CFG_TIME_SAVE_IO_WINDUP` | 0 | ms | 0 – 50 | Persiapan serialisasi JSON | [A] |
| `CFG_TIME_SAVE_IO_ACTIVE` | 100 | ms | 50 – 300 | Penulisan data atomik ke storage IndexedDB | [A] |
| `CFG_TIME_SAVE_IO_RECOVERY` | 100 | ms | 50 – 200 | Penutupan modal kelola save | [A] |
| `CFG_TIME_SAVE_IO_COOLDOWN` | 200 | ms | 100 – 400 | Cooldown operasi I/O file | [A] |
| `CFG_AGE_MIN` | 0 | Tahun | 0 – 0 | Usia awal karakter dilahirkan | [V] |
| `CFG_AGE_MAX_V1` | 18 | Tahun | 18 – 18 | Batas usia tamat SMA versi 1.0 (End of v1) | [REV] |
| `CFG_AGE_PRIMARY_SCHOOL` | 6 | Tahun | 6 – 7 | Usia masuk Sekolah Dasar (SD) | [I] |
| `CFG_AGE_MIDDLE_SCHOOL` | 12 | Tahun | 12 – 13 | Usia masuk Sekolah Menengah Pertama (SMP) | [I] |
| `CFG_AGE_HIGH_SCHOOL` | 15 | Tahun | 15 – 16 | Usia masuk Sekolah Menengah Atas (SMA) | [I] |
| `CFG_AGE_PART_TIME_UNLOCK` | 15 | Tahun | 14 – 16 | Usia minimal membuka aktivitas kerja paruh waktu | [REV] |
| `CFG_STAT_MIN` | 0 | Poin | 0 – 0 | Batas mutlak terendah semua parameter statistik | [V] |
| `CFG_STAT_MAX` | 100 | Poin | 100 – 100 | Batas mutlak tertinggi semua parameter statistik | [V] |
| `CFG_STAT_INITIAL_HEALTH` | 90 | Poin | 70 – 100 | Modal kesehatan awal bayi saat lahir | [A] |
| `CFG_STAT_INITIAL_HAPPINESS`| 85 | Poin | 60 – 100 | Modal kebahagiaan awal bayi | [A] |
| `CFG_STAT_INITIAL_RELATION` | 80 | Poin | 50 – 100 | Nilai keharmonisan awal dengan orang tua | [A] |
| `CFG_STAT_INITIAL_ACADEMIC` | 50 | Poin | 30 – 70 | Potensi kecerdasan kognitif awal | [A] |
| `CFG_RELATION_DECAY_ANNUAL`| 3 | Poin | 1 – 6 | Penurunan alami relasi jika tidak berinteraksi dalam 1 tahun | [A] |
| `CFG_ALLOWANCE_BASE_SD` | 20000 | IDR | 5000 – 50000 | Uang saku tahunan rata-rata saat SD (Usia 6–11) | [A] |
| `CFG_ALLOWANCE_BASE_SMP` | 60000 | IDR | 20000 – 150000 | Uang saku tahunan rata-rata saat SMP (Usia 12–14) | [A] |
| `CFG_ALLOWANCE_BASE_SMA` | 150000 | IDR | 50000 – 400000 | Uang saku tahunan rata-rata saat SMA (Usia 15–18) | [A] |
| `CFG_HEALTH_PENALTY_DEPLETION`| 5 | Poin | 2 – 10 | Penalti kebahagiaan tahunan jika kesehatan < 20% | [A] |
| `CFG_EVENT_POOL_SIZE_V1` | 50 | Unit | 40 – 100 | Jumlah kuota minimal kartu kejadian di v1 | [REV] |
| `CFG_SAVE_SLOT_COUNT` | 3 | Slot | 1 – 5 | Jumlah slot penyimpanan lokal mandiri | [REV] |
| `CFG_AUTO_SAVE_ENABLED` | true | Boolean | true / false | Status auto-save aktif otomatis tiap tahun | [REV] |
| `CFG_AUDIO_DEFAULT_MUTED` | true | Boolean | true / false | Audio bawaan nonaktif saat pertama kali buka | [REV] |

---

## S8. PERSISTENSI

### 8.1 Strategi Penyimpanan
- **Penyimpanan Primer**: Browser `IndexedDB` (menggunakan library ultra-ringan `idb-keyval` atau native wrapper) dengan fallback otomatis ke `localStorage`.
- **Ekspor/Impor File Cadangan**: Fitur ekspor berkas `.json` mandiri (`everlife-save-slot-[id].json`) yang dapat diunduh pemain untuk memindahkan data save antara versi Web PWA dan APK Capacitor.
- **Auto-Save**: Tersimpan otomatis secara atomik setiap kali tombol Tambah Umur (+1 Tahun) selesai dieksekusi.

### 8.2 Skema Data (TypeScript Interface)
```typescript
export interface CharacterProfile {
  name: string;
  gender: 'Pria' | 'Wanita';
  country: string;
  birthYear: number;
  age: number; // 0 s.d. CFG_AGE_MAX_V1
  cash: number; // IDR (Saldo riil)
  grade: 'Balita' | 'SD' | 'SMP' | 'SMA' | 'Lulus';
}

export interface CharacterStats {
  health: number;      // CFG_STAT_MIN s.d. CFG_STAT_MAX
  happiness: number;   // CFG_STAT_MIN s.d. CFG_STAT_MAX
  relationship: number;// Rata-rata relasi sosial
  academic: number;    // Nilai kecerdasan & prestasi sekolah
}

export interface RelationNPC {
  id: string;
  name: string;
  role: 'Ayah' | 'Ibu' | 'Saudara' | 'Teman' | 'Guru';
  relationshipScore: number; // 0 s.d. 100
  isAlive: boolean;
}

export interface TimelineLogEntry {
  age: number;
  title: string;
  description: string;
  category: 'Keluarga' | 'Sekolah' | 'Kesehatan' | 'Dilema' | 'Acak';
  statDeltas?: Partial<Record<keyof CharacterStats | 'cash', number>>;
}

export interface EverLifeSaveData {
  schemaVersion: number; // 1
  slotId: number;        // 1, 2, atau 3
  updatedAt: string;     // ISO Timestamp
  lifeSeed: number;      // Seed PRNG Mulberry32
  profile: CharacterProfile;
  stats: CharacterStats;
  relations: RelationNPC[];
  timelineHistory: TimelineLogEntry[];
  flags: string[];       // Tag peristiwa masa lalu
  isCompleted: boolean;  // True jika sudah tamat SMA
  checksum: string;      // FNV-1a hash integrity string
}
```

### 8.3 Algoritma Checksum & Validasi Integritas
Untuk mendeteksi file korup atau modifikasi tidak sengaja saat impor:
```typescript
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

### 8.4 Strategi Migrasi Data Skema
- Jika berkas save memiliki `schemaVersion < CURRENT_SCHEMA_VERSION`:
  - Pipeline migrator menjalankan fungsi transformasi bertingkat (misal: `migrateV1ToV2(oldData)`).
  - Jika skema tidak dikenali atau rusak parah, data lama diarsipkan ke `everlife_save_corrupted_[timestamp]` dan pemain disuguhkan opsi pemulihan.

---

## S9. AUTH & IDENTITAS
*TIDAK AKTIF (Alasan: Sesuai Keputusan DEC-002 & DEC-004, game ini berada pada Skala Small dengan arsitektur Mode A - Pure Client Offline Penuh. Pemain bersifat anonim selamanya tanpa akun atau server cloud).*

---

## S10. DATA & API
*TIDAK AKTIF (Alasan: Sesuai Keputusan DEC-002, game ini beroperasi tanpa backend server database maupun REST/GraphQL API. Seluruh logika dan data tersimpan lokal pada memori klien).*

---

## S11. ANTI-CHEAT & KEAMANAN
*TIDAK AKTIF (Alasan: Sesuai Keputusan DEC-008, game bergenre single-player offline-first tanpa papan peringkat kompetitif atau transaksi uang riil, sehingga verifikasi server-side anti-cheat tidak diperlukan. Keamanan data save cukup dilindungi oleh checksum lokal).*

---

## S12. CACHE, LEADERBOARD & RATE LIMIT
*TIDAK AKTIF (Alasan: Game tidak memiliki fitur leaderboard global, multiplayer, maupun koneksi eksternal yang memerlukan Redis cache atau rate limiting).*

---

## S13. NETCODE & SKALA
*TIDAK AKTIF (Alasan: Tidak ada mekanisme sinkronisasi jaringan real-time/multiplayer. Game sepenuhnya turn-based lokal).*

---

## S14. HOSTING, CI/CD & OBSERVABILITAS (VERSI LITE SMALL)

### 14.1 Hosting Statis & Distribusi
- **PWA Web Hosting**: GitHub Pages, Cloudflare Pages, atau Vercel Static Hosting (Biaya hosting Rp0 / bulan).
- **Distribusi Android**: File biner APK dibuat melalui bundling Capacitor v6 (`npx cap build android`) untuk distribusi sideloading langsung.
- **Service Worker (PWA)**: Menggunakan Workbox / Vite PWA Plugin dengan strategi caching `CacheFirst` untuk seluruh bundel JS/CSS/Aset agar game 100% dapat dibuka saat mode pesawat (tanpa internet).

### 14.2 Pipeline CI/CD Otomatis (GitHub Actions Lite)
```yaml
name: EverLife CI Pipeline
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run build
```

### 14.3 Observabilitas & Penanganan Error Lokal
- Tanpa SDK eksternal pihak ketiga (seperti Sentry) untuk menjaga kebersihan dependensi.
- Menggunakan React `<ErrorBoundary>` di tingkat root aplikasi:
  - Jika terjadi unhandled exception, muncul layar fallback bersahabat dengan tombol "Salin Log Masalah" dan tombol "Muat Ulang Permainan".
  - Log error dicatat ke `localStorage.getItem('everlife_last_crash')` untuk investigasi lokal.

---

## S15. RENCANA UJI & BUKTI

### 15.1 Matriks Pengujian Unit (Unit Test Suite - Vitest)
| Modul Pengujian | Target Komponen | Perintah Eksekusi Eksak | Ambang Lulus (Pass Criteria) |
| :--- | :--- | :--- | :--- |
| **Logic Clamping** | `StatCalculator.ts` | `npx vitest run test/unit/stats.test.ts` | 100% lulus; tidak ada nilai stat keluar dari rentang $[0, 100]$ |
| **Age Progression** | `GameEngine.ts` | `npx vitest run test/unit/age.test.ts` | Usia bertambah tepat 1 tahun per siklus; auto-save dipanggil; tamat pada usia 18 |
| **Event Generator** | `EventEngine.ts` | `npx vitest run test/unit/events.test.ts` | Seed konsisten membangkitkan urutan event identik; syarat usia dan flag ditaati |
| **Relasi & Sosial** | `RelationEngine.ts`| `npx vitest run test/unit/relations.test.ts`| Interaksi menambah/mengurangi skor relasi dengan benar; decay tahunan terhitung |
| **Ekspor & Impor** | `SaveManager.ts` | `npx vitest run test/unit/save.test.ts` | Ekspor JSON valid; impor berkas rusak ditolak oleh verifikator checksum |

### 15.2 Gerbang Kinerja & Build
- `npm run lint`: 0 error, 0 warning kritis.
- `npm run build`: Ukuran total direktori `dist/` $< 1.5\text{ MB}$.
- `npm run test:coverage`: Coverage logika matematika & state game $\ge 90\%$.

### 15.3 Skenario Red Team / Tamper Test Lokal
1. **Manipulasi Manual Nilai Saldo pada Save JSON**:
   - *Tindakan*: Mengubah saldo cash dari 50.000 menjadi 999.999.999 pada file save JSON tanpa memperbarui checksum.
   - *Hasil Diharapkan*: Game menampilkan notifikasi "Berkas Simpanan Tidak Valid / Corrupt" dan menolak proses muat data.
2. **Spam Tombol Tambah Umur**:
   - *Tindakan*: Mengirimkan 50 event tap per detik pada tombol umur menggunakan script pengujian.
   - *Hasil Diharapkan*: Debounce `CFG_INPUT_DEBOUNCE_MS` memfilter seluruh tap berlebih, hanya 1 siklus tahun yang dieksekusi per cooldown.

---

## S16. PRA-LIVEOPS

### 16.1 Kebijakan Semantic Versioning (SemVer)
- Format: `MAJOR.MINOR.PATCH` (Versi rilis perdana: `1.0.0-rc1`).
  - `PATCH`: Perbaikan teks peristiwa naratif, perbaikan bug minor UI.
  - `MINOR`: Penambahan kumpulan kartu peristiwa baru (misal: Paket Event Ekskul SMA), rilis slot save ekstra.
  - `MAJOR`: Ekspansi fase hidup dewasa (Usia 19–80+ tahun / Kuliah & Karier).

### 16.2 Kebijakan Migrasi Save & Kompatibilitas Mundur
- File save wajib mempertahankan kompatibilitas mundur minimal 2 versi minor sebelumnya.
- Jika ada field baru ditambahkan ke interface `CharacterStats` pada update minor, fungsi parser otomatis mengisi nilai bawaan (default fallback) tanpa menghapus progres pemain.

### 16.3 Lokasi Balance Config & Feature Flags
- Seluruh konstanta penyeimbang disimpan terpusat pada file: `src/config/gameConfig.ts`.
- Feature Flag Lokal:
  ```typescript
  export const FEATURE_FLAGS = {
    ENABLE_DEBUG_MENU: false, // Terkunci pada production build
    ENABLE_SYNTH_AUDIO: true,  // Modul Web Audio API
    ENABLE_JSON_EXPORT: true,  // Tombol ekspor/impor di pengaturan
  };
  ```

---

## (A) KEPUTUSAN SCALE / MODE / TARGET
1. **Skala Game (Scale)**: **Small**
   - *Alasan*: Game didesain untuk simulasi santai pemain tunggal (single-player) berbasis teks offline-first. Tanpa dependensi multiplayer, tanpa leaderboard global, dan seluruh state muat dalam memori perangkat klien.
   - *Alternatif Ditolak*: Medium / Large (Ditolak karena membebani proyek dengan infrastruktur server, basis data online, dan biaya operasional yang tidak relevan).
2. **Build Mode**: **Mode A (Pure Client / Offline Penuh)**
   - *Alasan*: Menjamin game dapat dimainkan 100% tanpa sambungan internet di mana saja. Mengeliminasi latensi transmisi jaringan dan biaya sewa server (anggaran hosting Rp0).
   - *Alternatif Ditolak*: Mode B (Client-Server Hybrid) (Ditolak karena menambah titik kegagalan login dan pemeliharaan API).
3. **Target Platform**: **PWA Mobile-First + APK Android via Capacitor**
   - *Alasan*: Kombinasi ini memberi fleksibilitas distribusi maksimal: pemain web dapat langsung bermain instan via browser atau menginstal sebagai PWA di home screen, sementara pengguna Android dapat menginstal APK sideload mandiri secara native.
   - *Alternatif Ditolak*: Flutter / Unity Native (Ditolak karena overhead ukuran instalasi terlalu besar untuk game berbasis teks UI murni).

---

## (B) RISIKO TOP-5: RISIKO | DAMPAK | MITIGASI
| No | Risiko Utama | Potensi Dampak | Strategi Mitigasi Arsitektural |
| :---: | :--- | :--- | :--- |
| **1** | **Kebosanan Akibat Variasi Kejadian Terbatas** | Pemain cepat berhenti bermain karena menemui dialog peristiwa yang sama berulang kali dalam 3 kali bermain. | Menetapkan kuota minimal `CFG_EVENT_POOL_SIZE_V1` (50 kartu) dengan sistem filter multi-kondisi (kombinasi usia, minat, dan pilihan masa lalu) sehingga urutan kejadian terasa dinamis. |
| **2** | **Kehilangan Data Save Akibat Bersih Cache Browser** | Progres karakter pemain terhapus saat sistem operasi membersihkan temporary storage browser. | Menerapkan penyimpanan persisten ganda (`IndexedDB` + backup otomatis) serta menyediakan fitur unduh manual berkas ekspor JSON ke memori lokal HP/komputer. |
| **3** | **Spam Klik / Double Triggering pada Tombol Tambah Umur** | Pemain melewati beberapa tahun sekaligus secara tidak sengaja atau memicu inkonsistensi state. | Menerapkan filter debounce terpusat `CFG_INPUT_DEBOUNCE_MS` (200 ms) dan state guard ketat yang mengunci tombol selama siklus `AGE_UP` sedang berlangsung. |
| **4** | **Performa Menurun / Memory Bloat pada Riwayat Log yang Panjang** | Antarmuka terasa patah-patah saat pemain telah mencapai usia 18 tahun dengan puluhan entri log peristiwa. | Menggunakan komponen daftar ter-virtualisasi (*virtualized list*) pada linimasa peristiwa, merender hanya elemen yang tampak di layar. |
| **5** | **Kematian Dini yang Terasa Tidak Adil bagi Pemain Baru** | Karakter pemain meninggal di usia dini akibat kombinasi pengurangan stat yang terlalu drastis tanpa peringatan. | Menerapkan ambang batas perlindungan (grace period) pada usia 0–12 tahun di mana stat Kesehatan memiliki batas pengurangan maksimal per tahun, serta visual warning kedipan merah saat kesehatan $< 25\%$. |

---

## (C) 10 PERTANYAAN /GRILL-ME TEPAT BESERTA STATUS TERJAWAB

1. **Q1: Genre + mekanik inti dalam 2 kalimat: apa yang pemain LAKUKAN?**
   - *Dampak jika tak dijawab*: Kehilangan fokus desain inti permainan dan ruang lingkup mechanics creep.
   - **TERJAWAB**: Life-sim berbasis teks dan pilihan: pemain menekan "Tambah Umur" tiap tahun, lalu memilih respons pada kartu kejadian dan melakukan aktivitas tahunan (belajar, olahraga, bersosialisasi, dan sebagainya). Kehidupan berjalan dari lahir sampai tamat SMA (v1), dengan stat, relasi mendalam, keluarga, dan uang yang saling memengaruhi.
2. **Q2: Single-player, multiplayer, atau keduanya? Jika multiplayer: real-time atau async?**
   - *Dampak jika tak dijawab*: Ketidakjelasan arsitektur networking dan pemilihan engine/stack.
   - **TERJAWAB**: Single-player saja. Tanpa multiplayer.
3. **Q3: Target platform & engine: web/mobile web/desktop standalone/console; engine wajib atau bebas?**
   - *Dampak jika tak dijawab*: Salah memilih basis teknologi, tooling, dan UI layout framework.
   - **TERJAWAB**: PWA mobile-first (utama), lalu APK Android via Capacitor (sideload), dan desktop lewat instal PWA. Engine bebas; TypeScript + Vite + React, dengan inti game TypeScript murni tanpa DOM.
4. **Q4: Konfirmasi skala usulan (Small/Medium/Large) dan batas anggaran hosting/waktu?**
   - *Dampak jika tak dijawab*: Over-engineering infrastruktur server atau kehabisan waktu pengembangan.
   - **TERJAWAB**: Small, Mode A (offline penuh). Anggaran hosting Rp0: tanpa server, hosting statis opsional atau lokal saja. Pilot 40–50 kartu kejadian.
5. **Q5: Auth: wajib / guest diizinkan / anonim selamanya?**
   - *Dampak jika tak dijawab*: Kompleksitas integrasi OAuth, basis data pengguna, dan kepatuhan privasi data.
   - **TERJAWAB**: Anonim selamanya. Tanpa akun; seluruh data tersimpan hanya di perangkat pemain.
6. **Q6: Panjang sesi & save: arcade cepat / checkpoint / auto-save penuh?**
   - *Dampak jika tak dijawab*: Data pemain rentan hilang saat browser di-refresh atau aplikasi ditutup.
   - **TERJAWAB**: Auto-save penuh: simpan otomatis tiap tahun. Sesi 5–30 menit, 3 slot save lokal, fitur ekspor/impor JSON dengan checksum sebagai cadangan dan jembatan antara PWA dan APK.
7. **Q7: Ekonomi/progresi: XP-level / item-inventori / currency-shop / achievement / tidak ada?**
   - *Dampak jika tak dijawab*: Salah merancang sistem reward loop dan kalkulasi matematika status.
   - **TERJAWAB**: Progresi lewat stat, uang, pendidikan, relasi, dan keluarga. Tanpa XP/level dan tanpa currency premium. Sistem achievement ditunda ke versi v1.x.
8. **Q8: Leaderboard: global / mingguan / teman / tidak ada — dan seberapa penting integritasnya?**
   - *Dampak jika tak dijawab*: Memaksakan kebutuhan database backend dan sistem validasi anti-cheat.
   - **TERJAWAB**: Tidak ada leaderboard. Integritas skor tidak relevan karena game offline dan tidak ada persaingan antar-pemain.
9. **Q9: Monetisasi: gratis / iklan / IAP / premium sekali bayar?**
   - *Dampak jika tak dijawab*: Mengacaukan UI game dengan slot iklan atau modul payment gateway yang belum dibutuhkan.
   - **TERJAWAB**: Tidak ada monetisasi di v1 (100% gratis bersih). Premium sekali bayar hanya rencana cadangan dan tidak dibangun di v1 (tanpa kode pembayaran).
10. **Q10: Situasi aset: sudah punya (tier H) / pakai library gratis / butuh placeholder? Siapa yang menyediakan seni dan audio?**
    - *Dampak jika tak dijawab*: Tersendat menunggu suplai aset gambar karakter dan musik yang menghambat rilis kode.
    - **TERJAWAB**: Ikon dari library open-license MIT Lucide (tier H), UI dan avatar inisial dibuat dari kode prosedural (tier P). Tanpa avatar gambar external. Audio opsional, disintesis dari kode (Web Audio API), dan default mati.
