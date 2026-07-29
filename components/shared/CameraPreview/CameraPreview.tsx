"use client";

import { cn } from "@/libs/cn";

type CameraPreviewProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mirrored?: boolean;
  className?: string;
};

export function CameraPreview({
  videoRef,
  mirrored = true,
  className,
}: CameraPreviewProps) {
  return (
    <div
      className={cn(
        "border-border bg-foreground/5 shadow-neo-md relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-xl)] border-2",
        className,
      )}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={cn("size-full object-cover", mirrored && "-scale-x-100")}
      />
    </div>
  );
}
