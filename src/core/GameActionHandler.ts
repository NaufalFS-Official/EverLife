/**
 * Handler Logika Eksekusi Aksi Permainan EverLife (v1.0-SMA).
 * Memisahkan logika reduksi aksi dari koordinator GameEngine agar mematuhi batas baris D5 (<300 baris).
 * Direktif D6: 100% strict type-safe, nol any.
 */

import {
  ActiveSession,
  AppScreenState,
  TimelineLogEntry,
} from '../contracts/gameState';
import { GAME_CONFIG } from '../contracts/gameConfig';
import { validateAgeUpAction } from '../contracts/guardTable';
import { createMulberry32 } from './prng';
import { StatCalculator } from './StatCalculator';
import { EventEngine } from './EventEngine';
import { RelationEngine } from './RelationEngine';
import { EconomyEngine } from './EconomyEngine';

export class GameActionHandler {
  /**
   * Mengeksekusi transisi penambahan umur (+1 tahun).
   */
  public static executeAgeUp(
    session: ActiveSession,
    currentScreen: AppScreenState
  ): { nextSession: ActiveSession; nextScreen: AppScreenState } {
    const guardCheck = validateAgeUpAction({
      currentScreen,
      currentAge: session.profile.age,
      maxAge: GAME_CONFIG.CFG_AGE_MAX_V1,
      health: session.stats.health,
      hasActiveEvent: session.activeEventId !== null,
    });

    if (!guardCheck.allowed) {
      throw new Error(`ERR_AGE_UP_GUARD: ${guardCheck.reason}`);
    }

    const nextAge = session.profile.age + 1;
    const nextGrade = StatCalculator.resolveGrade(nextAge);
    const allowance = EconomyEngine.processAnnualAllowance(nextAge);
    const decayedRelations = RelationEngine.applyAnnualDecay(session.relations);
    const healthPenaltyResult = StatCalculator.evaluateHealthPenalty(session.stats);
    const nextStats = healthPenaltyResult.stats;

    const nextCash = session.profile.cash + allowance;

    const ageLog: TimelineLogEntry = {
      age: nextAge,
      title: `Ulang Tahun ke-${nextAge}`,
      description: `Kamu genap berusia ${nextAge} tahun. Jenjang saat ini: ${nextGrade}.${
        allowance > 0 ? ` Menerima uang saku Rp ${allowance.toLocaleString('id-ID')}.` : ''
      }`,
      category: 'Acak',
      statDeltas: allowance > 0 ? { cash: allowance } : undefined,
    };

    const pastEventIds = session.timelineHistory.map(entry => entry.title);
    const prng = createMulberry32(session.lifeSeed + nextAge);
    const event = EventEngine.selectEventForAge({
      age: nextAge,
      prng,
      pastFlags: session.flags,
      pastEventIds,
    });

    const isGraduationAge = nextAge >= GAME_CONFIG.CFG_AGE_MAX_V1;

    let targetScreen: AppScreenState = 'GAMEPLAY_ACTIVE';
    let activeEventId: string | null = null;

    if (event) {
      activeEventId = event.id;
      targetScreen = 'EVENT_MODAL';
    } else if (isGraduationAge) {
      targetScreen = 'GRADUATION_SCREEN';
    }

    const nextSession: ActiveSession = {
      ...session,
      profile: {
        ...session.profile,
        age: nextAge,
        cash: nextCash,
        grade: isGraduationAge ? 'Lulus SMA' : nextGrade,
      },
      stats: nextStats,
      relations: decayedRelations,
      timelineHistory: [ageLog, ...session.timelineHistory],
      activeEventId,
      isCompleted: isGraduationAge && !event,
    };

    return { nextSession, nextScreen: targetScreen };
  }

  /**
   * Mengeksekusi pemilihan opsi dalam dialog dilema event.
   */
  public static executeSelectEventOption(
    session: ActiveSession,
    optionId: string
  ): { nextSession: ActiveSession; nextScreen: AppScreenState } {
    if (!session.activeEventId) {
      throw new Error('ERR_NO_ACTIVE_EVENT: Tidak ada event aktif yang sedang menunggu respons.');
    }

    const event = EventEngine.getEvent(session.activeEventId);
    if (!event) {
      throw new Error(`ERR_EVENT_NOT_FOUND: Event ID '${session.activeEventId}' tidak ditemukan.`);
    }

    const resolution = EventEngine.resolveOption({
      event,
      optionId,
      currentStats: session.stats,
      currentCash: session.profile.cash,
      currentAge: session.profile.age,
    });

    const updatedFlags = resolution.grantedFlag
      ? [...session.flags, resolution.grantedFlag]
      : session.flags;

    const isDead = resolution.nextStats.health <= GAME_CONFIG.CFG_STAT_MIN;
    const isGraduated = session.profile.age >= GAME_CONFIG.CFG_AGE_MAX_V1;

    let nextScreen: AppScreenState = 'GAMEPLAY_ACTIVE';
    if (isDead) {
      nextScreen = 'GAME_OVER_DEATH';
    }

    const nextSession: ActiveSession = {
      ...session,
      stats: resolution.nextStats,
      profile: {
        ...session.profile,
        cash: resolution.nextCash,
        grade: isGraduated ? 'Lulus SMA' : session.profile.grade,
      },
      flags: updatedFlags,
      timelineHistory: [resolution.logEntry, ...session.timelineHistory],
      activeEventId: null,
      isCompleted: isGraduated,
    };

    return { nextSession, nextScreen };
  }

  /**
   * Mengeksekusi aktivitas tahunan (belajar, olahraga, kerja paruh waktu, dll).
   */
  public static executeActivity(
    session: ActiveSession,
    activityId: string
  ): { nextSession: ActiveSession; nextScreen?: AppScreenState } {
    const result = EconomyEngine.executeActivity({
      activityId,
      currentAge: session.profile.age,
      currentCash: session.profile.cash,
    });

    if (!result.success) {
      throw new Error(result.message);
    }

    const updatedStats = StatCalculator.applyDeltas(session.stats, result.statDeltas);
    const updatedCash = session.profile.cash + result.cashDelta;

    const activityLog: TimelineLogEntry = {
      age: session.profile.age,
      title: result.activity.title,
      description: result.activity.description,
      category: 'Dilema',
      statDeltas: {
        ...result.statDeltas,
        cash: result.cashDelta !== 0 ? result.cashDelta : undefined,
      },
    };

    const isDead = updatedStats.health <= GAME_CONFIG.CFG_STAT_MIN;

    const nextSession: ActiveSession = {
      ...session,
      stats: updatedStats,
      profile: {
        ...session.profile,
        cash: updatedCash,
      },
      timelineHistory: [activityLog, ...session.timelineHistory],
    };

    return {
      nextSession,
      nextScreen: isDead ? 'GAME_OVER_DEATH' : undefined,
    };
  }

  /**
   * Mengeksekusi interaksi sosial dengan NPC relasi.
   */
  public static executeRelationInteract(
    session: ActiveSession,
    targetNpcId: string,
    actionType: 'chat' | 'spend_time' | 'ask_allowance'
  ): ActiveSession {
    const result = RelationEngine.interact({
      relations: session.relations,
      targetId: targetNpcId,
      actionType,
      currentCash: session.profile.cash,
    });

    const updatedStats = StatCalculator.applyDeltas(session.stats, {
      happiness: Math.floor(result.scoreDelta / 2),
      relationship: Math.floor(result.scoreDelta / 2),
    });

    const interactionLog: TimelineLogEntry = {
      age: session.profile.age,
      title: `Interaksi Sosial (${actionType})`,
      description: result.interactionLog,
      category: 'Keluarga',
      statDeltas: {
        cash: result.cashDelta !== 0 ? result.cashDelta : undefined,
        relationship: result.scoreDelta,
      },
    };

    return {
      ...session,
      relations: result.updatedRelations,
      stats: updatedStats,
      profile: {
        ...session.profile,
        cash: session.profile.cash + result.cashDelta,
      },
      timelineHistory: [interactionLog, ...session.timelineHistory],
    };
  }
}
