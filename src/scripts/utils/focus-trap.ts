/**
 * Lightweight focus trap for accessible modal dialogs
 * Traps Tab/Shift+Tab within a container element
 */
const FOCUSABLE_SELECTOR = [
	"a[href]",
	"button:not([disabled])",
	'input:not([disabled]):not([type="hidden"])',
	"select:not([disabled])",
	"textarea:not([disabled])",
	'[tabindex]:not([tabindex="-1"])',
].join(", ");

export interface FocusTrap {
	activate: () => void;
	deactivate: () => void;
}

export const createFocusTrap = (container: HTMLElement): FocusTrap => {
	let previouslyFocused: HTMLElement | null = null;

	const handleKeyDown = (e: KeyboardEvent): void => {
		if (e.key !== "Tab") return;

		const focusable = Array.from(
			container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
		).filter((el) => !el.closest("[hidden]"));

		if (focusable.length === 0) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	};

	return {
		activate() {
			previouslyFocused = document.activeElement as HTMLElement;
			container.addEventListener("keydown", handleKeyDown);
		},
		deactivate() {
			container.removeEventListener("keydown", handleKeyDown);
			if (previouslyFocused && document.contains(previouslyFocused)) {
				previouslyFocused.focus();
			}
		},
	};
};
