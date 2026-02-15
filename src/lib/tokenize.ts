/**
 * Split raw text into word tokens for RSVP display.
 *
 * - Normalizes all whitespace runs to single spaces
 * - Preserves punctuation attached to words: "Hei, maailma!" => ["Hei,", "maailma!"]
 * - Supports Unicode (Finnish ä/ö/å, etc.)
 */
export function tokenize(text: string): string[] {
	return text
		.replace(/\s+/g, " ")
		.trim()
		.split(" ")
		.filter((t) => t.length > 0);
}
