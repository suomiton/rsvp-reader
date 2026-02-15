import { useRef, useCallback } from "react";

/**
 * Drift-corrected timer using self-correcting setTimeout chain.
 *
 * @param onTick - Called each tick; return true to continue, false to stop.
 * @param getIntervalMs - Called each tick to get current interval (supports live WPM changes).
 * @returns [start, stop] functions.
 */
export function useDriftTimer(
	onTick: () => boolean,
	getIntervalMs: () => number,
): [start: () => void, stop: () => void] {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const targetRef = useRef(0);
	const onTickRef = useRef(onTick);
	const getIntervalRef = useRef(getIntervalMs);

	onTickRef.current = onTick;
	getIntervalRef.current = getIntervalMs;

	const stop = useCallback(() => {
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const scheduleNext = useCallback(() => {
		const intervalMs = getIntervalRef.current();
		targetRef.current += intervalMs;

		const now = performance.now();
		const delay = Math.max(0, targetRef.current - now);

		timerRef.current = setTimeout(() => {
			const shouldContinue = onTickRef.current();
			if (shouldContinue) {
				scheduleNext();
			} else {
				timerRef.current = null;
			}
		}, delay);
	}, []);

	const start = useCallback(() => {
		stop();
		targetRef.current = performance.now();
		scheduleNext();
	}, [stop, scheduleNext]);

	return [start, stop];
}
