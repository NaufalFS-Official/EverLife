/**
 * SECURITY HARDENING PERMANENT REGRESSION SUITE (ADA Blue Team)
 * Memverifikasi ketahanan terhadap:
 * - NaN financial poisoning
 * - HTML/XSS tag injection
 * - Buffer bloat pada string nama
 * - Age rewind & Age skip monotonicity violations
 */

import { describe, it, expect } from 'vitest';
import { createNewLife, sanitizeName, MAX_NAME_LENGTH } from '../../src/core/character';
import { processAnnualCashflow, sanitizeCurrency } from '../../src/core/finances';
import { tickAge, validateAndSyncAgeMonotonicity } from '../../src/core/aging';
import { Mulberry32PRNG } from '../../src/shared';

describe('TEST-SEC-HARDENING: Security Hardening & Input Defense', () => {
  describe('Financial & Currency Sanitization (ATK-008 Defense)', () => {
    it('harus membersihkan nilai NaN dan Infinity menjadi nilai aman 0', () => {
      expect(sanitizeCurrency(NaN)).toBe(0);
      expect(sanitizeCurrency(Infinity)).toBe(0);
      expect(sanitizeCurrency(-Infinity)).toBe(0);
      expect(sanitizeCurrency('bad_string' as unknown as number)).toBe(0);
      expect(sanitizeCurrency(undefined as unknown as number)).toBe(0);
      expect(sanitizeCurrency(15000.75)).toBe(15001);
    });

    it('harus mencegah kontaminasi NaN pada saldo bank dan net worth saat evaluasi cashflow', () => {
      const state = createNewLife({ firstName: 'Secure', lastName: 'Finance', gender: 'Female', seed: 101 });
      state.character.age = 22;
      state.character.finances.bankBalance = NaN;

      const result = processAnnualCashflow(state);

      expect(Number.isNaN(state.character.finances.bankBalance)).toBe(false);
      expect(Number.isFinite(state.character.finances.bankBalance)).toBe(true);
      expect(Number.isNaN(state.character.finances.netWorth)).toBe(false);
      expect(Number.isFinite(state.character.finances.netWorth)).toBe(true);
      expect(Number.isFinite(result.netSavingsDelta)).toBe(true);
    });
  });

  describe('Input Sanitization & Buffer Defense (ATK-017, ATK-018, ATK-019 Defense)', () => {
    it('harus membersihkan tag script dan elemen HTML berbahaya dari nama', () => {
      expect(sanitizeName('<script>alert("xss")</script>John')).toBe('alert("xss")John');
      expect(sanitizeName('<img src=x onerror=alert(1)>')).toBe('Karakter');
      expect(sanitizeName('<svg onload=fetch("evil.com")>Bob')).toBe('Bob');
    });

    it('harus membatasi panjang nama maksimal hingga MAX_NAME_LENGTH (30 char)', () => {
      const longInput = 'A'.repeat(500);
      const sanitized = sanitizeName(longInput);
      expect(sanitized.length).toBe(MAX_NAME_LENGTH);
      expect(sanitized).toBe('A'.repeat(MAX_NAME_LENGTH));
    });

    it('harus menerapkan sanitasi secara otomatis pada alur createNewLife', () => {
      const state = createNewLife({
        firstName: '<script>alert(1)</script>Rico',
        lastName: 'B'.repeat(500),
        gender: 'Male',
      });

      expect(state.character.name.first).not.toContain('<script>');
      expect(state.character.name.first).toBe('alert(1)Rico');
      expect(state.character.name.last.length).toBe(MAX_NAME_LENGTH);
    });
  });

  describe('Age Monotonicity & Step Defense (ATK-005 & ATK-006 Defense)', () => {
    it('harus menolak pembalikan usia (Age Rewind) dan memulihkan ke usia tertinggi yang tercatat', () => {
      const state = createNewLife({ firstName: 'Time', lastName: 'Traveler', gender: 'Male', seed: 202 });
      state.character.age = 40;
      state.character.lifeLog.push({ age: 40, text: 'Usia 40 tahun tercatat', categoryTag: 'Aging', iconKey: 'icon_age' });

      // Coba membalikkan usia ke 15 di memory
      state.character.age = 15;
      const status = validateAndSyncAgeMonotonicity(state);

      expect(status.revertedRewind).toBe(true);
      expect(state.character.age).toBe(40);

      // Jalankan tickAge resmi
      const rng = new Mulberry32PRNG(303);
      tickAge(state, rng);
      expect(state.character.age).toBe(41);
    });

    it('harus menolak lompatan usia melonjak (Age Skip) dan membatasi penuaan diskrit +1 tahun', () => {
      const state = createNewLife({ firstName: 'Speed', lastName: 'Jumper', gender: 'Female', seed: 404 });
      state.character.age = 10;
      state.character.lifeLog.push({ age: 10, text: 'Usia 10 tahun', categoryTag: 'Aging', iconKey: 'icon_age' });

      // Coba melonjakkan usia ke 80
      state.character.age = 80;
      const status = validateAndSyncAgeMonotonicity(state);

      expect(status.clampedSkip).toBe(true);
      expect(state.character.age).toBe(10);

      // Siklus berikutnya maju tepat 1 tahun
      const rng = new Mulberry32PRNG(505);
      tickAge(state, rng);
      expect(state.character.age).toBe(11);
    });
  });
});
