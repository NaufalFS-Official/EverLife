# DOKUMEN DESAIN PERMAINAN (GAME_DESIGN.md)
**Game: EverLife (v1.0-SMA)**  
*Vibecoding Build System v2.2 — Desain Inti & Mekanik Permainan*

Dokumen ini merangkum filosofi desain, pilar gameplay, siklus hidup, dan penyeimbangan mekanik simulasi EverLife versi 1.0.

---

## 1. PILAR DESAIN UTAMA
1. **Pilihan Berdampak & Bernuansa Lokal**: Narasi merefleksikan dilema khas masa kanak-kanak hingga remaja di Indonesia (imunisasi puskesmas, seragam SD merah putih, MOS SMP, penjurusan IPA/IPS SMA, ujian UTBK).
2. **Keterbacaan & Kedalaman Stat-Driven**: Tidak ada grinding level angka absurd atau mata uang fiktif. Seluruh progresi dinilai dari 4 statistik organik (Kesehatan, Kebahagiaan, Hubungan, Akademik) dan tabungan riil (Rupiah).
3. **Sentuhan Rasa (Juice & Responsivitas)**: Setiap aksi dilengkapi umpan balik visual animasi bar progress, flash angka, dan nada sintetis lembut 60 FPS.

---

## 2. RENTANG HIDUP & TAHAPAN PENDIDIKAN (USIA 0–18 TAHUN)

```
[Usia 0–5: Balita] ──► [Usia 6–11: SD] ──► [Usia 12–14: SMP] ──► [Usia 15–18: SMA] ──► [Lulus SMA: Wisuda]
```

### Karakteristik Tiap Fase:
1. **Fase Balita (Usia 0–5 Tahun)**:
   - Fokus: Ikatan orang tua, perkembangan motorik awal, pengenalan krayon, dan sekolah taman kanak-kanak (TK/PAUD).
   - Uang Saku: Rp 0 / tahun.
2. **Fase Sekolah Dasar / SD (Usia 6–11 Tahun)**:
   - Fokus: Disiplin seragam merah putih, PR matematika, ekstrakurikuler Pramuka, jajanan kantin, dan pertemanan awal.
   - Uang Saku: Rata-rata Rp 20.000 / tahun.
3. **Fase SMP (Usia 12–14 Tahun)**:
   - Fokus: Masa orientasi siswa (MOS), smartphone pertama, olahraga class-meeting, kepengurusan OSIS, dan cinta monyet.
   - Uang Saku: Rata-rata Rp 60.000 / tahun.
4. **Fase SMA (Usia 15–18 Tahun)**:
   - Fokus: Penjurusan MIPA vs IPS, kerja paruh waktu barista (usia 15+), izin mengendarai motor, bimbingan belajar, persiapan UTBK, dan pesta perpisahan angkatan.
   - Uang Saku: Rata-rata Rp 150.000 / tahun. Pembukaan akses penghasilan mandiri kerja part-time (+Rp 50.000 / aktivitas).

---

## 3. PARAMETER STATISTIK & KONDISI GAME OVER

| Statistik | Rentang | Nilai Awal | Keterangan Efek Kritis |
| :--- | :--- | :--- | :--- |
| **Kesehatan (Health)** | $0 - 100$ | 90 Poin | Jika menyentuh 0%, karakter wafat (`GAME_OVER_DEATH`). Jika $< 20\%$, memicu penalti depresi kebahagiaan (-5 poin/tahun). |
| **Kebahagiaan (Happiness)** | $0 - 100$ | 85 Poin | Mempengaruhi stabilitas mental dan gelar predikat kelulusan. |
| **Hubungan (Relationship)** | $0 - 100$ | 80 Poin | Mengalami penurunan alami tahunan (-3 poin/tahun) jika tidak dirawat melalui aksi ngobrol atau makan bersama. |
| **Akademik (Academic)** | $0 - 100$ | 50 Poin | Menentukan penerimaan sekolah unggulan dan predikat kelulusan cum laude di usia 18 tahun. |
| **Tabungan (Cash)** | $\ge 0$ IDR | Rp 0 | Diperoleh dari uang saku orang tua dan kerja paruh waktu; digunakan untuk les bimbel, gym, dan nongkrong bersama relasi. |

---

## 4. SISTEM BANK EVENT (50 KARTU DILEMA)
- Dipilih secara acak terdistribusi menggunakan **Mulberry32 PRNG** berdasarkan kombinasi seed kehidupan (`lifeSeed`) dan usia saat ini.
- Setiap event memiliki 2 s.d. 4 opsi pilihan dengan konsekuensi stat, mutasi uang, atau flag pencapaian tertentu.
- Opsi diklasifikasikan ke dalam 4 tema visual: **Positive** (hijau), **Rational** (biru), **Rebellious** (merah), dan **Passive** (abu-abu).
