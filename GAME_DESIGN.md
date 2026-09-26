# DOKUMEN DESAIN GAME (EverLife Game Design Document)

## 1. Visi & Identitas Game

**EverLife** adalah simulator kehidupan interaktif berbasis teks vertikal di mana setiap keputusan pemain menentukan jalannya takdir karakter dari lahir, menempuh pendidikan, berkarir, membina relasi, mengumpulkan kekayaan, hingga menghadapi kematian.

- **Genre**: Life Simulation / Text-Based Interactive RPG Sandbox.
- **Platform**: Web-Native Mobile Portrait (skalabilitas fleksibel desktop/tablet).
- **Filosofi Mekanik**: *Feel Before Features* — responsivitas input <50ms, determinisme seed PRNG penuh, dan keterbukaan sandbox tanpa batasan alokasi poin artifisial.

---

## 2. Core Game Loop (Siklus Hidup Tahunan)

```
[Kelahiran (Usia 0)]
        │
        ▼
┌──────────────────────────────────────────────┐
│                  LOOP USIA                   │
│                                              │
│  1. Tekan Tombol "+Age"                      │
│  2. Kalkulasi Penuaan & Gaji Finansial       │
│  3. Evaluasi Event Naratif (Modal Dialog)    │
│  4. Interaksi Opsional (Karir, Aset, Relasi) │
│  5. Evaluasi Mortalitas Tahunan              │
└───────────────────────┬──────────────────────┘
                        │ Karakter Wafat (Health=0% / Usia Lanjut)
                        ▼
             [Layar Memorial Nisan]
                        │
                        ▼
             [Mulai Hidup Baru (Reset)]
```

---

## 3. Sistem Atribut Karakter

Karakter memiliki 8 atribut status inti dengan rentang nilai **0 s/d 100%**:
1. **Health (Kesehatan)**: Menentukan vitalitas fisik dan kelangsungan hidup. Bila Health < 25%, layar berdenyut merah (Health Vignette). Bila Health = 0%, terjadi kematian instan.
2. **Happiness (Kebahagiaan)**: Kepuasan batin. Dipengaruhi oleh relasi, liburan, dan pencapaian hidup.
3. **Smarts (Kecerdasan)**: Menentukan kualifikasi masuk universitas dan persyaratan pekerjaan profesional bergaji tinggi.
4. **Looks (Penampilan)**: Mempengaruhi kemudahan bersosialisasi dan pekerjaan tertentu (misal industri hiburan).
5. **Karma (Moralitas)**: Indikator keberuntungan dan integritas etis (kejahatan menurunkan karma, aksi dermawan meningkatkannya).
6. **Discipline (Kedisiplinan)**: Ketekunan dalam belajar dan kenaikan promosi jabatan kerja.
7. **Fertility (Kesuburan)**: Potensi biologis untuk memiliki keturunan.
8. **Sexuality (Orientasi)**: Straight, Bisexual, atau Gay.

---

## 4. Sistem Finansial & Aset

- **Kekayaan Bersih (Net Worth)**: $\text{Net Worth} = \text{Bank Balance} + \sum \text{Nilai Aset Pasar}$.
- **Siklus Finansial Tahunan**:
  $$\Delta \text{Balance} = \text{Gaji Karir} - \text{Biaya Hidup Dasar} - \sum \text{Biaya Perawatan Aset} - \text{Pajak}$$
- **Aset Properti & Kendaraan**:
  - Mobil: Nilai pasar mengalami depresiasi tahunan ~5%, memerlukan biaya servis berkala.
  - Properti/Rumah: Nilai pasar mengalami apresiasi tahunan ~2-4%, memerlukan biaya perawatan tahunan.

---

## 5. Sistem Mortalitas & Kematian

- **Kematian Alami**: Probabilitas wafat meningkat seiring pertambahan usia dan dipengaruhi kondisi kesehatan:
  $$P(\text{Wafat}) = \text{BaseMortality}(\text{Age}) \times \left(1 + \frac{100 - \text{Health}}{50}\right)$$
- **Kematian Fatal/Tragis**: Kejadian mendadak pada peristiwa ekstrem (kecelakaan, penyakit kritis, eksekusi kriminal).
- **Permadeath**: Tidak ada mekanisme memutar balik tahun (*Time Machine*) pada MVP demi menjaga konsekuensi emosional setiap keputusan pemain.
