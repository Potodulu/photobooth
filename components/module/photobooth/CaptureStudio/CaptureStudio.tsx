"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CameraPreview } from "@/components/shared/CameraPreview";
import { Countdown } from "@/components/shared/Countdown";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Capture } from "@/features/photobooth/domain";
import { cn } from "@/libs/cn";

type CaptureStudioProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  permission: string;
  error: string | null;
  captures: Capture[];
  objectUrls: Record<string, string>;
  maxTakes: number;
  requiredSlots: number;
  isCapturing: boolean;
  onStartCamera: () => void;
  onCapture: () => Promise<void>;
  onRetake: () => Promise<void>;
  onContinue: () => Promise<void>;
};

export function CaptureStudio({
  videoRef,
  permission,
  error,
  captures,
  objectUrls,
  maxTakes,
  requiredSlots,
  isCapturing,
  onStartCamera,
  onCapture,
  onRetake,
  onContinue,
}: CaptureStudioProps) {
  const t = useTranslations("TryCamera");
  const [count, setCount] = useState<number | null>(null);

  const runCountdown = async () => {
    if (isCapturing || captures.length >= maxTakes || count !== null) return;
    for (const value of [3, 2, 1]) {
      setCount(value);
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
    setCount(null);
    await onCapture();
  };

  const canContinue = captures.length >= requiredSlots;

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        {permission === "granted" ? (
          <>
            <CameraPreview videoRef={videoRef} />
            <Countdown value={count} />
          </>
        ) : (
          <div className="border-border bg-muted/40 shadow-neo-md flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border-2 p-6 text-center">
            <p className="text-muted-foreground max-w-sm text-sm">
              {t("permissionHint")}
            </p>
            {error ? <p className="text-destructive text-sm">{error}</p> : null}
            <Button
              variant="solid"
              color="primary"
              radius="lg"
              onClick={onStartCamera}
            >
              {t("enableCamera")}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="soft" color="neutral" radius="full">
          {t("count", { current: captures.length, max: maxTakes })}
        </Badge>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            color="neutral"
            radius="lg"
            disabled={
              permission !== "granted" ||
              isCapturing ||
              captures.length >= maxTakes
            }
            onClick={runCountdown}
          >
            {t("capture")}
          </Button>
          <Button
            variant="outline"
            color="destructive"
            radius="lg"
            disabled={captures.length === 0 || isCapturing}
            onClick={onRetake}
          >
            {t("retake")}
          </Button>
          <Button
            variant="solid"
            color="primary"
            radius="lg"
            disabled={!canContinue || isCapturing}
            onClick={onContinue}
          >
            {t("continue")}
          </Button>
        </div>
      </div>

      {captures.length > 0 ? (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {captures.map((capture) => (
            <div
              key={capture.id}
              className={cn(
                "border-border aspect-square overflow-hidden rounded-[var(--radius-md)] border-2",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={objectUrls[capture.id]}
                alt=""
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
