import { describe, it, expect } from "vitest";
import { appReducer } from "./reducer";
import { initialState } from "./types";
import type { AppState, RenderModel } from "./types";

describe("appReducer", () => {
	describe("SET_TEXT", () => {
		it("should set text and clear error", () => {
			const state: AppState = { ...initialState, error: "Previous error" };
			const result = appReducer(state, {
				type: "SET_TEXT",
				payload: "Hello world",
			});

			expect(result.text).toBe("Hello world");
			expect(result.error).toBe(null);
		});

		it("should not modify other state properties", () => {
			const state: AppState = {
				...initialState,
				index: 5,
				wpm: 400,
				tokens: ["hello"],
			};
			const result = appReducer(state, {
				type: "SET_TEXT",
				payload: "New text",
			});

			expect(result.index).toBe(5);
			expect(result.wpm).toBe(400);
			expect(result.tokens).toEqual(["hello"]);
		});

		it("should handle empty string", () => {
			const result = appReducer(initialState, {
				type: "SET_TEXT",
				payload: "",
			});
			expect(result.text).toBe("");
		});
	});

	describe("SET_WPM", () => {
		it("should set valid WPM value", () => {
			const result = appReducer(initialState, {
				type: "SET_WPM",
				payload: 500,
			});
			expect(result.wpm).toBe(500);
		});

		it("should clamp WPM to minimum 50", () => {
			const result = appReducer(initialState, {
				type: "SET_WPM",
				payload: 30,
			});
			expect(result.wpm).toBe(50);
		});

		it("should clamp WPM to maximum 1200", () => {
			const result = appReducer(initialState, {
				type: "SET_WPM",
				payload: 1500,
			});
			expect(result.wpm).toBe(1200);
		});

		it("should accept exactly 50", () => {
			const result = appReducer(initialState, {
				type: "SET_WPM",
				payload: 50,
			});
			expect(result.wpm).toBe(50);
		});

		it("should accept exactly 1200", () => {
			const result = appReducer(initialState, {
				type: "SET_WPM",
				payload: 1200,
			});
			expect(result.wpm).toBe(1200);
		});

		it("should handle negative values", () => {
			const result = appReducer(initialState, {
				type: "SET_WPM",
				payload: -100,
			});
			expect(result.wpm).toBe(50);
		});

		it("should not modify other state properties", () => {
			const state: AppState = {
				...initialState,
				text: "Hello",
				index: 3,
			};
			const result = appReducer(state, { type: "SET_WPM", payload: 600 });

			expect(result.text).toBe("Hello");
			expect(result.index).toBe(3);
		});
	});

	describe("PREPARE_READING", () => {
		it("should set tokens and models, reset index", () => {
			const tokens = ["Hello", "world"];
			const models: RenderModel[] = [
				{ prefix: "H", highlight: "e", suffix: "llo" },
				{ prefix: "w", highlight: "o", suffix: "rld" },
			];

			const state: AppState = { ...initialState, index: 5 };
			const result = appReducer(state, {
				type: "PREPARE_READING",
				payload: { tokens, models },
			});

			expect(result.tokens).toEqual(tokens);
			expect(result.models).toEqual(models);
			expect(result.index).toBe(0);
			expect(result.error).toBe(null);
		});

		it("should clear any existing error", () => {
			const state: AppState = { ...initialState, error: "Previous error" };
			const result = appReducer(state, {
				type: "PREPARE_READING",
				payload: { tokens: ["test"], models: [] },
			});

			expect(result.error).toBe(null);
		});

		it("should handle empty arrays", () => {
			const result = appReducer(initialState, {
				type: "PREPARE_READING",
				payload: { tokens: [], models: [] },
			});

			expect(result.tokens).toEqual([]);
			expect(result.models).toEqual([]);
			expect(result.index).toBe(0);
		});

		it("should preserve text and wpm", () => {
			const state: AppState = {
				...initialState,
				text: "Original text",
				wpm: 400,
			};
			const result = appReducer(state, {
				type: "PREPARE_READING",
				payload: { tokens: ["test"], models: [] },
			});

			expect(result.text).toBe("Original text");
			expect(result.wpm).toBe(400);
		});
	});

	describe("SET_INDEX", () => {
		const testState: AppState = {
			...initialState,
			tokens: ["a", "b", "c", "d", "e"],
		};

		it("should set valid index", () => {
			const result = appReducer(testState, {
				type: "SET_INDEX",
				payload: 2,
			});
			expect(result.index).toBe(2);
		});

		it("should clamp negative index to 0", () => {
			const result = appReducer(testState, {
				type: "SET_INDEX",
				payload: -5,
			});
			expect(result.index).toBe(0);
		});

		it("should clamp index beyond array length", () => {
			const result = appReducer(testState, {
				type: "SET_INDEX",
				payload: 10,
			});
			expect(result.index).toBe(4); // tokens.length - 1
		});

		it("should accept index 0", () => {
			const result = appReducer(testState, {
				type: "SET_INDEX",
				payload: 0,
			});
			expect(result.index).toBe(0);
		});

		it("should accept last valid index", () => {
			const result = appReducer(testState, {
				type: "SET_INDEX",
				payload: 4,
			});
			expect(result.index).toBe(4);
		});

		it("should handle empty tokens array", () => {
			const emptyState: AppState = { ...initialState, tokens: [] };
			const result = appReducer(emptyState, {
				type: "SET_INDEX",
				payload: 5,
			});
			// Math.max(0, Math.min(5, -1)) = Math.max(0, -1) = 0
			expect(result.index).toBe(0);
		});

		it("should not modify other state properties", () => {
			const state: AppState = {
				...testState,
				text: "Test",
				wpm: 500,
			};
			const result = appReducer(state, { type: "SET_INDEX", payload: 2 });

			expect(result.text).toBe("Test");
			expect(result.wpm).toBe(500);
		});
	});

	describe("STEP_FORWARD", () => {
		const testState: AppState = {
			...initialState,
			tokens: ["a", "b", "c"],
			index: 1,
		};

		it("should increment index when not at end", () => {
			const result = appReducer(testState, { type: "STEP_FORWARD" });
			expect(result.index).toBe(2);
		});

		it("should increment from 0", () => {
			const state: AppState = { ...testState, index: 0 };
			const result = appReducer(state, { type: "STEP_FORWARD" });
			expect(result.index).toBe(1);
		});

		it("should not increment when at last token", () => {
			const state: AppState = { ...testState, index: 2 };
			const result = appReducer(state, { type: "STEP_FORWARD" });
			expect(result.index).toBe(2);
		});

		it("should return same reference when at end", () => {
			const state: AppState = { ...testState, index: 2 };
			const result = appReducer(state, { type: "STEP_FORWARD" });
			expect(result).toBe(state);
		});

		it("should not modify other state properties", () => {
			const state: AppState = {
				...testState,
				text: "Test",
				wpm: 500,
			};
			const result = appReducer(state, { type: "STEP_FORWARD" });

			expect(result.text).toBe("Test");
			expect(result.wpm).toBe(500);
			expect(result.tokens).toBe(state.tokens);
		});

		it("should handle single token array", () => {
			const state: AppState = {
				...initialState,
				tokens: ["only"],
				index: 0,
			};
			const result = appReducer(state, { type: "STEP_FORWARD" });
			expect(result.index).toBe(0);
			expect(result).toBe(state);
		});
	});

	describe("STEP_BACK", () => {
		const testState: AppState = {
			...initialState,
			tokens: ["a", "b", "c"],
			index: 1,
		};

		it("should decrement index when not at start", () => {
			const result = appReducer(testState, { type: "STEP_BACK" });
			expect(result.index).toBe(0);
		});

		it("should decrement from last index", () => {
			const state: AppState = { ...testState, index: 2 };
			const result = appReducer(state, { type: "STEP_BACK" });
			expect(result.index).toBe(1);
		});

		it("should not decrement when at index 0", () => {
			const state: AppState = { ...testState, index: 0 };
			const result = appReducer(state, { type: "STEP_BACK" });
			expect(result.index).toBe(0);
		});

		it("should return same reference when at start", () => {
			const state: AppState = { ...testState, index: 0 };
			const result = appReducer(state, { type: "STEP_BACK" });
			expect(result).toBe(state);
		});

		it("should not modify other state properties", () => {
			const state: AppState = {
				...testState,
				text: "Test",
				wpm: 500,
			};
			const result = appReducer(state, { type: "STEP_BACK" });

			expect(result.text).toBe("Test");
			expect(result.wpm).toBe(500);
			expect(result.tokens).toBe(state.tokens);
		});
	});

	describe("SET_ERROR", () => {
		it("should set error message", () => {
			const result = appReducer(initialState, {
				type: "SET_ERROR",
				payload: "Test error",
			});
			expect(result.error).toBe("Test error");
		});

		it("should overwrite existing error", () => {
			const state: AppState = { ...initialState, error: "Old error" };
			const result = appReducer(state, {
				type: "SET_ERROR",
				payload: "New error",
			});
			expect(result.error).toBe("New error");
		});

		it("should handle empty string error", () => {
			const result = appReducer(initialState, {
				type: "SET_ERROR",
				payload: "",
			});
			expect(result.error).toBe("");
		});

		it("should not modify other state properties", () => {
			const state: AppState = {
				...initialState,
				text: "Test",
				index: 3,
			};
			const result = appReducer(state, {
				type: "SET_ERROR",
				payload: "Error",
			});

			expect(result.text).toBe("Test");
			expect(result.index).toBe(3);
		});
	});

	describe("CLEAR_ERROR", () => {
		it("should clear error", () => {
			const state: AppState = { ...initialState, error: "Some error" };
			const result = appReducer(state, { type: "CLEAR_ERROR" });
			expect(result.error).toBe(null);
		});

		it("should work when error is already null", () => {
			const result = appReducer(initialState, { type: "CLEAR_ERROR" });
			expect(result.error).toBe(null);
		});

		it("should not modify other state properties", () => {
			const state: AppState = {
				...initialState,
				text: "Test",
				wpm: 500,
				error: "Error",
			};
			const result = appReducer(state, { type: "CLEAR_ERROR" });

			expect(result.text).toBe("Test");
			expect(result.wpm).toBe(500);
		});
	});

	describe("RESET_READER", () => {
		it("should return initial state", () => {
			const state: AppState = {
				text: "Some text",
				tokens: ["a", "b"],
				models: [],
				index: 5,
				wpm: 600,
				error: "Error",
			};
			const result = appReducer(state, { type: "RESET_READER" });
			expect(result).toEqual(initialState);
		});

		it("should work from initial state", () => {
			const result = appReducer(initialState, { type: "RESET_READER" });
			expect(result).toEqual(initialState);
		});
	});

	describe("immutability", () => {
		it("should not mutate original state on SET_TEXT", () => {
			const state: AppState = { ...initialState, text: "Original" };
			const original = { ...state };
			appReducer(state, { type: "SET_TEXT", payload: "New" });

			expect(state).toEqual(original);
		});

		it("should not mutate original state on STEP_FORWARD", () => {
			const state: AppState = {
				...initialState,
				tokens: ["a", "b"],
				index: 0,
			};
			const original = { ...state };
			appReducer(state, { type: "STEP_FORWARD" });

			expect(state).toEqual(original);
		});

		it("should not mutate tokens array on PREPARE_READING", () => {
			const tokens = ["a", "b"];
			const models: RenderModel[] = [];
			const state: AppState = { ...initialState };

			appReducer(state, {
				type: "PREPARE_READING",
				payload: { tokens, models },
			});

			expect(tokens).toEqual(["a", "b"]);
		});
	});

	describe("edge cases", () => {
		it("should handle state with all properties modified", () => {
			const complexState: AppState = {
				text: "Complex text",
				tokens: ["word1", "word2", "word3"],
				models: [
					{ prefix: "w", highlight: "o", suffix: "rd1" },
					{ prefix: "w", highlight: "o", suffix: "rd2" },
					{ prefix: "w", highlight: "o", suffix: "rd3" },
				],
				index: 1,
				wpm: 750,
				error: "Some error",
			};

			// Various operations should work correctly
			let result = appReducer(complexState, { type: "STEP_FORWARD" });
			expect(result.index).toBe(2);

			result = appReducer(complexState, { type: "SET_WPM", payload: 2000 });
			expect(result.wpm).toBe(1200);

			result = appReducer(complexState, { type: "CLEAR_ERROR" });
			expect(result.error).toBe(null);
		});

		it("should handle rapid sequential actions", () => {
			let state = initialState;

			state = appReducer(state, { type: "SET_TEXT", payload: "Hello" });
			state = appReducer(state, {
				type: "PREPARE_READING",
				payload: { tokens: ["a", "b", "c"], models: [] },
			});
			state = appReducer(state, { type: "SET_WPM", payload: 500 });
			state = appReducer(state, { type: "STEP_FORWARD" });
			state = appReducer(state, { type: "STEP_FORWARD" });
			state = appReducer(state, { type: "STEP_BACK" });

			expect(state.text).toBe("Hello");
			expect(state.tokens).toEqual(["a", "b", "c"]);
			expect(state.wpm).toBe(500);
			expect(state.index).toBe(1);
		});
	});
});
