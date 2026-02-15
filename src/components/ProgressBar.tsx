import { useRef, useState } from "react";
import { cn } from "../lib/cn";

interface ProgressBarProps {
	current: number;
	total: number;
	onSeek: (index: number) => void;
	className?: string;
}

export function ProgressBar({
	current,
	total,
	onSeek,
	className,
}: ProgressBarProps) {
	const barRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const percentage = total > 0 ? (current / (total - 1)) * 100 : 0;

	function handleSeek(clientX: number) {
		if (!barRef.current) return;

		const rect = barRef.current.getBoundingClientRect();
		const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
		const ratio = x / rect.width;
		const targetIndex = Math.round(ratio * (total - 1));

		onSeek(targetIndex);
	}

	function handlePointerDown(e: React.PointerEvent) {
		e.stopPropagation();
		setIsDragging(true);
		e.currentTarget.setPointerCapture(e.pointerId);
		handleSeek(e.clientX);
	}

	function handlePointerMove(e: React.PointerEvent) {
		if (!isDragging) return;
		handleSeek(e.clientX);
	}

	function handlePointerUp(e: React.PointerEvent) {
		setIsDragging(false);
		if (e.currentTarget.hasPointerCapture(e.pointerId)) {
			e.currentTarget.releasePointerCapture(e.pointerId);
		}
	}

	return (
		<div
			ref={barRef}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
			className={cn(
				"relative h-1 bg-navy/50 rounded-full cursor-pointer group",
				"hover:h-1.5 transition-all duration-150",
				className,
			)}
		>
			{/* Progress fill */}
			<div
				className="absolute top-0 left-0 h-full bg-amber rounded-full transition-all duration-100"
				style={{ width: `${percentage}%` }}
			/>

			{/* Thumb/handle */}
			<div
				className={cn(
					"absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-amber rounded-full",
					"opacity-0 group-hover:opacity-100 transition-opacity duration-150",
					"pointer-events-none",
					isDragging && "opacity-100 scale-125",
				)}
				style={{ left: `calc(${percentage}% - 4px)` }}
			/>
		</div>
	);
}
