"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { StorageWarning } from "@/components/module/photobooth/StorageWarning";
import { ROUTES } from "@/constants/route";
import {
  usePhotoboothActions,
  useOnlineStepSync,
} from "@/features/photobooth/hooks";

export function GuestWarningPage() {
  const t = useTranslations("OnlineWarning");
  const router = useRouter();
  const { prepareOnlineSession, startGuestSession } = usePhotoboothActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useOnlineStepSync("warning");

  useEffect(() => {
    void prepareOnlineSession();
  }, [prepareOnlineSession]);

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      await startGuestSession();
      router.push(ROUTES.GUEST.LAYOUT);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    router.push(ROUTES.HOME);
  };

  return (
    <PhotoboothLayout title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <StorageWarning
        open
        loading={isSubmitting}
        onContinue={handleContinue}
        onCancel={handleCancel}
      />
    </PhotoboothLayout>
  );
}
