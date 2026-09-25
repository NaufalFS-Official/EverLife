/**
 * LOCAL STORAGE & INDEXEDDB ADAPTER (EverLife)
 * Blueprint S8 & D8: Persistensi atomik dengan salted SHA-256 HMAC envelope dan auto-migration.
 * Fallback bertingkat: IndexedDB -> localStorage -> In-Memory Storage (dengan log peringatan).
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
  MemoryStorage,
} from '../shared';

const STORAGE_KEY = 'everlife_save_slot_01';

export class LocalSaveRepository implements ISaveRepository {
  private platform = new DefaultPlatformAdapter();
  private memoryFallback = new MemoryStorage();

  public async save(gameState: GlobalGameState): Promise<boolean> {
    try {
      const envelope = createSaveEnvelope(gameState);
      const serialized = JSON.stringify(envelope);

      let savedInIdb = false;
      let savedInLocalStorage = false;

      // Tier 1: Coba IndexedDB jika berada di peramban
      if (this.platform.isBrowser()) {
        try {
          await set(STORAGE_KEY, serialized);
          savedInIdb = true;
        } catch {
          // IndexedDB diblokir atau gagal
          savedInIdb = false;
        }
      }

      // Tier 2: Coba localStorage
      try {
        this.platform.storage.setItem(STORAGE_KEY, serialized);
        savedInLocalStorage = true;
      } catch {
        // localStorage quota error atau private mode diblokir
        savedInLocalStorage = false;
      }

      // Tier 3: Jika keduanya gagal, jatuh ke MemoryStorage dengan log peringatan
      if (!savedInIdb && !savedInLocalStorage) {
        console.warn('Storage fallback: IndexedDB dan localStorage gagal/tidak tersedia. Menggunakan in-memory storage sementara.');
        this.memoryFallback.setItem(STORAGE_KEY, serialized);
      }

      return true;
    } catch {
      return false;
    }
  }

  public async load(): Promise<GlobalGameState | null> {
    try {
      let raw: string | null = null;

      // Tier 1: Coba baca dari IndexedDB
      if (this.platform.isBrowser()) {
        try {
          const fromIdb = await get<string>(STORAGE_KEY);
          if (fromIdb) raw = fromIdb;
        } catch {
          // Gagal baca IndexedDB, lanjut ke Tier 2
        }
      }

      // Tier 2: Coba baca dari localStorage
      if (!raw) {
        try {
          raw = this.platform.storage.getItem(STORAGE_KEY);
        } catch {
          // Gagal baca localStorage
        }
      }

      // Tier 3: Coba baca dari Memory fallback
      if (!raw) {
        raw = this.memoryFallback.getItem(STORAGE_KEY);
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
          // Ignore
        }
      }
      try {
        this.platform.storage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
      this.memoryFallback.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }

  public async exportPayload(): Promise<string> {
    // Cari data tersimpan dari tier 1 -> tier 2 -> tier 3
    if (this.platform.isBrowser()) {
      try {
        const fromIdb = await get<string>(STORAGE_KEY);
        if (fromIdb) return fromIdb;
      } catch {
        // Fallback
      }
    }

    try {
      const fromStorage = this.platform.storage.getItem(STORAGE_KEY);
      if (fromStorage) return fromStorage;
    } catch {
      // Fallback
    }

    return this.memoryFallback.getItem(STORAGE_KEY) ?? '';
  }

  public async importPayload(encoded: string): Promise<boolean> {
    try {
      if (!encoded || encoded.trim() === '') return false;
      const envelope = JSON.parse(encoded) as SaveDataEnvelope;
      if (!validateSaveEnvelope(envelope)) {
        console.warn('Import save ditolak: Checksum invalid atau format payload terkorupsi.');
        return false;
      }
      if (typeof envelope.schemaVersion !== 'number' || envelope.schemaVersion < 1) {
        console.warn('Import save ditolak: schemaVersion tidak valid.');
        return false;
      }
      const state = migrateSaveData(envelope);
      return await this.save(state);
    } catch {
      console.warn('Import save gagal: format JSON tidak valid.');
      return false;
    }
  }
}
