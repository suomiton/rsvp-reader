import { describe, it, expect } from "vitest";
import { tokenize } from "./tokenize";

describe("tokenize", () => {
	describe("basic tokenization", () => {
		it("should split simple sentence by spaces", () => {
			expect(tokenize("Hello world")).toEqual(["Hello", "world"]);
		});

		it("should handle single word", () => {
			expect(tokenize("Hello")).toEqual(["Hello"]);
		});

		it("should handle multiple words", () => {
			expect(tokenize("The quick brown fox")).toEqual([
				"The",
				"quick",
				"brown",
				"fox",
			]);
		});
	});

	describe("punctuation preservation", () => {
		it("should preserve trailing punctuation", () => {
			expect(tokenize("Hello, world!")).toEqual(["Hello,", "world!"]);
		});

		it("should preserve various punctuation marks", () => {
			expect(tokenize("Yes. No? Maybe!")).toEqual(["Yes.", "No?", "Maybe!"]);
		});

		it("should preserve colons and semicolons", () => {
			expect(tokenize("Note: important; critical.")).toEqual([
				"Note:",
				"important;",
				"critical.",
			]);
		});

		it("should preserve quotes", () => {
			expect(tokenize('"Hello" said Bob')).toEqual(['"Hello"', "said", "Bob"]);
		});

		it("should preserve parentheses", () => {
			expect(tokenize("Word (parenthetical) content")).toEqual([
				"Word",
				"(parenthetical)",
				"content",
			]);
		});
	});

	describe("whitespace normalization", () => {
		it("should normalize multiple spaces to single space", () => {
			expect(tokenize("Hello  world")).toEqual(["Hello", "world"]);
			expect(tokenize("a   b    c")).toEqual(["a", "b", "c"]);
		});

		it("should handle tabs", () => {
			expect(tokenize("Hello\tworld")).toEqual(["Hello", "world"]);
		});

		it("should handle newlines", () => {
			expect(tokenize("Hello\nworld")).toEqual(["Hello", "world"]);
		});

		it("should handle carriage returns", () => {
			expect(tokenize("Hello\rworld")).toEqual(["Hello", "world"]);
		});

		it("should handle mixed whitespace", () => {
			expect(tokenize("Hello \t\n world")).toEqual(["Hello", "world"]);
		});

		it("should trim leading whitespace", () => {
			expect(tokenize("  Hello world")).toEqual(["Hello", "world"]);
		});

		it("should trim trailing whitespace", () => {
			expect(tokenize("Hello world  ")).toEqual(["Hello", "world"]);
		});

		it("should trim both leading and trailing whitespace", () => {
			expect(tokenize("  Hello world  ")).toEqual(["Hello", "world"]);
		});
	});

	describe("edge cases", () => {
		it("should return empty array for empty string", () => {
			expect(tokenize("")).toEqual([]);
		});

		it("should return empty array for whitespace-only string", () => {
			expect(tokenize("   ")).toEqual([]);
			expect(tokenize("\t\n\r")).toEqual([]);
		});

		it("should handle single character", () => {
			expect(tokenize("I")).toEqual(["I"]);
		});

		it("should filter out empty tokens", () => {
			const result = tokenize("Hello  world");
			expect(result.every((t) => t.length > 0)).toBe(true);
		});
	});

	describe("Unicode support", () => {
		it("should handle Finnish text", () => {
			expect(tokenize("Hei, maailma!")).toEqual(["Hei,", "maailma!"]);
			expect(tokenize("Älä käytä")).toEqual(["Älä", "käytä"]);
		});

		it("should handle Swedish text", () => {
			expect(tokenize("Hej världen")).toEqual(["Hej", "världen"]);
		});

		it("should handle special characters", () => {
			expect(tokenize("café naïve résumé")).toEqual([
				"café",
				"naïve",
				"résumé",
			]);
		});

		it("should handle emoji (treated as part of word)", () => {
			expect(tokenize("Hello 👋 World")).toEqual(["Hello", "👋", "World"]);
		});
	});

	describe("real-world text", () => {
		it("should handle typical paragraph", () => {
			const text =
				"RSVP Reader is a speed-reading app. It helps you read faster!";
			const result = tokenize(text);

			expect(result).toEqual([
				"RSVP",
				"Reader",
				"is",
				"a",
				"speed-reading",
				"app.",
				"It",
				"helps",
				"you",
				"read",
				"faster!",
			]);
		});

		it("should handle text with multiple sentences", () => {
			const text = "First sentence. Second one! Third?";
			const result = tokenize(text);

			expect(result).toEqual([
				"First",
				"sentence.",
				"Second",
				"one!",
				"Third?",
			]);
		});

		it("should preserve hyphens in compound words", () => {
			const text = "state-of-the-art twenty-first";
			const result = tokenize(text);

			expect(result).toEqual(["state-of-the-art", "twenty-first"]);
		});
	});
});
