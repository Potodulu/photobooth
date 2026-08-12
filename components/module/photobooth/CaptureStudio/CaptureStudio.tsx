"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RotateCw } from "lucide-react";
import { CameraPreview } from "@/components/shared/CameraPreview";
import { Countdown } from "@/components/shared/Countdown";
import { CropHintOverlay } from "@/components/shared/CropHintOverlay";
import { FlashOverlay } from "@/components/shared/FlashOverlay";
import { Button } from "@/components/ui/Button";
import {
  type Capture,
  type CaptureOrientation,
  type CountdownSeconds,
} from "@/features/photobooth/domain";
import type { TakePhotoHooks } from "@/features/photobooth/application/capturePhoto";
import { useDeviceOrientation } from "@/features/photobooth/hooks";
import { useLayoutStore } from "@/features/photobooth/stores";
import { CameraControls } from "./CameraControls";
import { CapturedPhotosModal } from "./CapturedPhotosModal";

type CaptureStudioProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  permission: string;
  error: string | null;
  captures: Capture[];
  objectUrls: Record<string, string>;
  maxTakes: number;
  requiredSlots: number;
  countdownSeconds: CountdownSeconds;
  mirrorEnabled: boolean;
  isCapturing: boolean;
  isRecording: boolean;
  recordingRemaining: number | null;
  onStartCamera: () => void;
  onCountdownChange: (seconds: number) => void;
  onMirrorChange: (enabled: boolean) => void;
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
  mirrorEnabled,
  isCapturing,
  onStartCamera,
  onCountdownChange,
  onMirrorChange,
  onCapture,
  onRetake,
  onContinue,
}: CaptureStudioProps) {
  const t = useTranslations("TryCamera");
  const { isPortrait, isLandscape, orientation } = useDeviceOrientation();
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [frozenOrientation, setFrozenOrientation] =
    useState<CaptureOrientation | null>(null);

  const selectedLayoutId = useLayoutStore((s) => s.selectedLayoutId);
  const layouts = useLayoutStore((s) => s.layouts);
  const layout = layouts.find((item) => item.id === selectedLayoutId);
  const referenceSlot = layout?.slots[0];
  const cropAspectRatio = referenceSlot
    ? referenceSlot.width / referenceSlot.height
    : undefined;
  const prefersLandscapeTemplate = (cropAspectRatio ?? 1) > 1;

  const busy = isCapturing || count !== null;
  const canContinue = captures.length >= requiredSlots;
  const latest = captures.at(-1);
  const latestThumbUrl = latest ? (objectUrls[latest.id] ?? null) : null;
  const orientationLocked =
    frozenOrientation !== null &&
    count !== null &&
    frozenOrientation.deviceOrientation !== orientation;

  const runCapture = async () => {
    if (isCapturing || captures.length >= maxTakes || count !== null) return;
    try {
      await onCapture({
        onCountdown: setCount,
        onFlash: setFlash,
        onCaptureOrientationFrozen: setFrozenOrientation,
      });
    } finally {
      setFrozenOrientation(null);
    }
  };

  return (
    <div className="bg-foreground/5 relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <FlashOverlay active={flash} />

      <div className="relative min-h-0 flex-1">
        {permission === "granted" ? (
          <>
            <CameraPreview
              videoRef={videoRef}
              mirrored={mirrorEnabled}
              fill
              className="bg-black"
            />
            {cropAspectRatio ? (
              <CropHintOverlay
                videoRef={videoRef}
                aspectRatio={cropAspectRatio}
              />
            ) : null}
            <Countdown value={count} />
          </>
        ) : (
          <div className="bg-muted/40 flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
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

        {isPortrait && prefersLandscapeTemplate && permission === "granted" ? (
          <div className="pointer-events-none absolute top-3 left-1/2 z-10 flex max-w-[90%] -translate-x-1/2 items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white">
            <RotateCw className="size-3.5 shrink-0" aria-hidden />
            <span>{t("rotateHint")}</span>
          </div>
        ) : null}

        {permission === "granted" ? (
          <CameraControls
            landscape={isLandscape}
            busy={busy}
            mirrorEnabled={mirrorEnabled}
            countdownSeconds={countdownSeconds}
            canCapture={captures.length < maxTakes}
            canContinue={canContinue}
            latestThumbUrl={latestThumbUrl}
            captureCount={captures.length}
            maxTakes={maxTakes}
            orientationLocked={orientationLocked}
            lockHint={t("orientationLocked")}
            mirrorLabel={t("mirrorAria")}
            timerLabel={t("timerAria")}
            timerOptionLabel={(seconds) => t("countdownOption", { seconds })}
            galleryLabel={t("galleryAria")}
            captureLabel={t("captureAria")}
            continueLabel={t("continue")}
            onMirrorToggle={() => onMirrorChange(!mirrorEnabled)}
            onCountdownChange={onCountdownChange}
            onOpenGallery={() => setGalleryOpen(true)}
            onCapture={() => void runCapture()}
            onContinue={() => void onContinue()}
          />
        ) : null}
      </div>

      <CapturedPhotosModal
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        captures={captures}
        objectUrls={objectUrls}
        title={t("galleryTitle")}
        closeLabel={t("galleryClose")}
        retakeLabel={t("retake")}
        canRetake={captures.length > 0}
        busy={busy}
        onRetake={() => void onRetake()}
      />
    </div>
  );
}
