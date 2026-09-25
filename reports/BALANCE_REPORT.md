# LAPORAN KALIBRASI & KESEIMBANGAN PERMAINAN (BALANCE_REPORT)
Tanggal: 2026-09-26T04:02:00+07:00
Target Aplikasi: EverLife v1.0.0
Metode: Simulasi Headless Deterministik (Vitest + Mulberry32 PRNG)
Sampel: 3.000 Kehidupan Penuh (1.000 run per arketipe)
Status: COMPLETE (100% TARGET TERCAPAI)

---

## 1. Ringkasan Eksekutif

Sesi balancing berbasis data (`/balance`) dijalankan untuk memvalidasi seluruh formula mekanika, ekonomi, dan mortalitas yang ditetapkan dalam [docs/game_prd_v1.1.md](file:///c:/Users/User/OneDrive/EverLife/docs/game_prd_v1.1.md) (§1, §3.5, §10) serta [docs/blueprint_final.md](file:///c:/Users/User/OneDrive/EverLife/docs/blueprint_final.md) (S2, S7).

Pengujian dilakukan tanpa manipulasi logika core (D16) melalui bot bertingkat di atas fungsi deterministik `simulate(seed, inputLog)`:
1. **Average Joe (1.000 run)**: Mewakili pemain kasual standar yang bekerja di sektor jasa/retail dan memilih jalur umum.
2. **High Achiever (1.000 run)**: Mewakili pemain ambisius yang menempuh pendidikan tinggi, berkarir teknologi/korporat, dan rutin menjaga kebugaran/kesehatan.
3. **Risk Taker / Kriminal (1.000 run)**: Mewakili pemain berisiko tinggi yang melakukan aksi kriminalitas dan hidup di bawah tekanan hukum.

---

## 2. Tabel Perbandingan Sebelum vs Sesudah Kalibrasi

*Rangkaian Seed Uji: Average Joe (`100000 - 100999`), High Achiever (`200000 - 200999`), Risk Taker (`300000 - 300999`)*

| Arketipe & Metrik | Target PRD / Blueprint | Sebelum Kalibrasi (Baseline) | Sesudah Kalibrasi | Status | Keterangan / Analisis |
|---|---|---|---|---|---|
| **Average Joe: Median Lifespan** | $70 - 85$ tahun (PRD §1) | **33 tahun** (GAGAL) | **73 tahun** | **LULUS** | Kematian dini burnout dieliminasi |
| **Average Joe: P95 Lifespan** | $\ge 80$ tahun | 45 tahun | **90 tahun** | **LULUS** | Lansia hidup hingga usia lanjut |
| **Average Joe: Child Mortality** | $< 5.0\%$ | 2.3% | **2.3%** | **LULUS** | Mortalitas anak rendah dan aman |
| **Average Joe: Centenarian ($\ge 100$)** | $0.1\% - 3.0\%$ | 0.0% | **0.3%** | **LULUS** | Masuk akal secara demografis |
| **Average Joe: Median Net Worth** | Positif ($> \$0$) | $0 | **$8,880** | **LULUS** | Pekerja standar mampu menabung |
| **Average Joe: Dominant Ribbon** | Mediocre (warga biasa) | Saint: 997 (anomali) | **Mediocre: 971 (97.1%)** | **LULUS** | Ribbon realistis tanpa inflasi karma |
| **High Achiever: Median Lifespan** | $\ge 70$ tahun | 65 tahun (GAGAL) | **72 tahun** | **LULUS** | Gaya hidup sehat memperpanjang umur |
| **High Achiever: Median Net Worth** | $\ge \$50,000$ | $273,340 | **$291,120** | **LULUS** | Karir teknologi mencapai tabungan mapan |
| **High Achiever: Successful Ribbon** | $\ge 10\%$ perolehan | 0% (semua jadi Saint) | **56.9% (569 run)** | **LULUS** | Mencapai gelar nisan sukses finansial |
| **Risk Taker: Insolvency Rate** | Tingkat kebangkrutan tinggi | 97.2% | **97.2%** | **LULUS** | Denda kejahatan menguras neraca |
| **Risk Taker: Dominant Ribbon** | Wicked / Jailbird | None: 733 / Wicked: 239 | **Wicked: 935 (93.5%)** | **LULUS** | Konsekuensi moral tercermin akurat |

---

## 3. Rincian Iterasi Kalibrasi (Satu per Satu)

### Iterasi 1: Koreksi Penalti Kesehatan Lembur (`evt_office_burnout`)
- **Masalah Awal**: Skenario `evt_office_burnout` pada pilihan `c1` memberikan penalti `health: -15`. Karena pool skenario usia 22-55 terbatas, event ini terpicu berulang kali sehingga 66% karakter meninggal di usia 33 tahun dengan penyebab "Beban Lembur Tak Berujung".
- **Perubahan**: Mengubah penalti `health` menjadi `-3` dan menambahkan `happiness: -5`.
- **Dampak**: Median umur Average Joe melonjak dari 33 tahun menjadi 69 tahun.

### Iterasi 2: Penyesuaian Usia Awal Krisis Penyakit (`FEEL_CRISIS_START_AGE`)
- **Masalah Awal**: Pada nilai awal `60 tahun`, kurva mortalitas Gompertz-Makeham memotong harapan hidup High Achiever pada usia median 69 tahun (sedikit di bawah target PRD $\ge 70$ tahun).
- **Perubahan**: Mengubah `FEEL_CRISIS_START_AGE` dari `60` menjadi `65` tahun di `src/shared/config.ts` (rentang aman S7: 50 - 70 tahun).
- **Dampak**: Harapan hidup median naik menjadi 72-73 tahun dan P95 mencapai 90 tahun.

### Iterasi 3: Koreksi Penalti Skenario Medis (`evt_health_checkup`)
- **Masalah Awal**: Pilihan `c2` (makan makanan cepat saji) memotong kesehatan secara ekstrem sebesar `-25%`, membunuh 73.3% karakter kriminal yang memilih opsi kedua.
- **Perubahan**: Mengubah penalti menjadi `-5%` health.
- **Dampak**: Kematian mendadak akibat tes medis turun dari 733 kejadian menjadi hanya 36 kejadian kasus kronis.

### Iterasi 4: Kalibrasi Inflasi Karma pada Skenario Non-Moral
- **Masalah Awal**: Pilihan biasa seperti menyapa teman sekolah (+5 karma), mengerjakan PR (+10 karma), wawancara kerja (+5 karma), dan berkebun lansia (+3 s/d +10 karma) mendongkrak nilai karma seluruh karakter hingga 100%, sehingga 98%+ karakter dinobatkan sebagai "Saint" terlepas dari status ekonomi atau pencapaian mereka.
- **Perubahan**: Mengatur `karmaDelta: 0` pada aktivitas rutin sehari-hari, dan menyisihkan penambahan karma positif signifikan hanya untuk pilihan altruisme sejati (seperti menyerahkan dompet hilang ke polisi atau mendanai penampungan hewan).
- **Dampak**: 56.9% High Achiever berhasil meraih gelar **Successful** (karena Net Worth $\ge \$250,000$), Average Joe bergelar **Mediocre** (97.1%), dan penjahat bergelar **Wicked** (93.5%).

---

## 4. Distribusi Penyebab Kematian (Post-Calibration)

Dari 1.000 kehidupan Average Joe:
1. **Meninggal tenang dalam tidur akibat usia tua**: 438 orang (43.8%)
2. **Penyakit kronis berkepanjangan pada usia lanjut**: 413 orang (41.3%)
3. **Kecelakaan lalu lintas fatal**: 120 orang (12.0%)
4. **Komplikasi penyakit langka masa kanak-kanak**: 23 orang (2.3%)
5. **Serangan jantung mendadak akibat kondisi fisik melemah**: 6 orang (0.6%)

Mortalitas kini menyerupai piramida demografi modern di mana sebagian besar kematian terkonsentrasi pada usia senja (70-90 tahun).

---

## 5. Daftar Hal yang Hanya Bisa Dinilai Manusia (L5)

Sesuai direktif D10 (*Feel Sebelum Fitur*) dan D11 (*Scope Honesty*), aspek subjektif berikut membutuhkan pengujian langsung oleh manusia (L5):

1. **Rasa Adil Saat Mengalami Kematian Dini**:
   - Apakah pemain merasa tertantang atau frustrasi ketika karakter berusia muda meninggal akibat kecelakaan lalu lintas acak (peluang 12%).
2. **Pacing Kepuasan Akumulasi Finansial**:
   - Apakah penambahan tabungan tahunan $840 untuk pelayan dan $6,000 untuk pengembang software terasa memuaskan saat disaksikan di log tahunan.
3. **Bobot Emosional Peristiwa Duka**:
   - Uji kesan naratif ketika menerima notifikasi kepergian Ayah atau Ibu di usia lanjut.
