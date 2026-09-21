# LAPORAN PENGUJIAN KEAMANAN & INTEGRITAS (RED TEAM)
**Game: EverLife (v1.0-SMA)**  
*Sesi: SESI-06-REDTEAM | Tanggal: 2026-09-21 | Status: AUDITED*

---

## 1. LINGKUNGAN TARGET & BATASAN OTORISASI
- **Target Uji**: In-Memory Headless Engine & Web Client Harness (`http://localhost:5173`)
- **Lingkungan**: Node.js `v24.16.0`, Windows 11, Vitest `v2.1.1`
- **Klasifikasi Arsitektur**: **Small (Mode A — Pure Client / Offline-First / Rp0 Hosting)**
- **Prinsip Batas Otorisasi**: Pengujian dijalankan secara eksklusif pada runtime lokal internal. Nol serangan terhadap server produksi atau sistem pihak ketiga.

---

## 2. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)
Pengujian Red Team pada arsitektur Mode A bertujuan untuk **mengukur, mengeksploitasi, dan mendokumentasikan** batas ketahanan logika klien (Client-Side Tampering & Input Resilience) tanpa ilusi keamanan mutlak:
1. **Inherent Client-Side Limitation (ATK-004 / Status OPEN)**:
   - Karena EverLife v1.0 beroperasi 100% offline di peramban pemain tanpa backend server, seluruh algoritma verifikasi integritas (`FNV-1a 32-bit`) berjalan di sisi klien.
   - Penyerang yang memodifikasi berkas simpanan JSON (misal mengubah `cash` menjadi Rp 500.000.000) dan menghitung ulang nilai checksum menggunakan rumus publik yang sama dapat mengimpor simpanan tersebut dengan sukses.
   - **Keputusan Desain**: Risiko ini diterima sebagai karakteristik wajar game single-player offline (Mode A) tanpa leaderboard global kompetitif.
2. **Robustness of In-Memory Guards (ATK-001–003, ATK-005–016 / Status BLOCKED-OK)**:
   - Modifikasi sembarang tanpa kalkulasi checksum, sintaks JSON rusak, atau skema versi masa depan ditolak secara elegan tanpa menyebabkan crash.
   - Seluruh transisi state terlarang (penambahan umur saat modal event aktif, bypass usia kerja, aktivitas fiktif, spam tombol aksi 50 tap/detik, dan injeksi XSS) berhasil diblokir oleh `guardTable.ts`, `EconomyEngine.ts`, dan mekanisme debounce `200 ms`.

---

## 3. MATRIKS EKSEKUSI SERANGAN (ATTACK MATRIX)

| ID | Kategori | Vektor / Payload | Ekspektasi | Aktual (Bukti Mentah) | Severity | Status |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **ATK-001** | STORAGE / TAMPER | Saldo `cash` diubah `0 -> 999999999` tanpa ubah checksum | Tolak impor berkas | `ERR_SAVE_CHECKSUM_MISMATCH: Verifikasi checksum simpanan gagal.` | Medium | `BLOCKED-OK` |
| **ATK-002** | STORAGE / PARSER | JSON terpotong: `{"schemaVersion": 1, ...` | Tolak parsing | `ERR_IMPORT_INVALID_JSON: Format berkas bukan JSON valid.` | Low | `BLOCKED-OK` |
| **ATK-003** | STORAGE / SCHEMA | `schemaVersion: 999` ber-checksum valid | Tolak versi masa depan | `ERR_SAVE_FUTURE_VERSION: Skema simpanan v999 lebih tinggi dari versi aplikasi (v1).` | Medium | `BLOCKED-OK` |
| **ATK-004** | STORAGE / EXPLOIT | Rekalkulasi FNV-1a checksum setelah modifikasi `cash` | Buktikan manipulasi klien | Impor sukses (`profile.cash = 500000000`). Risiko arsitektur Mode A terdokumentasi. | High | `OPEN` |
| **ATK-005** | STORAGE / BOUNDARY | Slot ID di luar batas: `slotId: 0`, `4`, `-1`, `99` | Tolak akses slot | `ERR_INVALID_SLOT_ID: Nomor slot harus berupa bilangan bulat antara 1 dan 3.` | Low | `BLOCKED-OK` |
| **ATK-006** | LOGIC / EVENT | Opsi fiktif: `engine.selectEventOption('opt-hacked-999')` | Tolak opsi ilegal, layar tetap stabil | `ERR_INVALID_OPTION_ID: Opsi pilihan opt-hacked-999 tidak valid.` (Screen: `EVENT_MODAL`) | Medium | `BLOCKED-OK` |
| **ATK-007** | STATE / GUARD | Eksekusi `engine.ageUp()` saat layar `EVENT_MODAL` | Cegah skip dilema | `ERR_AGE_UP_GUARD: Tidak dapat menambah umur: Selesaikan dialog event yang sedang aktif terlebih dahulu.` | Medium | `BLOCKED-OK` |
| **ATK-008** | LOGIC / ECONOMY | Kerja paruh waktu `act-part-time` pada usia 8 tahun | Tolak aktivitas terkunci | `ERR_ACTIVITY_LOCKED: Aktivitas Barista Paruh Waktu terkunci (minimal usia 15 tahun).` | Low | `BLOCKED-OK` |
| **ATK-009** | ECONOMY / NEGATIVE | Eksekusi `act-tutoring` (Rp 30.000) dengan saldo Rp 5.000 | Tolak transaksi, saldo Rp 5.000 | `success: false, cashDelta: 0, message: Saldo tidak mencukupi untuk Bimbel Tambahan.` | Low | `BLOCKED-OK` |
| **ATK-010** | LOGIC / INJECTION | Aktivitas fiktif: `act-cheat-billionaire` | Tolak aktivitas tak terdaftar | `ERR_ACTIVITY_NOT_FOUND: Aktivitas act-cheat-billionaire tidak terdaftar.` | Low | `BLOCKED-OK` |
| **ATK-011** | SOCIAL / NPC | Interaksi dengan ID fiktif: `npc-ghost-999` | Tolak target tak ditemukan | `ERR_RELATION_NOT_FOUND: NPC dengan ID npc-ghost-999 tidak ditemukan dalam daftar relasi.` | Low | `BLOCKED-OK` |
| **ATK-012** | STATE / GAME_OVER | Eksekusi `engine.ageUp()` saat karakter telah wafat (`health: 0`) | Cegah aksi pasca-kematian | `ERR_AGE_UP_GUARD: Tidak dapat menambah umur: Karakter telah wafat.` (Screen: `GAME_OVER_DEATH`) | High | `BLOCKED-OK` |
| **ATK-013** | STATE / BOUNDARY | Eksekusi `engine.ageUp()` saat usia mencapai batas tamat SMA (`age: 18`) | Cegah umur melewati SMA | `ERR_AGE_UP_GUARD: Usia telah mencapai batas maksimal simulasi SMA (18 tahun).` | Medium | `BLOCKED-OK` |
| **ATK-014** | INPUT / SANITIZE | Pembuatan karakter nama kosong (`""`) atau whitespace (`"   "`) | Tolak input kosong | `ERR_INVALID_CHARACTER_NAME: Nama karakter tidak boleh kosong.` | Low | `BLOCKED-OK` |
| **ATK-015** | INPUT / XSS | Injeksi script: `<script>alert("XSS")</script><img src=x onerror=alert(1)>` | Sanitasi / text escape aman | Disimpan sebagai string mentah, di-render aman via React JSX escaping kontekstual (0 execution). | Low | `BLOCKED-OK` |
| **ATK-016** | TIMING / DEBOUNCE | Spamming 50 tap tombol Tambah Umur (+1) dalam 1 siklus frame | Saring multi-trigger | Debounce `CFG_INPUT_DEBOUNCE_MS = 200 ms` mengeksekusi tepat 1 panggilan dari 50 tap serentak. | Low | `BLOCKED-OK` |

---

## 4. BUKTI MENTAH TERMINAL (RAW TERMINAL PROOF)

```
[BUKTI] perintah: npm run test:redteam | exit: 0 | waktu: 2026-09-21T20:13:02+07:00
> everlife@1.0.0 test:redteam
> vitest run test/redteam security/attacks

 RUN  v2.1.1 C:/Users/User/OneDrive/EverLife

 ✓ security/attacks/ATK-008-underage-job.test.ts  (1 test) 4ms
 ✓ security/attacks/ATK-011-ghost-npc.test.ts  (1 test) 3ms
 ✓ security/attacks/ATK-005-invalid-slot.test.ts  (1 test) 6ms
 ✓ security/attacks/ATK-003-future-schema.test.ts  (1 test) 6ms
 ✓ security/attacks/ATK-009-insufficient-funds.test.ts  (1 test) 23ms
 ✓ security/attacks/ATK-004-checksum-forgery.test.ts  (1 test) 5ms
 ✓ security/attacks/ATK-013-max-age-overflow.test.ts  (1 test) 5ms
 ✓ security/attacks/ATK-015-xss-injection.test.ts  (1 test) 3ms
 ✓ security/attacks/ATK-006-illegal-event-option.test.ts  (1 test) 6ms
 ✓ security/attacks/ATK-007-bypass-ageup-guard.test.ts  (1 test) 5ms
 ✓ security/attacks/ATK-012-deceased-ageup.test.ts  (1 test) 5ms
 ✓ security/attacks/ATK-014-empty-name.test.ts  (1 test) 4ms
 ✓ security/attacks/ATK-001-tamper-cash.test.ts  (1 test) 6ms
 ✓ test/redteam/tamper.test.ts  (6 tests) 10ms
 ✓ test/redteam/stress.test.ts  (11 tests) 29ms
 ✓ security/attacks/ATK-010-unregistered-activity.test.ts  (1 test) 2ms
 ✓ security/attacks/ATK-002-corrupt-json.test.ts  (1 test) 2ms

 Test Files  17 passed (17)
      Tests  32 passed (32)
   Start at  20:13:00
   Duration  1.42s (transform 765ms, setup 0ms, collect 3.33s, tests 124ms, environment 4ms, prepare 3.17s)
```

---

## 5. KESIMPULAN & REKOMENDASI EVOLUSI SISTEM
1. **Kesiapan Mode A**:
   - Seluruh 15 dari 16 skenario uji integritas terblokir sempurna (`BLOCKED-OK`).
   - Temuan `OPEN` pada **ATK-004** adalah keterbatasan alami dari aplikasi berarsitektur tanpa server (pure client). Game tetap aman dimainkan karena tidak memiliki fitur kompetitif lintas-pemain yang merugikan pengguna lain.
2. **Rekomendasi Skala Medium/Large (Bila beralih ke Mode B/C dengan Server Authoritative)**:
   - Gunakan skema tanda tangan digital `HMAC-SHA256` dengan secret key yang hanya disimpan di sisi server.
   - Pindahkan validasi transisi umur dan perolehan uang ke API endpoint terisolasi (`/api/v1/age-up`) dengan validasi token sesi sekali pakai (nonce/anti-replay).
   - Terapkan rate-limiting Redis (mis. 5 request/menit per session ID).
