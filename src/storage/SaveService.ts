/**
 * Layanan Manajemen Penyimpanan Game EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S8.
 * Menangani 3 slot mandiri, auto-save per tahun, dan ekspor/impor berkas JSON ber-checksum.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import { StoragePort } from './StoragePort';
import { LocalSaveAdapter } from './LocalSaveAdapter';
import { ActiveSession } from '../contracts/gameState';
import {
  CURRENT_SCHEMA_VERSION,
  EverLifeSaveData,
  calculateChecksum,
  migrateSaveData,
} from '../contracts/saveSchema';
import { GAME_CONFIG } from '../contracts/gameConfig';

export class SaveService {
  private readonly storage: StoragePort;

  public constructor(storage?: StoragePort) {
    this.storage = storage ?? new LocalSaveAdapter();
  }

  /**
   * Memuat data sesi permainan dari nomor slot tertentu (1..3).
   */
  public async loadSlot(slotId: number): Promise<EverLifeSaveData | null> {
    this.validateSlotId(slotId);
    return this.storage.loadSlot(slotId);
  }

  /**
   * Menyimpan sesi aktif ke slot tertentu lengkap dengan checksum FNV-1a.
   */
  public async saveActiveSession(session: ActiveSession, slotId: number): Promise<EverLifeSaveData> {
    this.validateSlotId(slotId);

    const payload: Omit<EverLifeSaveData, 'checksum'> = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      slotId,
      updatedAt: new Date().toISOString(),
      lifeSeed: session.lifeSeed,
      profile: session.profile,
      stats: session.stats,
      relations: session.relations,
      timelineHistory: session.timelineHistory,
      flags: session.flags,
      isCompleted: session.isCompleted,
    };

    const checksum = calculateChecksum(payload);
    const saveData: EverLifeSaveData = {
      ...payload,
      checksum,
    };

    await this.storage.saveSlot(saveData);
    return saveData;
  }

  /**
   * Auto-save tahunan: menyimpan jika CFG_AUTO_SAVE_ENABLED bernilai true.
   */
  public async triggerAutoSave(session: ActiveSession, slotId: number): Promise<void> {
    if (!GAME_CONFIG.CFG_AUTO_SAVE_ENABLED) {
      return;
    }
    await this.saveActiveSession(session, slotId);
  }

  /**
   * Menghapus simpanan pada slot tertentu.
   */
  public async deleteSlot(slotId: number): Promise<void> {
    this.validateSlotId(slotId);
    await this.storage.deleteSlot(slotId);
  }

  /**
   * Mengambil status seluruh slot simpanan (1 s.d. CFG_SAVE_SLOT_COUNT).
   */
  public async listAllSlots(): Promise<readonly (EverLifeSaveData | null)[]> {
    return this.storage.listSlots();
  }

  /**
   * Mengekspor data simpanan menjadi string JSON untuk diunduh pemain.
   */
  public exportToJson(saveData: EverLifeSaveData): string {
    return JSON.stringify(saveData, null, 2);
  }

  /**
   * Mengimpor dan memverifikasi string JSON dari luar.
   * Melempar exception jika format salah, checksum tidak cocok, atau data korup.
   */
  public importFromJson(jsonString: string): EverLifeSaveData {
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      throw new Error('ERR_IMPORT_INVALID_JSON: Format berkas bukan JSON valid.');
    }
    return migrateSaveData(parsed);
  }

  private validateSlotId(slotId: number): void {
    if (!Number.isInteger(slotId) || slotId < 1 || slotId > GAME_CONFIG.CFG_SAVE_SLOT_COUNT) {
      throw new Error(
        `ERR_INVALID_SLOT_ID: Nomor slot harus berupa bilangan bulat antara 1 dan ${GAME_CONFIG.CFG_SAVE_SLOT_COUNT}. Diberikan: ${slotId}`
      );
    }
  }
}
