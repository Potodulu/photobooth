"use client";

import { useState } from "react";
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
  backLabel: string;
  previewAria: (index: number) => string;
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
  backLabel,
  previewAria,
  canRetake,
  busy,
  onRetake,
}: CapturedPhotosModalProps) {
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) setPreviewId(null);
    onOpenChange(next);
  };

  const previewCapture = previewId
    ? captures.find((item) => item.id === previewId)
    : null;
  const previewIndex = previewCapture
    ? captures.findIndex((item) => item.id === previewCapture.id)
    : -1;
  const previewUrl = previewCapture
    ? (objectUrls[previewCapture.id] ?? null)
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[85dvh] overflow-y-auto sm:max-w-lg",
          previewUrl && "sm:max-w-3xl",
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {previewCapture ? String(previewIndex + 1).padStart(2, "0") : title}
          </DialogTitle>
        </DialogHeader>

        {previewUrl ? (
          <div className="bg-muted/30 flex max-h-[70dvh] items-center justify-center overflow-hidden rounded-[var(--radius-md)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt=""
              className="max-h-[70dvh] w-full object-contain"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {captures.map((capture, index) => (
              <button
                key={capture.id}
                type="button"
                className={cn(
                  "border-border focus-visible:ring-ring relative aspect-square overflow-hidden rounded-[var(--radius-md)] border-2 transition hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none",
                )}
                aria-label={previewAria(index + 1)}
                onClick={() => setPreviewId(capture.id)}
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
              </button>
            ))}
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {previewUrl ? (
            <Button
              type="button"
              variant="outline"
              color="neutral"
              radius="lg"
              onClick={() => setPreviewId(null)}
            >
              {backLabel}
            </Button>
          ) : (
            <>
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
                onClick={() => handleOpenChange(false)}
              >
                {closeLabel}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
