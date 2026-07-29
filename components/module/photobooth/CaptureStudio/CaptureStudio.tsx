"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CameraPreview } from "@/components/shared/CameraPreview";
import { Countdown } from "@/components/shared/Countdown";
import { FlashOverlay } from "@/components/shared/FlashOverlay";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  COUNTDOWN_SECONDS,
  PHOTO_FILTERS,
  getFilterCss,
  type Capture,
  type PhotoFilterId,
} from "@/features/photobooth/domain";
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
  isRecording: boolean;
  recordingRemaining: number | null;
  filterId: PhotoFilterId;
  onFilterChange: (id: PhotoFilterId) => void;
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
  isRecording,
  recordingRemaining,
  filterId,
  onFilterChange,
  onStartCamera,
  onCapture,
  onRetake,
  onContinue,
}: CaptureStudioProps) {
  const t = useTranslations("TryCamera");
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const runCountdown = async () => {
    if (isCapturing || captures.length >= maxTakes || count !== null) return;
    for (let value = COUNTDOWN_SECONDS; value >= 1; value -= 1) {
      setCount(value);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setCount(null);
    setFlash(true);
    await new Promise((resolve) => setTimeout(resolve, 150));
    setFlash(false);
    await onCapture();
  };

  const canContinue = captures.length >= requiredSlots;
  const busy = isCapturing || count !== null;

  return (
    <div className="flex flex-col gap-6">
      <FlashOverlay active={flash} />
      <div className="relative">
        {permission === "granted" ? (
          <>
            <CameraPreview
              videoRef={videoRef}
              filterCss={getFilterCss(filterId)}
            />
            <Countdown value={count} />
            {isRecording && recordingRemaining !== null ? (
              <div className="bg-destructive text-destructive-foreground absolute top-3 right-3 rounded-[var(--radius-md)] px-3 py-1 text-sm font-bold">
                {t("recording", { seconds: recordingRemaining })}
              </div>
            ) : null}
          </>
        ) : (
          <div className="border-border bg-muted/40 shadow-neo-md flex aspect-video max-h-[60vh] w-full flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border-2 p-6 text-center">
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

      <div className="space-y-2">
        <p className="text-sm font-semibold">{t("filters")}</p>
        <div className="flex flex-wrap gap-2">
          {PHOTO_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              type="button"
              size="sm"
              radius="full"
              variant={filterId === filter.id ? "solid" : "outline"}
              color={filterId === filter.id ? "primary" : "neutral"}
              onClick={() => onFilterChange(filter.id)}
            >
              {t(`filter.${filter.id}`)}
            </Button>
          ))}
        </div>
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
              permission !== "granted" || busy || captures.length >= maxTakes
            }
            onClick={runCountdown}
          >
            {t("capture")}
          </Button>
          <Button
            variant="outline"
            color="destructive"
            radius="lg"
            disabled={captures.length === 0 || busy}
            onClick={onRetake}
          >
            {t("retake")}
          </Button>
          <Button
            variant="solid"
            color="primary"
            radius="lg"
            disabled={!canContinue || busy}
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
                style={{ filter: getFilterCss(filterId) }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
