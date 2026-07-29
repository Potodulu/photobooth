"use client";

import Image from "next/image";
import type { Layout } from "@/features/photobooth/domain";
import { cn } from "@/libs/cn";
import { Badge } from "@/components/ui/Badge";

type LayoutPickerProps = {
  layouts: Layout[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function LayoutPicker({
  layouts,
  selectedId,
  onSelect,
}: LayoutPickerProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {layouts.map((layout) => {
        const selected = layout.id === selectedId;
        return (
          <button
            key={layout.id}
            type="button"
            onClick={() => onSelect(layout.id)}
            className={cn(
              "border-border bg-card shadow-neo-sm hover:shadow-neo-md flex flex-col gap-3 rounded-[var(--radius-xl)] border-2 p-4 text-left transition",
              selected && "bg-primary/20 ring-foreground ring-2 ring-offset-2",
            )}
          >
            <div className="border-border relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)] border-2 bg-white">
              <Image
                src={layout.preview}
                alt={layout.name}
                fill
                className="object-contain p-3"
                unoptimized
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-display font-bold">{layout.name}</span>
              <Badge variant="soft" color="neutral" radius="full" size="sm">
                {layout.slots.length}
              </Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}
