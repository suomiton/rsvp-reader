import type { RenderModel } from "../state/types";

interface WordDisplayProps {
  model: RenderModel | null;
  finished: boolean;
}

export function WordDisplay({ model, finished }: WordDisplayProps) {
  if (finished) {
    return (
      <div className="font-mono text-display text-amber font-bold">
        Finished
      </div>
    );
  }

  if (!model) {
    return (
      <div className="font-mono text-display text-gray/30">&mdash;</div>
    );
  }

  return (
    <div className="flex items-baseline font-mono text-display select-none">
      <span className="text-right flex-1 text-gray">{model.prefix}</span>
      <span className="text-amber font-bold w-[1ch] text-center">
        {model.highlight}
      </span>
      <span className="text-left flex-1 text-gray">{model.suffix}</span>
    </div>
  );
}
