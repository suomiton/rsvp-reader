import type { AppState, AppAction } from "./types";
import { initialState } from "./types";

export function appReducer(state: AppState, action: AppAction): AppState {
	switch (action.type) {
		case "SET_TEXT":
			return { ...state, text: action.payload, error: null };

		case "SET_WPM": {
			const clamped = Math.max(50, Math.min(1200, action.payload));
			return { ...state, wpm: clamped };
		}

		case "PREPARE_READING":
			return {
				...state,
				tokens: action.payload.tokens,
				models: action.payload.models,
				index: 0,
				error: null,
			};

		case "SET_INDEX":
			return {
				...state,
				index: Math.max(0, Math.min(action.payload, state.tokens.length - 1)),
			};

		case "STEP_FORWARD":
			return state.index < state.tokens.length - 1
				? { ...state, index: state.index + 1 }
				: state;

		case "STEP_BACK":
			return state.index > 0 ? { ...state, index: state.index - 1 } : state;

		case "SET_ERROR":
			return { ...state, error: action.payload };

		case "CLEAR_ERROR":
			return { ...state, error: null };

		case "RESET_READER":
			return initialState;

		default: {
			const _exhaustive: never = action;
			return _exhaustive;
		}
	}
}
