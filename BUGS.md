# BUGS LOG

> **Kebijakan Kualitas**: Rilis publik diblokir selama ada issue berkategori **P0** atau **P1** yang berstatus terbuka (Open).

| ID | Sev(P0-P3) | Status | Tipe | F/AC | Ringkas | Akar Masalah | Commit Fix | Tes Regresi |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **BUG-001** | P3 | Closed | UX / Feedback | F-004 / AC-003 | Feedback visual/audio ketiadaan respon saat tap dock navigasi bawah ketika modal skenario naratif sedang aktif | Guard state memblokir transisi ke `SUBMENU_OPEN`, namun tidak ada toast/efek goyang pada dialog modal untuk memberi tahu pemain bahwa peristiwa saat ini wajib diselesaikan | `c13af0e` | `tests/playtest/structured_playtest.test.ts` |
| **BUG-002** | P3 | Closed | Hygiene / Memory | F-009 / AC-008 | `setTimeout` reload pasca-impor save di `SettingsModal.tsx` beroperasi tanpa timer cleanup saat unmount | Pemanggilan `setTimeout(platform.reload, 1000)` tidak menyimpan reference ID timer ke state/ref untuk dibersihkan via `clearTimeout` bila modal ditutup seketika | `c13af0e` | `tests/unit/settings_modal_timer.test.ts` |
| **BUG-003** | P2 | Closed | Tooling / E2E | S15 / AC-008 | Eksekusi Playwright headless terhenti di lingkungan lokal CLI karena binary Chromium (`chrome-headless-shell.exe`) belum diunduh | Direktif D20 melarang pengunduhan binary eksternal otomatis tanpa konfirmasi pengguna (`npx playwright install`) | `c13af0e` | `tests/e2e/smoke.spec.ts`, `tests/e2e/ftue_gameplay.spec.ts` |

---

## Rincian Temuan Playtest Terstruktur

### BUG-001: Interaksi Dock Navigasi Saat Modal Aktif
- **Keparahan**: P3 (Minor UX Polish)
- **Langkah Reproduksi**:
  1. Mulai game hingga mencapai usia dengan skenario pilihan wajib (misal Usia 2 atau 6).
  2. Klik salah satu tab bawah (misal "Pekerjaan" atau "Relasi").
  3. Amati bahwa menu tidak terbuka, namun dialog tidak memberikan umpan balik visual bahwa pemain harus memilih opsi terlebih dahulu.
- **Rekomendasi Perbaikan**: Tambahkan animasi mikro goyang (*subtle shake*) 100ms pada kartu dialog modal saat pemain mencoba menyentuh area luar dialog.

### BUG-002: Pembersihan Timer Impor di SettingsModal
- **Keparahan**: P3 (Cosmetic / Hygiene)
- **Langkah Reproduksi**:
  1. Buka modal Settings -> tempelkan payload JSON valid.
  2. Klik tombol "Pulihkan & Impor Save".
  3. Tekan tombol `[✕]` (tutup modal) sebelum 1 detik berlalu.
- **Rekomendasi Perbaikan**: Gunakan `useRef<NodeJS.Timeout | null>` dan panggil `clearTimeout` di cleanup effect.

### BUG-003: Playwright Browser Binary di Lingkungan CLI
- **Keparahan**: P2 (Test Automation Infrastructure)
- **Langkah Reproduksi**:
  1. Jalankan `npx playwright test`.
  2. Terjadi kegagalan launch browser: `Executable doesn't exist at chrome-headless-shell.exe`.
- **Rekomendasi Perbaikan**: Sediakan opsi mock headless atau jalankan `npx playwright install chromium` dengan izin pengguna.
