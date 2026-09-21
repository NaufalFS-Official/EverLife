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

## 2. DEPLOYMENT WEB STATIS (PWA OFFLINE DI GITHUB PAGES)

### Langkah Aktivasi GitHub Pages (Otomatis via GitHub Actions):
1. **Push ke GitHub**:
   Kode dikirim ke cabang `main` di `https://github.com/NaufalFS-Official/EverLife`.
2. **Aktifkan GitHub Pages**:
   - Buka repositori di browser: `https://github.com/NaufalFS-Official/EverLife/settings/pages`
   - Pada bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
3. **Pipeline Otomatis**:
   - Workflow `.github/workflows/deploy-pages.yml` akan otomatis terpicu pada setiap push ke cabang `main`.
   - Workflow ini membangun bundel PWA dengan `base: '/EverLife/'`, menghasilkan Service Worker CacheFirst, dan menerbitkan web ke GitHub Pages.
4. **URL Akses Publik**:
   - `https://naufalfs-official.github.io/EverLife/`
   - Buka URL di Chrome/Safari pada perangkat seluler, lalu ketuk menu peramban > **"Tambahkan ke Layar Utama" (Add to Home Screen)** untuk menginstal PWA secara mandiri.

---

## 3. KOMPILASI APK ANDROID (CAPACITOR SIDELOAD)

### Opsi 1: Unduh APK Otomatis via GitHub Actions (Rekomendasi Tanpa Perlu Setup Java/SDK Lokal)
1. Workflow `.github/workflows/build-android.yml` otomatis terpicu setiap kali cabang `main` diperbarui.
2. Buka tab **Actions** di repositori GitHub: `https://github.com/NaufalFS-Official/EverLife/actions`
3. Pilih workflow run **Build Android APK (Capacitor Sideload)** terbaru yang telah selesai (centang hijau).
4. Gulir ke bagian bawah pada tabel **Artifacts**, lalu unduh **`EverLife-v1.0.0-Android-APK`**.
5. Ekstrak file zip hasil unduhan untuk mendapatkan `app-debug.apk`.
6. Salin berkas `app-debug.apk` ke HP Android (via USB, Telegram, WhatsApp, atau Google Drive), lalu buka file tersebut untuk menginstal (sideload).

### Opsi 2: Kompilasi Lokal via Android Studio
1. Pastikan terpasang Java JDK 17+ dan Android Studio Ladybug.
2. Jalankan sinkronisasi aset web ke modul Android:
   ```bash
   npm run build
   npm run cap:sync
   ```
3. Buka modul Android di Android Studio:
   ```bash
   npx cap open android
   ```
4. Di Android Studio, pilih menu **Build > Build Bundle(s) / APK(s) > Build APK(s)** untuk menghasilkan berkas APK lokal.

---

## 4. VERIFIKASI MODE PESAWAT (OFFLINE-FIRST AIRPLANE MODE)
Untuk memverifikasi bahwa aplikasi 100% beroperasi tanpa koneksi internet:
1. Buka aplikasi di Chrome/Edge, pastikan Service Worker berstatus `Activated and running` di DevTools (Application > Service Workers).
2. Aktifkan toggle **Offline** di panel Network DevTools (atau nyalakan mode pesawat pada ponsel fisik).
3. Muat ulang halaman (`F5` / swipe refresh).
4. **Hasil yang Diharapkan**: Seluruh antarmuka, aset ikon, audio sintetis, dan siklus umur 0 s.d. 18 tahun tetap berfungsi responsif tanpa pesan error jaringan.
