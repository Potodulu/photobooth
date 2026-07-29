"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { CaptureStudio } from "@/components/module/photobooth/CaptureStudio";
import {
  useCamera,
  usePhotoboothActions,
  useTryFlowGuard,
  useTryStepSync,
} from "@/features/photobooth/hooks";
import { useCaptureStore, useLayoutStore } from "@/features/photobooth/stores";

export function TryCameraPage() {
  const t = useTranslations("TryCamera");
  const router = useRouter();
  const { videoRef, permission, error, start } = useCamera();
  const { takePhoto, retakeLastPhoto, persistCaptureSet, busy } =
    usePhotoboothActions();
  const captures = useCaptureStore((s) => s.captures);
  const objectUrls = useCaptureStore((s) => s.objectUrls);
  const maxTakes = useCaptureStore((s) => s.maxTakes);
  const isCapturing = useCaptureStore((s) => s.isCapturing);
  const isRecording = useCaptureStore((s) => s.isRecording);
  const recordingRemaining = useCaptureStore((s) => s.recordingRemaining);
  const selectedLayoutId = useLayoutStore((s) => s.selectedLayoutId);
  const layouts = useLayoutStore((s) => s.layouts);
  const layout = layouts.find((item) => item.id === selectedLayoutId);
  const requiredSlots = layout?.slots.length ?? 1;

  useTryFlowGuard("camera");
  useTryStepSync("camera");

  return (
    <PhotoboothLayout title={t("title")} subtitle={t("subtitle")}>
      <CaptureStudio
        videoRef={videoRef}
        permission={permission}
        error={error}
        captures={captures}
        objectUrls={objectUrls}
        maxTakes={maxTakes}
        requiredSlots={requiredSlots}
        isCapturing={isCapturing || busy}
        isRecording={isRecording}
        recordingRemaining={recordingRemaining}
        onStartCamera={start}
        onCapture={async (hooks) => {
          if (!videoRef.current) return;
          await takePhoto(videoRef.current, hooks);
        }}
        onRetake={retakeLastPhoto}
        onContinue={async () => {
          await persistCaptureSet();
          router.push("/try/frame");
        }}
      />
    </PhotoboothLayout>
  );
}
