import * as z from "zod";

export const reminderRuleSchema = z.object({
  type: z.enum(["before_deadline", "after_deadline"]),
  days: z.number().min(1),
  recipients: z.array(
    z.object({
      type: z.enum(["email", "role", "user_id"]),
      value: z.string(),
    })
  ),
  message: z.string().optional(),
  enabled: z.boolean(),
});

export const rfpFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["active", "inactive", "draft", "submit", "completed"]),
  description: z.string().optional(),
  valid_period: z.number().min(1, "Valid period must be at least 1 day"),
  template_id: z.string().optional(),
  portal_duration: z.number().min(1),
  rfp_type: z.enum(["buy", "sell", "recurring"]),
  submission_method: z.enum(["auto", "manual"]),
  require_approval: z.boolean(),
  auto_reminder: z.boolean(),
  priority: z.enum(["high", "medium", "low"]),
  instructions: z.string().optional(),
  reminders: z.array(reminderRuleSchema).optional(),
  escalations: z.array(reminderRuleSchema).optional(),
  vendors: z.array(z.string()).optional(),
});

export type RfpFormValues = z.infer<typeof rfpFormSchema>;
