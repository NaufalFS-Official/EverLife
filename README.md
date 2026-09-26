# EverLife — Life Simulator Sandbox

[![EverLife CI/CD Pipeline](https://github.com/NaufalFS-Official/EverLife/actions/workflows/ci.yml/badge.svg)](https://github.com/NaufalFS-Official/EverLife/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-v1.0.0--rc.1-emerald.svg)](https://github.com/NaufalFS-Official/EverLife/releases)
[![Tests](https://img.shields.io/badge/tests-114%20passed-brightgreen.svg)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PWA%20%7C%20Mobile%20%7C%20Desktop-orange.svg)](#cara-bermain-di-mobile--desktop)

> **EverLife** adalah simulator kehidupan modular berbasis teks di mana setiap keputusan menentukan takdir karakter dari lahir hingga wafat.

---

## 🎮 Mainkan Langsung (Live Play)

EverLife siap dimainkan secara instan di peramban web modern tanpa instalasi:

👉 **[https://naufalfs-official.github.io/EverLife/](https://naufalfs-official.github.io/EverLife/)**

---

## 📱 & 💻 Cara Bermain di Mobile & Desktop

EverLife dirancang dengan arsitektur **Mobile-First Responsive** yang memberikan pengalaman optimal di semua perangkat:

### 1. Di Smartphone / Tablet (Mobile)
- **Orientasi**: Gunakan orientasi **Portrait** (tegak). Game dilengkapi proteksi *Landscape Shield* yang memandu pemain jika layar tidak sengaja berputar.
- **Kontrol Sentuh**: Ketuk tombol **+Usia** untuk bertambah umur 1 tahun, sentuh opsi dialog untuk menentukan pilihan, dan jelajahi tab drawer di bagian bawah (Aktivitas, Relasi, Karir, Aset).
- **PWA (Instalasi Tanpa App Store)**:
  - **Android (Chrome)**: Ketuk menu `⋮` (tiga titik) -> pilih **"Tambahkan ke Layar Utama" / "Instal Aplikasi"**.
  - **iOS (Safari)**: Ketuk tombol **Bagikan (Share)** `⎋` -> pilih **"Tambahkan ke Layar Utama (Add to Home Screen)"**.
  - *Dapat dimainkan 100% offline* setelah dimuat pertama kali berkat Service Worker v1.0.0.

### 2. Di Komputer / Laptop (Desktop)
- **Tampilan Elegan**: Game tampil terpusat (*centered phone shell*) dengan bayangan realistis dan rasio mobile portrait modern.
- **Pintasan Keyboard (Ergonomis)**:
  - <kbd>Space</kbd> / <kbd>Enter</kbd> / <kbd>A</kbd>: Menua 1 Tahun (+Age)
  - <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd>, <kbd>4</kbd>: Memilih opsi pada dialog peristiwa secara instan
  - <kbd>Esc</kbd>: Menutup menu / laci navigasi
  - <kbd>M</kbd>: Menghidupkan / mematikan audio SFX

---

## 🚀 Mengunduh & Menjalankan secara Lokal

Anda dapat meng-clone repositori ini menggunakan **GitHub CLI** atau **Git**:

### Menggunakan GitHub CLI (`gh`):
```bash
gh repo clone NaufalFS-Official/EverLife
cd EverLife
```

### Menggunakan Git Standar:
```bash
git clone https://github.com/NaufalFS-Official/EverLife.git
cd EverLife
```

### Langkah Instalasi & Menjalankan:
```bash
# 1. Instal dependensi terkunci
npm ci

# 2. Jalankan server pengembangan lokal
npm run dev
# Buka http://localhost:5173 di peramban Anda

# 3. Kompilasi build produksi statis
npm run build
# Hasil kompilasi siap disajikan di dist/

# 4. Buat paket portal game web (itch.io, CrazyGames, Poki)
npm run build:portal
# Menghasilkan everlife-web-portal.zip
```

---

## 🧪 Pengujian & Jaminan Kualitas (DoD L1 - L4)

Proyek ini memiliki cakupan uji komprehensif (114 unit/integration tests, 2 Playwright E2E tests, 25 security tamper payloads):

```bash
npm run typecheck      # TypeScript strict compilation (0 error)
npm run lint           # ESLint 9 code style verification
npm run test:unit      # Vitest unit, contract, state, & security harness
npm run test:e2e       # Playwright end-to-end user flow & FTUE test
npm run verify:bundle  # Memastikan ukuran bundle tetap di bawah budget (< 450 kB gzip)
npm run detect-secrets # Memindai ketiadaan kunci API atau rahasia hardcoded
```

---

## 🛡️ Arsitektur & Keamanan (Mode A / C0)

- **100% Client-Side & Zero-Server**: Semua logika berjalan di peramban pemain tanpa pengumpulan data pribadi (Zero-PII).
- **Penyimpanan Bertingkat**: Menggunakan IndexedDB dengan auto-fallback ke `localStorage` dan in-memory storage (aman untuk mode Incognito/Private Browsing).
- **Anti-Tamper Save Envelope**: Setiap data save diverifikasi dengan salted SHA-256 HMAC checksum.
- **Production Dead-Code Elimination**: Objek pengujian debug `window.__game` secara otomatis tereliminasi total dari build produksi melalui isolasi bundler.

---

## 📄 Lisensi & Dokumen Legal

- **Kode Sumber**: Berlisensi [MIT](LICENSE).
- **Aset & SFX**: Berlisensi MIT / CC0 Public Domain (Lihat [`ASSETS_LICENSES.md`](ASSETS_LICENSES.md)).
- **Kebijakan Privasi**: Zero-PII lokal ([`PRIVACY_POLICY.md`](PRIVACY_POLICY.md)).
- **Syarat Layanan**: Bebas biaya tanpa transaksi mikro ([`TERMS.md`](TERMS.md)).
- **Audit Gerbang Akhir**: Laporan pengesahan rilis mandiri ([`GATE_FINAL.md`](GATE_FINAL.md)).
