import { z } from 'zod';

//#region  Zod Create
export const ClusterCreateSchema = z
  .object({
    code: z
      .string({
        required_error: 'Code field is required',
      })
      .min(3, 'Code must be at least 3 characters'),
    name: z
      .string({
        required_error: 'Name field is required',
      })
      .min(3, 'name must be at least 3 characters'),
    is_active: z.boolean({
      required_error: 'is_active field is required',
    }),
  })
  .strict();

export type ClusterCreateModel = z.infer<typeof ClusterCreateSchema>;

export class ClusterCreateDto implements ClusterCreateModel {
  code!: string;
  name!: string;
  is_active!: boolean;
}

//#endregion Zod Create

//#region  Zod Update

export const ClusterUpdateSchema = z
  .object({
    id: z.string().optional(),
    code: z
      .string({
        required_error: 'Code field is required',
      })
      .min(3, 'Code must be at least 3 characters')
      .optional(),
    name: z
      .string({
        required_error: 'Name field is required',
      })
      .min(3, 'name must be at least 3 characters')
      .optional(),
    is_active: z
      .boolean({
        required_error: 'is_active field is required',
      })
      .optional(),
  })
  .strict();

export type ClusterUpdateModel = z.infer<typeof ClusterUpdateSchema>;

export class ClusterUpdateDto implements ClusterUpdateModel {
  id?: string;
  code?: string;
  name?: string;
  is_active?: boolean;
}

