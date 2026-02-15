import "@testing-library/jest-dom";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
	cleanup();
});

// Mock Pointer Events API (not fully implemented in jsdom)
if (!Element.prototype.setPointerCapture) {
	Element.prototype.setPointerCapture = function () {
		// Mock implementation
	};
}

if (!Element.prototype.releasePointerCapture) {
	Element.prototype.releasePointerCapture = function () {
		// Mock implementation
	};
}

if (!Element.prototype.hasPointerCapture) {
	Element.prototype.hasPointerCapture = function () {
		return false; // Mock implementation
	};
}
