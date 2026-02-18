/**
 * Copy text to clipboard with fallback for mobile/HTTP environments
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
	if (
		navigator.clipboard &&
		typeof navigator.clipboard.writeText === "function"
	) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// Fall through to legacy method
		}
	}

	// Fallback: legacy execCommand with temporary textarea
	try {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.cssText =
			"position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;font-size:16px";
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		textarea.setSelectionRange(0, textarea.value.length);
		const success = document.execCommand("copy");
		document.body.removeChild(textarea);
		return success;
	} catch (err) {
		console.error("Fallback copy failed:", err);
		return false;
	}
};
