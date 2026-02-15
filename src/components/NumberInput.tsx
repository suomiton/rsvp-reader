import { useState } from "react";
import { cn } from "../lib/cn";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  className,
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState(String(value));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setLocalValue(raw);

    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) {
      onChange(parsed);
    }
  }

  function handleBlur() {
    const parsed = Number(localValue);
    if (Number.isNaN(parsed)) {
      setLocalValue(String(value));
      return;
    }
    const clamped = Math.max(min, Math.min(max, parsed));
    setLocalValue(String(clamped));
    onChange(clamped);
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <label className="text-gray text-sm">{label}</label>
      <input
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        className={cn(
          "w-10 bg-navy text-gray text-center p-1 rounded",
          "border border-gray/20 focus:outline-none focus:ring-2 focus:ring-amber",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
      />
    </div>
  );
}
