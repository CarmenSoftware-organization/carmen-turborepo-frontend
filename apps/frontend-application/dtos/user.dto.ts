import { z } from 'zod';

//#region  Zod Create
export const UserCreateSchema = z
  .object({
    username: z
      .string({
        required_error: 'Username field is required',
      })
      .min(3, 'Username must be at least 3 characters'),
    email: z
      .string({
        required_error: 'email field is required',
      })
      .min(3, 'email must be at least 3 characters'),
    is_active: z.boolean({
      required_error: 'is_active field is required',
    }),
    is_consent: z.boolean({
      required_error: 'is_consent field is required',
    }),
  })
  .strict();

export type UserCreateModel = z.infer<typeof UserCreateSchema>;

export class UserCreateDto implements UserCreateModel {
  id?: string;
  username!: string;
  email!: string;
  is_consent!: boolean;
  is_active!: boolean;
}

//#endregion Zod Create

//#region  Zod Update

export const UserUpdateSchema = z
  .object({
    id: z.string().optional(),
    username: z
      .string({ required_error: 'Username field is required' })
      .optional(),
    email: z.string({ required_error: 'email field is required' }).optional(),
    is_consent: z
      .boolean({ required_error: 'is_consent field is required' })
      .optional(),
    is_active: z
      .boolean({ required_error: 'is_active field is required' })
      .optional(),
  })
  .strict();

export type UserUpdateModel = z.infer<typeof UserUpdateSchema>;

export class UserUpdateDto implements UserUpdateModel {
  id?: string;
  username?: string;
  email?: string;
  is_consent?: boolean;
  is_active?: boolean;
}

