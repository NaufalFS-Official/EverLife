import { describe, it, expect } from 'vitest';
import {
  spendTimeWithNPC,
  giveGiftToNPC,
  addFriend,
  processAnnualRelationships,
} from '../../src/core/relationships';
import { createNewLife } from '../../src/core/character';
import { Mulberry32PRNG } from '../../src/shared';

describe('TEST-AC-006: NPC Relationship System & Social Dynamics', () => {
  it('harus meningkatkan bar relasi dan happiness saat spend time', () => {
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      seed: 42,
    });

    const father = state.character.relationships[0]!;
    const prevBar = father.relationshipBar;
    const prevHappy = state.character.attributes.happiness;

    const res = spendTimeWithNPC(state, father.id);
    expect(res.success).toBe(true);
    expect(father.relationshipBar).toBeGreaterThanOrEqual(prevBar);
    expect(state.character.attributes.happiness).toBeGreaterThanOrEqual(prevHappy);
  });

  it('harus memotong uang saat memberi hadiah dan menolak jika saldo kurang', () => {
    const state = createNewLife({
      firstName: 'Archie',
      lastName: 'King',
      gender: 'Male',
      seed: 42,
    });
    const mother = state.character.relationships[1]!;

    state.character.finances.bankBalance = 50; // Kurang dari $100
    const failRes = giveGiftToNPC(state, mother.id, 100);
    expect(failRes.success).toBe(false);
    expect(failRes.message).toContain('tidak cukup');

    state.character.finances.bankBalance = 500;
    const okRes = giveGiftToNPC(state, mother.id, 100);
    expect(okRes.success).toBe(true);
    expect(state.character.finances.bankBalance).toBe(400);
  });

  it('harus dapat menambahkan teman baru dan memproses penuaan relasi tahunan', () => {
    const state = createNewLife({
      firstName: 'Social',
      lastName: 'Butterfly',
      gender: 'Female',
      seed: 888,
    });
    const rng = new Mulberry32PRNG(888);

    const friend = addFriend(state, 'Tommy', 10, 60);
    expect(state.character.relationships).toContainEqual(friend);

    const prevFriendAge = friend.age;
    processAnnualRelationships(state, rng);
    expect(friend.age).toBe(prevFriendAge + 1);
  });
});
