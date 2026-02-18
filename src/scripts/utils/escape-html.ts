/**
 * Escape HTML entities to prevent XSS
 * IMPORTANT: Always use this when inserting user-controlled values into innerHTML
 */
export const escapeHtml = (text: string): string => {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
};
