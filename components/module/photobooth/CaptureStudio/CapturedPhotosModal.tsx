"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import type { Capture } from "@/features/photobooth/domain";
import { cn } from "@/libs/cn";

type CapturedPhotosModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  captures: Capture[];
  objectUrls: Record<string, string>;
  title: string;
  closeLabel: string;
  retakeLabel: string;
  canRetake: boolean;
  busy: boolean;
  onRetake: () => void;
};

export function CapturedPhotosModal({
  open,
  onOpenChange,
  captures,
  objectUrls,
  title,
  closeLabel,
  retakeLabel,
  canRetake,
  busy,
  onRetake,
}: CapturedPhotosModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {captures.map((capture, index) => (
            <div
              key={capture.id}
              className={cn(
                "border-border relative aspect-square overflow-hidden rounded-[var(--radius-md)] border-2",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={objectUrls[capture.id]}
                alt=""
                className="size-full object-cover"
              />
              <span className="bg-background/80 text-foreground absolute right-1 bottom-1 rounded px-1.5 text-xs font-bold">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            color="destructive"
            radius="lg"
            disabled={!canRetake || busy}
            onClick={onRetake}
          >
            {retakeLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            color="neutral"
            radius="lg"
            onClick={() => onOpenChange(false)}
          >
            {closeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
