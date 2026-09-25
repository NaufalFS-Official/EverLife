/**
 * RED TEAM ATTACK SUITE: SAVE & STORAGE TAMPER
 * Target: Localhost in-process memory runtime
 * Payloads: ATK-012 s/d ATK-016
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LocalSaveRepository } from '../../src/adapter/localAdapter';
import { createNewLife } from '../../src/core/character';
import { createSaveEnvelope } from '../../src/shared';

describe('RED TEAM: Save & Storage Tamper (ATK-012 s/d ATK-016)', () => {
  let repo: LocalSaveRepository;

  beforeEach(() => {
    repo = new LocalSaveRepository();
  });

  it('[ATK-012-SAVE] Modifikasi saldo tanpa update checksum HMAC SHA-256', async () => {
    const state = createNewLife({ firstName: 'Tamper', lastName: 'Checksum', gender: 'Male' });
    const envelope = createSaveEnvelope(state);

    // Attacker modifies balance directly in envelope payload
    envelope.payload.character.finances.bankBalance = 999999999;
    const tamperedPayload = JSON.stringify(envelope);

    const result = await repo.importPayload(tamperedPayload);
    console.log('[ATK-012-SAVE RAW RESP] Import tampered checksum result:', result);
    expect(result).toBe(false); // BLOCKED-OK: HMAC checksum mismatch detected
  });

  it('[ATK-013-SAVE] Pemalsuan checksum dengan salt acak sembarang', async () => {
    const state = createNewLife({ firstName: 'Fake', lastName: 'Salt', gender: 'Male' });
    const envelope = {
      schemaVersion: 1,
      timestamp: Date.now(),
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // arbitrary hash
      payload: state,
    };

    const result = await repo.importPayload(JSON.stringify(envelope));
    console.log('[ATK-013-SAVE RAW RESP] Import fake salt checksum result:', result);
    expect(result).toBe(false); // BLOCKED-OK: Invalid signature rejected
  });

  it('[ATK-014-SAVE] Injeksi raw corrupted non-JSON string', async () => {
    const rawGarbage = '<<<INVALID_CORRUPTED_RAW_STORAGE_BYTES_0x000xFF>>>';
    const result = await repo.importPayload(rawGarbage);
    console.log('[ATK-014-SAVE RAW RESP] Import non-JSON result:', result);
    expect(result).toBe(false); // BLOCKED-OK: Caught SyntaxError
  });

  it('[ATK-015-SAVE] Schema version spoofing (schemaVersion: 999)', async () => {
    const state = createNewLife({ firstName: 'Spoof', lastName: 'Version', gender: 'Male' });
    const envelope = {
      schemaVersion: 999,
      timestamp: Date.now(),
      checksum: 'abc',
      payload: state,
    };

    const result = await repo.importPayload(JSON.stringify(envelope));
    console.log('[ATK-015-SAVE RAW RESP] Import schemaVersion 999 result:', result);
    expect(result).toBe(false); // BLOCKED-OK: Schema version rejected
  });

  it('[ATK-016-SAVE] Truncated / Unclosed JSON string', async () => {
    const truncated = '{"schemaVersion":1,"timestamp":123456789,"checksum":"abc","payload":{"character":{"name":{"first":"Tr';
    const result = await repo.importPayload(truncated);
    console.log('[ATK-016-SAVE RAW RESP] Import truncated JSON result:', result);
    expect(result).toBe(false); // BLOCKED-OK: Truncated JSON safely rejected
  });
});
