import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	describe("initialization", () => {
		it("should return fallback value when localStorage is empty", () => {
			const { result } = renderHook(() =>
				useLocalStorage("test-key", "default"),
			);

			expect(result.current[0]).toBe("default");
		});

		it("should return stored value when it exists", () => {
			localStorage.setItem("test-key", JSON.stringify("stored"));

			const { result } = renderHook(() =>
				useLocalStorage("test-key", "default"),
			);

			expect(result.current[0]).toBe("stored");
		});

		it("should handle number values", () => {
			localStorage.setItem("wpm", JSON.stringify(500));

			const { result } = renderHook(() => useLocalStorage("wpm", 300));

			expect(result.current[0]).toBe(500);
		});

		it("should handle boolean values", () => {
			localStorage.setItem("dark-mode", JSON.stringify(true));

			const { result } = renderHook(() =>
				useLocalStorage("dark-mode", false),
			);

			expect(result.current[0]).toBe(true);
		});

		it("should handle object values", () => {
			const obj = { name: "Test", count: 42 };
			localStorage.setItem("config", JSON.stringify(obj));

			const { result } = renderHook(() =>
				useLocalStorage("config", { name: "", count: 0 }),
			);

			expect(result.current[0]).toEqual(obj);
		});

		it("should handle array values", () => {
			const arr = ["a", "b", "c"];
			localStorage.setItem("items", JSON.stringify(arr));

			const { result } = renderHook(() => useLocalStorage("items", []));

			expect(result.current[0]).toEqual(arr);
		});

		it("should return fallback on parse error", () => {
			localStorage.setItem("bad-json", "{invalid json}");

			const { result } = renderHook(() =>
				useLocalStorage("bad-json", "fallback"),
			);

			expect(result.current[0]).toBe("fallback");
		});

		it("should return fallback on null value", () => {
			localStorage.setItem("test-key", "null");

			const { result } = renderHook(() =>
				useLocalStorage("test-key", "default"),
			);

			expect(result.current[0]).toBe(null);
		});
	});

	describe("setValue", () => {
		it("should update state and localStorage", () => {
			const { result } = renderHook(() =>
				useLocalStorage("test-key", "initial"),
			);

			act(() => {
				result.current[1]("updated");
			});

			expect(result.current[0]).toBe("updated");
			expect(localStorage.getItem("test-key")).toBe(
				JSON.stringify("updated"),
			);
		});

		it("should persist number values", () => {
			const { result } = renderHook(() => useLocalStorage("wpm", 300));

			act(() => {
				result.current[1](500);
			});

			expect(result.current[0]).toBe(500);
			expect(localStorage.getItem("wpm")).toBe("500");
		});

		it("should persist boolean values", () => {
			const { result } = renderHook(() =>
				useLocalStorage("enabled", false),
			);

			act(() => {
				result.current[1](true);
			});

			expect(result.current[0]).toBe(true);
			expect(localStorage.getItem("enabled")).toBe("true");
		});

		it("should persist object values", () => {
			const { result } = renderHook(() =>
				useLocalStorage("config", { count: 0 }),
			);

			act(() => {
				result.current[1]({ count: 42 });
			});

			expect(result.current[0]).toEqual({ count: 42 });
			expect(JSON.parse(localStorage.getItem("config") ?? "")).toEqual({
				count: 42,
			});
		});

		it("should handle multiple updates", () => {
			const { result } = renderHook(() => useLocalStorage("count", 0));

			act(() => {
				result.current[1](1);
			});
			expect(result.current[0]).toBe(1);

			act(() => {
				result.current[1](2);
			});
			expect(result.current[0]).toBe(2);

			act(() => {
				result.current[1](3);
			});
			expect(result.current[0]).toBe(3);

			expect(localStorage.getItem("count")).toBe("3");
		});

		it("should not throw on localStorage write failure", () => {
			const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
			setItemSpy.mockImplementation(() => {
				throw new Error("Quota exceeded");
			});

			const { result } = renderHook(() =>
				useLocalStorage("test-key", "initial"),
			);

			expect(() => {
				act(() => {
					result.current[1]("updated");
				});
			}).not.toThrow();

			expect(result.current[0]).toBe("updated");

			setItemSpy.mockRestore();
		});
	});

	describe("persistence", () => {
		it("should persist across hook remounts", () => {
			const { result: result1 } = renderHook(() =>
				useLocalStorage("test-key", "default"),
			);

			act(() => {
				result1.current[1]("persisted");
			});

			const { result: result2 } = renderHook(() =>
				useLocalStorage("test-key", "default"),
			);

			expect(result2.current[0]).toBe("persisted");
		});

		it("should use different keys independently", () => {
			const { result: result1 } = renderHook(() =>
				useLocalStorage("key1", "default1"),
			);
			const { result: result2 } = renderHook(() =>
				useLocalStorage("key2", "default2"),
			);

			act(() => {
				result1.current[1]("value1");
			});
			act(() => {
				result2.current[1]("value2");
			});

			expect(result1.current[0]).toBe("value1");
			expect(result2.current[0]).toBe("value2");
			expect(localStorage.getItem("key1")).toBe(JSON.stringify("value1"));
			expect(localStorage.getItem("key2")).toBe(JSON.stringify("value2"));
		});
	});

	describe("type safety", () => {
		it("should maintain type for strings", () => {
			const { result } = renderHook(() =>
				useLocalStorage<string>("test", "default"),
			);

			const value: string = result.current[0];
			expect(typeof value).toBe("string");
		});

		it("should maintain type for numbers", () => {
			const { result } = renderHook(() => useLocalStorage<number>("test", 0));

			const value: number = result.current[0];
			expect(typeof value).toBe("number");
		});

		it("should maintain type for objects", () => {
			type Config = { name: string; count: number };
			const { result } = renderHook(() =>
				useLocalStorage<Config>("test", { name: "", count: 0 }),
			);

			const value: Config = result.current[0];
			expect(value).toHaveProperty("name");
			expect(value).toHaveProperty("count");
		});
	});

	describe("edge cases", () => {
		it("should handle empty string value", () => {
			const { result } = renderHook(() => useLocalStorage("test", "default"));

			act(() => {
				result.current[1]("");
			});

			expect(result.current[0]).toBe("");
			expect(localStorage.getItem("test")).toBe('""');
		});

		it("should handle zero value", () => {
			const { result } = renderHook(() => useLocalStorage("test", 100));

			act(() => {
				result.current[1](0);
			});

			expect(result.current[0]).toBe(0);
			expect(localStorage.getItem("test")).toBe("0");
		});

		it("should handle null value", () => {
			const { result } = renderHook(() =>
				useLocalStorage<string | null>("test", "default"),
			);

			act(() => {
				result.current[1](null);
			});

			expect(result.current[0]).toBe(null);
			expect(localStorage.getItem("test")).toBe("null");
		});

		it("should handle special characters in key", () => {
			const { result } = renderHook(() =>
				useLocalStorage("test-key_123.value", "default"),
			);

			act(() => {
				result.current[1]("value");
			});

			expect(result.current[0]).toBe("value");
			expect(localStorage.getItem("test-key_123.value")).toBe(
				JSON.stringify("value"),
			);
		});
	});
});
