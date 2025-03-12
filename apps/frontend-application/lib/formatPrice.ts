export enum TypeAmountKey {
	AMOUNT = 'amount',
	NET = 'netAmount',
	TAX = 'taxAmount',
	TOTAL = 'totalAmount',
	UNIT = 'unitPrice',
}

export const amountKeys = [
	TypeAmountKey.AMOUNT,
	TypeAmountKey.NET,
	TypeAmountKey.TAX,
	TypeAmountKey.TOTAL,
	TypeAmountKey.UNIT,
];

export const formatPrice = (amount: number | string) => {
	return Number(amount).toFixed(2);
};

export const formatAmount = (amount: number): string => {
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
};