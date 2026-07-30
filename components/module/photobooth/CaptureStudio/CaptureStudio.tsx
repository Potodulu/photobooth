"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CameraPreview } from "@/components/shared/CameraPreview";
import { Countdown } from "@/components/shared/Countdown";
import { FlashOverlay } from "@/components/shared/FlashOverlay";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  COUNTDOWN_OPTIONS,
  type Capture,
  type CountdownSeconds,
} from "@/features/photobooth/domain";
import type { TakePhotoHooks } from "@/features/photobooth/application/capturePhoto";
import { cn } from "@/libs/cn";

const SHOW_RECORDING_INDICATOR = false;

type CaptureStudioProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  permission: string;
  error: string | null;
  captures: Capture[];
  objectUrls: Record<string, string>;
  maxTakes: number;
  requiredSlots: number;
  countdownSeconds: CountdownSeconds;
  isCapturing: boolean;
  isRecording: boolean;
  recordingRemaining: number | null;
  onStartCamera: () => void;
  onCountdownChange: (seconds: number) => void;
  onCapture: (hooks: TakePhotoHooks) => Promise<void>;
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
  countdownSeconds,
  isCapturing,
  isRecording,
  recordingRemaining,
  onStartCamera,
  onCountdownChange,
  onCapture,
  onRetake,
  onContinue,
}: CaptureStudioProps) {
  const t = useTranslations("TryCamera");
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const runCapture = async () => {
    if (isCapturing || captures.length >= maxTakes || count !== null) return;
    await onCapture({
      onCountdown: setCount,
      onFlash: setFlash,
    });
  };

  const canContinue = captures.length >= requiredSlots;
  const busy = isCapturing || count !== null;

  return (
    <div className="flex flex-col gap-6">
      <FlashOverlay active={flash} />
      <div className="relative">
        {permission === "granted" ? (
          <>
            <CameraPreview videoRef={videoRef} />
            <Countdown value={count} />
            {SHOW_RECORDING_INDICATOR &&
            isRecording &&
            recordingRemaining !== null ? (
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
        <p className="text-sm font-semibold">{t("countdownLabel")}</p>
        <p className="text-muted-foreground text-xs">{t("countdownHint")}</p>
        <div className="flex flex-wrap gap-2">
          {COUNTDOWN_OPTIONS.map((seconds) => (
            <Button
              key={seconds}
              type="button"
              size="sm"
              radius="full"
              variant={countdownSeconds === seconds ? "solid" : "outline"}
              color={countdownSeconds === seconds ? "primary" : "neutral"}
              disabled={busy}
              aria-pressed={countdownSeconds === seconds}
              onClick={() => onCountdownChange(seconds)}
            >
              {t("countdownOption", { seconds })}
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
            onClick={runCapture}
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
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
