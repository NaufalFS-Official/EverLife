/**
 * EDUCATION & CAREER PIPELINE (EverLife)
 * Layer 1 Core: School milestones, job hunting, promotion logic, work performance.
 */

import { Mulberry32PRNG } from '../shared';
import { GlobalGameState, EducationLevel } from './types';

export interface JobDefinition {
  id: string;
  title: string;
  category: string;
  baseSalary: number;
  minEducation: EducationLevel;
  minSmarts: number;
}

export const INITIAL_JOB_LISTINGS: readonly JobDefinition[] = [
  {
    id: 'job_cashier',
    title: 'Pramuniaga Minimarket',
    category: 'Entry',
    baseSalary: 4200,
    minEducation: 'None',
    minSmarts: 10,
  },
  {
    id: 'job_waiter',
    title: 'Pelayan Kafe',
    category: 'Service',
    baseSalary: 4800,
    minEducation: 'Secondary',
    minSmarts: 20,
  },
  {
    id: 'job_apprentice_dev',
    title: 'Junior Web Developer',
    category: 'Tech',
    baseSalary: 12000,
    minEducation: 'Secondary',
    minSmarts: 55,
  },
  {
    id: 'job_accountant',
    title: 'Akuntan Perusahaan',
    category: 'Corporate',
    baseSalary: 18000,
    minEducation: 'University',
    minSmarts: 65,
  },
  {
    id: 'job_software_engineer',
    title: 'Senior Software Engineer',
    category: 'Tech',
    baseSalary: 32000,
    minEducation: 'University',
    minSmarts: 75,
  },
  {
    id: 'job_doctor',
    title: 'Dokter Umum',
    category: 'Medical',
    baseSalary: 48000,
    minEducation: 'University',
    minSmarts: 85,
  },
  {
    id: 'job_pilot',
    title: 'Pilot Maskapai',
    category: 'Aviation',
    baseSalary: 55000,
    minEducation: 'University',
    minSmarts: 80,
  },
];

const EDUCATION_RANKS: Record<EducationLevel, number> = {
  None: 0,
  Primary: 1,
  Secondary: 2,
  University: 3,
};

/**
 * Mengevaluasi kemajuan pendidikan tahunan secara otomatis berdasarkan usia.
 */
export function processAnnualEducation(state: GlobalGameState): string | null {
  const { age, education } = state.character;

  if (age === 6 && education.level === 'None') {
    education.level = 'Primary';
    return 'Saya mulai masuk Sekolah Dasar (SD).';
  }
  if (age === 12 && education.level === 'Primary') {
    education.level = 'Secondary';
    return 'Saya lulus SD dan masuk Sekolah Menengah Pertama (SMP).';
  }
  if (age === 18 && education.level === 'Secondary') {
    return 'Saya lulus Sekolah Menengah Atas (SMA) dengan hasil memuaskan!';
  }

  return null;
}

/**
 * Mendaftar kuliah (Universitas). Memerlukan syarat Smarts >= 60 dan usia >= 18.
 */
export function enrollUniversity(state: GlobalGameState): { success: boolean; message: string } {
  const { character } = state;
  if (character.age < 18) {
    return { success: false, message: 'Usia belum mencukupi untuk kuliah (minimal 18 tahun).' };
  }
  if (character.education.level === 'University') {
    return { success: false, message: 'Anda sudah menempuh pendidikan perguruan tinggi.' };
  }
  if (character.attributes.smarts < 60) {
    return { success: false, message: 'Nilai akademis (Smarts) tidak mencukupi untuk seleksi masuk universitas (min 60%).' };
  }

  character.education.level = 'University';
  character.education.grades = 85;
  return { success: true, message: 'Selamat! Anda diterima di Universitas bergengsi.' };
}

/**
 * Melamar pekerjaan dari daftar lowongan.
 */
export function applyForJob(
  state: GlobalGameState,
  jobDef: JobDefinition,
  rng: Mulberry32PRNG
): { success: boolean; message: string } {
  const { character } = state;

  if (character.age < 18) {
    return { success: false, message: 'Anda harus berusia minimal 18 tahun untuk bekerja penuh waktu.' };
  }

  const currentEduRank = EDUCATION_RANKS[character.education.level];
  const requiredEduRank = EDUCATION_RANKS[jobDef.minEducation];

  if (currentEduRank < requiredEduRank) {
    return { success: false, message: `Pendidikan tidak mencukupi. Dibutuhkan minimal ${jobDef.minEducation}.` };
  }

  if (character.attributes.smarts < jobDef.minSmarts) {
    return { success: false, message: 'Kualifikasi Smarts tidak mencukupi saat sesi wawancara.' };
  }

  // Peluang lolos wawancara dipengaruhi Smarts & Looks
  const interviewBonus = (character.attributes.smarts + character.attributes.looks) / 200;
  const passThreshold = 0.35 - interviewBonus * 0.2; // 15% - 35% risiko gagal
  if (rng.next() < passThreshold) {
    return { success: false, message: 'Pihak perekrut memilih kandidat lain saat wawancara final.' };
  }

  character.job = {
    id: jobDef.id,
    title: jobDef.title,
    salary: jobDef.baseSalary,
    performance: 75,
  };

  return { success: true, message: `Selamat! Anda resmi bekerja sebagai ${jobDef.title} dengan gaji $${jobDef.baseSalary.toLocaleString()}/tahun.` };
}

/**
 * Resign dari pekerjaan aktif.
 */
export function resignJob(state: GlobalGameState): boolean {
  if (!state.character.job) return false;
  state.character.job = null;
  state.character.finances.annualSalary = 0;
  return true;
}

/**
 * Meningkatkan performa kerja melalui lembur / dedikasi.
 */
export function workHarder(state: GlobalGameState): { success: boolean; message: string } {
  if (!state.character.job) {
    return { success: false, message: 'Anda tidak memiliki pekerjaan aktif.' };
  }

  state.character.job.performance = Math.min(100, state.character.job.performance + 15);
  state.character.attributes.happiness = Math.max(0, state.character.attributes.happiness - 5);
  return { success: true, message: 'Anda bekerja lembur dengan tekun! Performa kerja meningkat.' };
}
