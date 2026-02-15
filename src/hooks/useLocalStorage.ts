import { useState, useCallback } from "react";

export function useLocalStorage<T>(
	key: string,
	fallback: T,
): [T, (value: T) => void] {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = localStorage.getItem(key);
			if (item === null) return fallback;
			return JSON.parse(item) as T;
		} catch {
			return fallback;
		}
	});

	const setValue = useCallback(
		(value: T) => {
			setStoredValue(value);
			try {
				localStorage.setItem(key, JSON.stringify(value));
			} catch {
				// Ignore write errors (e.g., quota exceeded)
			}
		},
		[key],
	);

	return [storedValue, setValue];
}
