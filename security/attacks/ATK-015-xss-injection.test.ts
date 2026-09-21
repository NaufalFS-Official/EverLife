/**
 * ATK-015: Injeksi Payload Cross-Site Scripting (XSS) pada Nama Karakter
 * Kategori: INPUT / XSS
 * Target: GameEngine.submitCharacter (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { GameEngine } from '../../src/core/GameEngine';

describe('ATK-015-xss-injection', () => {
  it('harus menangani payload injeksi script HTML secara aman tanpa menyebabkan malfungsi state', () => {
    const engine = new GameEngine();
    const xssPayload = '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
    engine.submitCharacter({ name: xssPayload, gender: 'Wanita' });

    expect(engine.getState().session?.profile.name).toBe(xssPayload);
    // UI React melakukan escaping kontekstual otomatis saat render JSX sehingga mencegah eksploitasi DOM XSS
  });
});
