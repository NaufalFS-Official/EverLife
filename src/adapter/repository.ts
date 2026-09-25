/**
 * REPOSITORY PATTERN ABSTRACTION (EverLife)
 * Blueprint S8: Persistence contract decoupling game loop from storage mechanism.
 */

import { GlobalGameState } from '../core/types';

export interface ISaveRepository {
  /**
   * Menyimpan GlobalGameState ke persistent storage lokal.
   */
  save(gameState: GlobalGameState): Promise<boolean>;

  /**
   * Memuat GlobalGameState dari persistent storage, memvalidasi integritas checksum.
   */
  load(): Promise<GlobalGameState | null>;

  /**
   * Menghapus save data aktif.
   */
  clear(): Promise<void>;

  /**
   * Mengekspor payload save terenkripsi checksum sebagai string base64/JSON.
   */
  exportPayload(): Promise<string>;

  /**
   * Mengimpor payload save eksternal dengan validasi skema dan checksum.
   */
  importPayload(encoded: string): Promise<boolean>;
}
