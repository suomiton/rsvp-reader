import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Back, Left, Right } from "@icon-park/react";
import { useAppState } from "../state/context";
import { useKeyboard } from "../hooks/useKeyboard";
import { useDriftTimer } from "../hooks/useDriftTimer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { PageShell } from "../components/PageShell";
import { WordDisplay } from "../components/WordDisplay";
import { NumberInput } from "../components/NumberInput";
import { PlayButton } from "../components/PlayButton";

export function ReaderPage() {
	const { state, dispatch } = useAppState();
	const navigate = useNavigate();
	const containerRef = useRef<HTMLDivElement>(null);

	const [savedWpm, setSavedWpm] = useLocalStorage("rsvp-wpm", 300);
	const [finished, setFinished] = useState(false);

	const isPlayingRef = useRef(false);
	const indexRef = useRef(state.index);
	indexRef.current = state.index;

	// Sync saved WPM on mount
	useEffect(() => {
		dispatch({ type: "SET_WPM", payload: savedWpm });
	}, [savedWpm, dispatch]);

	// Redirect if no tokens
	useEffect(() => {
		if (state.tokens.length === 0) {
			navigate("/", { replace: true });
		}
	}, [state.tokens.length, navigate]);

	// Auto-focus container for keyboard capture
	useEffect(() => {
		containerRef.current?.focus();
	}, []);

	const tokensLength = state.tokens.length;

	const onTick = useCallback((): boolean => {
		if (indexRef.current >= tokensLength - 1) {
			setFinished(true);
			isPlayingRef.current = false;
			return false;
		}
		dispatch({ type: "STEP_FORWARD" });
		return true;
	}, [tokensLength, dispatch]);

	const getIntervalMs = useCallback((): number => {
		return 60_000 / state.wpm;
	}, [state.wpm]);

	const [timerStart, timerStop] = useDriftTimer(onTick, getIntervalMs);

	function handleWpmChange(value: number) {
		dispatch({ type: "SET_WPM", payload: value });
		setSavedWpm(value);
	}

	function handlePlayStart() {
		if (finished) return;
		isPlayingRef.current = true;
		timerStart();
	}

	function handlePlayStop() {
		isPlayingRef.current = false;
		timerStop();
	}

	useKeyboard({
		onSpaceDown: handlePlayStart,
		onSpaceUp: handlePlayStop,
		onArrowLeft: () => {
			if (isPlayingRef.current) return;
			if (finished) setFinished(false);
			dispatch({ type: "STEP_BACK" });
		},
		onArrowRight: () => {
			if (isPlayingRef.current) return;
			if (indexRef.current >= tokensLength - 1) {
				setFinished(true);
				return;
			}
			if (finished) setFinished(false);
			dispatch({ type: "STEP_FORWARD" });
		},
		onEscape: () => {
			handlePlayStop();
			navigate("/");
		},
	});

	// Clean up timer on unmount
	useEffect(() => {
		return () => {
			timerStop();
		};
	}, [timerStop]);

	const currentModel = state.models[state.index] ?? null;

	if (state.tokens.length === 0) {
		return null;
	}

	return (
		<PageShell>
			<div
				ref={containerRef}
				tabIndex={-1}
				className="flex-1 flex flex-col outline-none"
			>
				{/* Top bar */}
				<div className="flex items-center justify-between p-3">
					<button
						type="button"
						onClick={() => {
							handlePlayStop();
							navigate("/");
						}}
						className="flex items-center gap-0.5 text-gray/50 hover:text-gray transition-colors cursor-pointer"
						aria-label="Back to editor"
					>
						<Back theme="outline" size="18" fill="currentColor" />
						<span className="text-sm">Back</span>
					</button>
					<span className="text-sm text-gray/50">
						{state.index + 1} / {state.tokens.length}
					</span>
				</div>

				{/* Center word display */}
				<div className="flex-1 flex items-center justify-center px-3">
					<div className="w-full max-w-[800px] flex flex-col items-center">
						<WordDisplay model={currentModel} finished={finished} />
						<PlayButton
							onHoldStart={handlePlayStart}
							onHoldEnd={handlePlayStop}
							disabled={finished}
							className="mt-6"
						/>
						<p className="text-center text-gray/50 text-sm mt-3">
							Hold button or spacebar to read
						</p>
					</div>
				</div>

				{/* Bottom controls */}
				<div className="flex items-center justify-between p-3">
					<NumberInput
						label="WPM"
						value={state.wpm}
						onChange={handleWpmChange}
						min={50}
						max={1200}
						step={10}
					/>
					<span className="flex items-center gap-0.5 text-sm text-gray/40 hidden sm:inline-flex">
						<Left theme="outline" size="14" fill="currentColor" />
						<Right theme="outline" size="14" fill="currentColor" />
						to step &middot; ESC to go back
					</span>
				</div>
			</div>
		</PageShell>
	);
}
