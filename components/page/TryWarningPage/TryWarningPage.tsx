"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { StorageWarning } from "@/components/module/photobooth/StorageWarning";
import { ROUTES } from "@/constants/route";
import {
  usePhotoboothActions,
  useTryStepSync,
} from "@/features/photobooth/hooks";

export function TryWarningPage() {
  const t = useTranslations("TryWarning");
  const router = useRouter();
  const { startGuestSession, cancelGuestSession, prepareTryEntry } =
    usePhotoboothActions();
  useTryStepSync("warning");

  useEffect(() => {
    void prepareTryEntry();
  }, [prepareTryEntry]);

  const handleContinue = async () => {
    await startGuestSession();
    router.push(ROUTES.ONLINE.LAYOUT);
  };

  const handleCancel = async () => {
    await cancelGuestSession();
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
