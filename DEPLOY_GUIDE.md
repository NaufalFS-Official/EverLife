# PANDUAN DEPLOYMENT & DISTRIBUSI (DEPLOY_GUIDE.md)
**Game: EverLife (v1.0-SMA)**  
*Vibecoding Build System v2.2 — Tahap 3 (Infrastruktur & Rilis)*

Dokumen ini menjelaskan prosedur deployment aplikasi EverLife untuk hosting statis (PWA) dan kompilasi APK Android via Capacitor.

---

## 1. IKHTISAR TEKNIS
- **Skala Proyek**: Small (Mode A — Pure Client / Offline-First / Biaya Server Rp0)
- **Artefak Hasil Build**: Direktif statis web (`dist/`) berisi `index.html`, bundle JS/CSS, web manifest, dan Service Worker Workbox (`sw.js`).
- **Ambang Batas Ukuran Bundle**: $< 350\text{ KB}$ gzip (Status saat ini: $\sim 80.13\text{ KB}$ gzip).

---

## 2. DEPLOYMENT WEB STATIS (PWA OFFLINE)

### Opsi A: Cloudflare Pages (Rekomendasi Utama — Bebas Biaya & Cepat)
1. Hubungkan repositori Git ke dasbor **Cloudflare Pages**.
2. Konfigurasi build setting:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: $\ge 20.12.0$ (tambahkan env variable `NODE_VERSION = 20.12.0`)
3. Klik **Save and Deploy**. Cloudflare Pages menyediakan URL HTTPS otomatis dengan CDN global.
4. Akses URL di browser ponsel (Chrome/Safari), lalu pilih **"Tambahkan ke Layar Utama" (Add to Home Screen)** untuk menginstal sebagai PWA mandiri.

### Opsi B: Vercel
1. Jalankan perintah via terminal atau hubungkan repositori di Vercel Dashboard:
   ```bash
   npx vercel --prod
   ```
2. Pengaturan otomatis mendeteksi direktori `dist/` dari script `build`.

### Opsi C: GitHub Pages
1. Pastikan GitHub Actions diaktifkan pada repositori.
2. Gunakan artifact `dist/` yang dihasilkan oleh workflow `.github/workflows/ci.yml`.
3. Aktifkan GitHub Pages dari cabang `gh-pages` atau Actions deployment.

---

## 3. KOMPILASI APK ANDROID (CAPACITOR SIDELOAD)

### Prasyarat Toolchain Android:
- Java JDK 17 atau 21
- Android Studio Ladybug (atau versi lebih baru) dengan Android SDK Platform API 34
- Komponen Gradle $\ge 8.2$

### Langkah Kompilasi:
1. Jalankan build produksi web:
   ```bash
   npm run build
   ```
2. Sinkronkan aset web `dist/` ke proyek native Android:
   ```bash
   npx cap add android   # (Hanya jika folder android/ belum diinisialisasi)
   npm run cap:sync      # Menjalankan: npx cap sync android
   ```
3. Buka Android Studio:
   ```bash
   npx cap open android
   ```
4. Di dalam Android Studio:
   - Pilih menu **Build > Build Bundle(s) / APK(s) > Build APK(s)** untuk menghasilkan berkas `app-debug.apk`.
   - Atau pilih **Build > Generate Signed Bundle / APK** untuk rilis produksi mandiri (sideload).
5. File APK siap didistribusikan langsung ke perangkat Android tanpa memerlukan koneksi internet aktif.

---

## 4. VERIFIKASI MODE PESAWAT (OFFLINE-FIRST AIRPLANE MODE)
Untuk memverifikasi bahwa aplikasi 100% beroperasi tanpa koneksi internet:
1. Buka aplikasi di Chrome/Edge, pastikan Service Worker berstatus `Activated and running` di DevTools (Application > Service Workers).
2. Aktifkan toggle **Offline** di panel Network DevTools (atau nyalakan mode pesawat pada ponsel fisik).
3. Muat ulang halaman (`F5` / swipe refresh).
4. **Hasil yang Diharapkan**: Seluruh antarmuka, aset ikon, audio sintetis, dan siklus umur 0 s.d. 18 tahun tetap berfungsi responsif tanpa pesan error jaringan.
