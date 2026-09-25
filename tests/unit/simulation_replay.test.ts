import { describe, it, expect } from 'vitest';
import { simulate } from '../../src/core/simulation';
import { PlayerAction } from '../../src/core/types';

describe('TEST-AC-REPLAY: Deterministic Simulation & Replay Engine (D16)', () => {
  it('harus menghasilkan stateHash dan log yang identik pada dua kali simulasi mandiri (Seed deterministik)', () => {
    const seed = 428912;
    const actions: PlayerAction[] = [
      { type: 'AGE_UP' },
      { type: 'AGE_UP' },
      { type: 'CHOOSE_OPTION', eventId: 'evt_vaccine_toddler', choiceIndex: 1 },
      { type: 'AGE_UP' },
      { type: 'AGE_UP' },
      { type: 'SPEND_TIME_NPC', npcId: 'npc_father' },
      { type: 'AGE_UP' },
    ];

    const run1 = simulate(seed, actions);
    const run2 = simulate(seed, actions);

    expect(run1.stateHash).toBe(run2.stateHash);
    expect(run1.log).toEqual(run2.log);
    expect(run1.finalState.character.age).toBe(run2.finalState.character.age);
    expect(run1.finalState.character.attributes).toEqual(run2.finalState.character.attributes);
  });

  it('harus menghasilkan stateHash berbeda untuk seed yang berbeda dengan aksi yang sama', () => {
    const actions: PlayerAction[] = [
      { type: 'AGE_UP' },
      { type: 'AGE_UP' },
      { type: 'AGE_UP' },
    ];

    const runA = simulate(111111, actions);
    const runB = simulate(999999, actions);

    expect(runA.stateHash).not.toBe(runB.stateHash);
  });
});
