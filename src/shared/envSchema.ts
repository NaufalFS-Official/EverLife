/**
 * CLIENT ENVIRONMENT SCHEMA CONTRACT
 * Validasi variabel lingkungan untuk runtime web client-side (Mode A).
 */

export interface ClientEnvConfig {
  appTitle: string;
  appVersion: string;
  debugMode: boolean;
  telemetryEndpoint?: string;
}

export function validateEnv(rawEnv: Record<string, string | undefined> = {}): ClientEnvConfig {
  const envSource = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : rawEnv;

  return {
    appTitle: typeof envSource.VITE_APP_TITLE === 'string' && envSource.VITE_APP_TITLE.length > 0 ? envSource.VITE_APP_TITLE : 'EverLife',
    appVersion: typeof envSource.VITE_APP_VERSION === 'string' && envSource.VITE_APP_VERSION.length > 0 ? envSource.VITE_APP_VERSION : '1.0.0',
    debugMode: envSource.VITE_DEBUG_MODE === 'true',
    telemetryEndpoint: typeof envSource.VITE_TELEMETRY_ENDPOINT === 'string' && envSource.VITE_TELEMETRY_ENDPOINT.length > 0 ? envSource.VITE_TELEMETRY_ENDPOINT : undefined,
  };
}
