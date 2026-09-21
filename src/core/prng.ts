/**
 * Generator Bilangan Acak Semu Deterministik (Mulberry32 PRNG).
 * Memastikan keunikan sekaligus auditabilitas reproduksi riwayat kehidupan karakter.
 * Sesuai Blueprint S4.5 & Keputusan DEC-009.
 */

export interface PRNG {
  next(): number;          // Mengembalikan float [0, 1)
  nextInt(min: number, max: number): number; // Mengembalikan integer [min, max]
  getSeed(): number;
}

export function createMulberry32(initialSeed: number): PRNG {
  let s = initialSeed >>> 0;

  function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(min: number, max: number): number {
    const low = Math.ceil(min);
    const high = Math.floor(max);
    return Math.floor(next() * (high - low + 1)) + low;
  }

  return {
    next,
    nextInt,
    getSeed: () => s,
  };
}
