/**
 * Adapter Penyimpanan Lokal (IndexedDB dengan Fallback LocalStorage/Memory).
 * Mengimplementasikan StoragePort untuk mode offline-first.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import { StoragePort } from './StoragePort';
import { EverLifeSaveData, migrateSaveData } from '../contracts/saveSchema';
import { GAME_CONFIG } from '../contracts/gameConfig';

const STORAGE_PREFIX = 'everlife_save_slot_';

export class LocalSaveAdapter implements StoragePort {
  private readonly memoryStore = new Map<string, string>();

  private getKey(slotId: number): string {
    return `${STORAGE_PREFIX}${slotId}`;
  }

  private isIdbAvailable(): boolean {
    return typeof indexedDB !== 'undefined';
  }

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  public async loadSlot(slotId: number): Promise<EverLifeSaveData | null> {
    const key = this.getKey(slotId);
    let rawStr: string | null = null;

    if (this.isIdbAvailable()) {
      try {
        const val = await idbGet<string>(key);
        if (typeof val === 'string') {
          rawStr = val;
        }
      } catch {
        rawStr = null;
      }
    }

    if (!rawStr && this.isLocalStorageAvailable()) {
      try {
        rawStr = localStorage.getItem(key);
      } catch {
        rawStr = null;
      }
    }

    if (!rawStr) {
      rawStr = this.memoryStore.get(key) ?? null;
    }

    if (!rawStr) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawStr) as Record<string, unknown>;
      return migrateSaveData(parsed);
    } catch {
      return null;
    }
  }

  public async saveSlot(data: EverLifeSaveData): Promise<void> {
    const key = this.getKey(data.slotId);
    const serialized = JSON.stringify(data);

    this.memoryStore.set(key, serialized);

    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem(key, serialized);
      } catch {
        // Kuota storage lokal penuh atau diblokir
      }
    }

    if (this.isIdbAvailable()) {
      try {
        await idbSet(key, serialized);
      } catch {
        // Fallback sudah tersimpan di memory / localStorage
      }
    }
  }

  public async deleteSlot(slotId: number): Promise<void> {
    const key = this.getKey(slotId);
    this.memoryStore.delete(key);

    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(key);
      } catch {
        // Abaikan jika tidak tersedia
      }
    }

    if (this.isIdbAvailable()) {
      try {
        await idbDel(key);
      } catch {
        // Abaikan jika tidak tersedia
      }
    }
  }

  public async listSlots(): Promise<readonly (EverLifeSaveData | null)[]> {
    const results: (EverLifeSaveData | null)[] = [];
    for (let slotId = 1; slotId <= GAME_CONFIG.CFG_SAVE_SLOT_COUNT; slotId++) {
      const data = await this.loadSlot(slotId);
      results.push(data);
    }
    return results;
  }
}
