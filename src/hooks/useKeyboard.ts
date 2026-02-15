import { useEffect, useRef } from "react";

interface KeyboardHandlers {
	onSpaceDown: () => void;
	onSpaceUp: () => void;
	onArrowLeft: () => void;
	onArrowRight: () => void;
	onEscape: () => void;
}

/**
 * Keyboard event hook for the Reader page.
 *
 * - Uses latest-ref pattern to avoid re-attaching listeners.
 * - Tracks spacebar hold state to prevent key-repeat from starting multiple loops.
 * - Ignores keyboard events when focused on input/textarea elements.
 * - Handles window blur to release spacebar if user switches tabs.
 */
export function useKeyboard(handlers: KeyboardHandlers): void {
	const handlersRef = useRef(handlers);
	handlersRef.current = handlers;

	const spaceHeldRef = useRef(false);

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
					if (!spaceHeldRef.current) {
						spaceHeldRef.current = true;
						handlersRef.current.onSpaceDown();
					}
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

		function handleKeyUp(e: KeyboardEvent) {
			if (e.code === "Space") {
				spaceHeldRef.current = false;
				handlersRef.current.onSpaceUp();
			}
		}

		function handleBlur() {
			if (spaceHeldRef.current) {
				spaceHeldRef.current = false;
				handlersRef.current.onSpaceUp();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		window.addEventListener("blur", handleBlur);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("blur", handleBlur);
		};
	}, []);
}
