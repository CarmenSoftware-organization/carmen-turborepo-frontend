/**
 * Tax Profile DTO - Pure TypeScript interfaces
 * Zod schemas moved to: app/.../tax-profile/_schemas/tax-profile-form.schema.ts
 */

/**
 * Tax Profile Form DTO
 */
export interface TaxProfileFormData {
  name: string;
  tax_rate: number;
  is_active: boolean;
}

/**
 * Tax Profile GetAll DTO (with id)
 */
export interface TaxProfileGetAllDto extends TaxProfileFormData {
  id: string;
}

/**
 * Tax Profile Edit DTO (with id)
 */
export interface TaxProfileEditDto extends TaxProfileFormData {
  id: string;
}
