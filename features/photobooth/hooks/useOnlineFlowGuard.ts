"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useSessionStore } from "@/features/photobooth/stores";
import type { OnlineStep } from "@/features/photobooth/stores/sessionStore";

export function useOnlineFlowGuard(requiredStep: OnlineStep) {
  const router = useRouter();
  const accepted = useSessionStore((s) => s.acceptedStorageWarning);
  const step = useSessionStore((s) => s.step);
  const sessionId = useSessionStore((s) => s.sessionId);

  useEffect(() => {
    if (requiredStep === "warning") return;

    if (!accepted || !sessionId) {
      router.replace(ROUTES.ONLINE.ROOT);
      return;
    }

    const stepPathMap: Record<OnlineStep, string> = {
      warning: ROUTES.ONLINE.ROOT,
      layout: ROUTES.ONLINE.LAYOUT(sessionId),
      camera: ROUTES.ONLINE.CAMERA(sessionId),
      select: ROUTES.ONLINE.SELECT(sessionId),
      preview: ROUTES.ONLINE.PREVIEW(sessionId),
      gallery: ROUTES.ONLINE.GALLERY(sessionId),
    };

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
    if (currentIndex < requiredIndex && stepPathMap[step]) {
      router.replace(stepPathMap[step]);
    }
  }, [accepted, requiredStep, router, sessionId, step]);
}

export function useOnlineStepSync(step: OnlineStep) {
  const setStep = useSessionStore((s) => s.setStep);
  useEffect(() => {
    setStep(step);
  }, [setStep, step]);
}
