import { Play, Pause } from "@icon-park/react";
import { cn } from "../lib/cn";

interface PlayButtonProps {
	isPlaying: boolean;
	onClick: () => void;
	disabled?: boolean;
	className?: string;
}

export function PlayButton({
	isPlaying,
	onClick,
	disabled = false,
	className,
}: PlayButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"w-10 h-10 rounded-full bg-amber",
				"flex items-center justify-center",
				"active:scale-95 transition-transform duration-100",
				"select-none",
				"disabled:opacity-50 disabled:cursor-not-allowed",
				"focus:outline-none focus:ring-2 focus:ring-amber/50 focus:ring-offset-2 focus:ring-offset-black",
				"[&>*]:pointer-events-none cursor-pointer",
				className,
			)}
			aria-label={isPlaying ? "Pause reading" : "Start reading"}
		>
			{isPlaying ? (
				<Pause theme="filled" size="24" fill="#000000" />
			) : (
				<Play theme="filled" size="24" fill="#000000" />
			)}
		</button>
	);
}
