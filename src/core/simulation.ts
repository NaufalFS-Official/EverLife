/**
 * DETERMINISTIC SIMULATION & REPLAY ENGINE (EverLife)
 * Layer 1 Core: Pure simulation function simulate(seed, inputLog) -> stateHash.
 * Jaminan determinisme mutlak: Dua eksekusi dengan seed & inputLog identik menghasilkan stateHash sama.
 */

import { Mulberry32PRNG, computeStateHash } from '../shared';
import { GlobalGameState, PlayerAction, SimulationResult } from './types';
import { createNewLife } from './character';
import { tickAge } from './aging';
import { resolveChoice } from './events';
import { spendTimeWithNPC } from './relationships';
import { INITIAL_JOB_LISTINGS, applyForJob, resignJob } from './career';
import { purchaseAsset, sellAsset } from './finances';
import { commitCrime } from './crime';

/**
 * Menjalankan simulasi kehidupan lengkap dari seed dan riwayat aksi input pemain.
 * Bebas DOM, bebas Math.random() dan Date.now(), 100% deterministik.
 */
export function simulate(
  seed: number,
  inputLog: PlayerAction[],
  initialName = { first: 'Archie', last: 'King' }
): SimulationResult {
  const rng = new Mulberry32PRNG(seed);
  const state: GlobalGameState = createNewLife({
    firstName: initialName.first,
    lastName: initialName.last,
    gender: 'Male',
    seed,
  });

  for (const action of inputLog) {
    if (state.currentScreen === 'DEATH_SUMMARY') {
      break; // Karakter sudah meninggal, hentikan aksi berikutnya
    }

    switch (action.type) {
      case 'AGE_UP': {
        tickAge(state, rng);
        break;
      }

      case 'CHOOSE_OPTION': {
        if (state.activeModal) {
          resolveChoice(state, state.activeModal, action.choiceIndex);
        }
        break;
      }

      case 'SPEND_TIME_NPC': {
        spendTimeWithNPC(state, action.npcId, rng);
        break;
      }

      case 'APPLY_JOB': {
        const job = INITIAL_JOB_LISTINGS.find((j) => j.id === action.jobId);
        if (job) {
          applyForJob(state, job, rng);
        }
        break;
      }

      case 'QUIT_JOB': {
        resignJob(state);
        break;
      }

      case 'BUY_ASSET': {
        purchaseAsset(state, {
          id: action.assetId,
          name: 'Properti / Kendaraan',
          category: 'Vehicle',
          value: 5000,
          maintenanceAnnual: 200,
        });
        break;
      }

      case 'SELL_ASSET': {
        sellAsset(state, action.assetId);
        break;
      }

      case 'COMMIT_CRIME': {
        commitCrime(state, action.crimeType, rng);
        break;
      }

      case 'VISIT_DOCTOR': {
        if (state.character.finances.bankBalance >= 200) {
          state.character.finances.bankBalance -= 200;
          state.character.attributes.health = Math.min(100, state.character.attributes.health + 15);
        }
        break;
      }

      case 'GO_TO_GYM': {
        if (state.character.finances.bankBalance >= 20) {
          state.character.finances.bankBalance -= 20;
          state.character.attributes.health = Math.min(100, state.character.attributes.health + 5);
          state.character.attributes.looks = Math.min(100, state.character.attributes.looks + 3);
        }
        break;
      }
    }
  }

  const stateHash = computeStateHash(state);
  const log = state.character.lifeLog.map((entry) => entry.text);

  return {
    finalState: state,
    stateHash,
    log,
  };
}
