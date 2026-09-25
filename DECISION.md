# DECISION LOG

| ID | Keputusan | Alasan | Alternatif yang Ditolak |
| --- | --- | --- | --- |
| **DEC-001** | Permadeath Murni (ulang dari usia 0 tahun saat mati) | Menjaga konsekuensi dan bobot pilihan hidup tanpa kompleksitas snapshot time rewind pada MVP. | Fitur "Time Machine" (memutar balik 1-5 tahun ke belakang). |
| **DEC-002** | Slider Atribut Awal Bebas 0-100% (Sandbox Mode) | Sesuai eksplisit CATATAN_TAMBAHAN untuk kebebasan roleplay instan. | Sistem point-buy terbatas (alokasi poin kaku). |
| **DEC-003** | Penundaan Sistem Dinasti Generasi untuk MVP | Memangkas kompleksitas inheritance dan family tree agar siklus hidup satu karakter matang. | Sistem generasi berlanjut sebagai anak kandung. |
| **DEC-004** | Simulasi Karir & Kejahatan Berbasis Teks Murni | Mencegah penambahan engine/physics/canvas aksi refleks yang tidak sesuai genre teks. | Minigame aksi arcade (kabur penjara, kejar-kejaran mobil). |
| **DEC-005** | Injeksi Test ID Eksak (TEST-AC-001 s/d TEST-AC-008) | Memenuhi syarat verifikasi arsitektur dan penelusuran kualitas kode. | Pengujian ad-hoc tanpa penomoran ID. |
| **DEC-006** | Peniadaan Sesi Server & Data Backend | Proyek beroperasi pada Build Mode A / Konektivitas C0 luring 100%. | Penyediaan server Node.js / database PostgreSQL. |
| **DEC-007** | Peniadaan WebSocket & Netcode Autoritatif | Permainan berformat single-player mandiri tanpa interaksi sosial real-time. | Arsitektur multiplayer client-server. |
| **DEC-008** | Konsolidasi Sesi RedTeam & BlueTeam ke Tamper Lokal | Model ancaman Mode A terfokus pada integritas save storage IndexedDB dan validasi batas input. | Uji penetrasi server API / penipuan skor jaringan. |

---

## SELF-HEALING LOG

| [ITEM] | ERROR | AKAR | PERBAIKAN | PENCEGAHAN |
| --- | --- | --- | --- | --- |
| - | - | - | - | - |
