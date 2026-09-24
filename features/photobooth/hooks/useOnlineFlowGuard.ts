"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { getPhotoboothStepRoute, ROUTES } from "@/constants/route";
import { useSessionStore } from "@/features/photobooth/stores";
import type { OnlineStep } from "@/features/photobooth/stores/sessionStore";

export function useOnlineFlowGuard(requiredStep: OnlineStep) {
  const router = useRouter();
  const accepted = useSessionStore((s) => s.acceptedStorageWarning);
  const step = useSessionStore((s) => s.step);
  const sessionId = useSessionStore((s) => s.sessionId);

  useEffect(() => {
    if (requiredStep === "warning") return;

    if (!accepted) {
      router.replace(sessionId ? ROUTES.ONLINE.ROOT : ROUTES.GUEST.ROOT);
      return;
    }

    if (requiredStep === "gallery" && !sessionId) {
      router.replace(ROUTES.GUEST.PREVIEW);
      return;
    }

    const stepOrderMap: OnlineStep[] = [
      "warning",
      "layout",
      "camera",
      "select",
      "preview",
      "gallery",
    ];

    const requiredIndex = stepOrderMap.indexOf(requiredStep);
    const currentIndex = stepOrderMap.indexOf(step);
    if (currentIndex < requiredIndex) {
      router.replace(getPhotoboothStepRoute(step, sessionId));
    }
  }, [accepted, requiredStep, router, sessionId, step]);
}

export function useOnlineStepSync(step: OnlineStep) {
  const setStep = useSessionStore((s) => s.setStep);
  useEffect(() => {
    setStep(step);
  }, [setStep, step]);
}
