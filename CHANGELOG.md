# CHANGELOG

Semua perubahan penting pada proyek **EverLife** didokumentasikan di sini.

## [1.0.0-rc.1] - 2026-09-26

### Added
- **Core Simulation**: Mesin penuaan deterministik (+Age), pohon pendidikan & karir bertingkat, relasi keluarga & sosial, transaksi aset (mobil & rumah), dan aktivitas kriminal dengan risiko vonis penjara.
- **Visual & UI**: Desain antarmuka mobile-first portrait (390x844 px), kustomisasi avatar modular, modal skenario keputusan interaktif dengan animasi getar, kartu memorial nisan dengan sistem Pita Kematian (Ribbons).
- **Audio Stack**: Sintesis audio prosedural Web Audio API murni untuk 7 SFX responsif (0ms latency, zero assets 404).
- **Platform & PWA**: Standalone PWA Manifest (`manifest.webmanifest`), Service Worker offline cache (`sw.js`), 3 lapis fallback persistensi (IndexedDB -> localStorage -> Memory).
- **Distribusi Portal**: Skrip `npm run build:portal` yang menghasilkan arsip terkompresi `everlife-web-portal.zip` siap diunggah ke Itch.io / CrazyGames / Poki.
- **Legal & Compliance**: Draf `PRIVACY_POLICY.md`, `TERMS.md`, `ASSETS_LICENSES.md`, dan `docs/AGE_RATING_WORKSHEET.md` (rating 16+).

### Fixed
- BUG-001: Feedback visual micro-shake pada dialog modal saat pemain mengetuk dock menu yang terkunci.
- BUG-002: Cleanup timer `useRef` di `SettingsModal` untuk mencegah potensi kebocoran timer unmount.
- BUG-003: Konfigurasi instalasi Chromium Playwright tanpa unduhan binary di luar izin.
- Perbaikan mortalitas burnout dan penalti skenario naratif melalui 3.000 run simulasi headless (median lifespan stabil di 73 tahun).

### Security
- **Eliminasi Debug Hooks**: Dead-code elimination via `import.meta.env.PROD` menjamin `window.__game` tidak terbundel ke dalam artefak rilis produksi.
- **Sanitasi Finansial**: Fungsi `sanitizeCurrency` mencegah racun nilai `NaN` dan `Infinity` pada arus kas dan kekayaan bersih.
- **Monotonitas Usia**: Validator `validateAndSyncAgeMonotonicity` memblokir upaya Age Rewind (pemunduran umur) dan Age Skip (lompatan penuaan instan).
- **Sanitasi Input**: Pembersihan tag markup HTML/XSS dan pemotongan panjang nama karakter maksimal 30 karakter (`MAX_NAME_LENGTH`).
- **Header Keamanan**: Penerapan Content-Security-Policy (CSP), CORS, X-Content-Type-Options, Referrer-Policy, dan Permissions-Policy.

---

## [0.1.0-alpha] - 2026-09-25
- Inisialisasi struktur repositori, shared contracts, dan spesifikasi game.
