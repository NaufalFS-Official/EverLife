/**
 * NPC RELATIONSHIP SYSTEM & SOCIAL INTERACTIONS (EverLife)
 * Layer 1 Core: NPC aging, relationship bar decay, social interaction actions.
 */

import { Mulberry32PRNG } from '../shared';
import { GlobalGameState, NPC } from './types';

/**
 * Melakukan aktivitas "Spend Time" bersama NPC tertentu.
 */
export function spendTimeWithNPC(
  state: GlobalGameState,
  npcId: string,
  rng?: Mulberry32PRNG
): { success: boolean; log: string; delta: number } {
  const npc = state.character.relationships.find((r) => r.id === npcId && r.alive);
  if (!npc) {
    return { success: false, log: 'Karakter tidak ditemukan atau sudah meninggal.', delta: 0 };
  }

  const delta = rng ? rng.nextInt(12, 19) : 15;
  npc.relationshipBar = Math.min(100, npc.relationshipBar + delta);
  state.character.attributes.happiness = Math.min(100, state.character.attributes.happiness + 8);

  const log = `Menghabiskan waktu berkualitas bersama ${npc.name} (${npc.role}). Hubungan semakin hangat!`;
  return { success: true, log, delta };
}

/**
 * Memberikan hadiah kepada NPC dengan potongan saldo $100.
 */
export function giveGiftToNPC(
  state: GlobalGameState,
  npcId: string,
  giftCost: number = 100
): { success: boolean; message: string } {
  const npc = state.character.relationships.find((r) => r.id === npcId && r.alive);
  if (!npc) {
    return { success: false, message: 'NPC tidak ditemukan atau sudah wafat.' };
  }
  if (state.character.finances.bankBalance < giftCost) {
    return { success: false, message: 'Saldo uang tidak cukup untuk membeli hadiah.' };
  }

  state.character.finances.bankBalance -= giftCost;
  npc.relationshipBar = Math.min(100, npc.relationshipBar + 25);
  state.character.attributes.happiness = Math.min(100, state.character.attributes.happiness + 5);

  return { success: true, message: `Memberi hadiah spesial kepada ${npc.name}! Mereka sangat bahagia.` };
}

/**
 * Menambahkan teman baru ke daftar relasi.
 */
export function addFriend(
  state: GlobalGameState,
  name: string,
  age: number,
  initialBar: number = 50
): NPC {
  const newFriend: NPC = {
    id: `npc_friend_${state.character.relationships.length + 1}`,
    name,
    role: 'Friend',
    age,
    relationshipBar: initialBar,
    alive: true,
  };
  state.character.relationships.push(newFriend);
  return newFriend;
}

/**
 * Pembaruan tahunan relasi NPC:
 * 1. Seluruh NPC bertambah usia 1 tahun.
 * 2. Bar relasi menurun pasif 2-4% bila tidak dirawat.
 * 3. Evaluasi kematian orang tua usia lanjut (75+ tahun).
 */
export function processAnnualRelationships(
  state: GlobalGameState,
  rng: Mulberry32PRNG
): string[] {
  const logs: string[] = [];

  for (const npc of state.character.relationships) {
    if (!npc.alive) continue;

    npc.age += 1;
    // Penurunan alami hubungan jika tidak ada interaksi
    npc.relationshipBar = Math.max(0, npc.relationshipBar - rng.nextInt(1, 4));

    // Evaluasi kematian alami NPC lansia
    if (npc.age >= 75) {
      const mortalityChance = (npc.age - 70) * 0.02; // bertambah tiap tahun
      if (rng.next() < mortalityChance) {
        npc.alive = false;
        logs.push(`Kabar duka: ${npc.name} (${npc.role}) telah berpulang ke pangkuan Yang Maha Kuasa pada usia ${npc.age} tahun.`);
        state.character.attributes.happiness = Math.max(0, state.character.attributes.happiness - 30);
      }
    }
  }

  return logs;
}
