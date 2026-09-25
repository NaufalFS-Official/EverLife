import { describe, it, expect } from 'vitest';
import { validateEnv } from '../../src/config/envSchema';

describe('Smoke Test - Project Foundation Setup', () => {
  it('harus memvalidasi default environment schema dengan benar', () => {
    const config = validateEnv();
    expect(config.appTitle).toBe('EverLife');
    expect(config.appVersion).toBe('1.0.0');
    expect(config.debugMode).toBe(false);
  });
});
