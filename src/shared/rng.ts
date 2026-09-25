/**
 * DETERMINISTIC PRNG CONTRACT (Mulberry32)
 * Generator bilangan acak semu deterministik 32-bit untuk menjamin replikasi run identik (D16).
 * Dilarang menggunakan Math.random() pada logika simulasi core.
 */

export class Mulberry32PRNG {
  private state: number;
  private readonly initialSeed: number;

  constructor(seed: number) {
    this.initialSeed = seed >>> 0;
    this.state = this.initialSeed;
  }

  /**
   * Menghasilkan angka floating-point acak dalam rentang [0, 1)
   */
  public next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Menghasilkan integer acak dalam rentang [min, max] inklusif
   */
  public nextInt(min: number, max: number): number {
    if (min > max) {
      throw new Error(`min (${min}) tidak boleh lebih besar dari max (${max})`);
    }
    const range = max - min + 1;
    return min + Math.floor(this.next() * range);
  }

  /**
   * Memilih elemen acak dari array
   */
  public nextChoice<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error('Array tidak boleh kosong untuk pemilihan acak');
    }
    const index = this.nextInt(0, items.length - 1);
    const selected = items[index];
    if (selected === undefined) {
      throw new Error(`Indeks acak ${index} menghasilkan nilai undefined`);
    }
    return selected;
  }

  public getSeed(): number {
    return this.initialSeed;
  }

  public reset(): void {
    this.state = this.initialSeed;
  }
}

/**
 * Menghitung hash representasi deterministik dari objek state (D16 stateHash).
 * Menjamin simulate(seed, inputLog) -> stateHash identik pada pengujian berulang.
 */
export function computeStateHash(state: unknown): string {
  const jsonStr = JSON.stringify(state, Object.keys(state as object).sort());
  let hash = 0x811c9dc5;
  for (let i = 0; i < jsonStr.length; i++) {
    hash ^= jsonStr.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
