# DOKUMEN KESEIMBANGAN PERMAINAN (BALANCE.md)
**Game: EverLife (v1.0-SMA)**  
*Referensi Utama: Game Blueprint Bagian S7 dan src/contracts/gameConfig.ts*

Dokumen ini mendokumentasikan seluruh konstanta penyeimbang permainan secara mendetail beserta nilai awal, satuan eksplisit, rentang aman, dan dampaknya terhadap pengalaman bermain pemain.

---

## 1. KINERJA, VIEWPORT & ANIMASI

| Nama Konstanta | Nilai Awal | Satuan | Rentang Aman | Dampak Terhadap Gameplay |
| :--- | :--- | :---: | :---: | :--- |
| `CFG_FPS_TARGET` | `60` | FPS | 30 – 120 | Basis kalkulasi frame rate per detik dan basis konversi durasi milidetik ke frame. |
| `CFG_VIEWPORT_WIDTH_PT` | `390` | pt | 320 – 430 | Lebar acuan kontainer aplikasi pada layar perangkat bergerak. |
| `CFG_VIEWPORT_HEIGHT_PT` | `844` | pt | 640 – 932 | Tinggi acuan kontainer aplikasi pada layar perangkat bergerak. |
| `CFG_SAFE_AREA_TOP_PT` | `47` | pt | 0 – 60 | Inset atas untuk notch dan status bar perangkat agar tidak menutupi UI profil. |
| `CFG_SAFE_AREA_BOTTOM_PT`| `34` | pt | 0 – 40 | Inset bawah untuk home indicator perangkat agar tidak menutupi tab navigasi. |
| `CFG_ANIM_DELTA_CLAMP_MS`| `33.33` | ms | 16.6 – 50.0 | Batas maksimal delta time animasi UI saat terjadi lag atau perpindahan tab browser. |
| `CFG_INPUT_DEBOUNCE_MS` | `200` | ms | 100 – 350 | Mencegah pemicuan ganda (double-triggering) yang tidak disengaja pada tombol vital. |

---

## 2. POLISH & GAME FEEL

| Nama Konstanta | Nilai Awal | Satuan | Rentang Aman | Dampak Terhadap Gameplay |
| :--- | :--- | :---: | :---: | :--- |
| `CFG_TWEEN_BAR_DURATION_MS`| `300` | ms | 150 – 500 | Durasi animasi pergerakan isi bar statistik saat nilai bertambah atau berkurang. |
| `CFG_COLOR_FLASH_MS` | `200` | ms | 100 – 400 | Durasi kedipan aksen warna hijau (+bonus) atau merah (-penalti) pada teks indikator. |

---

## 3. DEKONSTRUKSI AKSI 4-FASE (WAKTU & SIKLUS)

| Nama Konstanta | Nilai Awal | Satuan | Rentang Aman | Dampak Terhadap Gameplay |
| :--- | :--- | :---: | :---: | :--- |
| `CFG_TIME_EVENT_TAP_WINDUP` | `0` | ms | 0 – 50 | Windup respons sentuhan saat menekan tombol opsi pada modal event. |
| `CFG_TIME_EVENT_TAP_ACTIVE` | `50` | ms | 30 – 100 | Waktu pemrosesan kalkulasi mutasi stat opsi yang dipilih. |
| `CFG_TIME_EVENT_TAP_RECOVERY`| `150` | ms | 100 – 250 | Durasi animasi transisi penutupan pop-up modal dialog event. |
| `CFG_TIME_EVENT_TAP_COOLDOWN`| `100` | ms | 50 – 200 | Jeda aman sebelum antarmuka menerima input baru setelah modal tertutup. |
| `CFG_TIME_AGE_UP_WINDUP` | `50` | ms | 0 – 100 | Jeda awal tombol Tambah Umur sebelum kalkulasi tahun dimulai. |
| `CFG_TIME_AGE_UP_ACTIVE` | `200` | ms | 100 – 350 | Durasi pemrosesan pergantian tahun dan penarikan peristiwa dari event pool. |
| `CFG_TIME_AGE_UP_RECOVERY` | `100` | ms | 50 – 200 | Pembaruan visual baris riwayat linimasa dan status bar umur. |
| `CFG_TIME_AGE_UP_COOLDOWN` | `300` | ms | 150 – 500 | Cooldown proteksi agar pemain tidak dapat memicu lompatan tahun secara beruntun. |
| `CFG_TIME_ACTION_TAP_WINDUP`| `0` | ms | 0 – 50 | Waktu tanggap sentuhan saat menekan kartu menu kegiatan tahunan. |
| `CFG_TIME_ACTION_TAP_ACTIVE`| `50` | ms | 30 – 100 | Waktu pemrosesan efek biaya energi dan perolehan stat dari aktivitas. |
| `CFG_TIME_ACTION_TAP_RECOVERY`| `100` | ms | 50 – 200 | Penutupan modal konfirmasi aktivitas. |
| `CFG_TIME_ACTION_TAP_COOLDOWN`| `100` | ms | 50 – 200 | Jeda penguncian input menu aktivitas. |
| `CFG_TIME_SOCIAL_TAP_WINDUP`| `0` | ms | 0 – 50 | Waktu tanggap sentuhan pada kontak relasi keluarga/teman. |
| `CFG_TIME_SOCIAL_TAP_ACTIVE`| `50` | ms | 30 – 100 | Waktu kalkulasi perolehan skor keharmonisan hubungan. |
| `CFG_TIME_SOCIAL_TAP_RECOVERY`| `150` | ms | 100 – 250 | Penutupan menu interaksi sosial. |
| `CFG_TIME_SOCIAL_TAP_COOLDOWN`| `200` | ms | 100 – 300 | Proteksi spam tombol interaksi dengan karakter NPC yang sama. |
| `CFG_TIME_NAV_TAP_WINDUP` | `0` | ms | 0 – 30 | Waktu tanggap sentuhan tombol navigasi tab bawah. |
| `CFG_TIME_NAV_TAP_ACTIVE` | `30` | ms | 20 – 60 | Waktu pergantian tampilan sub-tab aktif. |
| `CFG_TIME_NAV_TAP_RECOVERY` | `70` | ms | 50 – 120 | Transisi animasi slide horizontal antarmuka tab. |
| `CFG_TIME_NAV_TAP_COOLDOWN` | `50` | ms | 30 – 100 | Jeda pengaman perpindahan antar-tab. |
| `CFG_TIME_CHAR_GEN_WINDUP`| `0` | ms | 0 – 50 | Validasi form identitas pembuatan karakter baru. |
| `CFG_TIME_CHAR_GEN_ACTIVE`| `100` | ms | 50 – 200 | Inisialisasi seed PRNG Mulberry32 dan pembuatan state awal hidup. |
| `CFG_TIME_CHAR_GEN_RECOVERY`| `200` | ms | 100 – 350 | Transisi layar dari menu pembuatan karakter ke dashboard usia 0. |
| `CFG_TIME_CHAR_GEN_COOLDOWN`| `300` | ms | 150 – 500 | Jeda pengaman sebelum pemain dapat menyentuh tombol di dashboard pertama kali. |
| `CFG_TIME_SAVE_IO_WINDUP` | `0` | ms | 0 – 50 | Persiapan objek serialisasi JSON simpanan. |
| `CFG_TIME_SAVE_IO_ACTIVE` | `100` | ms | 50 – 300 | Waktu penulisan data atomik ke storage IndexedDB. |
| `CFG_TIME_SAVE_IO_RECOVERY` | `100` | ms | 50 – 200 | Penutupan antarmuka kelola berkas simpanan. |
| `CFG_TIME_SAVE_IO_COOLDOWN` | `200` | ms | 100 – 400 | Cooldown operasi I/O file penyimpanan lokal. |

---

## 4. BATAS USIA & JENJANG PENDIDIKAN

| Nama Konstanta | Nilai Awal | Satuan | Rentang Aman | Dampak Terhadap Gameplay |
| :--- | :--- | :---: | :---: | :--- |
| `CFG_AGE_MIN` | `0` | Tahun | 0 | Usia permulaan hidup karakter saat lahir. |
| `CFG_AGE_MAX_V1` | `18` | Tahun | 18 | Batas akhir fase masa muda versi 1.0 (memicu layar kelulusan tamat SMA). |
| `CFG_AGE_PRIMARY_SCHOOL` | `6` | Tahun | 6 – 7 | Usia transisi otomatis masuk ke jenjang Sekolah Dasar (SD). |
| `CFG_AGE_MIDDLE_SCHOOL` | `12` | Tahun | 12 – 13 | Usia transisi otomatis masuk ke jenjang Sekolah Menengah Pertama (SMP). |
| `CFG_AGE_HIGH_SCHOOL` | `15` | Tahun | 15 – 16 | Usia transisi otomatis masuk ke jenjang Sekolah Menengah Atas (SMA). |
| `CFG_AGE_PART_TIME_UNLOCK` | `15` | Tahun | 14 – 16 | Usia minimal untuk membuka opsi kegiatan kerja paruh waktu di tab aktivitas. |

---

## 5. PARAMETER STATISTIK & PENYEIMBANG

| Nama Konstanta | Nilai Awal | Satuan | Rentang Aman | Dampak Terhadap Gameplay |
| :--- | :--- | :---: | :---: | :--- |
| `CFG_STAT_MIN` | `0` | Poin | 0 | Batas mutlak terendah seluruh statistik (Kesehatan 0 memicu kematian). |
| `CFG_STAT_MAX` | `100` | Poin | 100 | Batas mutlak tertinggi seluruh statistik. |
| `CFG_STAT_INITIAL_HEALTH` | `90` | Poin | 70 – 100 | Modal cadangan kesehatan fisik awal saat karakter dilahirkan. |
| `CFG_STAT_INITIAL_HAPPINESS`| `85` | Poin | 60 – 100 | Modal kebahagiaan mental awal saat karakter dilahirkan. |
| `CFG_STAT_INITIAL_RELATION` | `80` | Poin | 50 – 100 | Rata-rata hubungan keharmonisan awal dengan kedua orang tua. |
| `CFG_STAT_INITIAL_ACADEMIC` | `50` | Poin | 30 – 70 | Modal potensi akademik / kognitif awal sebelum memasuki usia sekolah. |
| `CFG_RELATION_DECAY_ANNUAL`| `3` | Poin | 1 – 6 | Penurunan skor keharmonisan relasi tiap tahun jika pemain tidak berinteraksi. |
| `CFG_HEALTH_PENALTY_DEPLETION`| `5` | Poin | 2 – 10 | Penalti kebahagiaan tahunan yang dialami karakter saat kesehatan berada di bawah 20%. |

---

## 6. EKONOMI SAKU & PEKERJAAN

| Nama Konstanta | Nilai Awal | Satuan | Rentang Aman | Dampak Terhadap Gameplay |
| :--- | :--- | :---: | :---: | :--- |
| `CFG_ALLOWANCE_BASE_SD` | `20000` | IDR | 5.000 – 50.000 | Rata-rata akumulasi uang saku tahunan dari orang tua pada usia SD (6–11 tahun). |
| `CFG_ALLOWANCE_BASE_SMP` | `60000` | IDR | 20.000 – 150.000 | Rata-rata akumulasi uang saku tahunan dari orang tua pada usia SMP (12–14 tahun). |
| `CFG_ALLOWANCE_BASE_SMA` | `150000` | IDR | 50.000 – 400.000 | Rata-rata akumulasi uang saku tahunan dari orang tua pada usia SMA (15–18 tahun). |

---

## 7. SISTEM EVENT & PERSISTENSI

| Nama Konstanta | Nilai Awal | Satuan | Rentang Aman | Dampak Terhadap Gameplay |
| :--- | :--- | :---: | :---: | :--- |
| `CFG_EVENT_POOL_SIZE_V1` | `50` | Unit | 40 – 100 | Jumlah kuota minimal kartu dilema naratif masa kecil hingga tamat SMA. |
| `CFG_SAVE_SLOT_COUNT` | `3` | Slot | 1 – 5 | Jumlah slot penyimpanan lokal mandiri yang disediakan untuk pemain. |
| `CFG_AUTO_SAVE_ENABLED` | `true` | Boolean | true / false | Auto-save otomatis terpanggil secara atomik tiap pertambahan umur (+1 tahun). |
| `CFG_AUDIO_DEFAULT_MUTED` | `true` | Boolean | true / false | Audio disetel bawaan mati (mute) saat pertama kali bermain sesuai arahan desain. |
