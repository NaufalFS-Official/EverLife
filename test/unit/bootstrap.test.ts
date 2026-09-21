import { describe, it, expect } from 'vitest';
import { getClientEnv } from '../../src/contracts/envSchema';

describe('Bootstrap Environment & Canvas', () => {
  it('harus memuat konfigurasi environment klien yang valid', () => {
    const env = getClientEnv();
    expect(env.VITE_APP_TITLE).toBe('EverLife');
    expect(env.VITE_APP_VERSION).toBe('1.0.0');
    expect(['development', 'production', 'test']).toContain(env.VITE_APP_ENV);
  });
});
