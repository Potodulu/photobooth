"use client";

import { cn } from "@/libs/cn";

type CameraPreviewProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mirrored?: boolean;
  filterCss?: string;
  className?: string;
  /** Fill parent instead of fixed aspect-video card. */
  fill?: boolean;
};

export function CameraPreview({
  videoRef,
  mirrored = true,
  filterCss = "none",
  className,
  fill = false,
}: CameraPreviewProps) {
  return (
    <div
      className={cn(
        "bg-foreground/10 relative overflow-hidden",
        fill
          ? "size-full"
          : "border-border shadow-neo-md mx-auto aspect-video max-h-[60vh] w-full rounded-[var(--radius-xl)] border-2",
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
