import { z } from 'zod';

export const GoodReceiveNoteDetailCreateSchema = z.object({
  id: z.string().uuid().optional(),
  good_receive_note_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  total_price: z.number().min(0),
});

export type GoodReceiveNoteDetailCreateModel = z.infer<
  typeof GoodReceiveNoteDetailCreateSchema
>;

export class GoodReceiveNoteDetailCreateDto
  implements GoodReceiveNoteDetailCreateModel
{
  id?: string;
  good_receive_note_id!: string;
  product_id!: string;
  quantity!: number;
  unit_price!: number;
  total_price!: number;
}

export const GoodReceiveNoteDetailUpdateSchema = z.object({
  id: z.string().uuid(),
  good_receive_note_id: z.string().uuid().optional(),
  product_id: z.string().uuid().optional(),
  quantity: z.number().min(1).optional(),
  unit_price: z.number().min(0).optional(),
  total_price: z.number().min(0).optional(),
});

export type GoodReceiveNoteDetailUpdateModel = z.infer<
  typeof GoodReceiveNoteDetailUpdateSchema
>;

export class GoodReceiveNoteDetailUpdateDto
  implements GoodReceiveNoteDetailUpdateModel
{
  id!: string;
  good_receive_note_id?: string;
  product_id?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
}
