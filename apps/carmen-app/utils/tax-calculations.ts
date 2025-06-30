export interface TaxCalculationResult {
    originalAmount: number;
    vatAmount: number;
    withholdingAmount: number;
    netTransferAmount: number;
    vatRate: number;
    withholdingRate: number;
    currency: string;
  }
  
  export interface Currency {
    code: string;
    name: string;
    symbol: string;
  }
  
  export const currencies: Currency[] = [
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  ];
  
  export const calculateTax = (
    amount: number,
    vatRate: number,
    withholdingRate: number,
    currency: string = 'THB'
  ): TaxCalculationResult => {
    // Calculate VAT amount
    const vatAmount = (amount * vatRate) / 100;
    
    // Calculate withholding tax amount (based on original amount)
    const withholdingAmount = (amount * withholdingRate) / 100;
    
    // Calculate net transfer amount
    // Net = Original + VAT - Withholding Tax
    const netTransferAmount = amount + vatAmount - withholdingAmount;
  
    return {
      originalAmount: amount,
      vatAmount: Math.round(vatAmount * 100) / 100,
      withholdingAmount: Math.round(withholdingAmount * 100) / 100,
      netTransferAmount: Math.round(netTransferAmount * 100) / 100,
      vatRate,
      withholdingRate,
      currency,
    };
  };
  
  export const formatCurrency = (amount: number, currencyCode: string): string => {
    const currency = currencies.find(c => c.code === currencyCode);
    
    if (!currency) {
      return amount.toFixed(2);
    }
  
    // Special formatting for different currencies
    const locale = {
      'THB': 'th-TH',
      'USD': 'en-US',
      'EUR': 'de-DE',
      'GBP': 'en-GB',
      'JPY': 'ja-JP',
      'SGD': 'en-SG',
      'MYR': 'ms-MY',
    }[currencyCode] || 'en-US';
  
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
    }).format(amount);
  };
  
  export const formatThaiCurrency = (amount: number): string => {
    return formatCurrency(amount, 'THB');
  };