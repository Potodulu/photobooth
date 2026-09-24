"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { StorageWarning } from "@/components/module/photobooth/StorageWarning";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { ROUTES } from "@/constants/route";
import { tokenStorage } from "@/libs/api";
import {
  usePhotoboothActions,
  useOnlineStepSync,
} from "@/features/photobooth/hooks";
import { useSessionStore } from "@/features/photobooth/stores";

export function OnlineWarningPage() {
  const t = useTranslations("OnlineWarning");
  const router = useRouter();
  const { prepareOnlineSession } = usePhotoboothActions();
  const initOnlineSession = useSessionStore((s) => s.initOnlineSession);
  const acceptStorageWarning = useSessionStore((s) => s.acceptStorageWarning);
  const [gateModalOpen, setGateModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useOnlineStepSync("warning");

  useEffect(() => {
    const token = tokenStorage.get()?.accessToken;
    if (!token) {
      setGateModalOpen(true);
      return;
    }
    void prepareOnlineSession();
  }, [prepareOnlineSession]);

  const handleContinue = async () => {
    const token = tokenStorage.get()?.accessToken;
    if (!token) {
      setGateModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    const sessionId = await initOnlineSession();
    setIsSubmitting(false);

    if (sessionId) {
      if (!useSessionStore.getState().experienceId) {
        useSessionStore.getState().setExperienceId("online-guest-demo");
      }
      acceptStorageWarning();
      router.push(ROUTES.ONLINE.LAYOUT(sessionId));
    } else {
      setErrorModalOpen(true);
    }
  };

  const handleCancel = async () => {
    router.push(ROUTES.HOME);
  };

  return (
    <PhotoboothLayout title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <StorageWarning
        open={!gateModalOpen && !errorModalOpen}
        loading={isSubmitting}
        onContinue={handleContinue}
        onCancel={handleCancel}
      />

      {/* Gate Modal for Unauthenticated Access */}
      <AlertDialog open={gateModalOpen}>
        <AlertDialogContent radius="xl" elevation="lg" className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl font-extrabold text-foreground">
              {t("gateTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              {t("gateDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              variant="outline"
              color="neutral"
              radius="lg"
              onClick={handleCancel}
            >
              {t("backHome")}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="solid"
              color="primary"
              radius="lg"
              onClick={() => {
                setGateModalOpen(false);
                router.push(ROUTES.GUEST.ROOT);
              }}
            >
              {t("continueGuest")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Modal for Failed/Expired Session Creation */}
      <AlertDialog open={errorModalOpen}>
        <AlertDialogContent radius="xl" elevation="lg" className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl font-extrabold text-destructive">
              {t("sessionErrorTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              {t("sessionErrorDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              variant="outline"
              color="neutral"
              radius="lg"
              onClick={() => {
                setErrorModalOpen(false);
                router.push(ROUTES.LOGIN);
              }}
            >
              {t("login")}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="solid"
              color="primary"
              radius="lg"
              onClick={() => {
                setErrorModalOpen(false);
                router.push(ROUTES.GUEST.ROOT);
              }}
            >
              {t("continueGuest")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PhotoboothLayout>
  );
}
