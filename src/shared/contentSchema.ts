/**
 * CONTENT SCHEMA VALIDATOR CONTRACT (Zod)
 * Validasi skema runtime data naratif, bank skenario, dan lowongan karir (D1, D6).
 */

import { z } from 'zod';

export const choiceSchema = z.object({
  text: z.string().min(2).max(60),
  statDeltas: z.object({
    happiness: z.number().min(-50).max(50).optional(),
    health: z.number().min(-50).max(50).optional(),
    smarts: z.number().min(-50).max(50).optional(),
    looks: z.number().min(-50).max(50).optional(),
    karma: z.number().min(-20).max(20).optional(),
    discipline: z.number().min(-50).max(50).optional(),
    fertility: z.number().min(-50).max(50).optional(),
  }),
  logText: z.string().min(5).max(150),
  karmaDelta: z.number().min(-20).max(20).optional(),
});

export const scenarioEventSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/, 'ID event harus berupa huruf kecil, angka, atau underscore'),
    category: z.enum(['Childhood', 'School', 'Career', 'Crime', 'Health', 'Drama']),
    minAge: z.number().int().min(0).max(120),
    maxAge: z.number().int().min(0).max(120),
    title: z.string().min(3).max(40),
    description: z.string().min(10).max(250),
    choices: z.array(choiceSchema).min(2, 'Minimal 2 opsi pilihan').max(4, 'Maksimal 4 opsi pilihan'),
  })
  .refine(data => data.maxAge >= data.minAge, {
    message: 'maxAge harus lebih besar atau sama dengan minAge',
    path: ['maxAge'],
  });

export const jobListingSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  title: z.string().min(3).max(50),
  minSmarts: z.number().int().min(0).max(100),
  minEducation: z.enum(['None', 'Primary', 'Secondary', 'University']),
  baseSalary: z.number().int().min(5000).max(5000000),
});

export type ValidatedChoice = z.infer<typeof choiceSchema>;
export type ValidatedScenarioEvent = z.infer<typeof scenarioEventSchema>;
export type ValidatedJobListing = z.infer<typeof jobListingSchema>;

export function validateScenarioEvent(data: unknown): ValidatedScenarioEvent {
  return scenarioEventSchema.parse(data);
}

export function validateJobListing(data: unknown): ValidatedJobListing {
  return jobListingSchema.parse(data);
}
