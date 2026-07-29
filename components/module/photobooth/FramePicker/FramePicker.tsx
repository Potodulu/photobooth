"use client";

import type { Frame } from "@/features/photobooth/domain";
import { cn } from "@/libs/cn";

type FramePickerProps = {
  frames: Frame[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function FramePicker({
  frames,
  selectedId,
  onSelect,
}: FramePickerProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {frames.map((frame) => {
        const selected = frame.id === selectedId;
        return (
          <button
            key={frame.id}
            type="button"
            onClick={() => onSelect(frame.id)}
            className={cn(
              "border-border bg-card shadow-neo-sm hover:shadow-neo-md flex flex-col gap-3 rounded-[var(--radius-xl)] border-2 p-4 text-left transition",
              selected && "ring-foreground ring-2 ring-offset-2",
            )}
          >
            <div
              className="border-border aspect-[3/4] w-full rounded-[var(--radius-md)] border-2"
              style={{
                backgroundColor: frame.backgroundColor,
                boxShadow: `inset 0 0 0 ${frame.borderWidth ?? 8}px ${frame.borderColor ?? "#1a1a1a"}`,
              }}
            />
            <span className="font-display font-bold">{frame.name}</span>
          </button>
        );
      })}
    </div>
  );
}
