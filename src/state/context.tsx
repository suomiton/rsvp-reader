import {
	createContext,
	useContext,
	useReducer,
	type ReactNode,
	type Dispatch,
} from "react";
import { appReducer } from "./reducer";
import { initialState, type AppState, type AppAction } from "./types";

interface AppContextValue {
	state: AppState;
	dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(appReducer, initialState);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
}

export function useAppState(): AppContextValue {
	const ctx = useContext(AppContext);
	if (ctx === null) {
		throw new Error("useAppState must be used within an AppProvider");
	}
	return ctx;
}
