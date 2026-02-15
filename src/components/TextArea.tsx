import { cn } from "../lib/cn";

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 12,
  className,
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "w-full bg-navy text-gray p-3 rounded border border-gray/20",
        "focus:outline-none focus:ring-2 focus:ring-amber",
        "resize-y placeholder:text-gray/40 font-sans text-base",
        className
      )}
    />
  );
}
