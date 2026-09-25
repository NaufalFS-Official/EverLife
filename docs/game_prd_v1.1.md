# GAME PRD: EverLife - v1.1 (LOCKED)

> **STATUS DOKUMEN: PRD v1.1 - LOCKED**  
> Patch KUNCI diterapkan dari Konfirmasi & Resolusi Arsitektur Pengguna (`DEC-001` s/d `DEC-005` + `Q1` s/d `Q10` [U]).

---

## 1. Identitas & Ikhtisar

* **Working Title**: EverLife [V].
* **Genre / Sub-genre**: Text-Based Life Simulator [V] / Branching Interactive Narrative Sandbox [I].
* **High-Concept**: Simulator kehidupan berbasis teks modular di mana pemain mengendalikan takdir karakter dari lahir hingga wafat melalui pilihan diskrit tahunan, manajemen relasi, dan manipulasi atribut moral [V].
* **Design Pillars**:
  1. *Meaningful Causality*: Setiap keputusan memiliki dampak berantai jangka pendek dan panjang pada relasi, atribut, dan reputasi [V].
  2. *Emergent Storytelling*: Perpaduan skenario acak berbobot menghasilkan drama satirikal unik pada setiap playthrough [V].
  3. *Zero-Friction Gameplay*: Antarmuka berbasis list vertikal yang responsif, minim jeda, dan instan dieksekusi [I].
* **Pembeda vs Referensi (BitLife)**:
  1. *Moral Dilemma Matrix*: Sistem Karma aktif 2-sumbu (Order vs Chaos, Altruism vs Greed) yang membuka faksi rahasia, bukan sekadar stat pasif persentase [I].
  2. *Modular Career & Hustle Tree*: Pemain dapat memadukan pekerjaan formal dengan usaha rintisan mikro (side-hustle) tanpa batasan kaku karir korporat tunggal [I].
  3. *NPC Memory & Grudge System*: NPC keluarga dan rekan memiliki status afeksi dinamis dengan sistem memori dendam/hutang budi yang memicu pembalasan acak di masa depan [I].
* **Non-Goals**:
  1. Tidak menyediakan pergerakan spasial real-time 2D/3D (non-spasial sandbox) [U].
  2. Tidak menyediakan mode multiplayer sinkronus real-time (fokus single-player mandiri) [U].
  3. Tidak menggunakan animasi 3D kompleks atau rendering grafis berat (UI clean flat-vector native) [U].
  4. Tidak menyediakan minigame aksi fisik refleks pada versi MVP (fokus teks pilihan) [U].
  5. Tidak menyediakan silsilah dinasti warisan multi-generasi pada MVP [U].
* **Target Audiens**: Penggemar simulasi sosial, interactive fiction, dan casual mobile gamers usia 16+ [A].
* **Panjang Sesi**:
  * *Sesi Mikro*: 1 - 3 menit (memainkan 2-5 tahun kehidupan secara cepat saat jeda santai) [A].
  * *Sesi Penuh*: 15 - 25 menit (menyelesaikan 1 siklus kehidupan penuh 0 hingga 80+ tahun) [A].
* **Core Loop**:
  * *30 Detik*: Tekan "+Age" -> Baca log peristiwa tahunan -> Tanggapi 1 modal skenario dilema hidup -> Evaluasi perubahan status bar [V].
  * *Sesi (15-25 menit)*: Ambil jalur pendidikan -> Rintis karir/kejahatan -> Akumulasi kekayaan dan aset -> Bangun jejaring relasi keluarga/sosial -> Hadapi krisis usia tua -> Wafat [V].
  * *Meta-Progresi*: Buka pencapaian permanen (Achievements), koleksi pita/gelar kematian (Ribbons) [I].

---

## 2. Profil & Keputusan Arsitektur Final

| Keputusan | Pilihan | Alasan | Tag |
| --- | --- | --- | --- |
| **Skala** | Skala M | Multi-sistem terhubung (atribut, relasi, karir, inventaris aset, dan database event bercabang). | [U] |
| **Konektivitas** | C0 (Offline Penuh) | Game naratif single-player mandiri dengan Repository Pattern modular (siap provider C1 REST/Supabase di masa depan). | [U] |
| **Build Mode** | Mode A | Arsitektur client-side murni, zero-backend, zero-network overhead saat runtime MVP. | [U] |
| **Genre Profile** | Naratif / VN (Utama) + Prosedural (Sekunder) | Alur pilihan teks bercabang dengan distribusi event berbasis generator terbobot. | [U] |
| **Niat Rilis** | Publik | Rilis publik web gratis, responsif mobile, didukung PWA. | [U] |
| **Platform & Viewport** | Web-First (Mobile Portrait 390x844 px) | Target resolusi mobile portrait standar dengan desktop centered container. | [U] |
| **Engine / Framework** | Web-Native SPA (React 19 + TypeScript + Tailwind CSS + Vite) | Virtual DOM cepat, rendering teks dense bebas lag, struktur form/modal mudah diuji via unit test. | [U] |
| **Bahasa & Type-Safety** | TypeScript (Strict Mode) | Menjamin integritas skema data event naratif, relasi NPC, dan payload aksi. | [U] |
| **Physics** | N/A (Non-Spasial) | Tidak ada interaksi tabrakan fisik atau kalkulasi gaya kinematik. | [U] |
| **Netcode** | N/A (Konektivitas C0) | Tidak ada sinkronisasi jaringan antar pemain saat runtime. | [U] |
| **Audio Stack** | Web Audio API / Howler.js | Audio triggering ringan untuk SFX UI pendek (klik, chime, notifikasi). | [U] |
| **Storage / Save** | IndexedDB (idb-keyval) / LocalStorage | Auto-save state penuh terlindungi salted SHA-256 envelope per transisi tahun (+Age). | [U] |
| **Target FPS & Step** | 60 FPS (Fixed Timestep 16.6 ms untuk UI tweens) | Menjamin animasi transisi progress bar dan modal terasa licin (snappy). | [U] |

---

## 3. Spesifikasi Mekanika & Atribut

* **Pembuatan Karakter (Sandbox Sliders)**: Slider atribut awal (Discipline, Fertility, Happiness, Health, Karma, Looks, Smarts) bebas diatur antara 0% hingga 100% tanpa sistem point-buy pembatas [V/U].
* **Formula Finansial Tahunan**:
  $$\text{Net Income} = \text{Annual Salary} - \text{Taxes} - \text{Living Expenses} - \text{Asset Maintenance}$$ [A]
* **Formula Mortalitas Pasif Tahunan**:
  $$P(\text{Death}) = \max\left(0, \frac{100 - \text{Health}}{100}\right) \times 0.25 + (0.001 \times e^{0.045 \times \text{Age}})$$ [A]
* **Kondisi Akhir Permadeath**: Kematian karakter bersifat permanen. Menampilkan layar memorial nisan dan mewajibkan memulai siklus baru (New Life) [V/U].

---

## 4. Rencana Rilis MVP per Sesi (Tahapan Kerja)

* **Sesi 1 (First Playable Alpha Loop)**:
  * F-001: Character Creation Wizard (Nama, Gender, Lokasi, Atribut, Tampilan) [U]
  * F-002: Core Aging Engine (+Age loop, penuaan biologis, kalkulasi mortalitas) [U]
  * F-003: Main Narrative Log Viewer (Daftar vertikal riwayat hidup) [U]
  * F-004: Interactive Decision Modals (Skenario acak dengan 2-4 pilihan) [U]
  * F-005: Realtime Stat Dashboard (Happiness, Health, Smarts, Looks progress bars) [U]
* **Sesi 2 (Life Systems - Education, Career & Relationships)**:
  * F-006: Education & Career Pipeline (Sekolah, cari kerja, gaji, promosi) [U]
  * F-007: Basic Relationship System (Orang tua & saudara, bar relasi, aksi sosial) [U]
  * F-012: Modular Avatar Customizer UI (Preview avatar realtime saat edit fisik) [U]
* **Sesi 3 (Mortality, Finance & Persistence)**:
  * F-008: Death & Memorial Tombstone Screen (Penyebab mati, net worth, tombol restart) [U]
  * F-009: Local Persistence Engine (Auto-save via IndexedDB + SHA-256 checksum) [U]
  * F-010: Personal Finances & Basic Assets (Tabungan bank, aset properti & mobil) [U]
  * F-011: Crime & Risky Activities (Pencurian, perampokan, penangkapan polisi) [U]
* **Sesi 4 (Integration, Polish, Test & PWA Build)**:
  * F-013: Special Talent System [U]
  * Pengujian menyeluruh L1-L5 (Playwright E2E & unit tests) [U]
  * Konfigurasi PWA Manifest & Service Worker untuk offline play [U]
  * Static build deployment ke Cloudflare Pages / Vercel [U]

---

## 5. Kriteria Penerimaan (AC) & Test ID

| AC-ID | F-ID | Deskripsi Uji | Test ID | Level | Tag |
| --- | --- | --- | --- | --- | --- |
| **AC-001** | F-001 | Inisialisasi karakter baru (Age=0, Health=100%, log lahir) | `TEST-AC-001` | L2 | [V/U] |
| **AC-002** | F-002 | Siklus penuaan tahunan (+Age, mutasi finansial, log bertambah) | `TEST-AC-002` | L2 | [V/U] |
| **AC-003** | F-004 | Interaksi dialog modal & resolusi konsekuensi (<200ms) | `TEST-AC-003` | L3 | [V/U] |
| **AC-004** | F-005 | Deteksi Health=0% memicu kematian instan ke layar nisan | `TEST-AC-004` | L2 | [U] |
| **AC-005** | F-006 | Kualifikasi lamaran kerja & alokasi gaji tahunan | `TEST-AC-005` | L3 | [V/U] |
| **AC-006** | F-007 | Interaksi relasi keluarga meningkatkan bar relasi (>= +10%) | `TEST-AC-006` | L2 | [V/U] |
| **AC-007** | F-008 | Wafat pada usia lanjut menampilkan ringkasan memorial nisan lengkap | `TEST-AC-007` | L4 | [V/U] |
| **AC-008** | F-009 | Browser refresh mempertahankan 100% data state permainan | `TEST-AC-008` | L4 | [U] |

> **STATUS: PRD v1.1 - LOCKED**. Dokumen ini telah terkunci dan disepakati sebagai acuan tunggal pengerjaan proyek EverLife.
