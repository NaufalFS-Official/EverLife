/**
 * Kumpulan Kartu Kejadian Masa Balita (Usia 0 - 5 Tahun).
 * Jumlah: 7 Kartu Event Terkurasi.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { EventDilemma } from '../contracts/gameEvents';

export const TODDLER_EVENTS: readonly EventDilemma[] = [
  {
    id: 'evt-001',
    minAge: 1,
    maxAge: 2,
    category: 'Keluarga',
    title: 'Langkah Pertama',
    narrative: 'Kamu mulai bisa berdiri dan ingin mencoba melangkah. Ke mana tujuan pertamamu?',
    options: [
      { id: 'opt-1a', label: 'Menuju pelukan Ibu', theme: 'positive', statDeltas: { happiness: 10, relationship: 10 }, resultLog: 'Ibu tersenyum bangga melihatmu melangkah mantap.' },
      { id: 'opt-1b', label: 'Mengejar kucing tetangga', theme: 'rebellious', statDeltas: { health: -5, happiness: 10 }, resultLog: 'Kamu terjatuh di rumput tapi tertawa gembira.' },
      { id: 'opt-1c', label: 'Duduk diam menunggu disuapi', theme: 'passive', statDeltas: { health: 5 }, resultLog: 'Kamu memilih bersantai di atas karpet empuk.' },
    ],
  },
  {
    id: 'evt-002',
    minAge: 1,
    maxAge: 3,
    category: 'Kesehatan',
    title: 'Jadwal Imunisasi',
    narrative: 'Ibu membawamu ke puskesmas untuk imunisasi berkala. Jarum suntik sudah terlihat.',
    options: [
      { id: 'opt-2a', label: 'Menangis sekencang-kencangnya', theme: 'rebellious', statDeltas: { happiness: -10, health: 15 }, resultLog: 'Ruang suntik geger, tapi tubuhmu menjadi kebal dari infeksi.' },
      { id: 'opt-2b', label: 'Menahan tangis dengan berani', theme: 'rational', statDeltas: { health: 15, relationship: 5 }, resultLog: 'Dokter memberimu permen kecil karena bersikap tenang.' },
    ],
  },
  {
    id: 'evt-003',
    minAge: 2,
    maxAge: 4,
    category: 'Dilema',
    title: 'Tembok Ruang Tamu',
    narrative: 'Kamu menemukan krayon merah di lantai saat orang tua sedang sibuk di dapur.',
    options: [
      { id: 'opt-3a', label: 'Gambar mahakarya di dinding', theme: 'rebellious', statDeltas: { happiness: 15, relationship: -10 }, resultLog: 'Dinding ruang tamu penuh coretan seni abstrak.' },
      { id: 'opt-3b', label: 'Beri krayon ke Ayah', theme: 'positive', statDeltas: { relationship: 10, academic: 5 }, resultLog: 'Ayah membelikanmu buku gambar khusus.' },
      { id: 'opt-3c', label: 'Coba gigit krayonnya', theme: 'passive', statDeltas: { health: -5 }, resultLog: 'Rasanya tidak enak sama sekali. Lidahmu merah berhari-hari.' },
    ],
  },
  {
    id: 'evt-004',
    minAge: 3,
    maxAge: 5,
    category: 'Keluarga',
    title: 'Mangkuk Sayur Hijau',
    narrative: 'Ibu menyajikan sepiring sup brokoli hijau untuk makan siangmu.',
    options: [
      { id: 'opt-4a', label: 'Habiskan tanpa sisa', theme: 'positive', statDeltas: { health: 15, relationship: 5 }, resultLog: 'Tubuhmu terasa segar dan kuat.' },
      { id: 'opt-4b', label: 'Sembunyikan brokoli di bawah meja', theme: 'rebellious', statDeltas: { health: -5, happiness: 5 }, resultLog: 'Kucing rumah tampak bingung menatap brokoli itu.' },
      { id: 'opt-4c', label: 'Tawar minta telur goreng', theme: 'rational', statDeltas: { relationship: 5 }, resultLog: 'Ibu setuju asal kamu tetap mencicipi sebutir wortel.' },
    ],
  },
  {
    id: 'evt-005',
    minAge: 3,
    maxAge: 5,
    category: 'Acak',
    title: 'Berebut Mainan Balok',
    narrative: 'Di taman bermain, anak tetangga merebut balok kayu yang sedang kamu susun.',
    options: [
      { id: 'opt-5a', label: 'Rebut kembali dan dorong', theme: 'rebellious', statDeltas: { relationship: -10, happiness: 5 }, resultLog: 'Kalian berdua saling melotot sambil dilerai orang tua.' },
      { id: 'opt-5b', label: 'Ajak main bareng buat kastel', theme: 'positive', statDeltas: { relationship: 15, academic: 5 }, resultLog: 'Kalian menjadi teman akrab di taman.' },
      { id: 'opt-5c', label: 'Menangis mengadu ke Ibu', theme: 'passive', statDeltas: { happiness: -5, relationship: 5 }, resultLog: 'Ibu memelukmu dan meminjamkan mainan lain.' },
    ],
  },
  {
    id: 'evt-006',
    minAge: 4,
    maxAge: 5,
    category: 'Sekolah',
    title: 'Hari Pertama PAUD / TK',
    narrative: 'Kamu memasuki gerbang sekolah taman kanak-kanak. Banyak anak yang menangis.',
    options: [
      { id: 'opt-6a', label: 'Masuk dengan riang gembira', theme: 'positive', statDeltas: { happiness: 10, academic: 10 }, resultLog: 'Ibu guru memujimu sebagai murid paling mandiri.' },
      { id: 'opt-6b', label: 'Pegang erat kaki Ibu', theme: 'passive', statDeltas: { relationship: 5, academic: -5 }, resultLog: 'Ibu terpaksa menunggu di luar jendela kelas sepanjang hari.' },
      { id: 'opt-6c', label: 'Langsung cari mainan ayunan', theme: 'rebellious', statDeltas: { health: 10, happiness: 10 }, resultLog: 'Kamu bermain ayunan hingga bel tanda masuk berbunyi.' },
    ],
  },
  {
    id: 'evt-007',
    minAge: 5,
    maxAge: 6,
    category: 'Keluarga',
    title: 'Menghitung Uang Logam',
    narrative: 'Ayah mengeluarkan dompet koin dan mengajarimu mengenal nilai rupiah.',
    options: [
      { id: 'opt-7a', label: 'Belajar dengan antusias', theme: 'rational', statDeltas: { academic: 15, relationship: 10 }, resultLog: 'Kamu bisa membedakan uang koin dan kertas dengan cepat.' },
      { id: 'opt-7b', label: 'Minta semua koinnya untuk ditabung', theme: 'positive', statDeltas: { cash: 5000, happiness: 10 }, resultLog: 'Celengan ayammu berdenting makin berat.' },
    ],
  },
];
