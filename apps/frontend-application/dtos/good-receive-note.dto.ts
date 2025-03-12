import { z } from 'zod';

export const GoodReceiveNoteCreateSchema = z.object({
  id: z.string().uuid().optional(),
  inventory_transaction_id: z.string().uuid(),
  name: z.string(),
});

export type GoodReceiveNoteCreateModel = z.infer<
  typeof GoodReceiveNoteCreateSchema
>;

export class GoodReceiveNoteCreateDto implements GoodReceiveNoteCreateModel {
  id?: string;
  inventory_transaction_id!: string;
  name!: string;
}

export const GoodReceiveNoteUpdateSchema = z.object({
  id: z.string().uuid(),
  inventory_transaction_id: z.string().uuid().optional(),
  name: z.string().optional(),
});

export type GoodReceiveNoteUpdateModel = z.infer<
  typeof GoodReceiveNoteUpdateSchema
>;

export class GoodReceiveNoteUpdateDto implements GoodReceiveNoteUpdateModel {
  id!: string;
  inventory_transaction_id?: string;
  name?: string;
}
