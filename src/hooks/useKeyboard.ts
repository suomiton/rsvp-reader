import { useEffect, useRef } from "react";

interface KeyboardHandlers {
	onSpaceToggle: () => void;
	onArrowLeft: () => void;
	onArrowRight: () => void;
	onEscape: () => void;
}

/**
 * Keyboard event hook for the Reader page.
 *
 * - Uses latest-ref pattern to avoid re-attaching listeners.
 * - Spacebar toggles play/pause
 * - Ignores keyboard events when focused on input/textarea elements.
 */
export function useKeyboard(handlers: KeyboardHandlers): void {
	const handlersRef = useRef(handlers);
	handlersRef.current = handlers;

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			) {
				return;
			}

			switch (e.code) {
				case "Space":
					e.preventDefault();
					handlersRef.current.onSpaceToggle();
					break;
				case "ArrowLeft":
					e.preventDefault();
					handlersRef.current.onArrowLeft();
					break;
				case "ArrowRight":
					e.preventDefault();
					handlersRef.current.onArrowRight();
					break;
				case "Escape":
					handlersRef.current.onEscape();
					break;
			}
		}

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
}
