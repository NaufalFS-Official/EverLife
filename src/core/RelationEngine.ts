/**
 * Engine Manajemen Relasi Sosial & Interaksi Keluarga/Kawan EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S3, S7.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import { RelationNPC } from '../contracts/gameState';
import { GAME_CONFIG } from '../contracts/gameConfig';
import { StatCalculator } from './StatCalculator';

export class RelationEngine {
  /**
   * Membuat daftar relasi keluarga default saat karakter baru dilahirkan (Ayah dan Ibu).
   */
  public static createInitialFamily(): readonly RelationNPC[] {
    return [
      {
        id: 'npc-dad',
        name: 'Ayah',
        role: 'Ayah',
        relationshipScore: GAME_CONFIG.CFG_STAT_INITIAL_RELATION,
        isAlive: true,
      },
      {
        id: 'npc-mom',
        name: 'Ibu',
        role: 'Ibu',
        relationshipScore: GAME_CONFIG.CFG_STAT_INITIAL_RELATION + 5,
        isAlive: true,
      },
    ];
  }

  /**
   * Menerapkan penurunan alami relasi tahunan (annual decay) jika tidak ada interaksi.
   */
  public static applyAnnualDecay(relations: readonly RelationNPC[]): readonly RelationNPC[] {
    return relations.map(npc => {
      if (!npc.isAlive) return npc;
      const decayedScore = StatCalculator.clamp(
        npc.relationshipScore - GAME_CONFIG.CFG_RELATION_DECAY_ANNUAL
      );
      return {
        ...npc,
        relationshipScore: decayedScore,
      };
    });
  }

  /**
   * Mengeksekusi aksi interaksi sosial dengan karakter target.
   */
  public static interact(params: {
    readonly relations: readonly RelationNPC[];
    readonly targetId: string;
    readonly actionType: 'chat' | 'spend_time' | 'ask_allowance';
    readonly currentCash: number;
  }): {
    readonly updatedRelations: readonly RelationNPC[];
    readonly cashDelta: number;
    readonly interactionLog: string;
    readonly scoreDelta: number;
  } {
    const target = params.relations.find(npc => npc.id === params.targetId);
    if (!target) {
      throw new Error(`ERR_RELATION_NOT_FOUND: Karakter dengan ID '${params.targetId}' tidak ditemukan.`);
    }

    if (!target.isAlive) {
      return {
        updatedRelations: params.relations,
        cashDelta: 0,
        interactionLog: `${target.name} telah tiada. Kamu mendoakannya dalam hati.`,
        scoreDelta: 0,
      };
    }

    let scoreDelta = 0;
    let cashDelta = 0;
    let log = '';

    switch (params.actionType) {
      case 'chat': {
        scoreDelta = 10;
        log = `Kamu mengobrol santai dari hati ke hati dengan ${target.name}. Hubungan kalian menghangat.`;
        break;
      }
      case 'spend_time': {
        scoreDelta = 15;
        const cost = 10000;
        if (params.currentCash >= cost) {
          cashDelta = -cost;
          log = `Kamu mengajak ${target.name} makan bakso bersama. Suasana terasa sangat menyenangkan.`;
        } else {
          scoreDelta = 8;
          log = `Kamu duduk santai di teras bercanda bersama ${target.name}.`;
        }
        break;
      }
      case 'ask_allowance': {
        if (target.role === 'Ayah' || target.role === 'Ibu') {
          if (target.relationshipScore >= 60) {
            cashDelta = 15000;
            scoreDelta = -2;
            log = `${target.name} tersenyum dan memberimu uang saku tambahan sebesar Rp 15.000.`;
          } else {
            scoreDelta = -5;
            log = `${target.name} menasehatimu untuk lebih berhemat dan tidak memberi uang saku ekstra.`;
          }
        } else {
          log = `${target.name} tertawa dan menganggapmu sedang bercanda minta uang jajan.`;
        }
        break;
      }
    }

    const updatedRelations = params.relations.map(npc => {
      if (npc.id === target.id) {
        return {
          ...npc,
          relationshipScore: StatCalculator.clamp(npc.relationshipScore + scoreDelta),
        };
      }
      return npc;
    });

    return {
      updatedRelations,
      cashDelta,
      interactionLog: log,
      scoreDelta,
    };
  }

  /**
   * Menambahkan relasi baru (misal teman sekelas baru saat masuk sekolah).
   */
  public static addFriend(relations: readonly RelationNPC[], newFriend: RelationNPC): readonly RelationNPC[] {
    if (relations.some(npc => npc.id === newFriend.id)) {
      return relations;
    }
    return [...relations, newFriend];
  }
}
