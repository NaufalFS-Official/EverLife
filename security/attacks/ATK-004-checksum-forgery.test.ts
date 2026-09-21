/**
 * ATK-004: Pemalsuan Checksum Simpanan Lokal (Checksum Forgery)
 * Kategori: STORAGE / CLIENT_LIMITATION
 * Target: SaveService.importFromJson (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { SaveService } from '../../src/storage/SaveService';
import { GameEngine } from '../../src/core/GameEngine';
import { calculateChecksum } from '../../src/contracts/saveSchema';

describe('ATK-004-checksum-forgery', () => {
  it('membuktikan batasan Mode A: penyerang dapat menghitung ulang checksum lokal', async () => {
    const saveService = new SaveService();
    const engine = new GameEngine();
    engine.submitCharacter({ name: 'Hacker Lokal', gender: 'Pria' });

    const session = engine.getState().session!;
    const tamperedPayload = {
      schemaVersion: 1,
      slotId: 1,
      updatedAt: new Date().toISOString(),
      lifeSeed: session.lifeSeed,
      profile: {
        ...session.profile,
        cash: 500000000, // 500 juta rupiah
      },
      stats: session.stats,
      relations: session.relations,
      timelineHistory: session.timelineHistory,
      flags: session.flags,
      isCompleted: session.isCompleted,
    };

    const forgedChecksum = calculateChecksum(tamperedPayload);
    const forgedJson = JSON.stringify({
      ...tamperedPayload,
      checksum: forgedChecksum,
    });

    const imported = saveService.importFromJson(forgedJson);
    expect(imported.profile.cash).toBe(500000000);
  });
});
