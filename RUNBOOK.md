# PANDUAN OPERASIONAL & PENANGANAN MASALAH (RUNBOOK.md)
**Game: EverLife (v1.0-SMA)**  
*Vibecoding Build System v2.2 — Panduan Operasional Klien & Penanganan Masalah*

---

## 1. IKHTISAR OPERASIONAL
- **Arsitektur**: Small (Mode A — Pure Client / Offline-First / Static Hosting)
- **Runtime Klien**: Peramban modern (Chrome, Safari, Edge, Firefox) & WebView Android via Capacitor v6.
- **Penyimpanan Lokal**: Browser `IndexedDB` (`idb-keyval`) dengan fallback `localStorage`.
- **Observabilitas**: `FpsTracker.ts` (logging berkala p5/p50/p95 frametime) dan `ErrorTracker.ts` (logging crash & breadcrumbs aksi).

---

## 2. PROSEDUR OPERASIONAL HARIAN

### 2.1 Menjalankan Lingkungan Pengembangan Lokal
```bash
# Menyalakan dev server Vite
npm run dev

# Akses via peramban: http://localhost:5173
```

### 2.2 Menjalankan Uji Produksi Lokal (Preview)
```bash
# Kompilasi bundel produksi
npm run build

# Menjalankan HTTP server preview lokal
npm run preview

# Akses via peramban: http://localhost:4173
```

### 2.3 Reset Data Permainan Lokal (Hard Reset Simpanan)
Bila data simpanan di peramban mengalami anomali atau ingin mengulang dari awal:
1. Buka antarmuka peramban di `http://localhost:5173` atau domain rilis.
2. Tekan `F12` untuk membuka DevTools.
3. Masuk ke tab **Application** (atau **Penyimpanan** pada Firefox).
4. Di bilah samping kiri, pilih **IndexedDB** > `keyval-store` > klik **Delete Database**.
5. Pilih **Local Storage** > klik ikon **Clear All**.
6. Muat ulang halaman (`Ctrl + F5` atau `Cmd + Shift + R`).

### 2.4 Ekspor & Impor Cadangan Simpanan (Save JSON Transfer)
1. **Ekspor**: Masuk ke menu Pengaturan / Kelola Simpanan di dalam game > klik "Ekspor JSON" pada slot yang aktif > berkas `everlife-save-slotX.json` akan terunduh.
2. **Impor**: Masuk ke menu Pengaturan > pilih "Impor JSON" > pilih berkas simpanan cadangan. Sistem otomatis memvalidasi versi skema dan integritas checksum FNV-1a sebelum memuat sesi.

---

## 3. PROSEDUR PENANGANAN MASALAH (TROUBLESHOOTING)

### 3.1 Dialog "Terjadi Masalah yang Tidak Terduga" (Crash ErrorBoundary)
- **Gejala**: Tampilan antarmuka digantikan oleh kartu ErrorBoundary berbingkai merah.
- **Tindakan**:
  1. Klik tombol **"Salin Rincian Error"** pada dialog.
  2. Klik tombol **"Muat Ulang Permainan"** untuk me-restart engine dari auto-save terakhir.
  3. Periksa konsol DevTools untuk melihat jejak breadcrumb dari `ErrorTracker`.

### 3.2 Service Worker Tidak Memperbarui Versi Terbaru
- **Gejala**: Pengguna masih melihat versi build lama setelah rilis baru di-deploy ke Cloudflare/Vercel.
- **Tindakan**:
  1. Buka DevTools > tab **Application** > **Service Workers**.
  2. Centang opsi **Update on reload** saat debugging.
  3. Atau klik **Unregister** pada Service Worker yang terdaftar, lalu muat ulang halaman.

### 3.3 Penurunan Kinerja / Lag Animasi (Frametime > 16.6 ms)
- **Gejala**: Animasi bar statistik tersendat saat penambahan umur.
- **Tindakan**:
  1. Periksa log konsol bertanda `[EverLife][FPS]` yang dilaporkan setiap 60 detik.
  2. Pastikan tidak ada ekstensi peramban pihak ketiga yang memblokir requestAnimationFrame.
  3. Clamping delta animasi `CFG_ANIM_DELTA_CLAMP_MS = 33.33 ms` akan secara otomatis mencegah ledakan delta time jika tab sempat di-minimize.

---

## 4. KONTAK & ESKALASI
- **Pelaporan Isu Teknis**: Buat Issue baru pada repositori GitHub proyek dengan melampirkan salinan log dari tombol "Salin Rincian Error".
