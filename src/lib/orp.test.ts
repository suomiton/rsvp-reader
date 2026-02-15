import { describe, it, expect } from "vitest";
import { computeOrpIndex } from "./orp";

describe("computeOrpIndex", () => {
	describe("basic length rules", () => {
		it("should return 0 for single character", () => {
			expect(computeOrpIndex("I")).toBe(0);
			expect(computeOrpIndex("a")).toBe(0);
		});

		it("should return 1 for 2-5 character words", () => {
			expect(computeOrpIndex("is")).toBe(1);
			expect(computeOrpIndex("the")).toBe(1);
			expect(computeOrpIndex("word")).toBe(1);
			expect(computeOrpIndex("hello")).toBe(1);
		});

		it("should return 2 for 6-9 character words", () => {
			expect(computeOrpIndex("reader")).toBe(2);
			expect(computeOrpIndex("reading")).toBe(2);
			expect(computeOrpIndex("wonderful")).toBe(2);
		});

		it("should return 3 for 10-13 character words", () => {
			expect(computeOrpIndex("development")).toBe(3);
			expect(computeOrpIndex("programming")).toBe(3);
			expect(computeOrpIndex("understanding")).toBe(3);
		});

		it("should return 4 for 14+ character words", () => {
			expect(computeOrpIndex("implementation")).toBe(4);
			expect(computeOrpIndex("sophistication")).toBe(4);
			expect(computeOrpIndex("characterization")).toBe(4);
		});
	});

	describe("punctuation handling", () => {
		it("should ignore trailing punctuation", () => {
			expect(computeOrpIndex("hello,")).toBe(1); // same as "hello"
			expect(computeOrpIndex("world!")).toBe(1); // same as "world"
			expect(computeOrpIndex("yes.")).toBe(1); // same as "yes"
			expect(computeOrpIndex("what?")).toBe(1); // same as "what"
			expect(computeOrpIndex("note:")).toBe(1); // same as "note"
		});

		it("should ignore leading punctuation", () => {
			// "hello (core "hello" starts at 1, length 5, offset 1) -> 1 + 1 = 2
			expect(computeOrpIndex('"hello')).toBe(2);
			// (word (core "word" starts at 1, length 4, offset 1) -> 1 + 1 = 2
			expect(computeOrpIndex("(word")).toBe(2);
			// 'test (core "test" starts at 1, length 4, offset 1) -> 1 + 1 = 2
			expect(computeOrpIndex("'test")).toBe(2);
		});

		it("should ignore surrounding punctuation", () => {
			// "hello" (core "hello" starts at 1, length 5, offset 1) -> 1 + 1 = 2
			expect(computeOrpIndex('"hello"')).toBe(2);
			// (word) (core "word" starts at 1, length 4, offset 1) -> 1 + 1 = 2
			expect(computeOrpIndex("(word)")).toBe(2);
			// 'test' (core "test" starts at 1, length 4, offset 1) -> 1 + 1 = 2
			expect(computeOrpIndex("'test'")).toBe(2);
		});

		it("should handle multiple punctuation marks", () => {
			expect(computeOrpIndex("hello...")).toBe(1);
			expect(computeOrpIndex("what?!")).toBe(1);
		});
	});

	describe("Unicode support", () => {
		it("should handle Finnish characters", () => {
			expect(computeOrpIndex("ä")).toBe(0); // 1 char
			expect(computeOrpIndex("älä")).toBe(1); // 3 chars
			expect(computeOrpIndex("käyttää")).toBe(2); // 7 chars
			expect(computeOrpIndex("ääliö")).toBe(1); // 5 chars
		});

		it("should handle Swedish characters", () => {
			expect(computeOrpIndex("åäö")).toBe(1); // 3 chars
		});

		it("should handle various Unicode", () => {
			expect(computeOrpIndex("café")).toBe(1); // 4 chars
			expect(computeOrpIndex("naïve")).toBe(1); // 5 chars
		});
	});

	describe("edge cases", () => {
		it("should handle empty string", () => {
			expect(computeOrpIndex("")).toBeGreaterThanOrEqual(0);
		});

		it("should handle all punctuation", () => {
			const result = computeOrpIndex("...");
			expect(result).toBeGreaterThanOrEqual(0);
			expect(result).toBeLessThan(3);
		});

		it("should handle mixed case", () => {
			expect(computeOrpIndex("Hello")).toBe(1);
			expect(computeOrpIndex("WORLD")).toBe(1);
			expect(computeOrpIndex("TeSt")).toBe(1);
		});

		it("should handle numbers", () => {
			expect(computeOrpIndex("123")).toBe(1); // 3 digits
			expect(computeOrpIndex("2024")).toBe(1); // 4 digits
		});

		it("should handle mixed alphanumeric", () => {
			expect(computeOrpIndex("test123")).toBe(2); // 7 chars
			expect(computeOrpIndex("abc1")).toBe(1); // 4 chars
		});
	});

	describe("real-world examples", () => {
		it("should handle typical sentence words", () => {
			const sentence = "The quick brown fox jumps over the lazy dog.";
			const words = sentence.split(" ");

			expect(computeOrpIndex(words[0]!)).toBe(1); // "The" -> 1
			expect(computeOrpIndex(words[1]!)).toBe(1); // "quick" -> 1
			expect(computeOrpIndex(words[2]!)).toBe(1); // "brown" -> 1
			expect(computeOrpIndex(words[3]!)).toBe(1); // "fox" -> 1
			expect(computeOrpIndex(words[4]!)).toBe(1); // "jumps" -> 1
		});
	});
});
