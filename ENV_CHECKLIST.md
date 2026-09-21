# ENV CHECKLIST: EverLife (v1.0-SMA)

Daftar periksa environment variable untuk verifikasi keamanan dan build:

| Variabel | Tipe | Wajib / Opsional | Default | Keterangan |
| :--- | :---: | :---: | :--- | :--- |
| `VITE_APP_TITLE` | `string` | Opsional | `EverLife` | Judul aplikasi pada browser title |
| `VITE_APP_ENV` | `string` | Opsional | `development` | Lingkungan runtime (`development` / `production`) |
| `VITE_APP_VERSION` | `string` | Opsional | `1.0.0` | Nomor rilis SemVer aplikasi klien |

### Kebijakan Keamanan Rahasia (D7 & D8):
1. EverLife beroperasi pada **Skala Small (Mode A — Pure Client Offline)**.
2. Tidak ada API keys, JWT secret, database connection string, maupun secret pihak ketiga.
3. Seluruh variabel berawalan `VITE_` terekspos ke bundel klien, sehingga dilarang keras menempatkan rahasia apa pun di `.env`.
