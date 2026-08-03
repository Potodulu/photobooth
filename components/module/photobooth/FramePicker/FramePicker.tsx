"use client";

import Image from "next/image";
import type { Frame } from "@/features/photobooth/domain";
import { resolvePhotoboothAsset } from "@/features/photobooth/assets";
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
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pt-2 pb-1">
      {frames.map((frame) => {
        const selected = frame.id === selectedId;
        const previewSrc = resolvePhotoboothAsset(frame.preview);
        return (
          <button
            key={frame.id}
            type="button"
            onClick={() => onSelect(frame.id)}
            className={cn(
              "border-border bg-card shadow-neo-sm hover:shadow-neo-md flex w-28 shrink-0 flex-col gap-2 rounded-[var(--radius-xl)] border-2 p-3 text-left transition",
              selected && "ring-foreground ring-2 ring-offset-2",
            )}
          >
            <div
              className="border-border relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)] border-2"
              style={{ backgroundColor: frame.backgroundColor }}
            >
              <Image
                src={previewSrc}
                alt={frame.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="font-display truncate text-sm font-bold">
              {frame.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
