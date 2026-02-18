/**
 * Generate a unique ID string with broad browser compatibility
 * Uses crypto.randomUUID → crypto.getRandomValues → timestamp+random fallback
 */
export const generateId = (length: number = 8): string => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID().substring(0, length);
	}

	if (
		typeof crypto !== "undefined" &&
		typeof crypto.getRandomValues === "function"
	) {
		const bytes = Math.ceil(length / 2);
		const array = new Uint8Array(bytes);
		crypto.getRandomValues(array);
		return Array.from(array, (byte) =>
			byte.toString(16).padStart(2, "0"),
		)
			.join("")
			.substring(0, length);
	}

	return (
		Date.now().toString(36) + Math.random().toString(36).substring(2)
	).substring(0, length);
};
