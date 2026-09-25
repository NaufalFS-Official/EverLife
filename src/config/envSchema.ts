/**
 * Skema validasi variabel lingkungan untuk EverLife (Mode A).
 * Memastikan tidak ada token/rahasia yang bocor ke bundle client-side.
 */
export interface ClientEnvConfig {
  appTitle: string;
  appVersion: string;
  debugMode: boolean;
  telemetryEndpoint?: string;
}

export function validateEnv(): ClientEnvConfig {
  const env = import.meta.env;

  return {
    appTitle: typeof env.VITE_APP_TITLE === 'string' && env.VITE_APP_TITLE.length > 0 ? env.VITE_APP_TITLE : 'EverLife',
    appVersion: typeof env.VITE_APP_VERSION === 'string' && env.VITE_APP_VERSION.length > 0 ? env.VITE_APP_VERSION : '1.0.0',
    debugMode: env.VITE_DEBUG_MODE === 'true',
    telemetryEndpoint: typeof env.VITE_TELEMETRY_ENDPOINT === 'string' ? env.VITE_TELEMETRY_ENDPOINT : undefined,
  };
}
