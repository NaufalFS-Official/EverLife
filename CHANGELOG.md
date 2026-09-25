# CHANGELOG

Semua perubahan penting pada proyek **EverLife** didokumentasikan di sini.

## [Unreleased]

### Added
- Inisialisasi struktur repositori, direktori `docs/`, `reports/`, `security/attacks/` via `/init`.
- Dokumen memori proyek: `PROGRESS.md`, `DECISION.md`, `BUGS.md`, `BALANCE.md`, `CHANGELOG.md`, `ENV_CHECKLIST.md`, `ASSETS_LICENSES.md`, dan `AGENTS.md`.
- Dokumen analisis dan spesifikasi arsitektur: `docs/gemini_analysis.md`, `docs/game_prd_v1.1.md` (LOCKED), dan `docs/blueprint_final.md` (APPROVED).

### Changed
- Tidak ada.

### Fixed
- Tidak ada.

### Security
- Penerapan salted SHA-256 HMAC envelope pada SaveData schema untuk integritas penyimpanan offline C0.

### Balance
- Penentuan konstanta awal Feel Spec dan mortalitas di `BALANCE.md`.

### Migration
- Perancangan interface `ISaveRepository` untuk mendukung migrasi mulus dari IndexedDB ke REST/Supabase di masa depan.
