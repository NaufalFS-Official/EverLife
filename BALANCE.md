# BALANCE CONFIGURATION & CONSTANTS

| Konstanta | Nilai | Satuan | Rentang Aman | Dampak | Sumber (Tag) | Diubah Oleh |
| --- | --- | --- | --- | --- | --- | --- |
| `TARGET_FPS` | 60 | fps | 30 - 120 | Frame rate target game loop dan konversi ms ke frame | [T] | Architect Agent |
| `FEEL_TEXT_SPEED_CPS` | 0 | ms/chunk | 0 - 50 | Kecepatan cetak narasi tahunan (0 = instan) | [A] | Architect Agent |
| `FEEL_TREE_BRANCH_MIN` | 2 | pilihan | 2 - 3 | Jumlah minimum cabang pilihan per dialog | [I] | Architect Agent |
| `FEEL_TREE_BRANCH_MAX` | 4 | pilihan | 3 - 5 | Jumlah maksimum cabang pilihan per dialog | [I] | Architect Agent |
| `FEEL_AUTOSAVE_TRIGGER` | "ON_AGE_UP_AND_RESOLVE" | string | enum | Titik waktu auto-save dieksekusi | [A] | Architect Agent |
| `FEEL_SURPRISE_ME_LATENCY_MS` | 50 | ms | 10 - 100 | Waktu respon tombol 'Surprise Me!' | [V] | Architect Agent |
| `FEEL_PRNG_SEED_BITS` | 32 | bit | 32 - 64 | Ukuran integer seed deterministik | [A] | Architect Agent |
| `FEEL_MIN_SURVIVAL_CHOICES` | 1 | pilihan | 1 - 2 | Jaminan pilihan non-fatal per modal skenario | [A] | Architect Agent |
| `FEEL_MORTALITY_BASE_RATE` | 0.001 | rasio | 0.0005 - 0.005 | Konstanta dasar probabilitas kematian pasif | [A] | Architect Agent |
| `FEEL_MORTALITY_EXPONENT` | 0.045 | eksponen | 0.030 - 0.060 | Laju percepatan mortalitas seiring penuaan | [A] | Architect Agent |
| `FEEL_CRISIS_START_AGE` | 65 | tahun | 50 - 70 | Batas usia mulai melonjaknya krisis penyakit | [A] | Balance Agent (/balance) |
| `FEEL_AGE_TAP_LATENCY_MS` | 200 | ms | 100 - 300 | Animasi & render waktu tombol "+Age" ditekan | [T] | Architect Agent |
| `FEEL_DIALOG_POPUP_LATENCY_MS` | 150 | ms | 80 - 250 | Durasi transisi pembukaan dialog modal | [T] | Architect Agent |
| `FEEL_CHOICE_EXECUTION_LATENCY_MS` | 180 | ms | 100 - 300 | Durasi eksekusi pilihan ke outcome sheet | [T] | Architect Agent |
| `FEEL_MENU_OPEN_LATENCY_MS` | 100 | ms | 50 - 200 | Kecepatan buka drawer submenu tab | [T] | Architect Agent |
| `FEEL_CREATION_START_LATENCY_MS` | 260 | ms | 150 - 400 | Transisi dari form Start Life ke dashboard | [T] | Architect Agent |
| `FEEL_SLIDER_DRAG_STEP_MS` | 16.6 | ms | 10 - 33 | Throttle refresh tampilan slider atribut | [T] | Architect Agent |
| `FEEL_BUTTON_BOUNCE_SCALE` | 0.95 | rasio | 0.90 - 0.98 | Skala tekan tombol "+Age" saat diklik | [A] | Architect Agent |
| `FEEL_BUTTON_BOUNCE_DURATION_MS` | 100 | ms | 50 - 200 | Durasi animasi bounce tombol kembali ke 1.0 | [A] | Architect Agent |
| `FEEL_HAPTIC_PULSE_MS` | 20 | ms | 10 - 40 | Durasi getar getaran haptic mobile browser | [A] | Architect Agent |
| `FEEL_SCREEN_SHAKE_DURATION_MS` | 140 | ms | 80 - 250 | Durasi getar kontainer saat terjadi krisis | [A] | Architect Agent |
| `FEEL_SCREEN_SHAKE_INTENSITY_PX` | 2 | px | 1 - 5 | Jarak simpangan getar layar | [A] | Architect Agent |
| `FEEL_SCREEN_SHAKE_FREQUENCY_HZ` | 25 | Hz | 15 - 40 | Frekuensi getar getaran kontainer UI | [A] | Architect Agent |
| `FEEL_FLOATING_TEXT_DISTANCE_PX` | 24 | px | 16 - 40 | Jarak vertikal angka indikator delta melayang | [A] | Architect Agent |
| `FEEL_FLOATING_TEXT_DURATION_MS` | 550 | ms | 350 - 800 | Durasi pemudaran angka melayang di stat bar | [A] | Architect Agent |
| `FEEL_CONFETTI_MAX_COUNT` | 35 | partikel | 20 - 60 | Jumlah partikel canvas saat sukses/lulus | [A] | Architect Agent |
| `FEEL_CONFETTI_DURATION_MS` | 750 | ms | 500 - 1200 | Masa hidup partikel confetti sebelum hilang | [A] | Architect Agent |
| `FEEL_HEALTH_VIGNETTE_DURATION_MS` | 180 | ms | 100 - 300 | Durasi flash merah tepi layar saat krisis | [A] | Architect Agent |
| `FEEL_AUDIO_SYNC_MAX_DELAY_MS` | 16 | ms | 0 - 30 | Ambang toleransi sinkronisasi trigger SFX | [A] | Architect Agent |
| `STAT_MIN_VALUE` | 0 | % | 0 | Batas mutlak bawah seluruh stat atribut | [V] | Architect Agent |
| `STAT_MAX_VALUE` | 100 | % | 100 | Batas mutlak atas seluruh stat atribut | [V] | Architect Agent |
| `TAX_RATE_DEFAULT` | 0.20 | rasio | 0.05 - 0.45 | Tarif pajak pendapatan default tahunan | [A] | Architect Agent |
| `ASSET_MAINTENANCE_RATE` | 0.02 | rasio | 0.01 - 0.05 | Biaya pemeliharaan aset tahunan (% nilai aset) | [A] | Architect Agent |
| `LIVING_EXPENSE_BASE` | 3600 | USD/tahun | 1000 - 10000 | Biaya hidup dasar tahunan saat dewasa | [A] | Architect Agent |

## Catatan Perubahan Presentasi & Polish (Sesi /polish — Agent DA VINCI)
- **Tingkat Gain Efek Suara (Procedural Web Audio)**: Dikalibrasi untuk kenyamanan pendengaran mobile/earphone:
  - `ui_click`: 0.15 (sebelumnya 0.20)
  - `age_tick`: 0.20 (sebelumnya 0.25)
  - `birth`: 0.18 (sebelumnya 0.20)
  - `cash`: 0.20 (sebelumnya 0.25)
  - `death`: 0.25 (sebelumnya 0.30)
  - `fail`: 0.20 (sebelumnya 0.25)
  - `confetti`: 0.18 (sebelumnya 0.20)
- **Ukuran Sentuh Interaktif**: Seluruh elemen tombol navigasi, tab gender, pilihan modal, dan aksi drawer dipastikan >= 44px hit area sesuai standar mobile iOS HIG & Android Touch Target guidelines.
- **Aksesibilitas Gerak**: Pengenalan media query `@media (prefers-reduced-motion: reduce)` dan kelas `.reduced-motion` yang dapat diaktifkan manual lewat Pengaturan untuk menonaktifkan screen shake/pulse berlebihan bagi pemain sensitif motion.

---

## Catatan Kalibrasi Balancing Berbasis Data (Sesi /balance — 3.000 Run Multi-Bot)
1. **Pencegahan Kematian Dini Berulang (Burnout & Tes Medis)**:
   - `evt_office_burnout` (`c1`): Penalti health diturunkan dari `-15` menjadi `-3` (dengan `happiness: -5`), menaikkan usia harapan hidup Average Joe dari 33 tahun menjadi 73 tahun.
   - `evt_health_checkup` (`c2`): Penalti health makan cepat saji dikalibrasi dari `-25` menjadi `-5`.
2. **Penyesuaian Usia Lonjakan Krisis (`FEEL_CRISIS_START_AGE`)**:
   - Disesuaikan dari 60 tahun menjadi 65 tahun, menstabilkan harapan hidup median pada 72-73 tahun dan P95 pada 90 tahun (sesuai target PRD §1 & §3.5).
3. **Kalibrasi Inflasi Karma pada Skenario**:
   - Menghilangkan karma instan pada pilihan-pilihan non-moral (seperti menyapa teman sekolah, mengerjakan PR sendiri, wawancara kerja, dan berkebun santai) sehingga nilai karma awal (50-75) tidak otomatis melambung ke 100 tanpa tindakan altruistik nyata.
   - Distribusi Ribbon kini beroperasi realistis: Average Joe menerima gelar **Mediocre** (97.1%), High Achiever meraih **Successful** (56.9%), dan Kriminal menerima **Wicked** (93.5%).

