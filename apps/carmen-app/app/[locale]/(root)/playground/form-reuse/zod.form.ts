import { z } from "zod";

export const userFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  is_active: z.boolean(),
  price: z.number().min(0, {
    message: "Price must be greater than 0.",
  }),
  details: z.object({
    add: z.array(
      z.object({
        name: z.string().min(1, "Name is required"),
        age: z.number().min(0, "Age must be greater than or equal to 0"),
      })
    ),
    update: z.array(
      z.object({
        name: z.string().min(1, "Name is required"),
        age: z.number().min(0, "Age must be greater than or equal to 0"),
      })
    ),
    remove: z.array(
        z.object({
          id: z.string().min(1, "Name is required"),
        })
      ),
  }),
});

export const locationFormSchema = z.object({
  name: z.string().min(1, "Title is required"),
  code: z.string().min(1, "Code is required"),
  is_active: z.boolean(),
  itemDetails: z.array(z.object({
    add: z.array(z.object({
        name: z.string().min(1, "Name is required"),
        code: z.string().min(1, "Code is required"),
        is_active: z.boolean(),
    })),
    update: z.array(z.object({
        name: z.string().min(1, "Name is required"),
        code: z.string().min(1, "Code is required"),
        is_active: z.boolean(),
    })),
    remove: z.array(z.object({
        id: z.string().min(1, "Name is required"),
    })),
  })),
});
