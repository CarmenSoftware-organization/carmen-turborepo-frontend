import { z } from 'zod';

export const StockOutCreateSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  total_price: z.number().min(0),
  stock_out_date: z.date(),
  remarks: z.string().optional(),
});

export type StockOutCreateModel = z.infer<typeof StockOutCreateSchema>;

export class StockOutCreateDto implements StockOutCreateModel {
  id?: string;
  product_id!: string;
  quantity!: number;
  unit_price!: number;
  total_price!: number;
  stock_out_date!: Date;
  remarks?: string;
}

export const StockOutUpdateSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid().optional(),
  quantity: z.number().min(1).optional(),
  unit_price: z.number().min(0).optional(),
  total_price: z.number().min(0).optional(),
  stock_out_date: z.date().optional(),
  remarks: z.string().optional(),
});

export type StockOutUpdateModel = z.infer<typeof StockOutUpdateSchema>;

export class StockOutUpdateDto implements StockOutUpdateModel {
  id!: string;
  product_id?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  stock_out_date?: Date;
  remarks?: string;
}
