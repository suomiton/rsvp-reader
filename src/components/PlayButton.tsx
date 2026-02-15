import { useCallback } from "react";
import { Play } from "@icon-park/react";
import { cn } from "../lib/cn";

interface PlayButtonProps {
	onHoldStart: () => void;
	onHoldEnd: () => void;
	disabled?: boolean;
	className?: string;
}

export function PlayButton({
	onHoldStart,
	onHoldEnd,
	disabled = false,
	className,
}: PlayButtonProps) {
	const handlePointerDown = useCallback(
		(e: React.PointerEvent) => {
			if (disabled) return;
			e.preventDefault();
			e.currentTarget.setPointerCapture(e.pointerId);
			onHoldStart();
		},
		[disabled, onHoldStart],
	);

	const handlePointerUp = useCallback(
		(e: React.PointerEvent) => {
			e.preventDefault();
			onHoldEnd();
		},
		[onHoldEnd],
	);

	return (
		<button
			type="button"
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
			onContextMenu={(e) => e.preventDefault()}
			disabled={disabled}
			className={cn(
				"w-10 h-10 rounded-full bg-amber",
				"flex items-center justify-center",
				"active:scale-95 transition-transform duration-100",
				"select-none touch-none",
				"disabled:opacity-50 disabled:cursor-not-allowed",
				"focus:outline-none focus:ring-2 focus:ring-amber/50 focus:ring-offset-2 focus:ring-offset-black",
				"[&>*]:pointer-events-none",
				className,
			)}
			aria-label="Hold to read"
		>
			<Play theme="filled" size="24" fill="#000000" />
		</button>
	);
}
