/**
 * Skema validasi variabel lingkungan klien EverLife.
 * Sesuai Direktif D7: Setiap env var ada di env-schema + .env.example + ENV_CHECKLIST.md.
 */
export interface ClientEnv {
  VITE_APP_TITLE: string;
  VITE_APP_ENV: 'development' | 'production' | 'test';
  VITE_APP_VERSION: string;
}

export function getClientEnv(): ClientEnv {
  return {
    VITE_APP_TITLE: import.meta.env['VITE_APP_TITLE'] || 'EverLife',
    VITE_APP_ENV: (import.meta.env['VITE_APP_ENV'] as ClientEnv['VITE_APP_ENV']) || 'development',
    VITE_APP_VERSION: import.meta.env['VITE_APP_VERSION'] || '1.0.0',
  };
}
