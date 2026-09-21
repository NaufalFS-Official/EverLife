# ATRIBUSI LISENSI ASET (ASSETS_LICENSES.md)
**Game: EverLife (v1.0-SMA)**

Dokumen ini mencatat seluruh atribusi lisensi pihak ketiga untuk aset visual dan pustaka kode yang digunakan dalam aplikasi EverLife.

---

## 1. IKON UI: Lucide Icons (Tier H)
- **Sumber**: [Lucide Icons](https://lucide.dev/)
- **Versi**: `0.441.0` (via package `lucide-react`)
- **Lisensi**: ISC / MIT License
- **Hak Cipta**: Copyright (c) 2022-2024 Lucide Project Contributors, Copyright (c) 2013-2022 Cole Bemis (Feather Icons)
- **Teks Lisensi**:
```
ISC License

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## 2. AVATAR KARAKTER: Avatar Prosedural Inisial Huruf (Tier P)
- **Sumber**: Implementasi kode murni internal (`src/ui/components/ProceduralAvatar.tsx`).
- **Lisensi**: Hak cipta milik proyek EverLife. Dihasilkan secara deterministik via CSS gradient & kode JavaScript murni tanpa memuat berkas bitmap eksternal.

---

## 3. EFEK SUARA: Synthesizer Audio Web Audio API (Tier P)
- **Sumber**: Sintesis gelombang suara murni via osilator Web Audio API (`src/ui/audio/SynthAudio.ts`).
- **Lisensi**: Hak cipta milik proyek EverLife. Dihasilkan secara dinamis pada frekuensi 440 Hz (sine), 150 Hz (sawtooth), dan 523–784 Hz (triangle arpeggio) dengan ukuran berkas aset audio eksternal 0 KB.
