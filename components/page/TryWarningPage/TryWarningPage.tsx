"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { StorageWarning } from "@/components/module/photobooth/StorageWarning";
import { usePhotoboothActions } from "@/features/photobooth/hooks";
import { useTryStepSync } from "@/features/photobooth/hooks";
import {
  useCaptureStore,
  useFrameStore,
  useGeneratorStore,
  useLayoutStore,
} from "@/features/photobooth/stores";

export function TryWarningPage() {
  const t = useTranslations("TryWarning");
  const router = useRouter();
  const { startGuestSession, cancelGuestSession } = usePhotoboothActions();
  useTryStepSync("warning");

  const handleContinue = async () => {
    useLayoutStore.getState().reset();
    useFrameStore.getState().reset();
    useCaptureStore.getState().reset();
    useGeneratorStore.getState().reset();
    await startGuestSession();
    router.push("/try/layout");
  };

  const handleCancel = () => {
    cancelGuestSession();
    router.push("/");
  };

  return (
    <PhotoboothLayout title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <StorageWarning
        open
        onContinue={handleContinue}
        onCancel={handleCancel}
      />
    </PhotoboothLayout>
  );
}
