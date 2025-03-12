import { z } from 'zod';

export const ExchangeRateCreateSchema = z.object({
  id: z.string().uuid().optional(),
  at_date: z.union([z.date(), z.string()]).nullable().optional(),
  rate: z.number().nullable().optional(),
  currency_id: z.string().uuid(),
});

export type ExchangeRateCreateModel = z.infer<typeof ExchangeRateCreateSchema>;

export class ExchangeRateCreateDto implements ExchangeRateCreateModel {
  id?: string;
  at_date?: Date | string | null;
  rate?: number | null;
  currency_id!: string;
}

export const ExchangeRateUpdateSchema = z.object({
  id: z.string().uuid(),
  at_date: z.union([z.date(), z.string()]).nullable().optional(),
  rate: z.number().nullable().optional(),
  currency_id: z.string().uuid(),
});

export type ExchangeRateUpdateModel = z.infer<typeof ExchangeRateUpdateSchema>;

export class ExchangeRateUpdateDto implements ExchangeRateUpdateModel {
  id!: string;
  at_date?: Date | string | null;
  rate?: number | null;
  currency_id!: string;
}

