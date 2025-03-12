import { z } from 'zod';

export const StockInCreateSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  total_price: z.number().min(0),
  stock_in_date: z.date(),
  remarks: z.string().optional(),
});

export type StockInCreateModel = z.infer<typeof StockInCreateSchema>;

export class StockInCreateDto implements StockInCreateModel {
  id?: string;
  product_id!: string;
  quantity!: number;
  unit_price!: number;
  total_price!: number;
  stock_in_date!: Date;
  remarks?: string;
}

export const StockInUpdateSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid().optional(),
  quantity: z.number().min(1).optional(),
  unit_price: z.number().min(0).optional(),
  total_price: z.number().min(0).optional(),
  stock_in_date: z.date().optional(),
  remarks: z.string().optional(),
});

export type StockInUpdateModel = z.infer<typeof StockInUpdateSchema>;

export class StockInUpdateDto implements StockInUpdateModel {
  id!: string;
  product_id?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  stock_in_date?: Date;
  remarks?: string;
}
