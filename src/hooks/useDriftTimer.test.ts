import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDriftTimer } from "./useDriftTimer";

describe("useDriftTimer", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe("basic functionality", () => {
		it("should return start and stop functions", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));

			expect(result.current).toHaveLength(2);
			expect(typeof result.current[0]).toBe("function");
			expect(typeof result.current[1]).toBe("function");
		});

		it("should call onTick after interval when started", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start] = result.current;

			act(() => {
				start();
			});

			expect(onTick).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onTick).toHaveBeenCalledTimes(1);
		});

		it("should continue ticking when onTick returns true", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start] = result.current;

			act(() => {
				start();
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(1);

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(2);

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(3);
		});

		it("should stop ticking when onTick returns false", () => {
			let callCount = 0;
			const onTick = vi.fn(() => {
				callCount++;
				return callCount < 3;
			});
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start] = result.current;

			act(() => {
				start();
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(1);

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(2);

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(3);

			// Should not tick anymore
			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(3);
		});

		it("should stop ticking when stop is called", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start, stop] = result.current;

			act(() => {
				start();
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(1);

			act(() => {
				stop();
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(1);
		});

		it("should handle stop before any ticks", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start, stop] = result.current;

			act(() => {
				start();
				stop();
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onTick).not.toHaveBeenCalled();
		});

		it("should handle stop when not started", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [, stop] = result.current;

			expect(() => {
				act(() => {
					stop();
				});
			}).not.toThrow();
		});

		it("should handle multiple start/stop cycles", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start, stop] = result.current;

			// First cycle
			act(() => {
				start();
			});
			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(1);

			act(() => {
				stop();
			});

			// Second cycle
			act(() => {
				start();
			});
			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(2);

			act(() => {
				stop();
			});

			// Third cycle
			act(() => {
				start();
			});
			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(3);
		});
	});

	describe("dynamic interval", () => {
		it("should call getIntervalMs before each tick", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start] = result.current;

			act(() => {
				start();
			});

			expect(getInterval).toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(getInterval).toHaveBeenCalledTimes(2);

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(getInterval).toHaveBeenCalledTimes(3);
		});

		it("should adapt to changing intervals", () => {
			const onTick = vi.fn(() => true);
			let interval = 100;
			const getInterval = vi.fn(() => interval);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start] = result.current;

			act(() => {
				start();
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick).toHaveBeenCalledTimes(1);

			// Change interval
			interval = 200;

			act(() => {
				vi.advanceTimersByTime(200);
			});
			expect(onTick).toHaveBeenCalledTimes(2);

			act(() => {
				vi.advanceTimersByTime(200);
			});
			expect(onTick).toHaveBeenCalledTimes(3);
		});

		it("should handle WPM-style calculation (60000 / wpm)", () => {
			const onTick = vi.fn(() => true);
			const wpm = 300;
			const getInterval = vi.fn(() => 60_000 / wpm);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start] = result.current;

			act(() => {
				start();
			});

			// 300 WPM = 200ms per word
			act(() => {
				vi.advanceTimersByTime(200);
			});
			expect(onTick).toHaveBeenCalledTimes(1);

			// Second tick at 400ms total
			act(() => {
				vi.advanceTimersByTime(200);
			});
			expect(onTick).toHaveBeenCalledTimes(2);

			// Verify getInterval was called for each tick
			expect(getInterval.mock.calls.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe("callback updates", () => {
		it("should use latest onTick callback", () => {
			let shouldContinue = true;
			const onTick1 = vi.fn(() => shouldContinue);
			const getInterval = vi.fn(() => 100);

			const { result, rerender } = renderHook(
				({ callback }) => useDriftTimer(callback, getInterval),
				{ initialProps: { callback: onTick1 } },
			);

			const [start] = result.current;

			act(() => {
				start();
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick1).toHaveBeenCalledTimes(1);

			// Update callback
			const onTick2 = vi.fn(() => true);
			rerender({ callback: onTick2 });

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(onTick1).toHaveBeenCalledTimes(1);
			expect(onTick2).toHaveBeenCalledTimes(1);
		});

		it("should use latest getIntervalMs callback", () => {
			const onTick = vi.fn(() => true);
			const getInterval1 = vi.fn(() => 100);

			const { result, rerender } = renderHook(
				({ getter }) => useDriftTimer(onTick, getter),
				{ initialProps: { getter: getInterval1 } },
			);

			const [start] = result.current;

			act(() => {
				start();
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(getInterval1).toHaveBeenCalled();

			// Update getter
			const getInterval2 = vi.fn(() => 200);
			rerender({ getter: getInterval2 });

			act(() => {
				vi.advanceTimersByTime(200);
			});
			expect(getInterval2).toHaveBeenCalled();
		});
	});

	describe("restart behavior", () => {
		it("should stop existing timer when start is called again", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start] = result.current;

			act(() => {
				start();
			});

			act(() => {
				vi.advanceTimersByTime(50);
			});

			// Restart before first tick
			act(() => {
				start();
			});

			// Original tick shouldn't happen
			act(() => {
				vi.advanceTimersByTime(50);
			});
			expect(onTick).not.toHaveBeenCalled();

			// New tick happens after full interval
			act(() => {
				vi.advanceTimersByTime(50);
			});
			expect(onTick).toHaveBeenCalledTimes(1);
		});
	});

	describe("edge cases", () => {
		it("should handle zero interval", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 0);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start] = result.current;

			act(() => {
				start();
			});

			act(() => {
				vi.advanceTimersByTime(0);
			});

			expect(onTick).toHaveBeenCalled();
		});

		it("should handle very small intervals", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 1);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start] = result.current;

			act(() => {
				start();
			});

			act(() => {
				vi.advanceTimersByTime(1);
			});

			expect(onTick).toHaveBeenCalled();
		});

		it("should handle very large intervals", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 10_000);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start] = result.current;

			act(() => {
				start();
			});

			act(() => {
				vi.advanceTimersByTime(10_000);
			});

			expect(onTick).toHaveBeenCalled();
		});

		it("should handle rapid start/stop", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result } = renderHook(() => useDriftTimer(onTick, getInterval));
			const [start, stop] = result.current;

			expect(() => {
				act(() => {
					start();
					stop();
					start();
					stop();
					start();
				});
			}).not.toThrow();
		});
	});

	describe("function stability", () => {
		it("should return stable start/stop functions", () => {
			const onTick = vi.fn(() => true);
			const getInterval = vi.fn(() => 100);

			const { result, rerender } = renderHook(() =>
				useDriftTimer(onTick, getInterval),
			);

			const [start1, stop1] = result.current;

			rerender();

			const [start2, stop2] = result.current;

			expect(start1).toBe(start2);
			expect(stop1).toBe(stop2);
		});
	});
});
