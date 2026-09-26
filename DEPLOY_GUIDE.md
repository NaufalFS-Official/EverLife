# PANDUAN DEPLOYMENT & DISTRIBUSI (EverLife)

EverLife dirancang menggunakan arsitektur **Build Mode A (Konektivitas C0)**, yaitu Single Page Application (SPA) berbasis web statis murni tanpa ketergantungan runtime server. Seluruh simulasi, logika penuaan, audio synthesizer, dan penyimpanan berjalan di sisi klien (Client-Side Only).

---

## 1. Target Distribusi Utama

### A. Cloudflare Pages (Rekomendasi Edge Static)
1. Sambungkan repositori GitHub ke Cloudflare Pages dashboard.
2. Konfigurasi build setting:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js Version**: `20` (atau atur env `NODE_VERSION=20`)
3. Cloudflare Pages otomatis mengenali konfigurasi keamanan pada file `public/_headers` (Content-Security-Policy, HSTS, Permissions-Policy, dan Immutable Asset Caching).

### B. Vercel
1. Impor repositori EverLife ke Vercel dashboard.
2. Konfigurasi terdeteksi otomatis dari `vercel.json`:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Seluruh header keamanan HTTP dan rewrite static routing diterapkan secara otomatis.

### C. GitHub Pages
1. Bangun bundle produksi:
   ```bash
   npm run build
   ```
2. Jalankan deployment direktori `dist/` ke branch `gh-pages` menggunakan alat deploy standar:
   ```bash
   npx gh-pages -d dist
   ```
3. Di pengaturan repositori GitHub (`Settings` -> `Pages`), pilih sumber deploy dari branch `gh-pages`.

### D. Portal Game Web HTML5 (itch.io / Poki / CrazyGames)
1. Eksekusi script kompilasi portal:
   ```bash
   npm run build:portal
   ```
2. Seluruh artefak statis siap pakai berada di direktori `dist/`.
3. Buat arsip ZIP langsung dari isi folder `dist/` (pastikan `index.html` berada pada level teratas ZIP, bukan di dalam subfolder):
   ```bash
   # Di PowerShell
   Compress-Archive -Path dist/* -DestinationPath everlife-html5-portal.zip -Force
   ```
4. Unggah `everlife-html5-portal.zip` ke dashboard itch.io dan pilih opsi **"This file will be played in the browser"**. Tentukan orientasi default: **Mobile Portrait (430x932 atau 9:19.5)**.

---

## 2. Instalasi PWA (Progressive Web App)

EverLife dilengkapi dengan `manifest.webmanifest` dan Service Worker `sw.js` (Cache version `everlife-v1.0.0`):
- **iOS Safari**: Buka URL game -> Tekan tombol Share -> Pilih **"Add to Home Screen"**.
- **Android Chrome**: Buka URL game -> Muncul banner install otomatis atau buka menu titik tiga -> Pilih **"Install app"**.
- Setelah terpasang, game dapat dijalankan 100% offline tanpa koneksi internet sama sekali.

---

## 3. Checklist Sebelum Rilis Produksi (Release Hygiene)

- [x] Strict TypeScript Compile (`npm run typecheck` = 0 error)
- [x] ESLint Clean (`npm run lint` = 0 warning/error)
- [x] Vitest Unit & Performance Harness (`npm run test:unit` = 100% pass)
- [x] Bundle Size Gate (`npm run verify:bundle` < 450 kB gzip; real: ~129 kB)
- [x] Ketiadaan Debug Hooks (`window.__game` undefined di mode produksi)
- [x] Pemindaian Kunci Rahasia (`npm run detect-secrets` = 0 temuan)
