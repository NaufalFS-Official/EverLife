# KEBIJAKAN PRIVASI (PRIVACY POLICY) — EVERLIFE

> **DRAF DOKUMEN HUKUM**  
> *Pemberitahuan Penting: Dokumen ini merupakan draf operasional yang disusun untuk rilis publik perangkat lunak EverLife. Dokumen ini memerlukan peninjauan oleh penasihat hukum manusia berkualifikasi dan bukan merupakan nasihat hukum formal.*  
> **Tanggal Efektif**: 26 September 2026  
> **Versi**: 1.0.0-rc.1  

---

## 1. Ikhtisar & Prinsip Zero-PII
EverLife ("kami", "aplikasi", atau "game") adalah permainan simulasi kehidupan berbasis teks yang dibangun dengan arsitektur **Mode A (Client-Side Mandiri / Konektivitas C0)**. Prinsip utama kami adalah perlindungan privasi mutlak: **Zero Personal Identifiable Information (Zero-PII)**.

Kami **TIDAK MENGUMPULKAN**, **TIDAK MENYIMPAN**, dan **TIDAK MENGIRIMKAN** data identitas pribadi Anda (seperti nama asli, alamat email, nomor telepon, alamat IP, atau geolokasi perangkat) ke server mana pun.

---

## 2. Penyimpanan Data Lokal (Local Storage & IndexedDB)
Seluruh data permainan (progres karakter, atribut, riwayat hidup, saldo game, dan pengaturan tampilan) disimpan secara eksklusif pada penyimpanan lokal peramban (*browser local storage*) Anda:
1. **IndexedDB (`everlife_save_db`)**: Menyimpan snapshot status permainan aktif yang diamankan dengan enkripsi checksum HMAC-SHA-256 lokal untuk mencegah korupsi data.
2. **LocalStorage**: Menyimpan preferensi audio, preferensi *reduced motion*, dan cadangan darurat (*fallback storage*).

Data ini berada 100% di bawah kendali Anda. Anda dapat menghapus seluruh data ini kapan saja melalui menu Pengaturan Permainan (*Reset Life*) atau dengan menghapus data situs/cache pada peramban web Anda.

---

## 3. Telemetri & Analitik (Opt-In Anonim)
Sesuai PRD §13.4:
- Telemetri hanya aktif jika Anda memberikan persetujuan eksplisit (*Opt-In Consent*).
- Data yang dikumpulkan bersifat anonim murni (misal: *seed* permainan, kelompok usia karakter saat wafat, atau pilihan karir).
- Tidak ada kuki pelacak (*tracking cookies*) pihak ketiga, tag iklan tertanam, atau sidik jari perangkat (*device fingerprinting*).

---

## 4. Batasan Usia Pengguna (COPPA & GDPR Compliance)
EverLife dirancang untuk pengguna berusia **16 tahun ke atas** karena memuat tema satirikal kedewasaan, simulasi kejahatan fiksi, dan drama sosial. Kami tidak secara sengaja menargetkan atau mengumpulkan data dari anak-anak di bawah usia 13 tahun (mematuhi ketentuan *Children's Online Privacy Protection Act* / COPPA).

---

## 5. Hak Pengguna atas Data
Sesuai prinsip GDPR (*General Data Protection Regulation*):
- **Hak Akses & Portabilitas**: Anda dapat mengekspor seluruh rekaman data permainan Anda ke dalam format file JSON kapan saja melalui menu *Export Save*.
- **Hak Penghapusan (Right to be Forgotten)**: Anda dapat menghapus seketika seluruh rekaman permainan melalui tombol *Clear Data* di aplikasi atau menghapus penyimpanan peramban.

---

## 6. Kontak Pengembang
Untuk pertanyaan, masukan teknis, atau klarifikasi mengenai privasi ini, silakan hubungi tim pemelihara repositori open-source EverLife melalui halaman issue resmi di GitHub.
