/**
 * Engine Koordinator Utama State Permainan EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S2, S3, S4, S5.
 * Mengelola state machine, dispatch aksi, dan observer listener antarmuka.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import {
  ActiveSession,
  ActiveTab,
  AppScreenState,
  EverLifeAppState,
} from '../contracts/gameState';
import { GameAction } from '../contracts/gameEvents';
import { GAME_CONFIG } from '../contracts/gameConfig';
import { validateScreenTransition } from '../contracts/guardTable';
import { CharacterInitializer, CreateCharacterInput } from './CharacterInitializer';
import { GameActionHandler } from './GameActionHandler';

export type StateListener = (state: EverLifeAppState) => void;

export class GameEngine {
  private state: EverLifeAppState;
  private readonly listeners = new Set<StateListener>();

  public constructor(initialState?: EverLifeAppState) {
    this.state = initialState ?? {
      screen: 'MAIN_MENU',
      activeTab: 'LIFE',
      activeSlotId: 1,
      session: null,
    };
  }

  public getState(): EverLifeAppState {
    return this.state;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    const currentState = this.state;
    this.listeners.forEach(listener => listener(currentState));
  }

  private setScreen(toScreen: AppScreenState): void {
    const check = validateScreenTransition(this.state.screen, toScreen);
    if (!check.allowed) {
      throw new Error(`ERR_INVALID_SCREEN_TRANSITION: ${check.reason} (${check.errorCode})`);
    }
    this.state = {
      ...this.state,
      screen: toScreen,
    };
  }

  public startNewGame(): void {
    this.setScreen('CHARACTER_CREATION');
    this.emit();
  }

  public submitCharacter(input: CreateCharacterInput, slotId = 1): void {
    const session = CharacterInitializer.createNewSession(input);
    this.setScreen('GAMEPLAY_ACTIVE');
    this.state = {
      ...this.state,
      activeSlotId: slotId,
      activeTab: 'LIFE',
      session,
    };
    this.emit();
  }

  public loadSession(session: ActiveSession, slotId: number): void {
    let targetScreen: AppScreenState = 'GAMEPLAY_ACTIVE';
    if (session.stats.health <= GAME_CONFIG.CFG_STAT_MIN) {
      targetScreen = 'GAME_OVER_DEATH';
    } else if (session.isCompleted) {
      targetScreen = 'GRADUATION_SCREEN';
    } else if (session.activeEventId !== null) {
      targetScreen = 'EVENT_MODAL';
    }

    this.setScreen(targetScreen);
    this.state = {
      ...this.state,
      activeSlotId: slotId,
      activeTab: 'LIFE',
      session,
    };
    this.emit();
  }

  public ageUp(): void {
    if (!this.state.session) {
      throw new Error('ERR_NO_ACTIVE_SESSION: Tidak ada sesi permainan aktif.');
    }
    const result = GameActionHandler.executeAgeUp(this.state.session, this.state.screen);
    this.setScreen(result.nextScreen);
    this.state = {
      ...this.state,
      session: result.nextSession,
    };
    this.emit();
  }

  public selectEventOption(optionId: string): void {
    if (!this.state.session) {
      throw new Error('ERR_NO_ACTIVE_SESSION: Tidak ada sesi permainan aktif.');
    }
    const result = GameActionHandler.executeSelectEventOption(this.state.session, optionId);
    this.setScreen(result.nextScreen);
    this.state = {
      ...this.state,
      session: result.nextSession,
    };

    if (
      result.nextScreen === 'GAMEPLAY_ACTIVE' &&
      result.nextSession.profile.age >= GAME_CONFIG.CFG_AGE_MAX_V1
    ) {
      this.setScreen('GRADUATION_SCREEN');
    }

    this.emit();
  }

  public performActivity(activityId: string): void {
    if (!this.state.session) {
      throw new Error('ERR_NO_ACTIVE_SESSION: Tidak ada sesi permainan aktif.');
    }
    const result = GameActionHandler.executeActivity(this.state.session, activityId);
    if (result.nextScreen) {
      this.setScreen(result.nextScreen);
    }
    this.state = {
      ...this.state,
      session: result.nextSession,
    };
    this.emit();
  }

  public interactRelation(targetNpcId: string, actionType: 'chat' | 'spend_time' | 'ask_allowance'): void {
    if (!this.state.session) {
      throw new Error('ERR_NO_ACTIVE_SESSION: Tidak ada sesi permainan aktif.');
    }
    const nextSession = GameActionHandler.executeRelationInteract(this.state.session, targetNpcId, actionType);
    this.state = {
      ...this.state,
      session: nextSession,
    };
    this.emit();
  }

  public switchTab(tab: ActiveTab): void {
    this.state = {
      ...this.state,
      activeTab: tab,
    };
    this.emit();
  }

  public resetGame(): void {
    this.setScreen('MAIN_MENU');
    this.state = {
      screen: 'MAIN_MENU',
      activeTab: 'LIFE',
      activeSlotId: 1,
      session: null,
    };
    this.emit();
  }

  public dispatch(action: GameAction): void {
    switch (action.type) {
      case 'START_NEW_GAME':
        this.startNewGame();
        break;
      case 'SUBMIT_CHARACTER':
        this.submitCharacter(action.payload);
        break;
      case 'AGE_UP':
        this.ageUp();
        break;
      case 'SELECT_EVENT_OPTION':
        this.selectEventOption(action.payload.optionId);
        break;
      case 'PERFORM_ACTIVITY':
        this.performActivity(action.payload.activityId);
        break;
      case 'INTERACT_RELATION':
        this.interactRelation(action.payload.targetNpcId, action.payload.interactionType);
        break;
      case 'SWITCH_TAB':
        this.switchTab(action.payload.tab);
        break;
      case 'DISCARD_SESSION':
      case 'RESET_GAME':
        this.resetGame();
        break;
      case 'LOAD_SAVE_SLOT':
        break;
    }
  }
}
