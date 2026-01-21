import { z } from "zod";

export type UserListDto = {
  user_id: string;
  email: string;
  firstname: string;
  middlename: string;
  lastname: string;
};

export const UserRoleUpdatePayloadSchema = z.object({
  user_id: z.string().min(1),
  application_role_id: z.object({
    add: z.array(z.string()).optional(),
    remove: z.array(z.string()).optional(),
  }),
});

export type UserRoleUpdatePayloadDto = z.infer<typeof UserRoleUpdatePayloadSchema>;