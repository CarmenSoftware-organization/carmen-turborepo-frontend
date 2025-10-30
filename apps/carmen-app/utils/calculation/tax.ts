import { roundToDecimals } from "../format/number";

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

export interface ReverseTaxCalculationResult extends TaxCalculationResult {
  isReverseCalculation: boolean;
  useVat: boolean;
  useWithholding: boolean;
}

export interface TaxCalculationResults {
  originalPrice: number;
  vatAmount: number;
  withholdingAmount: number;
  finalAmount: number;
  priceBeforeVat: number;
}

const calculateVatAmount = (originalAmount: number, vatRate: number, useVat: boolean): number => {
  return useVat ? (originalAmount * vatRate) / 100 : 0;
};

const calculateWithholdingAmount = (
  originalAmount: number,
  vatAmount: number,
  withholdingRate: number,
  useWithholding: boolean
): number => {
  return useWithholding ? ((originalAmount + vatAmount) * withholdingRate) / 100 : 0;
};

const calculateNetTransferAmount = (
  originalAmount: number,
  vatAmount: number,
  withholdingAmount: number
): number => {
  return originalAmount + vatAmount - withholdingAmount;
};

const calculateOriginalAmountFromVatInclusive = (
  amountIncludingVat: number,
  vatRate: number,
  useVat: boolean
): number => {
  if (useVat) {
    return amountIncludingVat / (1 + vatRate / 100);
  } else {
    return amountIncludingVat;
  }
};

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
  const netTransferAmount = calculateNetTransferAmount(amount, vatAmount, withholdingAmount);

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
  const withholdingAmount = useWithholding ? (amountIncludingVat * withholdingRate) / 100 : 0;

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
