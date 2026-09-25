# CHECKLIST VARIABEL LINGKUNGAN (ENV CHECKLIST)

Dokumen ini memverifikasi seluruh variabel lingkungan yang digunakan dalam proyek EverLife sesuai Direktif D7 (`AGENTS.md`).

---

## 1. Arsitektur Mode A (Client-Side Standalone)

EverLife beroperasi pada **Build Mode A (Konektivitas C0)**:
- **Zero Server Secrets**: Game berjalan 100% di peramban klien tanpa API key rahasia, kredensial basis data backend, atau token privat.
- **Prefix Variabel**: Seluruh env var yang dibaca oleh Vite wajib berawalan `VITE_`.

---

## 2. Tabel Registrasi Variabel Lingkungan

| Nama Variabel | Wajib / Opsional | Tipe Data | Nilai Default | Tujuan & Deskripsi | Tervalidasi di Skema |
| --- | --- | --- | --- | --- | --- |
| `VITE_APP_TITLE` | Opsional | `string` | `"EverLife"` | Judul aplikasi pada antarmuka web dan metadata HTML. | `src/shared/envSchema.ts` |
| `VITE_APP_VERSION`| Opsional | `string` | `"1.0.0"` | Nomor versi aplikasi rilis SemVer. | `src/shared/envSchema.ts` |
| `VITE_DEBUG_MODE` | Opsional | `boolean` | `false` | Mengaktifkan hooks debug `window.__game` dan telemetry developer logs. Wajib `false` pada build rilis produksi. | `src/shared/envSchema.ts` |
| `VITE_TELEMETRY_ENDPOINT` | Opsional | `string` | `undefined` (kosong) | URL penampung telemetri jika pengguna mengaktifkan consent. Pada Mode A MVP bernilai kosong (telemetri disimpan lokal). | `src/shared/envSchema.ts` |

---

## 3. Protokol Keamanan & Sanitasi (D7 & D8)

1. **Anti-Leak Secrets**: Berkas `.env` dan file kunci rahasia lokal tidak pernah dimasukkan ke dalam version control (tercantum dalam `.gitignore`).
2. **Pemindai Rahasia Otomatis**: Skrip `npm run detect-secrets` dijalankan pada setiap pipeline CI dan sebelum rilis untuk memastikan 0 temuan private key, AWS token, atau token API.
3. **Penyimpanan Lokal Terenkripsi/Tervalidasi**: Penyimpanan status game lokal (`LocalSaveRepository`) dilindungi salted SHA-256 HMAC checksum untuk mendeteksi manipulasi client-side tanpa membutuhkan server session.
