# AGENTS PROTOCOL & COLLABORATION GUIDE
**Game: EverLife (v1.0-SMA)**  
*Vibecoding Build System v2.2*

Dokumen ini mendefinisikan aturan operasional, protokol serah terima sesi (*session handoff*), dan format pelaporan untuk setiap agen pengembang yang bekerja pada proyek **EverLife**.

---

## 1. ATURAN EMAS PER-SESI
1. **Fokus Tunggal**: Setiap agen HANYA mengeksekusi checklist yang berada di dalam sesi aktifnya saat ini. Dilarang melompat ke sesi berikutnya sebelum exit gate sesi aktif terverifikasi 100% HIJAU.
2. **Tanpa Asumsi Liar**: Semua konstanta, nama entitas, dan batasan matematis WAJIB merujuk pada `src/contracts/` dan `GAME_BLUEPRINT.md`. Jangan mengarang angka atau aturan baru.
3. **Pencatatan Keputusan**: Jika menemui dilema desain atau teknis di luar blueprint, catat keputusan tersebut ke dalam `DECISION.md` dengan format `DEC-###: keputusan | alasan | alternatif`.
4. **Verifikasi Bukti Nyata**: Setiap kali menyelesaikan checklist, jalankan perintah pembuktian nyata (typecheck, lint, unit test, build). Jangan mengklaim selesai tanpa bukti output terminal.
5. **Git Hygiene**: Setiap sesi diakhiri dengan pembaruan `PROGRESS.md`, pembersihan file sementara, dan pembuatan commit Git terstruktur.

---

## 2. FORMAT LAPORAN STATE SUMMARY
Setiap agen yang mengakhiri sesi wajib memperbarui `PROGRESS.md` dan mencetak blok ringkasan berikut:

```markdown
### STATE SUMMARY (Akhir Sesi [ID_SESI])
- **Sesi Selesai**: [ID_SESI - Nama Sesi]
- **Status Exit Gate**: [HIJAU / MERAH] (Bukti: [Perintah verifikasi + hasil])
- **Artefak Dibuat / Diubah**:
  - `path/to/file1.ts`
  - `path/to/file2.ts`
- **Keputusan Baru / Perubahan**: [DEC-### jika ada, atau NIHIL]
- **Blocker / Isu Terbuka**: [NIHIL / Deskripsi blocker]
- **Sesi Berikutnya**: [ID_SESI_SELANJUTNYA - Nama Sesi]
```

---

## 3. PETA PERAN AGEN SESI
- **SESI-01 (SETUP)**: DevOps & Tooling Specialist — Membangun workspace, dependensi terkunci, dan dev server.
- **SESI-02 (CONTRACT)**: Contract & Systems Architect — Menulis file TypeScript murni untuk seluruh state, event, dan config.
- **SESI-03 (CLIENT)**: Core Game Engineer & Frontend Developer — Membangun game engine headless, logic calculator, dan UI components.
- **SESI-04 (ASSET-HOOK)**: UI/UX & Audio Specialist — Mengintegrasikan SVG Lucide Icons, Avatar Prosedural, dan Web Audio Synth.
- **SESI-05 (INFRA)**: PWA & Mobile Packaging Specialist — Mengonfigurasi Service Worker offline, Capacitor Android, dan CI.
- **SESI-06 (REDTEAM)**: Security & Quality Assurance Tester — Menjalankan uji manipulasi save, stress input debounce, dan anti-cheat.
- **SESI-07 (RELEASE)**: Release Manager — Melakukan audit akhir, PRE_DEPLOY_CHECKLIST, changelog, dan release tag.
