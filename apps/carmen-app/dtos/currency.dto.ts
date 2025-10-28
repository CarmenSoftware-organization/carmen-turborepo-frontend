/**
 * Currency DTO Types
 * API Data Transfer Objects - Pure TypeScript types (no Zod)
 */

/**
 * DTO สำหรับ Create request
 */
export interface CurrencyCreateDto {
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  symbol: string;
  exchange_rate: number;
}

/**
 * DTO สำหรับ GET response (รวม id)
 */
export interface CurrencyGetDto extends CurrencyCreateDto {
  id: string;
}

/**
 * DTO สำหรับ Update request (รวม id)
 */
export interface CurrencyUpdateDto extends CurrencyCreateDto {
  id: string;
}
