import * as z from "zod";

export const rfpFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    status: z.enum(["active", "inactive", "draft", "submit", "completed"]),
    custom_message: z.string().optional(),
    start_date: z.string({
      required_error: "Start date is required",
    }),
    end_date: z.string({
      required_error: "End date is required",
    }),
    pricelist_template_id: z.string().optional(),
    dimension: z.any(),
    info: z.string().optional(),
    email_template_id: z.string().optional(),
    vendors: z
      .object({
        add: z
          .array(
            z.object({
              vendor_id: z.string(),
              vendor_name: z.string(),
              sequence_no: z.number(),
              contact_person: z.string().optional(),
              contact_phone: z.string().optional(),
              contact_email: z.string().optional(),
              dimension: z.any(),
            })
          )
          .optional(),
        remove: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;
      return new Date(data.end_date) >= new Date(data.start_date);
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

export type RfpFormValues = z.infer<typeof rfpFormSchema>;
