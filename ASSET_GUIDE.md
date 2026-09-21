# PANDUAN MANAJEMEN ASET (ASSET_GUIDE.md)
**Game: EverLife (v1.0-SMA)**  
*Vibecoding Build System v2.2 — Asset Pipeline Tier H & Tier P*

Dokumen ini menjelaskan arsitektur aset visual, ikonografi, dan synthesizer suara dalam game EverLife v1.0.

---

## 1. STRATEGI ASET BEBAS KUOTA (0 KB EXTERNAL BITMAP)
Untuk menjamin ukuran unduhan awal seminimal mungkin ($< 350\text{ KB}$) dan performa 60 FPS tanpa layout shift (CLS = 0), EverLife menerapkan strategi aset hibrida:
- **Tier H (Human/Open-Source MIT)**: Ikon SVG vektor berlisensi resmi via `lucide-react`.
- **Tier P (Procedural Code-Driven)**: Avatar karakter berbasis kode hash deterministik dan efek audio dinamis Web Audio API.
- **Tanpa Gambar Bitmap Eksternal**: Bebas dari aset PNG/JPG/WebP berukuran besar, sehingga game dapat beroperasi instan tanpa dependensi CDN eksternal.

---

## 2. PIPELINE IKONOGRAFI (TIER H)
Seluruh ikon didefinisikan secara deklaratif di dalam `src/contracts/assetManifest.ts` dan dipetakan di `src/ui/assets/icons.tsx`.

### Daftar Pemetaan Ikon Resmi:
| ID Ikon | Simbol | Komponen Lucide | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| `icon-heart` | ♥ | `Heart` | Indikator Statistik Kesehatan |
| `icon-smile` | :) | `Smile` | Indikator Statistik Kebahagiaan |
| `icon-users` | [U] | `Users` | Indikator Hubungan Sosial / Relasi |
| `icon-book` | [B] | `BookOpen` | Indikator Prestasi Akademik |
| `icon-coins` | $ | `Coins` | Saldo Uang Saku / Tabungan Mandiri |
| `icon-calendar` | [+] | `PlusCircle` | Tombol Aksi Tambah Umur (+1 Tahun) |
| `icon-settings` | [*] | `Settings` | Menu Pengaturan / Manajemen Simpanan |

### Aturan Menambah Ikon Baru:
1. Daftarkan entri baru di `ICON_MANIFEST` (`src/contracts/assetManifest.ts`).
2. Impor komponen Lucide terkait di `src/ui/assets/icons.tsx`.
3. Pastikan komponen tree-shaken tidak memuat seluruh paket Lucide.
4. Jalankan `npm run typecheck` untuk menjamin 0 kesalahan tipe data.

---

## 3. AVATAR PROSEDURAL KARAKTER (TIER P)
Komponen `ProceduralAvatar.tsx` menghasilkan lencana lingkaran berwarna cerah secara deterministik:
- **Inisial Huruf**: Diambil dari huruf kapital pertama nama karakter.
- **Gradien Latar Belakang**: Dipilih dari palet gradien Tailwind CSS (`from-blue-500 to-indigo-600`, dll.) berdasarkan fungsi hash 32-bit dari string nama.
- **Warna Cincin Identitas**: Biru muda untuk jenis kelamin Pria, merah muda untuk jenis kelamin Wanita.

---

## 4. MODUL SINTESIS AUDIO (WEB AUDIO API)
Modul `SynthAudio.ts` menghasilkan gelombang suara murni langsung melalui osilator browser tanpa memuat file MP3/WAV eksternal:
- **Ketukan Ringan (`playTap`)**: Sine oscillator $440\text{ Hz}$ durasi $50\text{ ms}$.
- **Peringatan / Penalti (`playAlert`)**: Sawtooth oscillator $150\text{ Hz}$ durasi $150\text{ ms}$.
- **Selebrasi Kelulusan (`playSuccess`)**: Triangle arpeggio ceria nada C5 ($523\text{ Hz}$), E5 ($659\text{ Hz}$), dan G5 ($784\text{ Hz}$).

### Kebijakan Suara Bawaan:
- Status bawaan audio adalah senyap (`CFG_AUDIO_DEFAULT_MUTED = true`) untuk mematuhi kebijakan browser modern mengenai autoplay audio serta kenyamanan pengguna saat bermain di ruang publik.
