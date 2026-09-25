# DECISION LOG

| ID | Keputusan | Alasan | Alternatif yang Ditolak |
| --- | --- | --- | --- |
| **DEC-001** | Permadeath Murni (ulang dari usia 0 tahun saat mati) | Menjaga konsekuensi dan bobot pilihan hidup tanpa kompleksitas snapshot time rewind pada MVP. | Fitur "Time Machine" (memutar balik 1-5 tahun ke belakang). |
| **DEC-002** | Slider Atribut Awal Bebas 0-100% (Sandbox Mode) | Sesuai eksplisit CATATAN_TAMBAHAN untuk kebebasan roleplay instan. | Sistem point-buy terbatas (alokasi poin kaku). |
| **DEC-003** | Penundaan Sistem Dinasti Generasi untuk MVP | Memangkas kompleksitas inheritance dan family tree agar siklus hidup satu karakter matang. | Sistem generasi berlanjut sebagai anak kandung. |
| **DEC-004** | Simulasi Karir & Kejahatan Berbasis Teks Murni | Mencegah penambahan engine/physics/canvas aksi refleks yang tidak sesuai genre teks. | Minigame aksi arcade (kabur penjara, kejar-kejaran mobil). |
| **DEC-005** | Injeksi Test ID Eksak (TEST-AC-001 s/d TEST-AC-008) | Memenuhi syarat verifikasi arsitektur dan penelusuran kualitas kode. | Pengujian ad-hoc tanpa penomoran ID. |
| **DEC-006** | Peniadaan Sesi Server & Data Backend | Proyek beroperasi pada Build Mode A / Konektivitas C0 luring 100%. | Penyediaan server Node.js / database PostgreSQL. |
| **DEC-007** | Peniadaan WebSocket & Netcode Autoritatif | Permainan berformat single-player mandiri tanpa interaksi sosial real-time. | Arsitektur multiplayer client-server. |
| **DEC-008** | Konsolidasi Sesi RedTeam & BlueTeam ke Tamper Lokal | Model ancaman Mode A terfokus pada integritas save storage IndexedDB dan validasi batas input. | Uji penetrasi server API / penipuan skor jaringan. |
| **DEC-009** | Instalasi paket zod@4.6.5 locked version | Validasi skema runtime pada content-schema (scenario events, job listings, save envelope) dan migrasi save berversi tanpa bypass type safety. | Validasi tipe runtime manual dengan assertion buatan tangan yang rentan inkonsistensi. |
| **DEC-010** | Penambahan field opsional AssetItem, prisonYears, causeOfDeath, ribbon pada GlobalGameState | Mendukung modularitas fitur F-008, F-010, F-011 di Sesi Klien tanpa merusak kompatibilitas backward schema v1 | Pemisahan state di luar GlobalGameState yang menyulitkan persistensi terpadu |
| **DEC-011** | Modularisasi subkomponen drawer dan pemisahan gameActions & engine/types | Memenuhi Direktif D5 (maksimal 300 baris per file kode) dengan menjaga SubmenuDrawer (~50 baris) dan GameContext (~299 baris) tetap ramping | Menumpuk seluruh logika UI dan actions dalam 1 file monolitik > 400 baris |
| **DEC-012** | Sintesis Audio Prosedural Web Audio API murni | Menjamin pemutaran 7 cues SFX dengan 0ms latency luring 100% tanpa risiko kegagalan unduhan file statis atau decoding audio browser | Bergantung mutlak pada file eksternal .mp3/.webm yang rentan 404/CORS |

---

## SELF-HEALING LOG

| [ITEM] | ERROR | AKAR | PERBAIKAN | PENCEGAHAN |
| --- | --- | --- | --- | --- |
| **SH-001** | `TS6133: 'computeSaveChecksum' is declared but its value is never read` | Import utilitas kriptografi di `contracts.test.ts` belum memiliki assertion pengujian langsung saat strict compiler `noUnusedLocals` aktif | Menambahkan unit test deterministik untuk `computeSaveChecksum` di test suite persistence | Pastikan setiap fungsi yang diexport dan diimport ke test file memiliki assertion uji langsung |
| **SH-002** | ESLint memindai folder `dist/` saat `npm run lint` | Konfigurasi flat ESLint 9 memerlukan object ignore mandiri tanpa atribut files/languageOptions | Memisahkan `{ ignores: ['dist/**', 'coverage/**'] }` sebagai objek flat pertama di `eslint.config.js` | Selalu pisahkan global ignores pada flat config ESLint 9 |
| **SH-003** | Inkonsistensi replay deterministik pada `simulation_replay.test.ts` | `createNewLife` menyisipkan `Date.now()` pada `runId` dan `spendTimeWithNPC` menggunakan `Math.random()` | Mengganti `runId` menjadi deterministik `run_${seed}` dan mewajibkan PRNG ber-seed di seluruh fungsi core per D16 | Dilarang keras menggunakan Math.random() dan Date.now() di folder `src/core/` |
| **SH-004** | Error TS2339 & TS6133 pada kompilasi awal `GameContext.tsx` | Method `Mulberry32PRNG` adalah `next()` bukan `nextFloat()`, dan interface `evaluateTransition` menerima 2 argumen | Menyelaraskan seluruh pemanggilan PRNG ke `rng.next()` dan menghapus parameter ketiga pada `evaluateTransition` | Selalu teliti antarmuka kontrak bersama sebelum implementasi engine |
| **SH-005** | Fluktuasi heap memory pada harness `fps_memory_harness.test.ts` | JIT compilation awal V8 dan modul Vitest mengalokasikan memory nursery sebelum baseline | Menambahkan warm-up iterasi 60 run dan pemicu GC eksplisit sebelum dan sesudah pengukuran | Gunakan fase warm-up JIT saat menguji stabilitas memori V8 jangka panjang |
