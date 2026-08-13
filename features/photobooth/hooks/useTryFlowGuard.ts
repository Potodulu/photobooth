"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useSessionStore } from "@/features/photobooth/stores";
import type { TryStep } from "@/features/photobooth/stores/sessionStore";

const STEP_PATH: Record<TryStep, string> = {
  warning: ROUTES.ONLINE.ROOT,
  layout: ROUTES.ONLINE.LAYOUT,
  camera: ROUTES.ONLINE.CAMERA,
  select: ROUTES.ONLINE.SELECT,
  preview: ROUTES.ONLINE.PREVIEW,
};

const STEP_ORDER: TryStep[] = [
  "warning",
  "layout",
  "camera",
  "select",
  "preview",
];

export function useTryFlowGuard(requiredStep: TryStep) {
  const router = useRouter();
  const accepted = useSessionStore((s) => s.acceptedStorageWarning);
  const step = useSessionStore((s) => s.step);

  useEffect(() => {
    if (requiredStep === "warning") return;

    if (!accepted) {
      router.replace(ROUTES.ONLINE.ROOT);
      return;
    }

    const requiredIndex = STEP_ORDER.indexOf(requiredStep);
    const currentIndex = STEP_ORDER.indexOf(step);
    if (currentIndex < requiredIndex) {
      router.replace(STEP_PATH[step]);
    }
  }, [accepted, requiredStep, router, step]);
}

export function useTryStepSync(step: TryStep) {
  const setStep = useSessionStore((s) => s.setStep);
  useEffect(() => {
    setStep(step);
  }, [setStep, step]);
}
