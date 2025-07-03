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

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ReverseTaxCalculationResult extends TaxCalculationResult {
  isReverseCalculation: boolean;
  useVat: boolean;
  useWithholding: boolean;
}

export const currencies: Currency[] = [
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
];

/**
 * คำนวณจำนวน VAT จากจำนวนเงินต้น
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
 * จัดรูปแบบผลลัพธ์การคำนวณ
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
    originalAmount: Math.round(originalAmount * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    withholdingAmount: Math.round(withholdingAmount * 100) / 100,
    netTransferAmount: Math.round(netTransferAmount * 100) / 100,
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

export const formatCurrency = (
  amount: number,
  currencyCode: string
): string => {
  const currency = currencies.find((c) => c.code === currencyCode);

  if (!currency) {
    return amount.toFixed(2);
  }

  // Special formatting for different currencies
  const locale =
    {
      THB: "th-TH",
      USD: "en-US",
      EUR: "de-DE",
      GBP: "en-GB",
      JPY: "ja-JP",
      SGD: "en-SG",
      MYR: "ms-MY",
    }[currencyCode] || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "JPY" ? 0 : 2,
  }).format(amount);
};

export const formatThaiCurrency = (amount: number): string => {
  return formatCurrency(amount, "THB");
};

export interface TaxCalculationResults {
  originalPrice: number;
  vatAmount: number;
  withholdingAmount: number;
  finalAmount: number;
  priceBeforeVat: number;
}

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
    originalPrice,
    vatAmount,
    withholdingAmount,
    finalAmount,
    priceBeforeVat,
  };
};

