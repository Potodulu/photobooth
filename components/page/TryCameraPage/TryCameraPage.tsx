"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { CaptureStudio } from "@/components/module/photobooth/CaptureStudio";
import {
  useCamera,
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
  const router = useRouter();
  const { videoRef, permission, error, start, stop } = useCamera();
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
    void start();
    return () => {
      stop();
    };
    // Mount-only camera lifecycle for immersive capture screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start/stop are stable enough for page mount
  }, []);

  return (
    <PhotoboothLayout immersive>
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
        onStartCamera={start}
        onCountdownChange={setCountdownSeconds}
        onMirrorChange={setMirrorEnabled}
        onCapture={async (hooks) => {
          if (!videoRef.current) return;
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
