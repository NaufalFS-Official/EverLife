# DIREKTIF GLOBAL v2.6 — berlaku untuk SEMUA sesi
D1 ANTI-HALUSINASI: verifikasi nama paket, versi, method, dan API sebelum dipakai (docs, `--help`, node_modules,
 type definition, `npm view <pkg> version`). Jangan mengarang API engine. Versi harus cocok. Ragu = katakan ragu.
D2 KODE NYATA: dilarang TODO, FIXME, stub, "akan diimplementasikan nanti", fungsi kosong, `throw not
implemented`, atau mock yang menyamar sebagai fitur. Satu-satunya pengecualian: generator placeholder aset.
D3 BUKTI SEBELUM KLAIM: dilarang menyatakan modul selesai/PASS/0 error tanpa menempelkan output MENTAH terminal dari perintah verifikasi. Format:
[BUKTI] perintah: <cmd> | exit: <kode> | waktu: <timestamp>
<20-40 baris terakhir output mentah, tidak diedit>
Perintah tidak dapat dijalankan = status UNVERIFIED (bukan DONE) + alasan. Klaim visual butuh screenshot/
rekaman (Artifact).
D4 STATUS BUTIR: ☐ TODO · ▣ DONE-VERIFIED (ada bukti) · ▨ DONE-UNVERIFIED · ✖ BLOCKED (+alasan). Hanya ▣ yang dihitung untuk exit gate. Hal yang tak dijalankan ditulis `TIDAK DIUJI + alasan`; hal yang butuh manusia ditulis
`MENUNGGU MANUSIA + prosedur`; hal legal yang dilewati karena niat rilis hobi ditulis `TIDAK BERLAKU — LEWATI`.
D5 ANTI-STUB & ANTI-TRUNCATION: tulis file satu per satu; file >300 baris dipecah per modul. Setelah menulis
jalankan `wc -l` dan pindai `grep -rnE "TODO|FIXME|not implemented|NotImplemented|stub|rest of the code|sama
seperti sebelumnya" <src>` = 0 temuan (tempel hasil).
D6 TYPE-SAFETY: Web/TS strict (noImplicitAny, noUncheckedIndexedAccess); nol `any`, `@ts-ignore`,
`as unknown as`. Godot: GDScript bertipe statis. Engine editor GUI besar: konvensi bahasa vendor + nullable/
ownership ketat.
D7 KONFIG & RAHASIA: setiap konstanta tunable ada di game-config; tidak ada angka ajaib di logika. Setiap env
var ada di env-schema + .env.example + ENV_CHECKLIST.md. Rahasia tidak pernah di-hardcode, dicetak, atau
di-commit. Versi paket terkunci (tanpa ^ atau ~).
D8 KEAMANAN: klien tidak pernah tepercaya. Tidak ada rute skor tanpa validasi anti-cheat; tidak ada rute
ekonomi tanpa rate limit + transaksi atomik; tidak ada data pemain tanpa isolasi kepemilikan (RLS/otorisasi).
Server = sumber kebenaran.
D9 INTEGRITAS GAME LOOP: render mengikuti requestAnimationFrame/loop engine (bukan setInterval); logika fixed
timestep 1/60 s (atau FPS target PRD; 1/30 s untuk tier low bila PRD menyatakan); delta di-clamp <100 ms; pause
menghentikan simulasi (bukan sekadar early-return); destroy scene = lepas listener + hentikan tween/timer.
D10 FEEL SEBELUM FITUR: mekanik harus terasa responsif dan FPS terukur sebelum mekanik baru ditambah. Penilaian
"terasa enak" final = manusia (L5); agent hanya mengukur yang terukur.
D11 SCOPE HONESTY: AI tidak membuat seni organik dari kode mentah. Aset tier H/X diintegrasikan, bukan
diciptakan. Placeholder = bentuk berlabel. Pekerjaan editor GUI yang tak bisa lewat CLI = MANUSIA-DI-EDITOR. Di
awal tiap sesi build, nyatakan singkat apa yang bisa dan tidak bisa dikerjakan agent.
D12 SELF-HEALING: error 1x = baca stack lengkap, cari akar. Error sama 2x = periksa asumsi fundamental. 3x =
berhenti dan jalankan /unstuck. Jangan menyembunyikan error dengan catch kosong. Catat di DECISION.md.
D13 KEPUTUSAN OTOMATIS: setiap auto-resolve dicatat di DECISION.md (DEC-###).
D14 DISIPLIN SESI: kerjakan HANYA lingkup sesi aktif. Jangan edit file milik sesi lain kecuali kontrak /shared
lewat prosedur perubahan (catat DEC-### + jalankan ulang typecheck di semua modul). Awal sesi: baca AGENTS.md,
manifest, PROGRESS.md. Akhir sesi: WAJIB menulis STATE SUMMARY ke PROGRESS.md.
D15 KOMIT: satu komit per modul terverifikasi: `feat(<modul>): <ringkas> [F-###] [verified]`; perbaikan:
`fix(<modul>): <ringkas> [BUG-###]`.
D16 TESTABILITY BY DESIGN: logika game murni di core/ (tanpa import engine/DOM/window). RNG ber-seed; dilarang Math.random() dan Date.now() di core/. `simulate(seed, inputLog) -> stateHash` harus identik pada dua kali
jalan. Hooks debug `window.__game` (seed, getState, stateHash, setState, spawn, press, fastForward, startReplay,
getReplay, fps) HANYA di build debug/?debug=1 dan TIDAK BOLEH ada di build produksi (wajib ada tes yang
memeriksanya). FPS harness = satu-satunya bukti performa. Script standar: typecheck, lint, test, build,
build:debug, e2e, verify-assets.
D17 INTEGRITAS TES: dilarang mengubah, menghapus, atau mem-skip tes agar lolos. Tes yang salah diperbaiki
dengan alasan tertulis di DECISION.md. Golden test tidak berubah kecuali disengaja dan dijelaskan.
D18 PRD = WHAT, BLUEPRINT = HOW: agent tidak mengedit PRD. Perubahan requirement lewat GEM (REVISI -> patch -> /blueprint delta). Semua artefak merujuk ID F-### (fitur), AC-### (kriteria), DEC-###, BUG-###; ID tidak
dipakai ulang. Pengecualian tunggal: /blueprint boleh menerapkan patch menjadi file versi baru dan mengisi
kolom Test ID pada tabel AC.
D19 PLATFORM ADAPTER: kode game tidak memanggil API platform (localStorage, navigator, dst.) langsung; semuanya lewat PlatformAdapter (shared/platform.ts). Kemampuan yang tak tersedia jatuh ke fallback yang terdokumentasi.
D20 TERMINAL & NON-DESTRUKTIF: BOLEH: npm run *, npm ci, npm view, tsc, vitest, eslint, playwright, git status/
diff/log/add/commit/checkout -b. MINTA KONFIRMASI: install paket baru (catat DEC-###), git merge/rebase/reset,
hapus file/folder/branch, docker compose up, menulis di luar proyek, unduh selain registry paket. DILARANG:
`rm -rf` di luar dist/node_modules/coverage/.cache, git push --force, push ke main/produksi tanpa persetujuan
eksplisit, docker system prune, deploy produksi, sudo, curl | sh, mencetak isi .env/private key. Deploy
produksi dan akun toko = langkah manusia.
D21 ARTIFACT: perubahan besar (lebih dari ~5 file atau menyentuh kontrak) = buat Implementation Plan (artifact)
dan tunggu persetujuan pengguna. Akhir sesi besar = Walkthrough (apa yang dibuat, bukti, screenshot). Browser
subagent tidak tersedia = tulis `L4 TIDAK TERSEDIA` + skenario manual.
D22 KEJUJURAN ADVERSARIAL: red team wajib menjalankan payload nyata; dilarang menulis "tidak bisa dieksploitasi"
tanpa payload dan respons mentahnya. Blue team wajib menjalankan ULANG payload identik dan menempelkan respons sebelum vs sesudah. Auditor (/gate-final) read-only dan tidak membulatkan ke atas.
D23 NIAT RILIS & LEGAL: baca PRD §13.0. Bila Hobi/Personal, seluruh langkah legal di /goal-release ditandai
`TIDAK BERLAKU — LEWATI (niat rilis: hobi)` di laporan, TIDAK dihapus dari alur kerja. Bila Publik, semua
langkah legal wajib dikerjakan sebagai draf dan diverifikasi manusia.
D24 GENRE NON-LINEAR: bila PRD §3.6 menyatakan game tanpa "akhir" desain (idle/arcade endless), bukti L3/L4 di
/goal-verify memakai kriteria endurance (N menit tanpa crash/soft-lock, skor/progres terus bertambah), BUKAN
bot tamat-game linear.
# FORMAT STATE SUMMARY (append ke PROGRESS.md di akhir sesi, atau saat konteks >80%)
## [SESI-ID] [tanggal-waktu] — status: COMPLETE | PARTIAL | BLOCKED
- Checklist: ID -> ☐/▣/▨/✖ (ringkas)
- File dibuat/diubah (path)
- Perintah bukti terakhir + hasil (1 baris tiap perintah)
- Level verifikasi tercapai (L1-L5) dan yang MENUNGGU MANUSIA
- Keputusan baru (DEC-###)
- Utang teknis / risiko diterima
- LANGKAH BERIKUTNYA: butir pertama yang belum selesai + konteks minimal untuk melanjutkan
- Gotchas: hal yang memakan waktu/menyebabkan error
# TABEL PERINTAH BUKTI (verifikasi flag terhadap versi terpasang; jangan disalin buta)
Web/TS : pnpm install --frozen-lockfile (atau npm ci) · tsc --noEmit · lint · vitest run --coverage · build ·
playwright test
Godot 4: godot --headless --path . --quit · godot --headless --check-only --script <file.gd> · runner uji
GUT/gdUnit4 via CLI
Engine editor GUI besar: test runner CLI vendor bila ada (verifikasi flag terhadap versi terpasang)
Server : test:integration · docker compose config · k6 run load.js · validator OpenAPI
