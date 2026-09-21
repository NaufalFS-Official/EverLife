# DIREKTIF GLOBAL v2 — berlaku untuk SEMUA sesi
D1 ANTI-HALUSINASI: verifikasi nama paket, versi, method, dan API sebelum dipakai (docs, `--help`,
node_modules, type definition). Jangan mengarang API engine. Versi harus cocok (Phaser 3 != 2; Three.js r150 !=
r120; Godot 4 != 3; API Unity per versi).
D2 KODE NYATA: dilarang TODO, FIXME, stub, "akan diimplementasikan nanti", fungsi kosong, `throw not
implemented`, atau mock yang menyamar sebagai fitur. Setiap entitas/mekanik/scene dalam lingkup sesi =
terimplementasi dan dapat dimainkan. Satu-satunya pengecualian: generator placeholder aset.
D3 BUKTI SEBELUM KLAIM: dilarang menyatakan modul selesai/PASS/0 error tanpa menempelkan output MENTAH terminal
dari perintah verifikasi (typecheck, test, build, log engine). Format:
[BUKTI] perintah: <cmd> | exit: <kode> | waktu: <timestamp>
<20-40 baris terakhir output mentah, tidak diedit>
Perintah tidak dapat dijalankan = status UNVERIFIED (bukan DONE) + alasan. Kata "seharusnya lulus / mungkin /
kelihatannya" tidak sah sebagai pengganti bukti.
D4 STATUS BUTIR: ☐ TODO · ▣ DONE-VERIFIED (ada bukti) · ▨ DONE-UNVERIFIED · ✖ BLOCKED (+alasan). Hanya ▣ yang
dihitung untuk exit gate.
D5 ANTI-STUB & ANTI-TRUNCATION: tulis file satu per satu; file >300 baris dipecah per modul. Setelah menulis
jalankan `wc -l` dan pindai `grep -rnE "TODO|FIXME|not implemented|NotImplemented|stub|rest of the code|sama
seperti sebelumnya" <src>` = 0 temuan (tempel hasil). Jangan menulis "sisanya sama".
D6 TYPE-SAFETY: Web/TS strict (noImplicitAny, noUncheckedIndexedAccess); nol `any`, `@ts-ignore`, `as unknown
as`. Godot: GDScript bertipe statis. Unity: C# nullable enable + asmdef. Unreal: C++ dengan UPROPERTY/ownership
benar. Roblox: Luau --!strict.
D7 KONFIG & RAHASIA: setiap konstanta tunable ada di game-config (mis. /shared/game-config.ts); tidak ada angka
ajaib di logika. Setiap env var ada di env-schema + .env.example + ENV_CHECKLIST.md. Rahasia tidak pernah
di-hardcode atau di-commit. Versi paket terkunci (tanpa ^ atau ~).
D8 KEAMANAN: klien tidak pernah tepercaya. Tidak ada rute skor tanpa validasi anti-cheat; tidak ada rute
ekonomi tanpa rate limit + transaksi atomik; tidak ada data pemain tanpa isolasi kepemilikan (RLS/otorisasi).
D9 INTEGRITAS GAME LOOP: render mengikuti requestAnimationFrame/loop engine (bukan setInterval); logika fixed
timestep 1/60 s (atau FPS target PRD); delta di-clamp <100 ms; pause menghentikan loop; destroy scene = lepas
listener + hentikan tween/timer.
D10 FEEL SEBELUM FITUR: mekanik harus terasa responsif (shake, hit-stop, partikel, SFX sinkron) dan 60 FPS
terverifikasi sebelum mekanik baru ditambah.
D11 SCOPE HONESTY: AI tidak membuat seni organik dari kode mentah. Aset tier H/X diintegrasikan, bukan
diciptakan. Placeholder = bentuk berlabel. Pekerjaan editor GUI yang tak bisa lewat CLI (Unity/Unreal) ditandai
MANUSIA-DI-EDITOR, bukan dipura-purakan.
D12 SELF-HEALING: error 1x = baca stack lengkap, cari akar. Error sama 2x = periksa asumsi fundamental. Jangan
menyembunyikan error dengan catch kosong. Catat di DECISION.md: [ITEM] ERROR | AKAR | PERBAIKAN | PENCEGAHAN.
D13 KEPUTUSAN OTOMATIS: setiap auto-resolve dicatat di DECISION.md (DEC-###).
D14 DISIPLIN SESI: kerjakan HANYA lingkup sesi aktif. Jangan edit file milik sesi lain kecuali kontrak /shared
lewat prosedur perubahan (catat DEC-### + jalankan ulang typecheck). Akhir sesi WAJIB menulis STATE SUMMARY ke
PROGRESS.md.
D15 KOMIT: satu komit per modul terverifikasi: `feat(<modul>): <ringkas> [verified]`.
# FORMAT STATE SUMMARY (append ke PROGRESS.md di akhir sesi, atau saat konteks >80%)
## [SESI-ID] [tanggal-waktu] — status: COMPLETE | PARTIAL | BLOCKED
- Checklist: ID -> ☐/▣/▨/✖ (ringkas)
- File dibuat/diubah (path)
- Perintah bukti terakhir + hasil (1 baris tiap perintah)
- Keputusan baru (DEC-###)
- Utang teknis / risiko diterima
- LANGKAH BERIKUTNYA: butir pertama yang belum selesai + konteks minimal untuk melanjutkan
- Gotchas: hal yang memakan waktu/menyebabkan error
# TABEL PERINTAH BUKTI (verifikasi flag terhadap versi terpasang; jangan disalin buta)
Web/TS : pnpm install --frozen-lockfile · pnpm tsc --noEmit · pnpm lint · pnpm vitest run --coverage · pnpm
build · pnpm playwright test
Godot 4: godot --headless --path . --quit · godot --headless --check-only --script <file.gd> · runner uji
GUT/gdUnit4 via CLI
Unity : Unity -batchmode -nographics -projectPath . -runTests -testPlatform EditMode|PlayMode -testResults
out.xml -logFile -
Unreal : UnrealEditor-Cmd <proj>.uproject -ExecCmds="Automation RunTests <Filter>; Quit" -unattended -nullrhi
-log
Roblox : selene . · lune run tests · rojo build -o game.rbxlx
Server : pnpm test:integration · docker compose config · k6 run load.js · validator OpenAPI
