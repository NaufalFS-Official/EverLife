# PANDUAN ASET & PIPELINE AUDIO-VISUAL (EverLife)

Dokumen ini menjelaskan standar teknis pembuatan, format, dan pipeline integrasi aset visual dan audio untuk proyek EverLife.

---

## 1. Filosofi & Lisensi Aset

- **Jalur Aset**: Campuran Prosedural (SVG inline terkomputasi + Sintesis Web Audio API) didukung placeholder berlabel.
- **Lisensi Wajib**: Seluruh aset buatan sendiri berlisensi **MIT**, dan setiap aset pihak ketiga wajib berlisensi **CC0 1.0 Universal** atau **Public Domain**.
- **Tanpa Panggilan Jaringan Eksternal**: Aset tidak boleh dimuat dari CDN eksternal atau URL pihak ketiga saat runtime untuk menjamin game dapat dimainkan 100% offline.

---

## 2. Spesifikasi Aset Visual (2D Avatar Komposit)

Avatar pemain dan karakter non-player digenerasikan secara real-time via modul `src/engine/avatarComposer.tsx`:
- **Format**: Inline SVG terkompresi.
- **ViewBox Standar**: `0 0 100 100`.
- **Lapisan Komposit (Z-Index Layering)**:
  1. Base Head & Neck (`skin`: indeks warna 0 - 5)
  2. Eyes & Pupils (`eyes`: bentuk variasi 0 - 5)
  3. Eyebrows (`brows`: bentuk variasi 0 - 4)
  4. Hair Base & Hairstyle (`hair`: gaya rambut 0 - 7, dengan warna `hairColor` 0 - 7)
- **Aturan Performa**:
  - Hindari filter SVG berat seperti `feGaussianBlur` atau efek drop-shadow kompleks pada tier Low/Mid untuk mencegah CPU throttling.
  - Gunakan elemen vektor path sederhana dengan `stroke-linecap="round"` dan kurva Bezier teroptimasi.

---

## 3. Spesifikasi Audio (Web Audio API Synthesizer)

Efek suara (SFX) di EverLife dihasilkan secara deterministik melalui osilator dan gain envelope native Web Audio API pada `src/engine/audioManager.ts`:
- **Latency**: 0 ms.
- **Ukuran File**: 0 KB aset binary audio (seluruh suara disintesis lewat matematika frekuensi gelombang).
- **Katalog SFX Aktif**:
  1. `ui_click`: Gelombang sine 600 Hz -> 300 Hz (durasi 40ms, gain decay cepat).
  2. `age_tick`: Gelombang triangle 440 Hz -> 880 Hz (durasi 80ms).
  3. `birth`: Dua nada ceria arpeggio (sine 523.25 Hz [C5] -> 659.25 Hz [E5]).
  4. `cash`: Gelombang square harmonik 987 Hz -> 1318 Hz (durasi 120ms).
  5. `death`: Gelombang sawtooth berat 120 Hz -> 40 Hz (durasi 600ms, low-pass filter).
  6. `fail`: Gelombang sawtooth minor 220 Hz -> 160 Hz (durasi 180ms).
  7. `police_siren`: Osilasi frekuensi 650 Hz <-> 900 Hz bertempo cepat.
- **Unlock Interaksi Pertama**:
  - Mengikuti kebijakan autoplay browser modern, AudioContext diinisialisasi dalam status suspended dan diaktifkan otomatis pada interaksi klik/tap pertama pengguna.

---

## 4. Generator Aset Cadangan (Placeholders)

Skrip `scripts/generate_placeholders.cjs` menghasilkan 11 aset placeholder berlabel untuk lingkungan fallback dan testing:
- Jalankan via: `npm run generate-placeholders`
- Folder keluaran: `public/assets/placeholders/`
