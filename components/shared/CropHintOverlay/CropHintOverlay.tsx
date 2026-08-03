"use client";

import { useLayoutEffect, useState } from "react";
import { cn } from "@/libs/cn";

type CropRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CropHintOverlayProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Target crop width / height (layout slot aspect ratio). */
  aspectRatio: number;
  className?: string;
};

function getContainRect(
  containerW: number,
  containerH: number,
  contentW: number,
  contentH: number,
) {
  const containerAspect = containerW / containerH;
  const contentAspect = contentW / contentH;

  if (contentAspect > containerAspect) {
    const width = containerW;
    const height = containerW / contentAspect;
    return { x: 0, y: (containerH - height) / 2, width, height };
  }

  const height = containerH;
  const width = containerH * contentAspect;
  return { x: (containerW - width) / 2, y: 0, width, height };
}

/** Matches center cover crop used in OutputGenerator.drawCover (pan 0,0). */
function getCoverCropRect(
  containerW: number,
  containerH: number,
  videoW: number,
  videoH: number,
  targetAspect: number,
): CropRect | null {
  if (!containerW || !containerH || !videoW || !videoH || !targetAspect) {
    return null;
  }

  const display = getContainRect(containerW, containerH, videoW, videoH);
  const videoAspect = videoW / videoH;

  let cropW: number;
  let cropH: number;
  if (videoAspect > targetAspect) {
    cropH = videoH;
    cropW = videoH * targetAspect;
  } else {
    cropW = videoW;
    cropH = videoW / targetAspect;
  }

  const scale = display.width / videoW;
  const cropX = (videoW - cropW) / 2;
  const cropY = (videoH - cropH) / 2;

  return {
    left: display.x + cropX * scale,
    top: display.y + cropY * scale,
    width: cropW * scale,
    height: cropH * scale,
  };
}

export function CropHintOverlay({
  videoRef,
  aspectRatio,
  className,
}: CropHintOverlayProps) {
  const [cropRect, setCropRect] = useState<CropRect | null>(null);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const update = () => {
      const container = video.parentElement;
      if (!container) return;
      setCropRect(
        getCoverCropRect(
          container.clientWidth,
          container.clientHeight,
          video.videoWidth,
          video.videoHeight,
          aspectRatio,
        ),
      );
    };

    update();
    video.addEventListener("loadedmetadata", update);
    video.addEventListener("resize", update);

    const container = video.parentElement;
    const observer =
      container && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : null;
    if (container) observer?.observe(container);
    observer?.observe(video);

    return () => {
      video.removeEventListener("loadedmetadata", update);
      video.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [videoRef, aspectRatio]);

  if (!cropRect) return null;

  const { left, top, width, height } = cropRect;
  const right = left + width;
  const bottom = top + height;
  const maskClass = "absolute bg-red-500/10";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
      aria-hidden
    >
      <div
        className={maskClass}
        style={{ left: 0, top: 0, right: 0, height: top }}
      />
      <div
        className={maskClass}
        style={{ left: 0, top: bottom, right: 0, bottom: 0 }}
      />
      <div
        className={maskClass}
        style={{ left: 0, top, width: left, height }}
      />
      <div
        className={maskClass}
        style={{ left: right, top, right: 0, height }}
      />
      <div
        className="absolute border-2 border-red-500/30"
        style={{ left, top, width, height }}
      />
    </div>
  );
}
