# OPERATIONAL RUNBOOK — EVERLIFE (v1.0.0-rc.1)

> **PANDUAN OPERASIONAL & PENANGANAN INSIDEN (L14)**  
> *Arsitektur*: Mode A (Static Single Page App / Jamstack / PWA)  
> *Target Distribusi*: Cloudflare Pages / Vercel / GitHub Pages / Itch.io  

---

## 1. Topologi Sistem & Alur Rilis
Aplikasi EverLife adalah aplikasi klien murni (*zero-backend*). Seluruh logika berjalan di sisi peramban pengguna.
- **Build Artifact**: Direktori `dist/` (HTML, JS, CSS, PWA assets)
- **Portal ZIP**: `everlife-web-portal.zip`
- **Cache CDN**: Edge caching via Cloudflare/Vercel CDN dengan Service Worker luring (`sw.js`).

---

## 2. Prosedur Rilis Standar (Standard Deployment)
1. **Verifikasi Lingkungan Bersih**:
   ```bash
   npm run typecheck
   npm run lint
   npm run test:unit
   npm run test:e2e
   npm run detect-secrets
   ```
2. **Kompilasi Artefak Produksi**:
   ```bash
   npm run build:portal
   npm run verify:bundle
   ```
3. **Penyebaran (*Deployment*)**:
   - **Vercel / Cloudflare Pages**: Terhubung otomatis ke git branch `main` pasca push tag `v1.0.0-rc.1`.
   - **Itch.io (Butler CLI)**:
     ```bash
     butler push everlife-web-portal.zip username/everlife:html5
     ```

---

## 3. Prosedur Darurat: Rollback Cepat (Dry-Run & Eksekusi)
Bila terjadi insiden kritis pasca-rilis (misal: regresi save data korup atau UI freeze):

### 3.1. Rollback Tingkat Hosting Edge (Waktu Pemulihan: < 60 detik)
1. Buka dashboard Cloudflare Pages / Vercel.
2. Navigasikan ke **Deployments**.
3. Pilih deployment sukses sebelumnya (misal commit `c1cdc19`).
4. Klik **Rollback to this deployment**.
5. Edge CDN akan langsung mengalihkan 100% trafik ke hash build sebelumnya tanpa perlu re-build.

### 3.2. Rollback Tingkat Service Worker (PWA Client Cache Invalidation)
Bila pengguna telah menyimpan cache Service Worker lama yang bermasalah:
1. Naikkan `CACHE_NAME` di `public/sw.js` (misal dari `everlife-v1.0.0` ke `everlife-v1.0.1-hotfix`).
2. Event `activate` pada Service Worker otomatis menghapus seluruh cache versi sebelumnya:
   ```javascript
   caches.keys().then((names) => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))));
   ```
3. Panggil `self.clients.claim()` untuk mengaktifkan Service Worker baru seketika pada tab aktif.

### 3.3. Penanganan Data Save Korup di Sisi Klien
Bila pemain mengalami kegagalan parsing save akibat perubahan skema:
1. Buka game dengan parameter darurat URL: `?reset=1` atau buka konsol:
   ```javascript
   localStorage.clear();
   indexedDB.deleteDatabase('everlife_save_db');
   location.reload();
   ```
2. Sistem storage fallback otomatis mengalihkan ke in-memory state bersih dan menampilkan notifikasi pemulihan.

---

## 4. Matriks Eskalasi & Status Operasional

| Gejala Insiden | Tingkat Keparahan | Tindakan Respons Awal | Penanggung Jawab |
| :--- | :---: | :--- | :--- |
| **White Screen / Crash Saat Boot** | P0 (Kritis) | Rollback instan ke deployment CDN sebelumnya | Release Engineer |
| **Gagal Simpan Save Data di iOS Safari** | P1 (Tinggi) | Verifikasi fallback LocalStorage aktif; audit quota | Platform Lead |
| **Asset Audio SFX Tidak Bersuara** | P2 (Sedang) | Periksa interaksi pertama pemain (Web Audio unlocking policy) | Audio/Client Lead |
| **Typo Teks Skenario Naratif** | P3 (Rendah) | Rilis patch minor pada siklus mingguan | Content Designer |
