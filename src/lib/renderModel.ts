import type { RenderModel } from "../state/types";
import { computeOrpIndex } from "./orp";

/**
 * Build a RenderModel for a single token, splitting it into
 * prefix, highlighted ORP character, and suffix.
 */
export function buildRenderModel(token: string): RenderModel {
	const orpIdx = computeOrpIndex(token);
	return {
		prefix: token.slice(0, orpIdx),
		highlight: token[orpIdx] ?? "",
		suffix: token.slice(orpIdx + 1),
	};
}

/**
 * Build RenderModels for an array of tokens.
 */
export function buildRenderModels(tokens: string[]): RenderModel[] {
	return tokens.map(buildRenderModel);
}
