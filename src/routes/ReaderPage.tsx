import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/context";
import { useKeyboard } from "../hooks/useKeyboard";
import { useDriftTimer } from "../hooks/useDriftTimer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { PageShell } from "../components/PageShell";
import { WordDisplay } from "../components/WordDisplay";
import { NumberInput } from "../components/NumberInput";

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

  useKeyboard({
    onSpaceDown: () => {
      if (finished) return;
      isPlayingRef.current = true;
      timerStart();
    },
    onSpaceUp: () => {
      isPlayingRef.current = false;
      timerStop();
    },
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
      timerStop();
      isPlayingRef.current = false;
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
        {/* Progress indicator */}
        <div className="flex justify-end p-3">
          <span className="text-sm text-gray/50">
            {state.index + 1} / {state.tokens.length}
          </span>
        </div>

        {/* Center word display */}
        <div className="flex-1 flex items-center justify-center px-3">
          <div className="w-full max-w-[800px]">
            <WordDisplay model={currentModel} finished={finished} />
            <p className="text-center text-gray/50 text-sm mt-4">
              Hold spacebar to read further
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
          <span className="text-sm text-gray/40 hidden sm:inline">
            Arrows to step &middot; ESC to go back
          </span>
        </div>
      </div>
    </PageShell>
  );
}
