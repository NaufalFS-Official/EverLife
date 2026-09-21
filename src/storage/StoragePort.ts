/**
 * Port Abstraksi Penyimpanan (Storage Port) EverLife (v1.0-SMA).
 * Mematuhi Arsitektur Ports & Adapters (Hexagonal) sesuai Blueprint S8 & M1.
 * Direktif D6: 100% strict type-safe, nol any.
 */

import { EverLifeSaveData } from '../contracts/saveSchema';

export interface StoragePort {
  /**
   * Mengambil data simpanan berdasarkan nomor slot (1-indexed).
   */
  loadSlot(slotId: number): Promise<EverLifeSaveData | null>;

  /**
   * Menyimpan data permainan ke slot target secara atomik.
   */
  saveSlot(data: EverLifeSaveData): Promise<void>;

  /**
   * Menghapus simpanan pada slot tertentu.
   */
  deleteSlot(slotId: number): Promise<void>;

  /**
   * Mendaftar ringkasan data dari seluruh slot yang tersedia (slot 1 s.d. 3).
   */
  listSlots(): Promise<readonly (EverLifeSaveData | null)[]>;
}
