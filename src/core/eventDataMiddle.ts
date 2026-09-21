/**
 * Kumpulan Kartu Kejadian Masa Sekolah Menengah Pertama (SMP) (Usia 12 - 14 Tahun).
 * Jumlah: 7 Kartu Event Terkurasi.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { EventDilemma } from '../contracts/gameEvents';

export const MIDDLE_EVENTS: readonly EventDilemma[] = [
  {
    id: 'evt-026',
    minAge: 12,
    maxAge: 13,
    category: 'Sekolah',
    title: 'Masa Orientasi Siswa (MOS)',
    narrative: 'Senior OSIS memberikan berbagai tugas unik dan teka-teki makanan di hari pertama masuk SMP.',
    options: [
      { id: 'opt-26a', label: 'Bawakan semua perlengkapan dengan tertib', theme: 'rational', statDeltas: { academic: 10, relationship: 10 }, resultLog: 'Senior memujimu sebagai siswa baru paling disiplin.' },
      { id: 'opt-26b', label: 'Bikin lelucon saat disuruh orasi di depan', theme: 'rebellious', statDeltas: { happiness: 15, relationship: 15 }, resultLog: 'Satu angkatan tertawa dan kamu langsung populer.' },
      { id: 'opt-26c', label: 'Bersembunyi di toilet sampai jam istirahat', theme: 'passive', statDeltas: { happiness: -5, academic: -5 }, resultLog: 'Kamu terhindar dari tugas, tapi tidak mengenal kawan baru.' },
    ],
  },
  {
    id: 'evt-027',
    minAge: 12,
    maxAge: 13,
    category: 'Keluarga',
    title: 'Ponsel Pintar Pertama',
    narrative: 'Untuk mempermudah koordinasi tugas sekolah, orang tua membelikanmu smartphone sederhana.',
    options: [
      { id: 'opt-27a', label: 'Gunakan bijak untuk belajar dan komunikasi', theme: 'rational', statDeltas: { academic: 15, relationship: 10 }, resultLog: 'Tugas-tugas kelompok terselesaikan dengan cepat.' },
      { id: 'opt-27b', label: 'Unduh game online dan mabar sampai larut', theme: 'rebellious', statDeltas: { happiness: 20, health: -10, academic: -10 }, resultLog: 'Peringkat rank game naik drastis, tapi kantung matamu menghitam.' },
    ],
  },
  {
    id: 'evt-028',
    minAge: 13,
    maxAge: 14,
    category: 'Dilema',
    title: 'Surat Rahasia Cinta Monyet',
    narrative: 'Di dalam laci mejamu terselip surat bertuliskan pesan manis dari seorang teman sekelas.',
    options: [
      { id: 'opt-28a', label: 'Balas dengan tulisan sopan dan berteman', theme: 'positive', statDeltas: { happiness: 15, relationship: 15 }, resultLog: 'Kalian menjadi teman curhat yang sangat akrab.' },
      { id: 'opt-28b', label: 'Fokus sekolah dan tolak dengan halus', theme: 'rational', statDeltas: { academic: 10 }, resultLog: 'Kamu memilih mengutamakan target nilai raport.' },
      { id: 'opt-28c', label: 'Tunjukkan suratnya ke seluruh teman kelas', theme: 'rebellious', statDeltas: { relationship: -20, happiness: -5 }, resultLog: 'Temanmu menangis malu. Kawan-kawan menganggapmu tidak punya empati.' },
    ],
  },
  {
    id: 'evt-029',
    minAge: 13,
    maxAge: 14,
    category: 'Kesehatan',
    title: 'Turnamen Futsal / Basket Antar-Kelas',
    narrative: 'Kelasmu membutuhkan satu pemain kunci untuk pertandingan final class-meeting.',
    options: [
      { id: 'opt-29a', label: 'Bermain habis-habisan demi kelas', theme: 'positive', statDeltas: { health: 15, happiness: 15, relationship: 15 }, resultLog: 'Tendanganmu mencetak gol penentu kemenangan juara 1!' },
      { id: 'opt-29b', label: 'Menjadi supporter heboh di pinggir lapangan', theme: 'positive', statDeltas: { relationship: 10, happiness: 10 }, resultLog: 'Suaramu habis bersorak, namun semangat tim terbakar membara.' },
    ],
  },
  {
    id: 'evt-030',
    minAge: 13,
    maxAge: 14,
    category: 'Dilema',
    title: 'Ajakan Bolos Pelajaran Kimia',
    narrative: 'Beberapa kawan mengajakmu melompati pagar belakang sekolah saat pelajaran yang membosankan.',
    options: [
      { id: 'opt-30a', label: 'Tolak tegas dan tetap di dalam kelas', theme: 'rational', statDeltas: { academic: 15, relationship: -5 }, resultLog: 'Guru mencatat kehadiranmu. Anak-anak yang bolos tertangkap satpam.' },
      { id: 'opt-30b', label: 'Ikut memanjat pagar ke rental PS', theme: 'rebellious', statDeltas: { happiness: 15, academic: -15, relationship: -10 }, resultLog: 'Orang tuamu dipanggil ke ruang BP keesokan harinya.' },
    ],
  },
  {
    id: 'evt-031',
    minAge: 14,
    maxAge: 14,
    category: 'Sekolah',
    title: 'Pemilihan Pengurus OSIS',
    narrative: 'Musyawarah perwakilan kelas membuka pendaftaran calon wakil ketua OSIS.',
    options: [
      { id: 'opt-31a', label: 'Daftarkan diri dan buat visi misi', theme: 'positive', statDeltas: { academic: 15, relationship: 20 }, resultLog: 'Kamu terpilih dan belajar memimpin berbagai acara sekolah.' },
      { id: 'opt-31b', label: 'Dukung sahabatmu dalam kampanye', theme: 'rational', statDeltas: { relationship: 15 }, resultLog: 'Sahabatmu terpilih berkat kerja keras tim suksesmu.' },
    ],
  },
  {
    id: 'evt-032',
    minAge: 14,
    maxAge: 15,
    category: 'Sekolah',
    title: 'Kelulusan SMP & Pilihan SMA',
    narrative: 'Nilai ujian SMP keluar. Kini saatnya mendaftar ke SMA Negeri unggulan atau SMK favorit.',
    options: [
      { id: 'opt-32a', label: 'Pilih SMA Negeri jalur prestasi', theme: 'rational', statDeltas: { academic: 20, happiness: 10 }, resultLog: 'Namamu tercantum di urutan atas penerimaan siswa baru.' },
      { id: 'opt-32b', label: 'Pilih SMK Jurusan Teknologi / Keahlian', theme: 'positive', statDeltas: { academic: 15, cash: 10000 }, resultLog: 'Kamu mulai mempelajari keahlian praktis yang langsung terpakai.' },
    ],
  },
];
