import { describe, it, expect } from "vitest";
import { buildRenderModel, buildRenderModels } from "./renderModel";

describe("buildRenderModel", () => {
	describe("basic splitting", () => {
		it("should split single character as highlight only", () => {
			const result = buildRenderModel("I");
			expect(result).toEqual({
				prefix: "",
				highlight: "I",
				suffix: "",
			});
		});

		it("should split 2-5 char words with index 1", () => {
			const result = buildRenderModel("hello");
			expect(result).toEqual({
				prefix: "h",
				highlight: "e",
				suffix: "llo",
			});
		});

		it("should split 6-9 char words with index 2", () => {
			const result = buildRenderModel("reading");
			expect(result).toEqual({
				prefix: "re",
				highlight: "a",
				suffix: "ding",
			});
		});

		it("should split 10-13 char words with index 3", () => {
			const result = buildRenderModel("programming");
			expect(result).toEqual({
				prefix: "pro",
				highlight: "g",
				suffix: "ramming",
			});
		});

		it("should split 14+ char words with index 4", () => {
			const result = buildRenderModel("implementation");
			expect(result).toEqual({
				prefix: "impl",
				highlight: "e",
				suffix: "mentation",
			});
		});
	});

	describe("with punctuation", () => {
		it("should handle trailing punctuation", () => {
			const result = buildRenderModel("hello,");
			expect(result).toEqual({
				prefix: "h",
				highlight: "e",
				suffix: "llo,",
			});
		});

		it("should handle leading punctuation", () => {
			const result = buildRenderModel('"hello');
			expect(result).toEqual({
				prefix: '"h',
				highlight: "e",
				suffix: "llo",
			});
		});

		it("should handle surrounding punctuation", () => {
			const result = buildRenderModel('"hello"');
			expect(result).toEqual({
				prefix: '"h',
				highlight: "e",
				suffix: 'llo"',
			});
		});

		it("should handle multiple trailing punctuation", () => {
			const result = buildRenderModel("what?!");
			expect(result).toEqual({
				prefix: "w",
				highlight: "h",
				suffix: "at?!",
			});
		});
	});

	describe("Unicode support", () => {
		it("should handle Finnish characters", () => {
			const result = buildRenderModel("käyttää");
			expect(result).toEqual({
				prefix: "kä",
				highlight: "y",
				suffix: "ttää",
			});
		});

		it("should handle Swedish characters", () => {
			const result = buildRenderModel("världen");
			expect(result).toEqual({
				prefix: "vä",
				highlight: "r",
				suffix: "lden",
			});
		});

		it("should handle accented characters", () => {
			const result = buildRenderModel("café");
			expect(result).toEqual({
				prefix: "c",
				highlight: "a",
				suffix: "fé",
			});
		});
	});

	describe("edge cases", () => {
		it("should handle empty string", () => {
			const result = buildRenderModel("");
			expect(result).toEqual({
				prefix: "",
				highlight: "",
				suffix: "",
			});
		});

		it("should handle all punctuation", () => {
			const result = buildRenderModel("...");
			// All punctuation edge case - should not crash
			expect(typeof result.prefix).toBe("string");
			expect(typeof result.highlight).toBe("string");
			expect(typeof result.suffix).toBe("string");
			// Reconstructed token should match original
			const reconstructed = result.prefix + result.highlight + result.suffix;
			expect(reconstructed).toBe("...");
		});

		it("should have valid structure", () => {
			const result = buildRenderModel("test");
			expect(result).toHaveProperty("prefix");
			expect(result).toHaveProperty("highlight");
			expect(result).toHaveProperty("suffix");
			expect(typeof result.prefix).toBe("string");
			expect(typeof result.highlight).toBe("string");
			expect(typeof result.suffix).toBe("string");
		});

		it("should reconstruct original token", () => {
			const token = "wonderful!";
			const result = buildRenderModel(token);
			const reconstructed = result.prefix + result.highlight + result.suffix;
			expect(reconstructed).toBe(token);
		});
	});

	describe("real-world examples", () => {
		it("should handle typical sentence words", () => {
			const words = ["The", "quick", "brown", "fox", "jumps"];
			const results = words.map(buildRenderModel);

			expect(results[0]).toEqual({ prefix: "T", highlight: "h", suffix: "e" });
			expect(results[1]).toEqual({
				prefix: "q",
				highlight: "u",
				suffix: "ick",
			});
			expect(results[2]).toEqual({
				prefix: "b",
				highlight: "r",
				suffix: "own",
			});
		});

		it("should reconstruct all tokens correctly", () => {
			const tokens = ["Hello,", "world!", "This", "is", "RSVP", "Reader."];
			tokens.forEach((token) => {
				const result = buildRenderModel(token);
				const reconstructed = result.prefix + result.highlight + result.suffix;
				expect(reconstructed).toBe(token);
			});
		});
	});
});

describe("buildRenderModels", () => {
	it("should build models for empty array", () => {
		const result = buildRenderModels([]);
		expect(result).toEqual([]);
	});

	it("should build models for single token", () => {
		const result = buildRenderModels(["hello"]);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			prefix: "h",
			highlight: "e",
			suffix: "llo",
		});
	});

	it("should build models for multiple tokens", () => {
		const tokens = ["Hello", "world"];
		const result = buildRenderModels(tokens);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			prefix: "H",
			highlight: "e",
			suffix: "llo",
		});
		expect(result[1]).toEqual({
			prefix: "w",
			highlight: "o",
			suffix: "rld",
		});
	});

	it("should handle typical paragraph", () => {
		const tokens = ["RSVP", "Reader", "is", "a", "speed-reading", "app."];
		const result = buildRenderModels(tokens);

		expect(result).toHaveLength(6);
		expect(result.every((m) => typeof m.prefix === "string")).toBe(true);
		expect(result.every((m) => typeof m.highlight === "string")).toBe(true);
		expect(result.every((m) => typeof m.suffix === "string")).toBe(true);
	});

	it("should reconstruct all original tokens", () => {
		const tokens = ["Hello,", "world!", "This", "is", "a", "test."];
		const result = buildRenderModels(tokens);

		result.forEach((model, i) => {
			const reconstructed = model.prefix + model.highlight + model.suffix;
			expect(reconstructed).toBe(tokens[i]);
		});
	});

	it("should return new array instance", () => {
		const tokens = ["hello", "world"];
		const result1 = buildRenderModels(tokens);
		const result2 = buildRenderModels(tokens);

		expect(result1).not.toBe(result2);
		expect(result1).toEqual(result2);
	});

	it("should handle mixed punctuation and lengths", () => {
		const tokens = ['"Hello,"', "said", "Bob.", "(parenthetical)", "content!"];
		const result = buildRenderModels(tokens);

		expect(result).toHaveLength(5);
		result.forEach((model, i) => {
			const reconstructed = model.prefix + model.highlight + model.suffix;
			expect(reconstructed).toBe(tokens[i]);
		});
	});
});
