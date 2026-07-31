"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { CaptureStudio } from "@/components/module/photobooth/CaptureStudio";
import { LandscapeOrientationGuard } from "@/components/shared/LandscapeOrientationGuard";
import {
  useCamera,
  useOrientationGuard,
  usePhotoboothActions,
  useTryFlowGuard,
  useTryStepSync,
} from "@/features/photobooth/hooks";
import {
  useCameraStore,
  useCaptureStore,
  useLayoutStore,
} from "@/features/photobooth/stores";

export function TryCameraPage() {
  const t = useTranslations("TryCamera");
  const router = useRouter();
  const { isBlocked: orientationBlocked } = useOrientationGuard();
  const { videoRef, permission, error, start, stop, stream } = useCamera();
  const shouldRestartCameraRef = useRef(false);
  const wasOrientationBlockedRef = useRef(orientationBlocked);
  const {
    takePhoto,
    retakeLastPhoto,
    persistCaptureSet,
    loadFramesForSelectedLayout,
    busy,
  } = usePhotoboothActions();
  const captures = useCaptureStore((s) => s.captures);
  const objectUrls = useCaptureStore((s) => s.objectUrls);
  const maxTakes = useCaptureStore((s) => s.maxTakes);
  const countdownSeconds = useCaptureStore((s) => s.countdownSeconds);
  const setCountdownSeconds = useCaptureStore((s) => s.setCountdownSeconds);
  const isCapturing = useCaptureStore((s) => s.isCapturing);
  const isRecording = useCaptureStore((s) => s.isRecording);
  const recordingRemaining = useCaptureStore((s) => s.recordingRemaining);
  const mirrorEnabled = useCameraStore((s) => s.mirrorEnabled);
  const setMirrorEnabled = useCameraStore((s) => s.setMirrorEnabled);
  const selectedLayoutId = useLayoutStore((s) => s.selectedLayoutId);
  const layouts = useLayoutStore((s) => s.layouts);
  const layout = layouts.find((item) => item.id === selectedLayoutId);
  const requiredSlots = layout?.slots.length ?? 1;

  useTryFlowGuard("camera");
  useTryStepSync("camera");

  useEffect(() => {
    const wasBlocked = wasOrientationBlockedRef.current;
    wasOrientationBlockedRef.current = orientationBlocked;

    if (orientationBlocked) {
      if (stream) {
        shouldRestartCameraRef.current = true;
        stop();
      }
      return;
    }

    if (
      wasBlocked &&
      permission === "granted" &&
      shouldRestartCameraRef.current
    ) {
      shouldRestartCameraRef.current = false;
      void start();
    }
  }, [orientationBlocked, stream, permission, start, stop]);

  return (
    <PhotoboothLayout title={t("title")} subtitle={t("subtitle")}>
      <LandscapeOrientationGuard
        active={orientationBlocked}
        message={t("rotateToLandscape")}
      />
      <CaptureStudio
        videoRef={videoRef}
        permission={permission}
        error={error}
        captures={captures}
        objectUrls={objectUrls}
        maxTakes={maxTakes}
        requiredSlots={requiredSlots}
        countdownSeconds={countdownSeconds}
        mirrorEnabled={mirrorEnabled}
        isCapturing={isCapturing || busy}
        isRecording={isRecording}
        recordingRemaining={recordingRemaining}
        orientationBlocked={orientationBlocked}
        onStartCamera={start}
        onCountdownChange={setCountdownSeconds}
        onMirrorChange={setMirrorEnabled}
        onCapture={async (hooks) => {
          if (orientationBlocked || !videoRef.current) return;
          await takePhoto(videoRef.current, hooks);
        }}
        onRetake={retakeLastPhoto}
        onContinue={async () => {
          await persistCaptureSet();
          await loadFramesForSelectedLayout();
          router.push("/try/select");
        }}
      />
    </PhotoboothLayout>
  );
}
