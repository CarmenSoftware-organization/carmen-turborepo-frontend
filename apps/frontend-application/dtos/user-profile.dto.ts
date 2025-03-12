import { z } from 'zod';

//#region  Zod Create
export const UserProfileCreateSchema = z
  .object({
    user_id: z
      .string({
        required_error: 'user_id field is required',
      })
      .min(3, 'user_id must be at least 3 characters'),
    firstname: z
      .string({
        required_error: 'firstname field is required',
      })
      .min(3, 'firstname must be at least 3 characters'),
    middlename: z
      .string({
        required_error: 'middlename field is required',
      })
      .optional(),
    lastname: z
      .string({
        required_error: 'lastname field is required',
      })
      .optional(),
    bio: z
      .object({
        age: z.number().optional(),
        occupation: z.string().optional(),
        education: z.string().optional(),
        contact: z.string().optional(),
        address: z.string().optional(),
        other: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type UserProfileCreateModel = z.infer<typeof UserProfileCreateSchema>;

export class UserProfileCreateDto implements UserProfileCreateModel {
  id?: string;
  user_id!: string;
  firstname!: string;
  middlename?: string;
  lastname?: string;
  bio?: {
    age?: number;
    occupation?: string;
    education?: string;
    contact?: string;
    address?: string;
    other?: string;
  };
}

//#endregion Zod Create

//#region  Zod Update

export const UserProfileUpdateSchema = z.object({
  id: z.string().optional(),
  user_id: z
    .string({
      required_error: 'user_id field is required',
    })
    .min(3, 'user_id must be at least 3 characters'),
  firstname: z
    .string({
      required_error: 'firstname field is required',
    })
    .min(3, 'firstname must be at least 3 characters'),
  middlename: z
    .string({
      required_error: 'middlename field is required',
    })
    .optional(),
  lastname: z
    .string({
      required_error: 'lastname field is required',
    })
    .optional(),
  bio: z
    .object({
      age: z.number().optional(),
      occupation: z.string().optional(),
      education: z.string().optional(),
      contact: z.string().optional(),
      address: z.string().optional(),
      other: z.string().optional(),
    })
    .optional(),
});

export type UserProfileUpdateModel = z.infer<typeof UserProfileUpdateSchema>;

export class UserProfileUpdateDto implements UserProfileUpdateModel {
  id?: string;
  user_id!: string;
  firstname!: string;
  middlename?: string;
  lastname?: string;
  bio?: {
    age?: number;
    occupation?: string;
    education?: string;
    contact?: string;
    address?: string;
    other?: string;
  };
}

//#endregion Zod Update
