import { z } from 'zod';

//#region  Zod Create
export const UserBusinessUnitCreateSchema = z
  .object({
    user_id: z
      .string({
        required_error: 'user_id field is required',
      })
      .min(3, 'user_id must be at least 3 characters'),
    business_unit_id: z
      .string({
        required_error: 'business_unit_id field is required',
      })
      .min(3, 'business_unit_id must be at least 3 characters'),
  })
  .strict();

export type UserBusinessUnitCreateModel = z.infer<
  typeof UserBusinessUnitCreateSchema
>;

export class UserBusinessUnitCreateDto implements UserBusinessUnitCreateModel {
  id?: string;
  user_id!: string;
  business_unit_id!: string;
}

//#endregion Zod Create

//#region  Zod Update

export const UserBusinessUnitUpdateSchema = z
  .object({
    id: z.string().optional(),
    user_id: z
      .string({ required_error: 'user_id field is required' })
      .optional(),
    business_unit_id: z
      .string({ required_error: 'business_unit_id field is required' })
      .optional(),
  })
  .strict();

export type UserBusinessUnitUpdateModel = z.infer<
  typeof UserBusinessUnitUpdateSchema
>;

export class UserBusinessUnitUpdateDto implements UserBusinessUnitUpdateModel {
  id?: string;
  user_id?: string;
  business_unit_id?: string;
}

