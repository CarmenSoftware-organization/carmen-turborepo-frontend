import { roundToDecimals } from "../format/number";

/**
 * Tax calculation result interface
 */
export interface TaxCalculationResult {
  originalAmount: number;
  vatAmount: number;
  withholdingAmount: number;
  netTransferAmount: number;
  vatRate: number;
  withholdingRate: number;
  currency: string;
  useVat?: boolean;
  useWithholding?: boolean;
}

/**
 * Reverse tax calculation result interface
 */
export interface ReverseTaxCalculationResult extends TaxCalculationResult {
  isReverseCalculation: boolean;
  useVat: boolean;
  useWithholding: boolean;
}

/**
 * Tax calculation results with detailed breakdown
 */
export interface TaxCalculationResults {
  originalPrice: number;
  vatAmount: number;
  withholdingAmount: number;
  finalAmount: number;
  priceBeforeVat: number;
}

/**
 * คำนวณจำนวน VAT จากจำนวนเงินต้น
 * Calculate VAT amount from original amount
 * @param originalAmount - Original amount before VAT
 * @param vatRate - VAT rate as percentage (e.g., 7 for 7%)
 * @param useVat - Whether to apply VAT
 * @returns VAT amount
 * @example
 * calculateVatAmount(100, 7, true) // 7
 */
const calculateVatAmount = (
  originalAmount: number,
  vatRate: number,
  useVat: boolean
): number => {
  return useVat ? (originalAmount * vatRate) / 100 : 0;
};

/**
 * คำนวณจำนวนหัก ณ ที่จ่ายจากราคารวม VAT
 * Calculate withholding tax from amount including VAT
 * @param originalAmount - Original amount
 * @param vatAmount - VAT amount
 * @param withholdingRate - Withholding tax rate as percentage
 * @param useWithholding - Whether to apply withholding tax
 * @returns Withholding tax amount
 * @example
 * calculateWithholdingAmount(100, 7, 3, true) // 3.21 (3% of 107)
 */
const calculateWithholdingAmount = (
  originalAmount: number,
  vatAmount: number,
  withholdingRate: number,
  useWithholding: boolean
): number => {
  return useWithholding
    ? ((originalAmount + vatAmount) * withholdingRate) / 100
    : 0;
};

/**
 * คำนวณยอดโอนสุดท้าย
 * Calculate final net transfer amount
 * @param originalAmount - Original amount
 * @param vatAmount - VAT amount
 * @param withholdingAmount - Withholding tax amount
 * @returns Net transfer amount
 * @example
 * calculateNetTransferAmount(100, 7, 3.21) // 103.79
 */
const calculateNetTransferAmount = (
  originalAmount: number,
  vatAmount: number,
  withholdingAmount: number
): number => {
  return originalAmount + vatAmount - withholdingAmount;
};

/**
 * คำนวณจำนวนเงินต้นจากยอดรวม VAT (สำหรับโหมดรวม VAT)
 * Calculate original amount from VAT-inclusive amount
 * @param amountIncludingVat - Amount including VAT
 * @param vatRate - VAT rate as percentage
 * @param useVat - Whether VAT is included
 * @returns Original amount before VAT
 * @example
 * calculateOriginalAmountFromVatInclusive(107, 7, true) // 100
 */
const calculateOriginalAmountFromVatInclusive = (
  amountIncludingVat: number,
  vatRate: number,
  useVat: boolean
): number => {
  if (useVat) {
    // amountIncludingVat = original * (1 + vatRate/100)
    // original = amountIncludingVat / (1 + vatRate/100)
    return amountIncludingVat / (1 + vatRate / 100);
  } else {
    // ถ้าไม่ใช้ VAT แสดงว่า amount นั้นคือ original amount
    return amountIncludingVat;
  }
};

/**
 * จัดรูปแบบผลลัพธ์การคำนวณภาษี
 * Format tax calculation result with proper rounding
 * @returns Formatted tax calculation result
 */
const formatTaxResult = (
  originalAmount: number,
  vatAmount: number,
  withholdingAmount: number,
  netTransferAmount: number,
  vatRate: number,
  withholdingRate: number,
  currency: string,
  useVat: boolean,
  useWithholding: boolean
): TaxCalculationResult => {
  return {
    originalAmount: roundToDecimals(originalAmount),
    vatAmount: roundToDecimals(vatAmount),
    withholdingAmount: roundToDecimals(withholdingAmount),
    netTransferAmount: roundToDecimals(netTransferAmount),
    vatRate,
    withholdingRate,
    currency,
    useVat,
    useWithholding,
  };
};

/**
 * คำนวณภาษี VAT และหัก ณ ที่จ่าย
 * Calculate VAT and withholding tax from original amount
 * @param amount - Original amount before tax
 * @param vatRate - VAT rate as percentage (e.g., 7)
 * @param withholdingRate - Withholding tax rate as percentage (e.g., 3)
 * @param currency - Currency code (default: "THB")
 * @param useVat - Apply VAT (default: true)
 * @param useWithholding - Apply withholding tax (default: true)
 * @returns Tax calculation result with all amounts
 * @example
 * calculateTax(100, 7, 3, "THB", true, true)
 * // {
 * //   originalAmount: 100,
 * //   vatAmount: 7,
 * //   withholdingAmount: 3.21,
 * //   netTransferAmount: 103.79,
 * //   ...
 * // }
 */
export const calculateTax = (
  amount: number,
  vatRate: number,
  withholdingRate: number,
  currency: string = "THB",
  useVat: boolean = true,
  useWithholding: boolean = true
): TaxCalculationResult => {
  const vatAmount = calculateVatAmount(amount, vatRate, useVat);
  const withholdingAmount = calculateWithholdingAmount(
    amount,
    vatAmount,
    withholdingRate,
    useWithholding
  );
  const netTransferAmount = calculateNetTransferAmount(
    amount,
    vatAmount,
    withholdingAmount
  );

  return formatTaxResult(
    amount,
    vatAmount,
    withholdingAmount,
    netTransferAmount,
    vatRate,
    withholdingRate,
    currency,
    useVat,
    useWithholding
  );
};

/**
 * คำนวณย้อนกลับจากยอดรวม VAT เพื่อหาจำนวนเงินต้น VAT และหัก ณ ที่จ่าย
 * Reverse calculate tax from VAT-inclusive amount
 * @param amountIncludingVat - Amount that includes VAT
 * @param vatRate - VAT rate as percentage
 * @param withholdingRate - Withholding tax rate as percentage
 * @param currency - Currency code (default: "THB")
 * @param useVat - VAT is included (default: true)
 * @param useWithholding - Apply withholding tax (default: true)
 * @returns Reverse tax calculation result
 * @example
 * calculateReverseTax(107, 7, 3, "THB", true, true)
 * // {
 * //   originalAmount: 100,
 * //   vatAmount: 7,
 * //   withholdingAmount: 3.21,
 * //   netTransferAmount: 103.79,
 * //   isReverseCalculation: true,
 * //   ...
 * // }
 */
export const calculateReverseTax = (
  amountIncludingVat: number,
  vatRate: number,
  withholdingRate: number,
  currency: string = "THB",
  useVat: boolean = true,
  useWithholding: boolean = true
): ReverseTaxCalculationResult => {
  // 1. คำนวณจำนวนเงินต้นจากยอดรวม VAT
  const originalAmount = calculateOriginalAmountFromVatInclusive(
    amountIncludingVat,
    vatRate,
    useVat
  );

  // 2. คำนวณจำนวน VAT
  const vatAmount = calculateVatAmount(originalAmount, vatRate, useVat);

  // 3. คำนวณหัก ณ ที่จ่าย (จากยอดรวม VAT ไม่ใช่จาก original amount)
  const withholdingAmount = useWithholding
    ? (amountIncludingVat * withholdingRate) / 100
    : 0;

  // 4. คำนวณยอดโอนสุดท้าย
  const netTransferAmount = amountIncludingVat - withholdingAmount;

  const result = formatTaxResult(
    originalAmount,
    vatAmount,
    withholdingAmount,
    netTransferAmount,
    vatRate,
    withholdingRate,
    currency,
    useVat,
    useWithholding
  );

  return {
    ...result,
    isReverseCalculation: true,
    useVat,
    useWithholding,
  };
};

/**
 * คำนวณภาษีแบบละเอียด (รองรับทั้ง VAT inclusive และ exclusive)
 * Calculate taxes with detailed breakdown, supporting both VAT-inclusive and VAT-exclusive
 * @param amount - Amount to calculate
 * @param vatRate - VAT rate as percentage
 * @param withholdingRate - Withholding tax rate as percentage
 * @param isVatInclusive - Whether amount includes VAT
 * @returns Detailed tax calculation results
 * @example
 * calculateTaxes(107, 7, 3, true)
 * // {
 * //   originalPrice: 107,
 * //   priceBeforeVat: 100,
 * //   vatAmount: 7,
 * //   withholdingAmount: 3,
 * //   finalAmount: 104
 * // }
 */
export const calculateTaxes = (
  amount: number,
  vatRate: number,
  withholdingRate: number,
  isVatInclusive: boolean
): TaxCalculationResults => {
  let priceBeforeVat: number;
  let vatAmount: number;
  let originalPrice: number;

  if (isVatInclusive) {
    // Amount includes VAT, so we need to extract the VAT
    priceBeforeVat = amount / (1 + vatRate / 100);
    vatAmount = amount - priceBeforeVat;
    originalPrice = amount;
  } else {
    // Amount is before VAT, so we add VAT
    priceBeforeVat = amount;
    vatAmount = amount * (vatRate / 100);
    originalPrice = amount;
  }

  // Withholding tax is calculated on the price before VAT
  const withholdingAmount = priceBeforeVat * (withholdingRate / 100);

  // Final amount = Price before VAT + VAT - Withholding tax
  const finalAmount = priceBeforeVat + vatAmount - withholdingAmount;

  return {
    originalPrice: roundToDecimals(originalPrice),
    vatAmount: roundToDecimals(vatAmount),
    withholdingAmount: roundToDecimals(withholdingAmount),
    finalAmount: roundToDecimals(finalAmount),
    priceBeforeVat: roundToDecimals(priceBeforeVat),
  };
};
