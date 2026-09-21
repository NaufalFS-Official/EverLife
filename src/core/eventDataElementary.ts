/**
 * Kumpulan Kartu Kejadian Masa Sekolah Dasar (SD) (Usia 6 - 11 Tahun).
 * Jumlah: 18 Kartu Event Terkurasi.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { EventDilemma } from '../contracts/gameEvents';

export const ELEMENTARY_EVENTS: readonly EventDilemma[] = [
  {
    id: 'evt-008',
    minAge: 6,
    maxAge: 7,
    category: 'Sekolah',
    title: 'Masuk Sekolah Dasar',
    narrative: 'Seragam merah putih pertamamu terasa kaku dan rapi. Hari ini upacara bendera perdana.',
    options: [
      { id: 'opt-8a', label: 'Berdiri tegap di barisan depan', theme: 'positive', statDeltas: { health: 5, academic: 10 }, resultLog: 'Guru kelas menunjukmu menjadi ketua barisan kelas.' },
      { id: 'opt-8b', label: 'Mengeluh kepanasan di bawah terik', theme: 'passive', statDeltas: { happiness: -5 }, resultLog: 'Kamu dipindahkan ke bawah pohon rindang.' },
    ],
  },
  {
    id: 'evt-009',
    minAge: 7,
    maxAge: 8,
    category: 'Keluarga',
    title: 'Pekerjaan Rumah Lupa Dikerjakan',
    narrative: 'Malam sudah larut ketika kamu ingat ada tugas matematika yang belum dikerjakan.',
    options: [
      { id: 'opt-9a', label: 'Bangun dan kerjakan sampai selesai', theme: 'rational', statDeltas: { academic: 15, health: -5 }, resultLog: 'Tugas selesai, walau matamu agak mengantuk di pagi hari.' },
      { id: 'opt-9b', label: 'Tidur saja dan pasrah dihukum', theme: 'passive', statDeltas: { academic: -10, happiness: -5 }, resultLog: 'Kamu disuruh berdiri di depan kelas selama pelajaran.' },
      { id: 'opt-9c', label: 'Salin tugas teman sebelum bel masuk', theme: 'rebellious', statDeltas: { academic: 5, relationship: 5 }, resultLog: 'Tugasmu selamat berkat bantuan teman sebangku.' },
    ],
  },
  {
    id: 'evt-010',
    minAge: 7,
    maxAge: 9,
    category: 'Kesehatan',
    title: 'Jajanan Es Lilin Pinggir Jalan',
    narrative: 'Di luar pagar sekolah ada pedagang es warna-warni yang sangat menggoda lidah.',
    options: [
      { id: 'opt-10a', label: 'Beli dan nikmati bareng teman', theme: 'positive', statDeltas: { happiness: 10, cash: -3000, health: -10 }, resultLog: 'Rasanya manis luar biasa, tapi perutmu sedikit mulas malamnya.' },
      { id: 'opt-10b', label: 'Minum bekal air putih dari rumah', theme: 'rational', statDeltas: { health: 10, relationship: 5 }, resultLog: 'Tubuhmu tetap bugar dan uang sakumu utuh.' },
    ],
  },
  {
    id: 'evt-011',
    minAge: 8,
    maxAge: 10,
    category: 'Sekolah',
    title: 'Lomba Cerdas Cermat',
    narrative: 'Wali kelas mencari perwakilan murid untuk lomba antar-sekolah tingkat kecamatan.',
    options: [
      { id: 'opt-11a', label: 'Ajukan diri dengan percaya diri', theme: 'positive', statDeltas: { academic: 20, happiness: 10 }, resultLog: 'Sekolahmu membawa pulang piagam juara harapan.' },
      { id: 'opt-11b', label: 'Tundukkan kepala agar tak ditunjuk', theme: 'passive', statDeltas: { academic: 0 }, resultLog: 'Teman sekelasmu yang terpilih mewakili sekolah.' },
    ],
  },
  {
    id: 'evt-012',
    minAge: 8,
    maxAge: 10,
    category: 'Dilema',
    title: 'Dompet Tercecer di Lorong',
    narrative: 'Kamu melihat dompet bergambar kartun berisi uang Rp 20.000 tergeletak di dekat kantin.',
    options: [
      { id: 'opt-12a', label: 'Serahkan ke ruang guru', theme: 'rational', statDeltas: { relationship: 15, academic: 5 }, resultLog: 'Guru mengumumkan kejujuranmu saat pengumuman kelas.' },
      { id: 'opt-12b', label: 'Ambil dan belikan jajan kelas', theme: 'rebellious', statDeltas: { cash: 20000, happiness: 10, relationship: -10 }, resultLog: 'Kamu mentraktir kawan-kawan, walau hatimu diliputi rasa bersalah.' },
    ],
  },
  {
    id: 'evt-013',
    minAge: 9,
    maxAge: 11,
    category: 'Kesehatan',
    title: 'Lari Mengelilingi Lapangan',
    narrative: 'Guru olahraga menyuruh seluruh murid lari 4 putaran di bawah matahari pagi.',
    options: [
      { id: 'opt-13a', label: 'Lari sekuat tenaga sampai garis akhir', theme: 'positive', statDeltas: { health: 15, happiness: 5 }, resultLog: 'Napasmu terengah-engah tapi staminamu meningkat drastis.' },
      { id: 'opt-13b', label: 'Pura-pura sakit perut di putaran ke-2', theme: 'rebellious', statDeltas: { health: -5, academic: -5 }, resultLog: 'Kamu disuruh istirahat di UKS sambil minum teh hangat.' },
    ],
  },
  {
    id: 'evt-014',
    minAge: 9,
    maxAge: 11,
    category: 'Keluarga',
    title: 'Membantu Ibu Menjual Kue',
    narrative: 'Ibu membuat kue basah untuk dititipkan ke warung tetangga dan meminta bantuanmu.',
    options: [
      { id: 'opt-14a', label: 'Bantu mengantar pesanan dengan senang hati', theme: 'positive', statDeltas: { relationship: 15, cash: 10000 }, resultLog: 'Ibu memberimu upah uang jajan tambahan.' },
      { id: 'opt-14b', label: 'Menolak karena ingin main layangan', theme: 'rebellious', statDeltas: { relationship: -10, happiness: 10 }, resultLog: 'Ibu menghela napas, sementara kamu asyik berlari mengejar layang-layang.' },
    ],
  },
  {
    id: 'evt-015',
    minAge: 10,
    maxAge: 11,
    category: 'Sekolah',
    title: 'Ujian Kelulusan SD',
    narrative: 'Ujian akhir sekolah dasar telah tiba. Semua mata pelajaran diuji dalam sepekan.',
    options: [
      { id: 'opt-15a', label: 'Belajar kelompok setiap sore', theme: 'rational', statDeltas: { academic: 20, relationship: 10 }, resultLog: 'Nilai ujianmu masuk dalam 5 besar terbaik di sekolah.' },
      { id: 'opt-15b', label: 'Belajar kilat satu malam sebelum ujian', theme: 'passive', statDeltas: { academic: 5, health: -5 }, resultLog: 'Hasilmu cukup memuaskan meski terasa melelahkan.' },
    ],
  },
  {
    id: 'evt-016',
    minAge: 6,
    maxAge: 8,
    category: 'Acak',
    title: 'Gigi Susu Goyang',
    narrative: 'Gigi depan bagian bawahmu mulai goyang saat makan apel merah.',
    options: [
      { id: 'opt-16a', label: 'Minta Ayah mencabutnya pakai benang', theme: 'rational', statDeltas: { health: 10, relationship: 5 }, resultLog: 'Sakit sedikit, tapi gigi barumu akan tumbuh rapi.' },
      { id: 'opt-16b', label: 'Goyang-goyangkan terus pakai lidah', theme: 'passive', statDeltas: { happiness: 5 }, resultLog: 'Gigimu lepas sendiri saat kamu tertawa di sekolah.' },
    ],
  },
  {
    id: 'evt-017',
    minAge: 7,
    maxAge: 9,
    category: 'Keluarga',
    title: 'Peliharaan Kucing Liar',
    narrative: 'Seekor anak kucing belang tiga berteduh di teras rumahmu saat hujan lebat.',
    options: [
      { id: 'opt-17a', label: 'Minta izin orang tua untuk merawatnya', theme: 'positive', statDeltas: { happiness: 15, relationship: 10 }, resultLog: 'Kucing itu kini menjadi sahabat setiamu di rumah.' },
      { id: 'opt-17b', label: 'Beri sisa ikan goreng lalu biarkan pergi', theme: 'rational', statDeltas: { happiness: 5 }, resultLog: 'Anak kucing itu mengeong senang lalu berlari menjauh.' },
    ],
  },
  {
    id: 'evt-018',
    minAge: 8,
    maxAge: 10,
    category: 'Dilema',
    title: 'Game Konsol Teman',
    narrative: 'Teman sekelasmu membawa game genggam konsol terbaru ke kelas.',
    options: [
      { id: 'opt-18a', label: 'Pinjam bergantian saat istirahat', theme: 'positive', statDeltas: { happiness: 15, relationship: 10 }, resultLog: 'Kalian seru memainkan petualangan monster bersama.' },
      { id: 'opt-18b', label: 'Iri dan merengek minta dibelikan Ayah', theme: 'rebellious', statDeltas: { relationship: -10, happiness: -5 }, resultLog: 'Ayah menasehatimu untuk lebih bersyukur.' },
    ],
  },
  {
    id: 'evt-019',
    minAge: 9,
    maxAge: 11,
    category: 'Sekolah',
    title: 'Pilihan Ekstrakurikuler SD',
    narrative: 'Sekolah membuka pendaftaran kegiatan ekstrakurikuler Pramuka dan Seni Lukis.',
    options: [
      { id: 'opt-19a', label: 'Gabung Pramuka Penggalang', theme: 'positive', statDeltas: { health: 10, relationship: 10 }, resultLog: 'Kamu belajar tali-temali dan kemandirian berkemah.' },
      { id: 'opt-19b', label: 'Gabung Sanggar Lukis', theme: 'rational', statDeltas: { academic: 10, happiness: 10 }, resultLog: 'Goresan kuasmu semakin mahir dan indah.' },
    ],
  },
  {
    id: 'evt-020',
    minAge: 10,
    maxAge: 11,
    category: 'Kesehatan',
    title: 'Hujan-hujanan Sepulang Sekolah',
    narrative: 'Langit sore menumpahkan hujan deras saat jalan pulang bersama teman-teman.',
    options: [
      { id: 'opt-20a', label: 'Buka payung dan jalan tertib', theme: 'rational', statDeltas: { health: 10 }, resultLog: 'Kamu sampai di rumah dalam keadaan kering dan hangat.' },
      { id: 'opt-20b', label: 'Lompat ke kubangan dan basah kuyup', theme: 'rebellious', statDeltas: { happiness: 20, health: -15 }, resultLog: 'Sangat seru, walau malamnya kepalamu berdenyut flu.' },
    ],
  },
  {
    id: 'evt-021',
    minAge: 6,
    maxAge: 7,
    category: 'Keluarga',
    title: 'Belajar Naik Sepeda Roda Dua',
    narrative: 'Roda bantu sepedamu sudah dilepas oleh Ayah di halaman rumah.',
    options: [
      { id: 'opt-21a', label: 'Kayuh kencang dan jaga keseimbangan', theme: 'positive', statDeltas: { health: 10, happiness: 15 }, resultLog: 'Kamu berhasil mengayuh tanpa dipegangi lagi!' },
      { id: 'opt-21b', label: 'Takut dan minta roda bantu dipasang lagi', theme: 'passive', statDeltas: { happiness: -5 }, resultLog: 'Ayah tersenyum sabar dan menyemangatimu untuk mencoba esok hari.' },
    ],
  },
  {
    id: 'evt-022',
    minAge: 7,
    maxAge: 9,
    category: 'Sekolah',
    title: 'Bekal Makan Siang Tertukar',
    narrative: 'Kotak bekal makan siangmu tidak sengaja tertukar dengan milik teman sekelas.',
    options: [
      { id: 'opt-22a', label: 'Tukar kembali dengan sopan', theme: 'rational', statDeltas: { relationship: 10 }, resultLog: 'Kalian saling meminta maaf sambil tersipu malu.' },
      { id: 'opt-22b', label: 'Makan saja bekalnya yang berisi ayam kecap', theme: 'rebellious', statDeltas: { happiness: 10, relationship: -5 }, resultLog: 'Bekalnya sangat enak, tapi temanmu cemberut seharian.' },
    ],
  },
  {
    id: 'evt-023',
    minAge: 8,
    maxAge: 10,
    category: 'Dilema',
    title: 'Melihat Teman Dibully',
    narrative: 'Seorang murid pendiam diejek oleh beberapa anak nakal di belakang perpustakaan.',
    options: [
      { id: 'opt-23a', label: 'Laporkan segera ke guru piket', theme: 'rational', statDeltas: { relationship: 15, academic: 5 }, resultLog: 'Guru segera datang melerai. Murid pendiam itu berterima kasih kepadamu.' },
      { id: 'opt-23b', label: 'Bela temanmu secara langsung', theme: 'positive', statDeltas: { health: -5, relationship: 20 }, resultLog: 'Kamu sempat didorong, tapi anak-anak nakal itu akhirnya kabur.' },
      { id: 'opt-23c', label: 'Pura-pura tidak lihat dan jalan terus', theme: 'passive', statDeltas: { happiness: -10 }, resultLog: 'Rasa bersalah terus mengusik pikiranmu.' },
    ],
  },
  {
    id: 'evt-024',
    minAge: 10,
    maxAge: 11,
    category: 'Keluarga',
    title: 'Liburan ke Rumah Nenek',
    narrative: 'Liburan kenaikan kelas kamu diajak menginap di desa tempat tinggal nenek.',
    options: [
      { id: 'opt-24a', label: 'Membantu memetik sayur di kebun', theme: 'positive', statDeltas: { health: 10, relationship: 15 }, resultLog: 'Nenek memasakkan sayur lodeh paling lezat di dunia untukmu.' },
      { id: 'opt-24b', label: 'Menonton TV seharian di dalam rumah', theme: 'passive', statDeltas: { happiness: 5, health: -5 }, resultLog: 'Liburanmu berlalu santai tanpa banyak aktivitas fisik.' },
    ],
  },
  {
    id: 'evt-025',
    minAge: 11,
    maxAge: 11,
    category: 'Sekolah',
    title: 'Wisuda Kelulusan SD',
    narrative: 'Hari pelepasan siswa kelas 6 SD. Seluruh guru dan murid berkumpul menyanyikan lagu perpisahan.',
    options: [
      { id: 'opt-25a', label: 'Foto bersama seluruh guru dan kawan', theme: 'positive', statDeltas: { relationship: 20, happiness: 15 }, resultLog: 'Kenangan masa kecil tersimpan manis dalam album kelulusan.' },
      { id: 'opt-25b', label: 'Fokus persiapkan diri masuk SMP favorit', theme: 'rational', statDeltas: { academic: 15 }, resultLog: 'Kamu bertekad menorehkan prestasi lebih tinggi di jenjang berikutnya.' },
    ],
  },
];
