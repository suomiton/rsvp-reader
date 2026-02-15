import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface PrimaryButtonProps {
	children: ReactNode;
	onClick: () => void;
	disabled?: boolean;
	type?: "button" | "submit";
	className?: string;
}

export function PrimaryButton({
	children,
	onClick,
	disabled = false,
	type = "button",
	className,
}: PrimaryButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"bg-amber text-black font-bold px-4 py-2 rounded",
				"hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber",
				"disabled:opacity-50 disabled:cursor-not-allowed",
				"transition-opacity duration-150 cursor-pointer",
				className,
			)}
		>
			{children}
		</button>
	);
}
