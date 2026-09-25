/**
 * API PORT & STANDBY CLOUD ADAPTER (EverLife)
 * Blueprint S10: Antarmuka gerbang API portabel untuk transisi mulus C0 -> C1/C2.
 */

import { GlobalGameState } from '../core/types';

export interface IApiPort {
  syncState(state: GlobalGameState): Promise<{ success: boolean; syncedAt: number }>;
  fetchLeaderboard(): Promise<{ rank: number; score: number }[]>;
}

export class LocalApiPort implements IApiPort {
  public async syncState(_state: GlobalGameState): Promise<{ success: boolean; syncedAt: number }> {
    // Mode A (C0): Sinkronisasi luring 100% instan
    return { success: true, syncedAt: Date.now() };
  }

  public async fetchLeaderboard(): Promise<{ rank: number; score: number }[]> {
    return [];
  }
}
