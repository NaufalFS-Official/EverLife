# GEMINI ANALYSIS: EverLife

# LANGKAH 0 - INTAKE

* **Input diterima**: Teks konsep & alur karakter "EverLife" [V], 4 rekaman gameplay/UI BitLife (Video 1, Video 2, Video 4, Video 6) [V], 2 tangkapan layar antarmuka (Image 3, Image 5) [V]. Video: diproses [V].
* **Ide 1 kalimat**: Simulator kehidupan berbasis teks modular di mana pemain memandu karakter dari lahir hingga wafat melalui siklus tahunan (+Age), pohon keputusan bercabang, manajemen relasi, dan manipulasi atribut [V]. Dimensi: 2D Portrait GUI [V].
* **Profil usulan**:
  * **Skala**: M [I: multi-sistem terhubung: atribut, relasi, karir, inventaris, event pool].
  * **Konektivitas**: C0 (offline penuh, save local browser/IndexedDB) [A: fokus single-player naratif] -> **Build Mode A** [I].
  * **Genre Profile**: Naratif / Visual Novel (Utama) + Prosedural (roguelite/endless) (Sekunder) [I: berbasis teks bercabang & seed acak].
  * **Platform**: Web-first (mobile-responsive portrait browser viewport) [A: standar Vibecoding].
  * **Niat Rilis**: Publik (gratis dimainkan via web/PWA) [I: teks "gratis untuk dimainkan"].
* **Tingkat keyakinan**: Tinggi [V]. Kontradiksi: Teks menyebut judul "EverLife" [V], namun materi visual/video berasal dari rekaman BitLife [V]; aset dan IP BitLife diperlakukan murni sebagai referensi mekanik tanpa menyalin nama atau grafis berhak cipta [A].

---

# BAGIAN 1: ANALISIS VISUAL & GAMEPLAY

## 1. VISUAL DNA

* **Art Style**: Minimalist Flat Vector UI / App-Centric Design [V]. Antarmuka menyerupai aplikasi utilitas mobile dengan daftar entri berbaris (list-view), rounded cards, dan avatar 2D modular berbasis layer datar (flat vector) [V].
* **Perspektif**: 2D Portrait Mobile Interface (rasio viewport target 9:19.5, optimal pada 390x844 px hingga 412x915 px) [V]. Kamera statis non-spasial, navigasi murni berbasis scroll vertikal DOM/Canvas [I: UI mobile standar].
* **Color Palette**:
  * *Utama*: Header Crimson Red `~#E52521` [V], Primary Age Button Emerald Green `~#27AE60` [V], Accent Cyan Blue `~#00A8FF` [V].
  * *Aksen*: Highlight Golden Yellow `~#F1C40F` [V], Relationship Pink `~#E84393` [V].
  * *Background*: Base Off-White `~#F8F9FA` [V], Card White `~#FFFFFF` [V], Header Red Bar `~#E52521` [V].
  * *UI*: Text Primary Charcoal `~#2C3E50` [V], Text Secondary Slate `~#7F8C8D` [V], Divider Grey `~#E2E8F0` [V].
  * *Bahaya / Negative*: Alert Dark Crimson `~#C0392B` [V].
  * *Stat Bar Fill*: Vibrant Green `~#2ECC71` [V], Warning Orange `~#E67E22` [V], Critical Red `~#E74C3C` [V].
* **Lighting & Material**: Flat 2D rendering tanpa pencahayaan dinamis (unlit) [V]. Kedalaman visual dibentuk oleh CSS drop-shadow lembut (`rgba(0, 0, 0, 0.08)` blur 8px) dan garis batas kontras tipis (border 1px) [A: web styling]. Avatar tanpa gradien kompleks, mengandalkan block-color solid [V]. Poly budget: N/A - aset 2D/vektor [V].
* **UI Style**: Modern Clean Mobile App Layout [V]. Elemen utama terbagi atas: Header profil permanen di atas, riwayat log teks di tengah dengan infinite scroll, tombol aksi utama melingkar di tengah bawah, dan 4-5 tab navigasi bawah [V]. Modal dialog muncul sebagai bottom sheet atau centered card dengan latar belakang redup (overlay 50% opacity) [V].
* **Animation Style**: Snappy & micro-interaction focused [A]. Transisi modal popup instan dengan zoom/fade ringan (120ms - 180ms) [T], progress bar stat terisi secara linier saat nilai berubah (300ms) [A].
* **Mood**: Satirikal, Adiktif, Eksploratif [I: tema hidup liar, drama, kejahatan, pencapaian].

## 2. GAMEPLAY ANALYSIS

* **Core Mechanic**: Siklus diskrit berbasis tahun (+Age) [V]. Pemain menekan tombol "+Age", engine mengeksekusi perhitungan tahunan (penuaan karakter, perubahan stat pasif, kemunculan event acak/terjadwal), menampilkan log teks baru, dan menyajikan modal keputusan jika terdapat persimpangan hidup [V].
* **Genre Primer**: Life Simulation / Text Sandbox [V]. Sub-genre: Branching Interactive Narrative [I].
* **Player Feedback Loops**:
  * *Visual*: Bar stat (Happiness, Health, Smarts, Looks) bertambah/berkurang secara real-time dengan kode warna dinamis [V]. Log kehidupan menambahkan baris baru dengan tahun, ikon peristiwa, dan teks naratif [V]. Dialog pop-up memberikan konfirmasi eksplisit atas aksi yang diambil [V].
  * *Audio*: Audio klik taktil pada tombol navigasi [A], tangisan bayi prosedural saat karakter lahir [V], jingle kemenangan saat lulus/promosi [A], dentang sirine/borgol saat tertangkap polisi [A].
  * *Angka Melayang & Notifikasi*: Floating stat delta (+/-) di atas bar status saat keputusan diambil [A].
* **Game Feel & Juice**:
  * Tombol "+Age" memiliki scaling feedback saat ditekan (scale down ke 0.95 lalu bounce kembali ke 1.0 dalam 100ms) [A].
  * Getaran haptic (Vibration API 15-30ms) pada perangkat mobile saat memicu pergantian tahun atau krisis [A].
  * Transisi teks instan tanpa typewriter delay berkepanjangan agar pacing gameplay cepat dan tidak menghambat keputusan berulang [A].

* **Dekonstruksi Awal Aksi**:

| Aksi | Nilai ms | Frame (@60 FPS) | Timestamp mm:ss.s | Toleransi (+/- frame) | Keyakinan (R/S/T) | Verifikasi: frame-step manual | Tag |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tap "+Age" memicu Log Baru | 200 ms | 12 | 00:54.2 (Video 2) | +/- 2 | T | Diukur dari sentuhan tombol hingga teks log bertambah | [T] |
| Munculnya Dialog Skenario Acak | 150 ms | 9 | 00:49.1 (Video 2) | +/- 2 | T | Diukur dari evaluasi tahun ke popup render | [T] |
| Eksekusi Pilihan Dialog ke Feedback | 180 ms | 11 | 00:57.0 (Video 2) | +/- 2 | T | Diukur dari tap opsi ke popup konfirmasi hasil | [T] |
| Buka Menu Tab (Assets/Activities) | 100 ms | 6 | 00:30.8 (Video 2) | +/- 1 | T | Diukur dari tap tab bar ke render halaman menu | [T] |
| Konfirmasi Pembuatan Karakter Baru | 260 ms | 16 | 00:46.5 (Video 4) | +/- 3 | S | Diukur dari tombol start ke modal 'giving birth' | [T] |
| Slider Atribut Karakter Realtime | 16.6 ms | 1 | 00:40.2 (Video 4) | +/- 1 | T | Perubahan angka 0-100% mengikuti drag input | [T] |

* **FEEL SPEC AWAL (Profil Utama: Naratif / Visual Novel; Profil Sekunder: Prosedural)**:

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

## 3. UI & HUD INVENTORY

* **Daftar Layar**:
  1. *Layar Menu Utama (Main Menu)*: Tombol New Life, Save Life, Load Life, Settings, About [V].
  2. *Layar New Life Wizard*: Country & City picker, Name input, Gender radio, Special Talent dropdown, Appearance customizer (Skin, Eyes, Brows, Hair), Atribut slider (0-100%), Tombol "Start 's life!" [V].
  3. *Layar Utama (Life Dashboard)*: Header status ringkas, Main Log vertikal (Age, Icon, Story narrative), FAB "+Age", Bottom Stats Dock [V].
  4. *Layar Sub-Menu Occupation / School / Job*: Daftar jenjang pendidikan, pekerjaan aktif, aksi performa kerja/sekolah (Study Harder, Drop Out, Interaksi Pengajar/Bos) [V].
  5. *Layar Sub-Menu Assets & Finances*: Ringkasan keuangan (Net Worth, Bank Balance, Income, Outflow), sub-kategori Aset Properti, Kendaraan, Investasi [V].
  6. *Layar Sub-Menu Relationships*: Daftar kartu entitas keluarga (Ayah, Ibu, Saudara, Pasangan, Teman, Hewan Peliharaan), indikator kedekatan (relasi bar 0-100%), sub-aksi individual (Spend Time, Compliment, Insult, Gift) [V].
  7. *Layar Sub-Menu Activities*: Daftar kategori aktivitas hidup (Mind & Body, Doctor, Crime, Emigrate, Lottery, Shopping, Salon, Surrender) [V].
  8. *Modal Popup Keputusan (Scenario Dialog)*: Banner kategori, ikon & identitas subjek, deskripsi situasi teks, 2-4 tombol pilihan, tombol "Surprise me!" [V].
  9. *Layar Wafat (Memorial / Tombstone Summary)*: Gelar kehidupan, ringkasan pencapaian, umur akhir, penyebab kematian, nilai kekayaan bersih, tombol "Start a New Life" [I: konvensi genre simulator hidup].

* **Elemen HUD**:
  * *Top Header*: Avatar karakter (lingkaran 48x48 px), Nama Lengkap, Status/Pekerjaan, Umur (label), Saldo Bank (`$X`), Tombol Menu burger [V].
  * *Bottom Dock Stats*: 4 Progress Bar horizontal berdampingan: Happiness (ikon wajah senyum), Health (ikon hati), Smarts (ikon lampu), Looks (ikon api/bintang) dengan persentase 0-100% [V].
  * *Floating Action Button (FAB)*: Tombol bulat diameter 72px hijau tua dengan ikon "+" dan teks "Age" di tengah dock bawah [V].
  * *Bottom Navigation Bar*: 4 Tab navigasi berikon: Infant/School/Occupation, Assets, Relationships, Activities [V].

* **Pola Menu**: Menu bertingkat (Hierarchical Drill-Down) berbasis card list; navigasi mundur menggunakan top-left back button panah [V]. Semua formulir dan keputusan menggunakan modal dialog terisolasi (sheet modal) [V].
* **Skema Kontrol**:
  * *Touch / Mouse Click*: Tap pada card menu, tombol "+Age", opsi pilihan dialog, dan slider [V].
  * *Keyboard Shortcut (Desktop Browser)*: `Space` = Tekan +Age, `1-4` = Pilih opsi keputusan modal, `Escape` = Tutup modal / Kembali [A].

## 4. ASSET & VFX INVENTORY

* **Entitas Sprite / Model**:
  * *Avatar System (Modular 2D SVGs)*: 1 Base Head Shape [A], 6 Variasi Skin Tone (`~#FFDBAC` s/d `~#3B2219`) [V], 8 Variasi Bentuk Rambut [V], 8 Warna Rambut [V], 6 Variasi Mata [V], 5 Variasi Bentuk Alis [V], 4 Tahapan Usia (Bayi, Anak, Dewasa, Lansia) [V].
  * *Iconography*: ~120 ikon berbasis SVG/Emoji standar untuk kategori aktivitas, jenis hubungan, pekerjaan, dan item aset [V].
* **Latar (Backgrounds)**: Solid neutral white `~#FFFFFF` [V] dan card contrast grey `~#F1F2F6` [V]. Modal overlay gelap `rgba(0, 0, 0, 0.45)` [V].
* **Pola Partikel / VFX**:
  * Confetti burst partikel 2D Canvas saat momen kelulusan, pernikahan, atau memenangkan lotre (durasi 800ms) [A].
  * Screen edge vignette merah berkedip lembut saat Health < 15% (siklus 1000ms pulse) [A].
  * Heart particle melayang saat relasi meningkat (+Relationship) [A].
* **Audio Cues**:
  * UI Tap: Soft tactile click (`ui_click.wav`, 40ms) [A].
  * Age Up: Muted ding / tick chime (`age_tick.wav`, 120ms) [A].
  * Birth Event: Suara tawa/tangis bayi pendek (`baby_birth.wav`, 800ms) [V: video 4 audio 00:47].
  * Death Toll: Low piano chord / chime murung (`death_toll.wav`, 1500ms) [A].
  * Cash Register: Suara koin (`cash_register.wav`, 250ms) saat menerima gaji atau menjual aset [A].
* **Estimasi Jumlah Aset**:
  * Avatar Layer SVGs: ~40 komponen modular [A].
  * UI Icons: ~100 ikon monokrom/warna [A].
  * SFX Audio: ~15 klip efek suara pendek (<2 detik) [A].
  * BGM: N/A (game simulator teks mengandalkan keheningan/ambient minimal untuk kenyamanan membaca pemain) [A].

## 5. TECH SIGNALS & REKOMENDASI

* **Renderer**: HTML5 DOM + Tailwind CSS (atau Canvas2D untuk modul avatar) [I: data-dense list UI jauh lebih efisien dan terstruktur di DOM].
* **Perilaku Fisika**: N/A - Game berbasis teks murni tanpa simulasi fisika rigid body atau gravitasi [V].
* **Tipe Map**: N/A - Arsitektur non-spasial, berbasis graph state dan database peristiwa prosedural [V].
* **Rekomendasi Engine & Alternatif**:
  * *Pilihan Utama: Web-Native SPA (React / Solid.js + TypeScript + Tailwind)*: 98% cocok.
  * *Alternatif 1: Phaser 3*: 65% cocok.
  * *Alternatif 2: Godot 4 (Export Web / PWA)*: 80% cocok.

## 6. 3-SENTENCE GAME DESIGN BRIEF

EverLife adalah simulator kehidupan berbasis teks modular dan reaktif yang dibangun di atas web stack berbobot ringan, berfokus pada kedalaman percabangan keputusan personal dari buaian hingga liang lahat. Siklus gameplay berpusat pada kepuasan penekanan tombol tahunan (+Age) yang memicu perpaduan peristiwa terprediksi dan skenario acak tak terduga yang secara instan menggeser matriks atribut, relasi sosial, serta neraca finansial pemain. Game feel dicapai melalui antarmuka mobile-first yang sangat responsif, feedback visual instan pada perubahan statistik, serta penceritaan satirikal yang memberikan otonomi penuh antara menjadi teladan masyarakat atau arsitek kekacauan total.
