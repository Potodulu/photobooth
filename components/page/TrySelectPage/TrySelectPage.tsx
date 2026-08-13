"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { PhotoPicker } from "@/components/module/photobooth/PhotoPicker";
import { ROUTES } from "@/constants/route";
import {
  usePhotoboothActions,
  useTryFlowGuard,
  useTryStepSync,
} from "@/features/photobooth/hooks";
import {
  useCaptureStore,
  useFrameStore,
  useGeneratorStore,
  useLayoutStore,
} from "@/features/photobooth/stores";

export function TrySelectPage() {
  const t = useTranslations("TrySelect");
  const router = useRouter();
  const {
    assignCaptureToSlot,
    clearSlotAssignment,
    resetSlotAssignments,
    updateSlotPan,
    autoFillSlots,
    confirmPhotoSelection,
    loadFramesForSelectedLayout,
    selectFrame,
  } = usePhotoboothActions();
  const selectedLayoutId = useLayoutStore((s) => s.selectedLayoutId);
  const layouts = useLayoutStore((s) => s.layouts);
  const layout = layouts.find((item) => item.id === selectedLayoutId);
  const captures = useCaptureStore((s) => s.captures);
  const objectUrls = useCaptureStore((s) => s.objectUrls);
  const filterId = useCaptureStore((s) => s.filterId);
  const setFilterId = useCaptureStore((s) => s.setFilterId);
  const assignments = useGeneratorStore((s) => s.slotAssignments);
  const frames = useFrameStore((s) => s.frames);
  const selectedFrameId = useFrameStore((s) => s.selectedFrameId);

  useTryFlowGuard("select");
  useTryStepSync("select");

  useEffect(() => {
    void loadFramesForSelectedLayout();
  }, [loadFramesForSelectedLayout]);

  if (!layout) {
    return (
      <PhotoboothLayout title={t("title")}>
        <p className="text-muted-foreground">{t("missingLayout")}</p>
      </PhotoboothLayout>
    );
  }

  return (
    <PhotoboothLayout>
      <PhotoPicker
        title={t("title")}
        subtitle={t("subtitle")}
        layout={layout}
        frames={frames}
        selectedFrameId={selectedFrameId}
        captures={captures}
        objectUrls={objectUrls}
        assignments={assignments}
        filterId={filterId}
        onFilterChange={setFilterId}
        onSelectFrame={selectFrame}
        onAssign={assignCaptureToSlot}
        onClear={clearSlotAssignment}
        onPanChange={updateSlotPan}
        onReset={resetSlotAssignments}
        onAutoFill={() => autoFillSlots(captures.map((item) => item.id))}
        onConfirm={() => {
          confirmPhotoSelection();
          router.push(ROUTES.ONLINE.PREVIEW);
        }}
      />
    </PhotoboothLayout>
  );
}
