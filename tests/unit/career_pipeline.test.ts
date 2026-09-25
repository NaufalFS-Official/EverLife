import { describe, it, expect } from 'vitest';
import {
  INITIAL_JOB_LISTINGS,
  applyForJob,
  enrollUniversity,
  resignJob,
  workHarder,
} from '../../src/core/career';
import { createNewLife } from '../../src/core/character';
import { Mulberry32PRNG } from '../../src/shared';

describe('TEST-AC-005: Career & Education Pipeline', () => {
  it('harus menolak pelamar di bawah usia 18 tahun', () => {
    const state = createNewLife({
      firstName: 'Kid',
      lastName: 'Gamer',
      gender: 'Male',
      seed: 123,
    });
    state.character.age = 16;
    const rng = new Mulberry32PRNG(123);

    const cashierJob = INITIAL_JOB_LISTINGS[0]!;
    const res = applyForJob(state, cashierJob, rng);

    expect(res.success).toBe(false);
    expect(res.message).toContain('minimal 18 tahun');
  });

  it('harus menolak pekerjaan yang membutuhkan gelar sarjana jika belum lulus kuliah', () => {
    const state = createNewLife({
      firstName: 'Junior',
      lastName: 'Applicant',
      gender: 'Male',
      seed: 456,
    });
    state.character.age = 20;
    state.character.education.level = 'Secondary';
    const rng = new Mulberry32PRNG(456);

    const doctorJob = INITIAL_JOB_LISTINGS.find((j) => j.id === 'job_doctor')!;
    const res = applyForJob(state, doctorJob, rng);

    expect(res.success).toBe(false);
    expect(res.message).toContain('Pendidikan tidak mencukupi');
  });

  it('harus berhasil kuliah di universitas jika Smarts >= 60 dan usia >= 18', () => {
    const state = createNewLife({
      firstName: 'Smarty',
      lastName: 'Student',
      gender: 'Male',
      seed: 789,
    });
    state.character.age = 18;
    state.character.attributes.smarts = 75;

    const res = enrollUniversity(state);
    expect(res.success).toBe(true);
    expect(state.character.education.level).toBe('University');
  });

  it('harus dapat mengundurkan diri dan meningkatkan performa kerja', () => {
    const state = createNewLife({
      firstName: 'Worker',
      lastName: 'Bee',
      gender: 'Male',
      seed: 999,
    });
    state.character.age = 22;
    state.character.job = {
      id: 'job_cashier',
      title: 'Kasir Minimarket',
      salary: 4500,
      performance: 60,
    };

    workHarder(state);
    expect(state.character.job.performance).toBe(75);

    const resigned = resignJob(state);
    expect(resigned).toBe(true);
    expect(state.character.job).toBeNull();
  });
});
