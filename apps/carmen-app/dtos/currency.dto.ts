import { z } from "zod";

const errorMessages = {
    th: {
        currency: {
            code: {
                required: 'กรุณาระบุรหัสสกุลเงิน',
                invalid: 'รหัสสกุลเงินไม่ถูกต้อง ต้องเป็นตัวอักษรภาษาอังกฤษ 3 ตัว เช่น THB, USD'
            },
            name: {
                required: 'กรุณาระบุชื่อสกุลเงิน',
                min: 'ชื่อสกุลเงินต้องมีอย่างน้อย 1 ตัวอักษร'
            },
            symbol: {
                required: 'กรุณาระบุสัญลักษณ์สกุลเงิน',
                min: 'สัญลักษณ์สกุลเงินต้องมีอย่างน้อย 1 ตัวอักษร',
                max: 'สัญลักษณ์สกุลเงินต้องไม่เกิน 3 ตัวอักษร'
            },
            exchange_rate: {
                required: 'กรุณาระบุอัตราแลกเปลี่ยน',
                positive: 'อัตราแลกเปลี่ยนต้องเป็นจำนวนบวก',
                number: 'อัตราแลกเปลี่ยนต้องเป็นตัวเลข'
            },
            is_active: {
                required: 'กรุณาระบุสถานะการใช้งาน',
                boolean: 'สถานะการใช้งานต้องเป็น true หรือ false'
            }
        }
    },
    en: {
        currency: {
            code: {
                required: 'Currency code is required',
                invalid: 'Currency code must be 3 uppercase letters (e.g., THB, USD)'
            },
            name: {
                required: 'Currency name is required',
                min: 'Currency name must be at least 1 character'
            },
            symbol: {
                required: 'Currency symbol is required',
                min: 'Currency symbol must be at least 1 character',
                max: 'Currency symbol must not exceed 3 characters'
            },
            exchange_rate: {
                required: 'Exchange rate is required',
                positive: 'Exchange rate must be a positive number',
                number: 'Exchange rate must be a number'
            },
            is_active: {
                required: 'Active status is required',
                boolean: 'Active status must be true or false'
            }
        }
    }
};

export const getErrorMessage = (lang: 'th' | 'en', path: string) => {
    const keys = path.split('.');
    let message: any = errorMessages[lang];

    for (const key of keys) {
        message = message?.[key];
    }

    return message || `Error: ${path}`;
};

export const currencyBaseSchema = z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    is_active: z.boolean(),
    symbol: z.string().min(1).max(3),
    exchange_rate: z.number().positive()
});

export const currencyCreateSchema = currencyBaseSchema;

export const currencyGetSchema = currencyBaseSchema.extend({
    id: z.string().min(1),
});

export const currencyUpdateSchema = currencyGetSchema;

export type CurrencyCreateDto = z.infer<typeof currencyCreateSchema>;
export type CurrencyUpdateDto = z.infer<typeof currencyUpdateSchema>;
export type CurrencyGetDto = z.infer<typeof currencyGetSchema>;
