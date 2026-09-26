# EverLife

> Simulator kehidupan modular berbasis teks di mana setiap keputusan membentuk takdir karakter dari lahir hingga wafat.

## Fitur Utama & Platform

- **Arsitektur Mandiri (Mode A / C0 Offline)**: 100% luring tanpa dependensi server eksternal, siap dimainkan sebagai PWA atau di portal web game.
- **Penyimpanan Bertingkat & Aman**: Menggunakan IndexedDB dengan fallback otomatis ke `localStorage` dan in-memory storage, dilindungi salted SHA-256 HMAC checksum.
- **PWA & Offline-First**: Mendukung pemasangan aplikasi mandiri (Standalone PWA) dengan Service Worker cache v1.0.0.
- **Profil Performa Fleksibel**: 3 tier grafis (Low / Mid / High) dengan adaptasi frame rate runtime otomatis.
- **Aksesibilitas & Ergonomi**: Mobile portrait shell dengan safe area notch insets, landscape shield overlay, serta pintasan keyboard (`Space`/`Enter`/`A` untuk +Age, `1-4` untuk pilihan, `Esc` untuk menutup menu).

## Prasyarat
- Node.js (versi 20+ atau 24 LTS)
- npm (versi 10+) atau pnpm (versi 9+)

## Menjalankan secara Lokal

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/NaufalFS-Official/EverLife.git
   cd EverLife
   ```

2. **Instalasi Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Akses antarmuka di peramban via `http://localhost:5173`.

4. **Kompilasi Build Produksi**:
   ```bash
   npm run build
   ```

5. **Build untuk Distribusi Portal Game Web (itch.io / Poki / CrazyGames)**:
   ```bash
   npm run build:portal
   ```
   Artefak terkompresi `everlife-web-portal.zip` otomatis dihasilkan dan siap diunggah langsung ke portal game HTML5.

6. **Menjalankan Pengujian**:
   ```bash
   npm run typecheck
   npm run lint
   npm run test:unit
   npm run test:e2e
   ```

## Lisensi
Proyek ini berlisensi [MIT](LICENSE).
