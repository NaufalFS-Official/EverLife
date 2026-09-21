/**
 * Kumpulan Kartu Kejadian Masa Sekolah Menengah Atas (SMA) (Usia 15 - 18 Tahun).
 * Jumlah: 18 Kartu Event Terkurasi.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import { EventDilemma } from '../contracts/gameEvents';

export const HIGH_EVENTS: readonly EventDilemma[] = [
  {
    id: 'evt-033',
    minAge: 15,
    maxAge: 16,
    category: 'Sekolah',
    title: 'Pemilihan Jurusan IPA atau IPS',
    narrative: 'Tes penjurusan kelas 10 menentukan fokus studimu selama tiga tahun ke depan.',
    options: [
      { id: 'opt-33a', label: 'Pilih MIPA (Fokus Sains & Matematika)', theme: 'rational', statDeltas: { academic: 20, health: -5 }, resultLog: 'Rumus fisika dan biologi mengisi hari-harimu.' },
      { id: 'opt-33b', label: 'Pilih IPS (Fokus Sosial & Ekonomi)', theme: 'positive', statDeltas: { academic: 15, relationship: 15 }, resultLog: 'Kamu mendalami sosiologi dan pergerakan pasar ekonomi.' },
    ],
  },
  {
    id: 'evt-034',
    minAge: 15,
    maxAge: 16,
    category: 'Dilema',
    title: 'Lowongan Barista Paruh Waktu',
    narrative: 'Kedai kopi dekat sekolah membuka lowongan barista kasir sore untuk pelajar berusia 15 tahun ke atas.',
    options: [
      { id: 'opt-34a', label: 'Lamar kerja sore untuk tabungan mandiri', theme: 'positive', statDeltas: { cash: 50000, health: -5, academic: -5 }, resultLog: 'Kamu menerima gaji pertamamu dan belajar meracik kopi.' },
      { id: 'opt-34b', label: 'Fokus belajar penuh di rumah', theme: 'rational', statDeltas: { academic: 15 }, resultLog: 'Waktu belajarmu tidak terganggu oleh jam kerja shift.' },
    ],
  },
  {
    id: 'evt-035',
    minAge: 15,
    maxAge: 17,
    category: 'Keluarga',
    title: 'Izin Mengendarai Sepeda Motor',
    narrative: 'Jarak sekolah cukup jauh dan kamu meminta izin orang tua untuk membawa motor sendiri.',
    options: [
      { id: 'opt-35a', label: 'Ikuti kursus mengemudi dan taati rambu', theme: 'rational', statDeltas: { health: 10, relationship: 10 }, resultLog: 'Orang tua percaya dan membelikan helm berstandar SNI.' },
      { id: 'opt-35b', label: 'Kebut-kebutan konvoi bareng teman', theme: 'rebellious', statDeltas: { health: -15, happiness: 15, relationship: -10 }, resultLog: 'Kamu sempat tergelincir di tikungan dan dimarahi habis-habisan.' },
    ],
  },
  {
    id: 'evt-036',
    minAge: 16,
    maxAge: 17,
    category: 'Dilema',
    title: 'Menembak Gebetan SMA',
    narrative: 'Di akhir festival musik sekolah, kamu berdua duduk di tribun lapangan saat kembang api menyala.',
    options: [
      { id: 'opt-36a', label: 'Ungkapkan perasaan dengan tulus', theme: 'positive', statDeltas: { happiness: 25, relationship: 20 }, resultLog: 'Dia tersenyum manis dan menerima ajakan pacaranmu!' },
      { id: 'opt-36b', label: 'Tetap jadi sahabat karib', theme: 'rational', statDeltas: { relationship: 10 }, resultLog: 'Kalian tertawa bersama menikmati indahnya malam festival.' },
      { id: 'opt-36c', label: 'Diam seribu bahasa karena gugup', theme: 'passive', statDeltas: { happiness: -10 }, resultLog: 'Momen romantis berlalu begitu saja tanpa sepatah kata.' },
    ],
  },
  {
    id: 'evt-037',
    minAge: 16,
    maxAge: 17,
    category: 'Sekolah',
    title: 'Proyek Kelompok Akhir Semester',
    narrative: 'Tugas makalah kimia dibagi ke dalam kelompok, namun salah satu anggota sama sekali tidak mau berkontribusi.',
    options: [
      { id: 'opt-37a', label: 'Kerjakan semuanya sendiri agar nilai sempurna', theme: 'rational', statDeltas: { academic: 20, health: -10 }, resultLog: 'Nilai kelompokmu A+, walau kamu begadang dua malam berturut-turut.' },
      { id: 'opt-37b', label: 'Bicara baik-baik dan bagi beban kerja adil', theme: 'positive', statDeltas: { relationship: 15, academic: 10 }, resultLog: 'Semua anggota tergerak membantu dan tugas selesai tepat waktu.' },
      { id: 'opt-37c', label: 'Coret namanya dari lembar judul laporan', theme: 'rebellious', statDeltas: { academic: 10, relationship: -15 }, resultLog: 'Guru memanggilnya, dan hubungan pertemanan kalian renggang.' },
    ],
  },
  {
    id: 'evt-038',
    minAge: 16,
    maxAge: 18,
    category: 'Kesehatan',
    title: 'Begadang Menjelang Ujian',
    narrative: 'Minggu ujian akhir sekolah tinggal menghitung hari. Kopi hitam terhidang di meja belajar.',
    options: [
      { id: 'opt-38a', label: 'Tidur cukup 7 jam demi konsentrasi prima', theme: 'rational', statDeltas: { health: 15, academic: 10 }, resultLog: 'Pikiranmu tajam dan kamu bisa menjawab soal dengan tenang.' },
      { id: 'opt-38b', label: 'Sistem Kebut Semalam (SKS) sampai jam 4 pagi', theme: 'rebellious', statDeltas: { academic: 15, health: -15, happiness: -10 }, resultLog: 'Kamu hampir tertidur di atas lembar jawaban saat ujian berlangsung.' },
    ],
  },
  {
    id: 'evt-039',
    minAge: 17,
    maxAge: 18,
    category: 'Dilema',
    title: 'Peluang Bisnis Online Remaja',
    narrative: 'Kamu melihat tren jualan merchandise pop culture di media sosial yang sedang naik daun.',
    options: [
      { id: 'opt-39a', label: 'Gunakan tabungan untuk modal jualan', theme: 'positive', statDeltas: { cash: 60000, academic: -5, happiness: 15 }, resultLog: 'Barangmu laris manis dan omzet tokomu meningkat pesat!' },
      { id: 'opt-39b', label: 'Fokuskan seluruh pikiran untuk UTBK', theme: 'rational', statDeltas: { academic: 20 }, resultLog: 'Skor tryout ujian masuk perguruan tinggimu melesat tinggi.' },
    ],
  },
  {
    id: 'evt-040',
    minAge: 17,
    maxAge: 18,
    category: 'Keluarga',
    title: 'Ekspektasi Masa Depan dari Orang Tua',
    narrative: 'Saat makan malam, orang tua mengungkapkan harapan besar agar kamu memilih profesi impian mereka.',
    options: [
      { id: 'opt-40a', label: 'Turuti impian orang tua dengan lapang dada', theme: 'rational', statDeltas: { relationship: 20, happiness: 5 }, resultLog: 'Orang tua tersenyum haru dan siap mendukung penuh studimu.' },
      { id: 'opt-40b', label: 'Jelaskan impian dan rencanamu sendiri', theme: 'positive', statDeltas: { happiness: 20, relationship: 10, academic: 10 }, resultLog: 'Diskusi berjalan hangat dan orang tua memahami jalan pilihanmu.' },
      { id: 'opt-40c', label: 'Debat keras dan banting pintu kamar', theme: 'rebellious', statDeltas: { relationship: -25, happiness: -15 }, resultLog: 'Suasana rumah menjadi dingin dan canggung selama berhari-hari.' },
    ],
  },
  {
    id: 'evt-041',
    minAge: 15,
    maxAge: 17,
    category: 'Acak',
    title: 'Konser Band Idola',
    narrative: 'Band musik favoritmu mengadakan konser perdana di kotamu akhir pekan ini.',
    options: [
      { id: 'opt-41a', label: 'Beli tiket festival dan lompat bersama kawan', theme: 'positive', statDeltas: { cash: -40000, happiness: 25, relationship: 15 }, resultLog: 'Malam terbaik masa remajamu bernyanyi sekuat tenaga.' },
      { id: 'opt-41b', label: 'Nonton cuplikannya saja di internet', theme: 'rational', statDeltas: { happiness: 5 }, resultLog: 'Uang tabunganmu aman tersimpan di dompet.' },
    ],
  },
  {
    id: 'evt-042',
    minAge: 16,
    maxAge: 18,
    category: 'Kesehatan',
    title: 'Latihan Kebugaran di Gym',
    narrative: 'Kawan sebangku mengajakmu mendaftar ke pusat kebugaran untuk melatih otot tubuh.',
    options: [
      { id: 'opt-42a', label: 'Rutin angkat beban 3 kali seminggu', theme: 'positive', statDeltas: { health: 25, happiness: 10, cash: -20000 }, resultLog: 'Bentuk tubuhmu semakin tegap dan rasa percaya dirimu meningkat.' },
      { id: 'opt-42b', label: 'Olahraga lari jogging gratis di taman kota', theme: 'rational', statDeltas: { health: 15, happiness: 10 }, resultLog: 'Paru-parumu sehat tanpa mengeluarkan biaya sepeser pun.' },
    ],
  },
  {
    id: 'evt-043',
    minAge: 17,
    maxAge: 18,
    category: 'Sekolah',
    title: 'Tryout Akbar UTBK Nasional',
    narrative: 'Sekolah mengadakan simulasi tryout ujian masuk perguruan tinggi negeri serentak.',
    options: [
      { id: 'opt-43a', label: 'Kerjakan dengan strategi passing grade', theme: 'rational', statDeltas: { academic: 25, happiness: 10 }, resultLog: 'Skormu menembus passing grade program studi incaranmu!' },
      { id: 'opt-43b', label: 'Tembak kancing saat soal matematika rumit', theme: 'rebellious', statDeltas: { academic: -5, happiness: 5 }, resultLog: 'Hasil analisismu menunjukkan perlunya belajar lebih giat lagi.' },
    ],
  },
  {
    id: 'evt-044',
    minAge: 15,
    maxAge: 17,
    category: 'Dilema',
    title: 'Teman Terlibat Masalah Rokok / Vape',
    narrative: 'Di warung belakang sekolah, seorang kawan menawarimu mencoba hisapan vape rokok elektrik.',
    options: [
      { id: 'opt-44a', label: 'Tolak tegas demi menjaga paru-paru', theme: 'rational', statDeltas: { health: 15, relationship: -5 }, resultLog: 'Kamu menjaga integritas kesehatan diri meski sedikit diejek.' },
      { id: 'opt-44b', label: 'Ikut mencoba agar dianggap gaul', theme: 'rebellious', statDeltas: { health: -20, happiness: 5, relationship: 10 }, resultLog: 'Tenggorokanmu perih dan kamu terbatuk-batuk hebat.' },
    ],
  },
  {
    id: 'evt-045',
    minAge: 16,
    maxAge: 18,
    category: 'Keluarga',
    title: 'Keluarga Menghadapi Krisis Keuangan',
    narrative: 'Pekerjaan orang tua mengalami penurunan pendapatan yang cukup signifikan tahun ini.',
    options: [
      { id: 'opt-45a', label: 'Hemat uang jajan dan bantu cari penghasilan', theme: 'positive', statDeltas: { relationship: 25, happiness: 10, cash: 15000 }, resultLog: 'Orang tua menangis bangga atas kedewasaan sikapmu.' },
      { id: 'opt-45b', label: 'Tetap meminta uang untuk nongkrong di kafe', theme: 'rebellious', statDeltas: { relationship: -25, happiness: -15 }, resultLog: 'Pertengkaran di meja makan tak terelakkan.' },
    ],
  },
  {
    id: 'evt-046',
    minAge: 17,
    maxAge: 18,
    category: 'Dilema',
    title: 'Tawaran Joki Tugas Sekolah',
    narrative: 'Seorang teman dari keluarga berada menawarimu Rp 50.000 untuk mengerjakan tugas portofolionya.',
    options: [
      { id: 'opt-46a', label: 'Terima tawaran joki demi uang saku', theme: 'rebellious', statDeltas: { cash: 50000, academic: -10, relationship: 5 }, resultLog: 'Uang bertambah, namun integritas akademikmu ternoda.' },
      { id: 'opt-46b', label: 'Tolak jokinya, tapi ajari dia mengerjakannya', theme: 'positive', statDeltas: { relationship: 20, academic: 15 }, resultLog: 'Dia memahami materi dan sangat menghormatimu.' },
    ],
  },
  {
    id: 'evt-047',
    minAge: 18,
    maxAge: 18,
    category: 'Sekolah',
    title: 'Foto Buku Tahunan Sekolah (Buku Kenangan)',
    narrative: 'Sesi pemotretan buku kenangan kelas 12 dengan tema busana retro elegan di studio foto.',
    options: [
      { id: 'opt-47a', label: 'Tampil necis dengan busana terbaik', theme: 'positive', statDeltas: { happiness: 20, relationship: 15, cash: -25000 }, resultLog: 'Foto profilmu terpilih sebagai salah satu pose terbaik di angkatan.' },
      { id: 'opt-47b', label: 'Pakai seragam OSIS biasa yang bersahaja', theme: 'rational', statDeltas: { happiness: 10 }, resultLog: 'Penampilanmu klasik dan otentik.' },
    ],
  },
  {
    id: 'evt-048',
    minAge: 18,
    maxAge: 18,
    category: 'Kesehatan',
    title: 'Stres Menunggu Hasil Pengumuman Kelulusan',
    narrative: 'Malam sebelum pengumuman kelulusan SMA dibuka di portal online sekolah.',
    options: [
      { id: 'opt-48a', label: 'Berdoa khusyuk dan berserah diri', theme: 'rational', statDeltas: { happiness: 15, health: 10 }, resultLog: 'Hatimu menjadi tenang dan siap menerima apa pun hasilnya.' },
      { id: 'opt-48b', label: 'Panik tak karuan dan tidak bisa tidur', theme: 'passive', statDeltas: { health: -10, happiness: -10 }, resultLog: 'Kamu membolak-balik bantal hingga fajar menyingsing.' },
    ],
  },
  {
    id: 'evt-049',
    minAge: 18,
    maxAge: 18,
    category: 'Dilema',
    title: 'Pesta Perpisahan Angkatan (Prom Night)',
    narrative: 'Malam perpisahan angkatan sekolah diadakan di aula hotel dengan musik dansa.',
    options: [
      { id: 'opt-49a', label: 'Dansa dan ucapkan terima kasih ke semua kawan', theme: 'positive', statDeltas: { happiness: 25, relationship: 25 }, resultLog: 'Malam penuh tawa, tangis bahagia, dan pelukan perpisahan.' },
      { id: 'opt-49b', label: 'Menepi dan nikmati hidangan penutup manis', theme: 'rational', statDeltas: { happiness: 15 }, resultLog: 'Kue cokelat dan es krim pesta terasa luar biasa nikmat.' },
    ],
  },
  {
    id: 'evt-050',
    minAge: 18,
    maxAge: 18,
    category: 'Sekolah',
    title: 'Upacara Wisuda & Kelulusan Tamat SMA',
    narrative: 'Toga dan selempang kelulusan telah kamu kenakan. Nama lengkapmu dipanggil ke atas panggung.',
    options: [
      { id: 'opt-50a', label: 'Langkah maju dengan kepala tegak menyambut masa depan', theme: 'positive', statDeltas: { happiness: 30, academic: 20, relationship: 20 }, resultLog: 'Ijazah SMA resmi berada di genggamanmu. Perjalanan kedewasaan baru saja dimulai!' },
      { id: 'opt-50b', label: 'Peluk kedua orang tua dengan air mata syukur', theme: 'rational', statDeltas: { relationship: 30, happiness: 25 }, resultLog: 'Orang tuamu tersenyum bangga: anak tercinta telah menuntaskan masa sekolahnya.' },
    ],
  },
];
