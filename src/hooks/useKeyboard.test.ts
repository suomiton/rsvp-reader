import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboard } from "./useKeyboard";

describe("useKeyboard", () => {
	describe("spacebar handling", () => {
		it("should call onSpaceToggle when Space is pressed", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			const event = new KeyboardEvent("keydown", { code: "Space" });
			window.dispatchEvent(event);

			expect(handlers.onSpaceToggle).toHaveBeenCalledTimes(1);
			expect(handlers.onArrowLeft).not.toHaveBeenCalled();
			expect(handlers.onArrowRight).not.toHaveBeenCalled();
			expect(handlers.onEscape).not.toHaveBeenCalled();
		});

		it("should prevent default on Space", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			const event = new KeyboardEvent("keydown", { code: "Space" });
			const preventDefaultSpy = vi.spyOn(event, "preventDefault");

			window.dispatchEvent(event);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it("should handle multiple Space presses", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));

			expect(handlers.onSpaceToggle).toHaveBeenCalledTimes(3);
		});

		it("should use Space code not key to avoid layout issues", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			// Code: "Space" is layout-independent
			window.dispatchEvent(
				new KeyboardEvent("keydown", { code: "Space", key: " " }),
			);
			expect(handlers.onSpaceToggle).toHaveBeenCalledTimes(1);

			// Using wrong code shouldn't trigger
			window.dispatchEvent(
				new KeyboardEvent("keydown", { code: "KeyS", key: " " }),
			);
			expect(handlers.onSpaceToggle).toHaveBeenCalledTimes(1);
		});
	});

	describe("arrow key handling", () => {
		it("should call onArrowLeft when ArrowLeft is pressed", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft" }));

			expect(handlers.onArrowLeft).toHaveBeenCalledTimes(1);
			expect(handlers.onSpaceToggle).not.toHaveBeenCalled();
			expect(handlers.onArrowRight).not.toHaveBeenCalled();
			expect(handlers.onEscape).not.toHaveBeenCalled();
		});

		it("should call onArrowRight when ArrowRight is pressed", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			window.dispatchEvent(
				new KeyboardEvent("keydown", { code: "ArrowRight" }),
			);

			expect(handlers.onArrowRight).toHaveBeenCalledTimes(1);
			expect(handlers.onSpaceToggle).not.toHaveBeenCalled();
			expect(handlers.onArrowLeft).not.toHaveBeenCalled();
			expect(handlers.onEscape).not.toHaveBeenCalled();
		});

		it("should prevent default on ArrowLeft", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			const event = new KeyboardEvent("keydown", { code: "ArrowLeft" });
			const preventDefaultSpy = vi.spyOn(event, "preventDefault");

			window.dispatchEvent(event);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it("should prevent default on ArrowRight", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			const event = new KeyboardEvent("keydown", { code: "ArrowRight" });
			const preventDefaultSpy = vi.spyOn(event, "preventDefault");

			window.dispatchEvent(event);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it("should handle rapid arrow key presses", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			window.dispatchEvent(
				new KeyboardEvent("keydown", { code: "ArrowRight" }),
			);
			window.dispatchEvent(
				new KeyboardEvent("keydown", { code: "ArrowRight" }),
			);
			window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft" }));
			window.dispatchEvent(
				new KeyboardEvent("keydown", { code: "ArrowRight" }),
			);

			expect(handlers.onArrowRight).toHaveBeenCalledTimes(3);
			expect(handlers.onArrowLeft).toHaveBeenCalledTimes(1);
		});
	});

	describe("escape key handling", () => {
		it("should call onEscape when Escape is pressed", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape" }));

			expect(handlers.onEscape).toHaveBeenCalledTimes(1);
			expect(handlers.onSpaceToggle).not.toHaveBeenCalled();
			expect(handlers.onArrowLeft).not.toHaveBeenCalled();
			expect(handlers.onArrowRight).not.toHaveBeenCalled();
		});

		it("should not prevent default on Escape", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			const event = new KeyboardEvent("keydown", { code: "Escape" });
			const preventDefaultSpy = vi.spyOn(event, "preventDefault");

			window.dispatchEvent(event);

			expect(preventDefaultSpy).not.toHaveBeenCalled();
		});
	});

	describe("ignore input events", () => {
		it("should ignore events from HTMLInputElement", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			const input = document.createElement("input");
			document.body.appendChild(input);

			const event = new KeyboardEvent("keydown", {
				code: "Space",
				bubbles: true,
			});
			Object.defineProperty(event, "target", { value: input, enumerable: true });

			window.dispatchEvent(event);

			expect(handlers.onSpaceToggle).not.toHaveBeenCalled();

			document.body.removeChild(input);
		});

		it("should ignore events from HTMLTextAreaElement", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			const textarea = document.createElement("textarea");
			document.body.appendChild(textarea);

			const event = new KeyboardEvent("keydown", {
				code: "Space",
				bubbles: true,
			});
			Object.defineProperty(event, "target", {
				value: textarea,
				enumerable: true,
			});

			window.dispatchEvent(event);

			expect(handlers.onSpaceToggle).not.toHaveBeenCalled();

			document.body.removeChild(textarea);
		});

		it("should handle arrow keys from input", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			const input = document.createElement("input");
			document.body.appendChild(input);

			const event = new KeyboardEvent("keydown", {
				code: "ArrowLeft",
				bubbles: true,
			});
			Object.defineProperty(event, "target", { value: input, enumerable: true });

			window.dispatchEvent(event);

			expect(handlers.onArrowLeft).not.toHaveBeenCalled();

			document.body.removeChild(input);
		});

		it("should handle escape from input", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			const input = document.createElement("input");
			document.body.appendChild(input);

			const event = new KeyboardEvent("keydown", {
				code: "Escape",
				bubbles: true,
			});
			Object.defineProperty(event, "target", { value: input, enumerable: true });

			window.dispatchEvent(event);

			expect(handlers.onEscape).not.toHaveBeenCalled();

			document.body.removeChild(input);
		});
	});

	describe("handler updates", () => {
		it("should use latest handlers without re-attaching listeners", () => {
			const handler1 = vi.fn();
			const handler2 = vi.fn();

			const { rerender } = renderHook(
				({ onSpace }) =>
					useKeyboard({
						onSpaceToggle: onSpace,
						onArrowLeft: vi.fn(),
						onArrowRight: vi.fn(),
						onEscape: vi.fn(),
					}),
				{ initialProps: { onSpace: handler1 } },
			);

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
			expect(handler1).toHaveBeenCalledTimes(1);
			expect(handler2).not.toHaveBeenCalled();

			// Update handler
			rerender({ onSpace: handler2 });

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
			expect(handler1).toHaveBeenCalledTimes(1);
			expect(handler2).toHaveBeenCalledTimes(1);
		});

		it("should handle all handlers updating", () => {
			const handlers1 = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			const handlers2 = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			const { rerender } = renderHook(({ h }) => useKeyboard(h), {
				initialProps: { h: handlers1 },
			});

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
			expect(handlers1.onSpaceToggle).toHaveBeenCalledTimes(1);

			rerender({ h: handlers2 });

			window.dispatchEvent(
				new KeyboardEvent("keydown", { code: "ArrowLeft" }),
			);
			expect(handlers2.onArrowLeft).toHaveBeenCalledTimes(1);
			expect(handlers1.onArrowLeft).not.toHaveBeenCalled();
		});
	});

	describe("cleanup", () => {
		it("should remove listener on unmount", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			const { unmount } = renderHook(() => useKeyboard(handlers));

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
			expect(handlers.onSpaceToggle).toHaveBeenCalledTimes(1);

			unmount();

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
			expect(handlers.onSpaceToggle).toHaveBeenCalledTimes(1);
		});
	});

	describe("unhandled keys", () => {
		it("should ignore unhandled keys", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyA" }));
			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Enter" }));
			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Tab" }));

			expect(handlers.onSpaceToggle).not.toHaveBeenCalled();
			expect(handlers.onArrowLeft).not.toHaveBeenCalled();
			expect(handlers.onArrowRight).not.toHaveBeenCalled();
			expect(handlers.onEscape).not.toHaveBeenCalled();
		});

		it("should ignore ArrowUp and ArrowDown", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowUp" }));
			window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowDown" }));

			expect(handlers.onArrowLeft).not.toHaveBeenCalled();
			expect(handlers.onArrowRight).not.toHaveBeenCalled();
		});
	});

	describe("edge cases", () => {
		it("should handle event with no code", () => {
			const handlers = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers));

			expect(() => {
				window.dispatchEvent(new KeyboardEvent("keydown", {}));
			}).not.toThrow();

			expect(handlers.onSpaceToggle).not.toHaveBeenCalled();
		});

		it("should handle multiple hooks simultaneously", () => {
			const handlers1 = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			const handlers2 = {
				onSpaceToggle: vi.fn(),
				onArrowLeft: vi.fn(),
				onArrowRight: vi.fn(),
				onEscape: vi.fn(),
			};

			renderHook(() => useKeyboard(handlers1));
			renderHook(() => useKeyboard(handlers2));

			window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));

			// Both hooks should receive the event
			expect(handlers1.onSpaceToggle).toHaveBeenCalledTimes(1);
			expect(handlers2.onSpaceToggle).toHaveBeenCalledTimes(1);
		});
	});
});
