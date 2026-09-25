# ENV CHECKLIST

> Catatan: EverLife beroperasi pada Build Mode A / Konektivitas C0 (Client-Side murni). Tidak ada secret token atau database credential yang dibutuhkan di runtime klien.

| Variabel | Grup | Wajib | Contoh | Catatan |
| --- | --- | --- | --- | --- |
| `VITE_APP_TITLE` | Build / App | Tidak | `EverLife` | Judul aplikasi di HTML header |
| `VITE_APP_VERSION` | Build / App | Tidak | `1.0.0` | Versi SemVer aplikasi |
| `VITE_DEBUG_MODE` | Debug / Dev | Tidak | `true` | Mengaktifkan hooks debug `window.__game` secara otomatis di development |
| `VITE_TELEMETRY_ENDPOINT` | Analytics | Tidak | `https://telemetry.example.com/collect` | Endpoint opt-in telemetri anonim (jika aktif) |
