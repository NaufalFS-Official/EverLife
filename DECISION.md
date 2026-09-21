# Log Keputusan Arsitektur & Desain EverLife (DECISION.md)

Dokumen ini mencatat seluruh keputusan arsitektural, teknis, dan mekanik game **EverLife** (Tahap 1B).

---

### DEC-001: Ruang Lingkup Versi 1.0 (Lahir hingga Tamat SMA)
- **Keputusan**: Ruang lingkup gameplay v1 dibatasi dari usia 0 (lahir) hingga 18 tahun (tamat SMA).
- **Alasan**: Fokus pada kedalaman narasi, relasi keluarga, sekolah, dan masa remaja yang padat dan bermakna sebelum mengekspansi ke karier dewasa kompleks di v1.x.
- **Alternatif Ditolak**: Rentang hidup 0–80+ tahun langsung di v1 (Ditolak: risiko konten dangkal atau pengulangan berlebih pada rilis perdana).

---

### DEC-002: Mode Arsitektur & Skala (Mode A — Pure Client / Small)
- **Keputusan**: Mengadopsi Skala **Small**, **Mode A (Pure Client)**, 100% offline-first tanpa backend server (anggaran hosting Rp0).
- **Alasan**: Game berbasis pilihan teks single-player tidak membutuhkan latensi jaringan atau validasi server. Seluruh komputasi berjalan di sisi klien.
- **Alternatif Ditolak**: Mode B (Client + API Server) / Mode C (Multiplayer Server) (Ditolak: menambah overhead biaya server, kompleksitas auth, dan pemeliharaan tak perlu).

---

### DEC-003: Platform Target & Tech Stack (PWA + Capacitor + React/TS)
- **Keputusan**: Target utama PWA mobile-first (responsif desktop), dibungkus menjadi APK Android via Capacitor (sideload). Stack: TypeScript + Vite + React, dengan Game Engine murni tanpa dependensi DOM.
- **Alasan**: Memungkinkan rilis web instan tanpa friction app store, portabilitas ke Android APK, serta pemisahan murni antara domain logic (TypeScript) dan presentation layer (React).
- **Alternatif Ditolak**: Flutter / React Native murni (Ditolak: siklus build lebih berat untuk iterasi cepat PWA web), Godot 4 (Ditolak: ukuran biner terlalu besar untuk game teks).

---

### DEC-004: Manajemen Identitas & Auth (Anonim Selamanya)
- **Keputusan**: Tidak ada sistem login, OAuth, atau pendaftaran akun (Anonim selamanya).
- **Alasan**: Menghilangkan friction pemain, menjaga privasi 100%, dan menyederhanakan regulasi data privasi (GDPR/COPPA) untuk karakter usia anak/remaja.
- **Alternatif Ditolak**: Guest upgrade ke Google/Firebase Auth (Ditolak: membutuhkan backend cloud dan dependensi jaringan).

---

### DEC-005: Strategi Penyimpanan & Save State (3 Slot + JSON Backup)
- **Keputusan**: Auto-save otomatis tiap pergantian tahun (+1 usia) ke penyimpanan lokal (`IndexedDB` / `localStorage`) dengan 3 slot independen, dilengkapi fitur ekspor/impor file JSON ber-checksum.
- **Alasan**: Melindungi progresi pemain dari refresh browser yang tidak disengaja dan menyediakan jembatan transfer save antara PWA web dan APK Capacitor.
- **Alternatif Ditolak**: Single-slot auto-save tanpa ekspor (Ditolak: pemain tidak bisa mencoba cabang takdir berbeda atau memindahkan save antar perangkat).

---

### DEC-006: Model Progresi & Ekonomi (Stat-Driven Non-Level)
- **Keputusan**: Progresi didorong oleh 5 parameter stat (Kesehatan, Kebahagiaan, Hubungan, Kecerdasan/Akademik, Uang), relasi keluarga/teman, dan pencapaian tonggak hidup (milestones). Tanpa sistem XP, level angka grinding, atau mata uang premium.
- **Alasan**: Menjaga realisme simulasi kehidupan organik tanpa distraksi mekanisme RPG fantasi.
- **Alternatif Ditolak**: Leveling RPG konvensional dengan stat points (Ditolak: merusak nuansa life simulator realistis).

---

### DEC-007: Kebijakan Monetisasi (Rp0 / Free-to-Play Bersih di v1)
- **Keputusan**: v1 dirilis 100% gratis tanpa iklan, tanpa IAP, dan tanpa paywall fitur.
- **Alasan**: Memberikan pengalaman bermain imersif tanpa gangguan iklan pada fase rilis awal.
- **Alternatif Ditolak**: Ad-supported (rewarded ads untuk tambah uang saku) atau pay-to-unlock (Ditolak: menambah dependensi SDK iklan pihak ketiga yang rentan merusak kestabilan offline).

---

### DEC-008: Strategi Aset Visual & Audio (Tier P & H Open-Source, Tanpa Avatar Gambar)
- **Keputusan**: Menggunakan sistem avatar prosedural berbasis inisial/ikon kode (Tier P), ikon UI open-license MIT (Tier H, Lucide Icons), dan audio sintetis minimal via Web Audio API yang default nonaktif (Mute).
- **Alasan**: Mengeliminasi kebutuhan produksi aset grafis manual 24 avatar dan beban unduhan file audio besar, menjaga total paket di bawah 2 MB.
- **Alternatif Ditolak**: Penggunaan 24 ilustrasi avatar buatan AI/manusia (Ditolak: sesuai jawaban Q10 untuk memangkas dependensi aset eksternal pada v1).

---

### DEC-009: Generator Peristiwa & Integritas Naratif (Deterministic Seeded PRNG)
- **Keputusan**: Menggunakan generator peristiwa berbasis kondisi (age-gated & flag-driven) dengan Pseudo-Random Number Generator (PRNG Mulberry32) berbasis seed per kehidupan.
- **Alasan**: Memastikan variasi narasi tetap dapat diaudit/direproduksi untuk keperluan debugging logika stat dan menjaga keunikan di tiap playthrough.
- **Alternatif Ditolak**: `Math.random()` murni tanpa seed (Ditolak: menyulitkan reproduksi bug narasi langka).

---

### DEC-010: Skema Pengujian & Kualitas (Vitest + Headless Test Harness)
- **Keputusan**: Seluruh kalkulasi logika, percabangan umur, dan mutasi stat diuji menggunakan Vitest pada level pure TypeScript tanpa browser DOM.
- **Alasan**: Eksekusi pengujian dalam hitungan milidetik di pipeline CI, menjamin 0 regression pada kalkulasi matematis stat.
- **Alternatif Ditolak**: End-to-end testing Cypress/Playwright untuk seluruh flow (Ditolak: terlalu lambat untuk verifikasi logika turn-based murni).

---

### DEC-011: Pengecualian Sesi Backend & Server (Skala Small Mode A)
- **Keputusan**: Mengeliminasi sesi DATA, SECURITY (backend), SERVER, INTEGRATE (network), dan BLUETEAM dari manifest eksekusi.
- **Alasan**: Berdasarkan aturan aktivasi skala Vibecoding v2.2, game berskala Small (Mode A - Pure Client) beroperasi sepenuhnya offline tanpa backend server, tanpa Redis, tanpa database SQL, dan tanpa otentikasi jaringan.
- **Alternatif Ditolak**: Memaksakan pembuatan server Express/NestJS dengan database lokal (Ditolak: over-engineering masif yang melanggar batasan arsitektur Rp0 dan offline-first).

