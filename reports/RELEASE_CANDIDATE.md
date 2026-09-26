# EVERLIFE — RELEASE CANDIDATE REPORT (v1.0.0-rc.1)

**Tanggal Audit**: 26 September 2026  
**Versi Kandidat**: `v1.0.0-rc.1`  
**Arsitektur Target**: Mode A (Static Client SPA / PWA Standalone / Web Game Portal / GitHub Ready)  
**Niat Rilis**: Publik (Sesuai PRD §13.0 & §2)  
**Status Evaluasi**: **RC READY** (Blocker: 0, Manual: 3)

---

## 1. Rekap Status Sesi & Exit Gate Proyek

Seluruh 12 tahapan orkestrasi game telah diselesaikan dengan status **▣ DONE-VERIFIED** tanpa ada item tertunda (▨) atau terblokir (✖).

| No | ID Sesi | Lingkup Pekerjaan | Status Exit Gate | Bukti Utama |
| :---: | :--- | :--- | :---: | :--- |
| 1 | **SETUP-01** | Toolchain Vite, React 19, TS Strict, Tailwind v4, Placeholders | ▣ DONE-VERIFIED | `npm run build` 73 kB gzip, dev preview 200 OK |
| 2 | **CONTRACT-01** | GameConfig, State, Events, Zod schemas, Mulberry32 PRNG | ▣ DONE-VERIFIED | 20 unit tests Vitest 100% pass |
| 3 | **CLIENT-01** | Layering core/, SceneRouter, HUD, Avatar, Skenario Modal, Ribbon | ▣ DONE-VERIFIED | 72 unit & integration tests pass |
| 4 | **PLATFORM-01** | Safe Area Notch, Storage Fallback (IDB->LocalStorage->Memory), PWA | ▣ DONE-VERIFIED | Incognito fallback & orientation tests pass |
| 5 | **INFRA-01** | CI/CD GitHub Actions, Bundle Gate, Secret Scan, Static Config | ▣ DONE-VERIFIED | Bundle 131 kB < 450 kB, detect-secrets 0 leaks |
| 6 | **PLAYTEST-01** | 5 Skenario L4: FTUE 60s, 3 Core Loop, Kondisi Batas, Ribbon, FPS | ▣ DONE-VERIFIED | 3 bug tercatat di BUGS.md (BUG-001 s/d BUG-003) |
| 7 | **FIX-01** | Perbaikan BUG-001 (Shake UI), BUG-002 (Timer), BUG-003 (Playwright) | ▣ DONE-VERIFIED | Seluruh P0-P3 Closed (0 open bugs) |
| 8 | **POLISH-01** | Audio gain procedural (0.15-0.25), Reduced Motion, Min-h 44px | ▣ DONE-VERIFIED | reports/POLISH_REPORT.md, core/ 0 mutasi |
| 9 | **PERF-01** | Benchmark CDP 3-tier (Low/Mid/High) 60 FPS, p95 < 16.6ms | ▣ DONE-VERIFIED | reports/PERF_REPORT.md, semua tier LULUS |
| 10 | **BALANCE-01** | Kalibrasi mortalitas 3.000 run headless, median lifespan 73 tahun | ▣ DONE-VERIFIED | reports/BALANCE_REPORT.md, PRD §10 terpenuhi |
| 11 | **REDTEAM-01** | 25 Payload serangan tamper klien (Skala M) | ▣ DONE-VERIFIED | reports/RED_REPORT.md, 18 blocked, 7 open |
| 12 | **BLUETEAM-01** | Mitigasi 7 celah OPEN: sanitasi uang/nama, usia monotonik, dead-code | ▣ DONE-VERIFIED | reports/SECURITY_HARDENING_REPORT.md, 7 fixed |

---

## 2. Matriks Verifikasi Kesiapan Rilis (Langkah 1 s/d 12)

| Langkah | Aspek Uji | Status | Bukti Verifikasi | Catatan |
| :---: | :--- | :---: | :--- | :--- |
| **01** | **Rekap Sesi** | ▣ PASS | 12/12 Sesi ▣ DONE-VERIFIED; 0 Open P0/P1 bugs. | Siap untuk kandidat rilis. |
| **02** | **Clean Checkout** | ▣ PASS | `git clone . $TEMP ; npm ci ; build ; test` -> Exit 0. | Repositori terisolasi 100% mandiri. |
| **03** | **Higiene Kode** | ▣ PASS | Stub/TODO = 0; Secret scan = 0; Nol angka ajaib baru. | Kepatuhan D2, D5, D7 terverifikasi. |
| **04** | **Niat Rilis (Publik)** | ▣ PASS | Draf `PRIVACY_POLICY.md` & `TERMS.md` selesai; Lisensi Aset lengkap. | Sesuai PRD §13.0 & §2. |
| **05** | **Budget Performa** | ▣ PASS | `PERF_REPORT.md` terbaru: 60 FPS locked, frame-time p95 < 16.6ms. | Memenuhi budget PRD §12.1. |
| **06** | **Build Per Target** | ▣ PASS | `dist/`, PWA Manifest, Service Worker, `everlife-web-portal.zip`. | Multi-target siap distribusi. |
| **07** | **Paket Distribusi** | ▣ PASS | Ikon SVG 192/512, 4 screenshot, Open Graph meta tags, Storyboard trailer. | `docs/DISTRIBUTION_METADATA.md`. |
| **08** | **Kontrol Runtime** | ▣ PASS | Save envelope v1 + SHA-256 HMAC; Prosedur Rollback di `RUNBOOK.md`. | Mitigasi risiko data korup siap. |
| **09** | **Smoke Build Prod** | ▣ PASS | Preview server HTTP 200; `window.__game === undefined`. | Bebas bocoran debug hooks. |
| **10** | **Verifikasi Kebijakan** | ▣ PASS | Itch.io HTML5, CrazyGames, & W3C PWA compliant (26 Sep 2026). | Kebijakan toko web terpenuhi. |
| **11** | **Dokumen Final** | ▣ PASS | `GAME_DESIGN.md`, `DEPLOY_GUIDE.md`, `RUNBOOK.md`, `CHANGELOG.md`. | Sinkronisasi memori proyek tuntas. |
| **12** | **Laporan RC** | ▣ PASS | Berkas `reports/RELEASE_CANDIDATE.md` disahkan. | Siap penyerahan akhir. |

---

## 3. Hasil Pengujian Bersih (Clean Checkout & Regresi Penuh)

[BUKTI] perintah: git clone . $TEMP/everlife-clean-test ; cd $TEMP/everlife-clean-test ; npm ci ; npm run typecheck ; npm run test:unit ; npm run build | exit: 0 | waktu: 2026-09-26T11:15:14+07:00
```
> everlife@1.0.0 typecheck
> tsc --noEmit

> everlife@1.0.0 test:unit
> vitest run

 Test Files  27 passed (27)
      Tests  114 passed (114)
   Start at  11:15:05
   Duration  2.78s

> everlife@1.0.0 build
> tsc --noEmit && vite build

vite v8.3.1 building client environment for production...
dist/index.html                   1.76 kB │ gzip:   0.73 kB
dist/assets/index-RwXf5uZ8.css   45.16 kB │ gzip:   8.40 kB
dist/assets/index-CO4kXJpn.js   410.55 kB │ gzip: 122.86 kB
✓ built in 848ms
[CLEAN CHECKOUT PASS] Clean clone, install, typecheck, test, and build succeeded.
```

---

## 4. Evaluasi Legal & Rating Konten (Publik)

1. **Kebijakan Privasi (`PRIVACY_POLICY.md`)**:
   - Menegaskan arsitektur Zero-PII lokal 100%.
   - Kepatuhan GDPR & COPPA untuk pengguna usia 16+ tahun.
2. **Syarat Layanan (`TERMS.md`)**:
   - Permainan gratis 100% tanpa paywall / IAP / lootbox.
   - Penafian fiksi satirikal eksplisit melindungi pengembang dari tuntutan hukum.
3. **Pendaftaran Lisensi Aset (`ASSETS_LICENSES.md`)**:
   - Seluruh 11 aset memiliki status **OK** (MIT / CC0 / ISC) tanpa pelanggaran IP pihak ketiga.
4. **Rating Usia (`docs/AGE_RATING_WORKSHEET.md`)**:
   - **Rekomendasi**: **16+** (IARC / PEGI 16 / ESRB Teen-17+ Advisory) karena memuat tema kedewasaan dan kejahatan satirikal berbasis teks.

---

## 5. Higienitas & Pengendalian Runtime Produksi

1. **Ketiadaan Debug Hooks**:
   - Pemindaian berkas `dist/assets/index-*.js` memastikan string literal dan objek `__game` **0 temuan** (*dead-code eliminated* via `import.meta.env.PROD`).
2. **Penyimpanan Save Berversi & Integritas Checksum**:
   - Skema save data `schemaVersion: 1` dengan verifikasi salted HMAC SHA-256.
   - Sistem auto-fallback 3 lapis (IndexedDB -> LocalStorage -> Memory) menjamin ketiadaan crash pada peramban privat (Safari Incognito).
3. **Prosedur Rollback Darurat**:
   - Terdokumentasi lengkap pada `RUNBOOK.md` (Rollback Edge CDN < 60 detik & invalidasi Service Worker PWA).

---

## 6. Daftar Tindakan Manual & Menunggu Manusia (L5)

Sesuai Direktif D11 & D20, langkah-langkah berikut berada di luar batasan agen otonom dan diserahkan kepada pengembang manusia:

1. **[MANUAL-01] Peninjauan Hukum Formal**:
   - Draf `PRIVACY_POLICY.md` dan `TERMS.md` memerlukan tinjauan akhir oleh penasihat hukum manusia sebelum pembukaan etalase komersial.
2. **[MANUAL-02] Unggah Artefak ke Akun Toko Pengembang**:
   - Mengunggah berkas `everlife-web-portal.zip` ke dashboard pengembang portal (itch.io via Butler CLI atau drag-and-drop web, CrazyGames Developer Portal).
3. **[MANUAL-03] Evaluasi Rasa Subjektif Final (Feel Test L5)**:
   - Pengujian langsung sentuhan fisik pada layar smartphone asli untuk menilai kenyamanan mikro-animasi shake modal, getaran, dan kejelasan tipografi mobile portrait.

---

## 7. Kesimpulan Akhir
Kandidat rilis **EverLife v1.0.0-rc.1** memenuhi seluruh 8 Kriteria Penerimaan (AC-001 s/d AC-008), 100% lulus uji otomatis L1-L4, bebas celah keamanan kritis/tinggi, dan siap diluncurkan ke publik.
