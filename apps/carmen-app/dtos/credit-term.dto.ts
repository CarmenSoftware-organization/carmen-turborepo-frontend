/**
 * Credit Term DTO - Pure TypeScript interfaces
 * Zod schemas moved to: app/.../credit-term/_schemas/credit-term-form.schema.ts
 */

/**
 * Credit Term Form DTO (for create)
 */
export interface CreateCreditTermFormValues {
  name: string;
  value: number;
  description?: string;
  is_active: boolean;
  note?: string;
}

/**
 * Credit Term GetAll DTO (with id)
 */
export interface CreditTermGetAllDto extends CreateCreditTermFormValues {
  id: string;
}

/**
 * Credit Term Update DTO
 */
export interface UpdateCreditTermDto extends CreateCreditTermFormValues {
  id: string;
}
