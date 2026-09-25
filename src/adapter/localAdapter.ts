/**
 * LOCAL STORAGE & INDEXEDDB ADAPTER (EverLife)
 * Blueprint S8 & D8: Persistensi atomik dengan salted SHA-256 HMAC envelope dan auto-migration.
 */

import { get, set, del } from 'idb-keyval';
import { ISaveRepository } from './repository';
import { GlobalGameState } from '../core/types';
import {
  createSaveEnvelope,
  validateSaveEnvelope,
  migrateSaveData,
  SaveDataEnvelope,
  DefaultPlatformAdapter,
} from '../shared';

const STORAGE_KEY = 'everlife_save_slot_01';

export class LocalSaveRepository implements ISaveRepository {
  private platform = new DefaultPlatformAdapter();

  public async save(gameState: GlobalGameState): Promise<boolean> {
    try {
      const envelope = createSaveEnvelope(gameState);
      const serialized = JSON.stringify(envelope);

      // Simpan di IndexedDB jika berada di browser
      if (this.platform.isBrowser()) {
        try {
          await set(STORAGE_KEY, serialized);
        } catch {
          // Fallback ke localStorage
          this.platform.storage.setItem(STORAGE_KEY, serialized);
        }
      } else {
        this.platform.storage.setItem(STORAGE_KEY, serialized);
      }
      return true;
    } catch {
      return false;
    }
  }

  public async load(): Promise<GlobalGameState | null> {
    try {
      let raw: string | null = null;

      if (this.platform.isBrowser()) {
        try {
          const fromIdb = await get<string>(STORAGE_KEY);
          if (fromIdb) raw = fromIdb;
        } catch {
          raw = this.platform.storage.getItem(STORAGE_KEY);
        }
      }

      if (!raw) {
        raw = this.platform.storage.getItem(STORAGE_KEY);
      }

      if (!raw) return null;

      const envelope = JSON.parse(raw) as SaveDataEnvelope;
      if (!validateSaveEnvelope(envelope)) {
        // Deteksi tampering / korupsi data (D8/S11)
        console.warn('Integritas save data gagal diverifikasi (Checksum mismatch).');
        return null;
      }

      const migrated = migrateSaveData(envelope);
      return migrated;
    } catch {
      return null;
    }
  }

  public async clear(): Promise<void> {
    try {
      if (this.platform.isBrowser()) {
        try {
          await del(STORAGE_KEY);
        } catch {
          this.platform.storage.removeItem(STORAGE_KEY);
        }
      }
      this.platform.storage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }

  public async exportPayload(): Promise<string> {
    const raw = this.platform.storage.getItem(STORAGE_KEY);
    if (!raw) return '';
    return raw;
  }

  public async importPayload(encoded: string): Promise<boolean> {
    try {
      const envelope = JSON.parse(encoded) as SaveDataEnvelope;
      if (!validateSaveEnvelope(envelope)) return false;
      const state = migrateSaveData(envelope);
      return await this.save(state);
    } catch {
      return false;
    }
  }
}
