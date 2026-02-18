/**
 * Format a number as USD currency string (e.g., "$12.50")
 */
export const formatCurrency = (amount: number): string => {
	return `$${amount.toFixed(2)}`;
};
