/**
 * RED TEAM ATTACK SUITE: INPUT VALIDATION & XSS
 * Target: Localhost in-process memory runtime
 * Payloads: ATK-017 s/d ATK-020
 */

import { describe, it, expect } from 'vitest';
import { createNewLife } from '../../src/core/character';

describe('RED TEAM: Input Validation & Injection (ATK-017 s/d ATK-020)', () => {
  it('[ATK-017-INPUT] Stored XSS Script Tag pada nama depan (<script>alert(1)</script>)', () => {
    const xssPayload = '<script>alert(1)</script>';
    const state = createNewLife({ firstName: xssPayload, lastName: 'Attacker', gender: 'Male' });

    console.log('[ATK-017-INPUT RAW RESP] Stored firstName:', state.character.name.first);

    // VULNERABILITY AUDIT: The raw string is preserved verbatim without HTML entity stripping.
    // In React DOM it is rendered as textNode (safe from direct DOM XSS), but raw string is unsanitized.
    expect(state.character.name.first).toBe(xssPayload);
  });

  it('[ATK-018-INPUT] Stored XSS SVG/Img Tag pada nama belakang (<img src=x onerror=alert(1)>)', () => {
    const imgPayload = '<img src=x onerror=alert(document.cookie)>';
    const state = createNewLife({ firstName: 'Victim', lastName: imgPayload, gender: 'Male' });

    console.log('[ATK-018-INPUT RAW RESP] Stored lastName:', state.character.name.last);
    expect(state.character.name.last).toBe(imgPayload);
  });

  it('[ATK-019-INPUT] String panjang ekstrem / Buffer bloat (10.000 karakter)', () => {
    const hugeString = 'A'.repeat(10000);
    const state = createNewLife({ firstName: hugeString, lastName: 'Overflow', gender: 'Male' });

    console.log('[ATK-019-INPUT RAW RESP] Accepted name length:', state.character.name.first.length, 'BirthLog length:', state.character.lifeLog[0]?.text.length);

    // VULNERABILITY AUDIT: createNewLife has NO max-length validation!
    // A 10,000-character name is stored in state, bloating lifeLog and localStorage.
    expect(state.character.name.first.length).toBe(10000);
  });

  it('[ATK-020-INPUT] Prototype Pollution via JSON payload (__proto__ injection)', () => {
    const maliciousJson = '{"schemaVersion":1,"__proto__":{"isAdminPolluted":true}}';
    const parsed = JSON.parse(maliciousJson);

    console.log('[ATK-020-INPUT RAW RESP] Object prototype polluted:', ({} as Record<string, unknown>)['isAdminPolluted']);

    // Standard JSON.parse in modern V8 does not mutate Object.prototype via __proto__ property
    expect(({} as Record<string, unknown>)['isAdminPolluted']).toBeUndefined(); // BLOCKED-OK
  });
});
