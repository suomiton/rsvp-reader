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
import { ProgressBar } from "../components/ProgressBar";

export function ReaderPage() {
	const { state, dispatch } = useAppState();
	const navigate = useNavigate();
	const containerRef = useRef<HTMLDivElement>(null);

	const [savedWpm, setSavedWpm] = useLocalStorage("rsvp-wpm", 300);
	const [finished, setFinished] = useState(false);
	const [isFocusMode, setIsFocusMode] = useState(false);

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
			setIsFocusMode(false);
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

	function startPlaying() {
		if (finished) return;
		isPlayingRef.current = true;
		setIsFocusMode(true);
		timerStart();
	}

	function stopPlaying() {
		isPlayingRef.current = false;
		setIsFocusMode(false);
		timerStop();
	}

	function togglePlayPause() {
		if (isPlayingRef.current) {
			stopPlaying();
		} else {
			startPlaying();
		}
	}

	function handleContainerClick() {
		if (isPlayingRef.current) {
			stopPlaying();
		}
	}

	function handleSeek(index: number) {
		if (isPlayingRef.current) {
			stopPlaying();
		}
		if (finished) setFinished(false);
		dispatch({ type: "SET_INDEX", payload: index });
	}

	useKeyboard({
		onSpaceToggle: togglePlayPause,
		onArrowLeft: () => {
			if (isPlayingRef.current) {
				stopPlaying();
			}
			if (finished) setFinished(false);
			dispatch({ type: "STEP_BACK" });
		},
		onArrowRight: () => {
			if (isPlayingRef.current) {
				stopPlaying();
			}
			if (indexRef.current >= tokensLength - 1) {
				setFinished(true);
				return;
			}
			if (finished) setFinished(false);
			dispatch({ type: "STEP_FORWARD" });
		},
		onEscape: () => {
			if (isPlayingRef.current) {
				stopPlaying();
			} else {
				navigate("/");
			}
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
				onClick={handleContainerClick}
				className="relative flex-1 flex items-center justify-center outline-none cursor-pointer overflow-hidden"
			>
				{/* Top bar - positioned absolutely */}
				{!isFocusMode && (
					<div className="absolute top-0 left-0 right-0 grid grid-cols-[auto_1fr_auto] items-center gap-3 p-2 sm:p-3 z-10">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								stopPlaying();
								navigate("/");
							}}
							className="flex items-center gap-0.5 text-gray/50 hover:text-gray transition-colors cursor-pointer"
							aria-label="Back to editor"
						>
							<Back theme="outline" size="18" fill="currentColor" />
							<span className="text-sm">Back</span>
						</button>

						<ProgressBar
							current={state.index}
							total={state.tokens.length}
							onSeek={handleSeek}
							className="min-w-[120px]"
						/>

						<span className="text-sm text-gray/50 whitespace-nowrap">
							{state.index + 1} / {state.tokens.length}
						</span>
					</div>
				)}

				{/* Center word display - absolutely centered */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] flex flex-col items-center px-3">
					<WordDisplay model={currentModel} finished={finished} />
				</div>

				{/* Play button and hint - positioned below center with safe margin */}
				{!isFocusMode && (
					<div
						onClick={(e) => e.stopPropagation()}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[80px] [@media(orientation:landscape)]:translate-y-[40px] md:translate-y-[120px] flex flex-col items-center z-10"
					>
						<PlayButton
							isPlaying={isPlayingRef.current}
							onClick={togglePlayPause}
							disabled={finished}
						/>
						<p className="text-center text-gray/50 text-xs sm:text-sm mt-1 sm:mt-2 whitespace-nowrap [@media(orientation:landscape)]:hidden md:[@media(orientation:landscape)]:block">
							Click play or press spacebar to start
						</p>
					</div>
				)}

				{/* Bottom controls - positioned absolutely */}
				{!isFocusMode && (
					<div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 sm:p-3 z-10">
						<div onClick={(e) => e.stopPropagation()}>
							<NumberInput
								label="WPM"
								value={state.wpm}
								onChange={handleWpmChange}
								min={50}
								max={1200}
								step={10}
							/>
						</div>
						<span className="flex items-center gap-0.5 text-sm text-gray/40 hidden sm:inline-flex">
							<Left theme="outline" size="14" fill="currentColor" />
							<Right theme="outline" size="14" fill="currentColor" />
							to step &middot; ESC to go back
						</span>
					</div>
				)}
			</div>
		</PageShell>
	);
}
