# EverLife (v1.0-SMA)
> **Simulasi Kehidupan Teks Berpilihan Modern (Usia 0 s.d. 18 Tahun)**  
> *Mobile-First PWA & Android APK via Capacitor | 100% Offline-Playable | Zero Server Cost*

---

## 1. TENTANG PERMAINAN
**EverLife** adalah game simulasi kehidupan berbasis teks dengan pilihan dilema yang realistis dan berlatar belakang budaya Indonesia. Pemain menjalani kehidupan dari masa bayi (0 tahun) hingga kelulusan SMA (18 tahun):
- **Siklus 4 Jenjang Usia**: Balita (0–5 tahun), SD (6–11 tahun), SMP (12–14 tahun), dan SMA (15–18 tahun).
- **4 Statistik Dinamis**: Kesehatan, Kebahagiaan, Hubungan, dan Akademik ($0 - 100$).
- **50 Kartu Dilema Pilihan**: Dilema kehidupan lokal (imunisasi, MOS, les bimbel, penjurusan IPA/IPS, kerja paruh waktu barista, hingga ujian UTBK).
- **Ekonomi Riil**: Kelola uang saku tahunan dan penghasilan kerja sambilan untuk les atau aktivitas sosial.
- **Relasi Organik**: Rawat hubungan dengan Orang Tua, Teman Sebaya, dan Guru sebelum mengalami peluruhan tahunan.
- **Auto-Save & Ekspor JSON**: 3 slot penyimpanan lokal independen ber-checksum FNV-1a dengan fitur unduh/unggah cadangan simpanan.

---

## 2. ARSITEKTUR TERPISAH (DECOUPLED ARCHITECTURE)
EverLife dirancang dengan pemisahan domain logic murni dari presentation layer (Zero DOM dependency pada Core):

```
everlife/
├── src/
│   ├── contracts/       # Definisi tipe murni, konstanta config, skema save, & guard table
│   ├── core/            # Engine logika murni (Turn cycle, Event, PRNG, Relasi, Ekonomi)
│   ├── storage/         # Abstraksi StoragePort, LocalSaveAdapter, dan SaveService
│   └── ui/              # Presentasi React 18, Tailwind CSS, SVG Icons, & Synth Audio
├── test/
│   ├── unit/            # Uji unit contracts, core engine, dan gameplay logic
│   ├── e2e/             # Uji simulasi playthrough lengkap 0–18 tahun
│   └── redteam/         # Uji stres dan integritas manipulasi data
├── security/            # 15 skrip serangan red team mandiri (ATK-001 s/d ATK-015)
└── public/              # Manifest web, ikon PWA, dan aset statis
```

---

## 3. PANDUAN INSTALASI & MENJALANKAN

### Prasyarat:
- Node.js $\ge 20.12.0$
- npm $\ge 10.5.0$

### Langkah Cepat:
```bash
# 1. Pasang dependensi versi terkunci
npm ci

# 2. Jalankan dev server lokal
npm run dev
# Akses melalui browser pada: http://localhost:5173

# 3. Jalankan rangkaian pengujian otomatis
npm run typecheck    # Verifikasi tipe TypeScript (0 error)
npm run lint         # Verifikasi kualitas kode ESLint
npm run test:unit    # Uji unit logika inti
npm run test:e2e     # Uji simulasi tamat usia 18 tahun
npm run test:redteam # Uji ketahanan anti-tamper dan stress input

# 4. Buat bundel produksi
npm run build
npm run preview      # Uji pratinjau hasil build lokal
```

---

## 4. DEPLOYMENT & DISTRIBUSI
- **Web PWA**: Deploy folder `dist/` ke platform statis bebas biaya (Cloudflare Pages / Vercel / GitHub Pages).
- **Android APK**: Sinkronkan aset ke Capacitor melalui `npm run cap:sync` lalu buka via Android Studio (`npx cap open android`) untuk menghasilkan berkas APK sideload.
- **Panduan Lengkap**: Baca `DEPLOY_GUIDE.md` untuk instruksi detail langkah-demi-langkah.

---

## 5. DOKUMEN ARSITEKTUR & PANDUAN SISTEM
| Dokumen | Deskripsi |
| :--- | :--- |
| `GAME_DESIGN.md` | Filosofi desain permainan, pilar gameplay, dan siklus usia 0–18 tahun. |
| `BALANCE.md` | Dokumentasi 45+ konstanta penyeimbang `gameConfig.ts` bersatuan eksplisit. |
| `ENV_CHECKLIST.md` | Daftar periksa variabel lingkungan `VITE_*`. |
| `DEPLOY_GUIDE.md` | Petunjuk kompilasi PWA offline dan APK Android via Capacitor. |
| `RUNBOOK.md` | Prosedur operasional harian, reset database simpanan, dan troubleshooting. |
| `RED_REPORT.md` | Laporan eksekusi serangan Red Team (16 skenario uji integritas). |
| `security-test-report.md` | Laporan remediasi Blue Team dan justifikasi formal Accepted Risk. |
| `PRE_DEPLOY_CHECKLIST.md` | Daftar periksa formal tanda tangan kesiapan rilis produksi. |
| `CHANGELOG.md` | Catatan rilis versi 1.0.0. |

---

## 6. LISENSI
Didistribusikan di bawah lisensi terbuka **MIT License**. Ikon grafis menggunakan Lucide Icons (Lisensi MIT). Rincian lisensi aset tercatat pada `ASSETS_LICENSES.md`.
