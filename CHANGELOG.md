# CATATAN RILIS (CHANGELOG.md)
Semua perubahan penting pada proyek **EverLife** akan dicatat dalam dokumen ini.
Format ini berbasis pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan proyek ini mematuhi [Semantic Versioning](https://semver.org/lang/id/).

---

## [1.0.0] - 2026-09-21
### Ditambahkan (Added)
- **Siklus Hidup Masa Muda (Usia 0–18 Tahun)**:
  - Fase Balita (0–5 tahun): Perkembangan motorik, ikatan keluarga, dan pengenalan dunia.
  - Fase Sekolah Dasar / SD (6–11 tahun): Seragam merah putih, uang saku awal, ekstrakurikuler Pramuka.
  - Fase SMP (12–14 tahun): Masa orientasi siswa (MOS), kepengurusan OSIS, gadget pertama.
  - Fase SMA (15–18 tahun): Penjurusan IPA/IPS, les bimbel, kerja paruh waktu, dan persiapan UTBK.
  - Perayaan Kelulusan SMA (`GRADUATION_SCREEN`) dengan predikat cum laude / memuaskan dan konfeti selebrasi.
- **50 Kartu Event & Dilema Pilihan**:
  - Bank 50 kartu peristiwa bertingkat usia dengan penyeleksi kondisi flag masa lalu dan PRNG Mulberry32 deterministik.
  - Opsi pilihan 4 tema: Positif (Hijau), Rasional (Biru), Menentang (Merah), dan Pasif (Abu-abu).
- **Sistem Statistik & Evaluasi Organik**:
  - 4 pilar stat: Kesehatan, Kebahagiaan, Hubungan, dan Akademik ($0 - 100$).
  - Sistem penalti kesehatan menipis ($< 20\%$) memicu penurunan kebahagiaan (-5 poin/tahun).
  - Layar Game Over jika kesehatan menyentuh 0 (`GAME_OVER_DEATH`).
- **Sistem Relasi Dinamis**:
  - Dukungan NPC Ayah, Ibu, Sahabat, dan Guru Wali Kelas.
  - Peluruhan keharmonisan alami tahunan (-3 poin) serta interaksi ngobrol dan traktiran makan.
- **Ekonomi Mandiri & Kerja Paruh Waktu**:
  - Penyaluran uang saku tahunan bertahap (SD: Rp 20.000, SMP: Rp 60.000, SMA: Rp 150.000).
  - Pembukaan opsi kerja paruh waktu barista pada usia 15 tahun ke atas (+Rp 50.000 per sesi).
- **Manajemen Penyimpanan Ber-Checksum**:
  - 3 slot simpanan independen berbasis IndexedDB / localStorage.
  - Auto-save otomatis tiap pergantian tahun.
  - Ekspor dan impor file cadangan JSON yang diproteksi oleh checksum integritas FNV-1a 32-bit.
- **Antarmuka Pengguna & Audio**:
  - Desain portrait mobile-first (390 x 844 pt) ber-safe area top 47pt / bottom 34pt.
  - Avatar huruf inisial prosedural (Tier P) tanpa gambar bitmap eksternal.
  - Synthesizer Web Audio API dengan 3 preset nada, berstatus default senyap (muted).
  - Pengaman debounce 200 ms pada tombol Tambah Umur.
- **Infrastruktur Offline & Android**:
  - Dukungan PWA Service Worker Workbox CacheFirst untuk pengalaman bermain 100% offline (airplane mode).
  - Pembungkus Android Capacitor v6 (`com.everlife.game`).
  - Penanganan crash terisolasi via `<ErrorBoundary>` tingkat root.

### Keamanan (Security)
- Verifikasi 16 skenario serangan Red Team (`test/redteam/` dan `security/attacks/`):
  - Penolakan berkas save JSON korup, manipulasi saldo tanpa update checksum, dan versi skema masa depan.
  - Penolakan transisi umur terlarang saat dialog dilema aktif, setelah kematian, atau melewati usia 18 tahun.
  - Sanitasi nama karakter dari input kosong dan injeksi payload XSS HTML.
- Dokumentasi formal keterbatasan integritas klien offline murni (ATK-004) sebagai `ACCEPTED-RISK` di `security-test-report.md`.
