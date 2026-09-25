/**
 * ENGINE TYPES (EverLife)
 */

import { GlobalGameState, GameScreenState, CharacterCreationParams } from '../core/types';
import { JobDefinition } from '../core/career';

export type SubmenuTab = 'occupation' | 'assets' | 'relationships' | 'activities';

export interface GameContextValue {
  state: GlobalGameState | null;
  activeSubmenu: SubmenuTab | null;
  isSaving: boolean;
  hasSavedGame: boolean;
  startNewLife: (params: CharacterCreationParams) => void;
  ageUp: () => void;
  chooseOption: (choiceIndex: number) => void;
  surpriseMe: () => void;
  spendTime: (npcId: string) => void;
  giveGift: (npcId: string) => void;
  applyJob: (job: JobDefinition) => boolean;
  quitJob: () => void;
  workHard: () => void;
  buyAsset: (asset: { id: string; name: string; category: 'Vehicle' | 'RealEstate'; value: number; maintenanceAnnual: number }) => boolean;
  sellOwnedAsset: (assetId: string) => void;
  doCrime: (crimeType: 'shoplift' | 'robbery' | 'heist') => boolean;
  visitDoctor: () => void;
  goToGym: () => void;
  openSubmenu: (tab: SubmenuTab) => void;
  closeSubmenu: () => void;
  resumeSavedGame: () => Promise<boolean>;
  restartGame: () => void;
  transitionTo: (toScreen: GameScreenState) => boolean;
  modalAttentionNonce: number;
  triggerModalAttention: () => void;
}
