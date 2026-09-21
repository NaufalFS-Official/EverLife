/**
 * ATK-011: Interaksi Sosial Terhadap Entitas Ghost NPC
 * Kategori: SOCIAL / NPC
 * Target: RelationEngine.interact (Lokal)
 */

import { describe, it, expect } from 'vitest';
import { RelationEngine } from '../../src/core/RelationEngine';

describe('ATK-011-ghost-npc', () => {
  it('harus menolak interaksi sosial dengan target NPC yang tidak terdaftar', () => {
    const family = RelationEngine.createInitialFamily();
    expect(() =>
      RelationEngine.interact({
        relations: family,
        targetId: 'npc-ghost-999',
        actionType: 'chat',
        currentCash: 10000,
      })
    ).toThrow(/ERR_RELATION_NOT_FOUND/);
  });
});
