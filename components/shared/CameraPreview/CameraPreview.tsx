"use client";

import { cn } from "@/libs/cn";

type CameraPreviewProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mirrored?: boolean;
  filterCss?: string;
  className?: string;
};

export function CameraPreview({
  videoRef,
  mirrored = true,
  filterCss = "none",
  className,
}: CameraPreviewProps) {
  return (
    <div
      className={cn(
        "border-border bg-foreground/10 shadow-neo-md relative mx-auto aspect-video max-h-[60vh] w-full overflow-hidden rounded-[var(--radius-xl)] border-2",
        className,
      )}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ filter: filterCss }}
        className={cn("size-full object-contain", mirrored && "-scale-x-100")}
      />
    </div>
  );
}
