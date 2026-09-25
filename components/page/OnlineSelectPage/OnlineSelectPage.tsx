"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { PhotoboothSectionLoading } from "@/components/shared/PhotoboothSectionLoading";
import { PhotoPicker } from "@/components/module/photobooth/PhotoPicker";
import { getPhotoboothStepRoute } from "@/constants/route";
import {
  usePhotoboothActions,
  useOnlineFlowGuard,
  useOnlineStepSync,
} from "@/features/photobooth/hooks";
import {
  useCaptureStore,
  useFrameStore,
  useGeneratorStore,
  useLayoutStore,
  useSessionStore,
} from "@/features/photobooth/stores";

export function OnlineSelectPage() {
  const t = useTranslations("OnlineSelect");
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
  const layoutsLoading = useLayoutStore((s) => s.isLoading);
  const layout = layouts.find((item) => item.id === selectedLayoutId);
  const captures = useCaptureStore((s) => s.captures);
  const objectUrls = useCaptureStore((s) => s.objectUrls);
  const filterId = useCaptureStore((s) => s.filterId);
  const setFilterId = useCaptureStore((s) => s.setFilterId);
  const assignments = useGeneratorStore((s) => s.slotAssignments);
  const frames = useFrameStore((s) => s.frames);
  const framesLoading = useFrameStore((s) => s.isLoading);
  const selectedFrameId = useFrameStore((s) => s.selectedFrameId);
  const sessionId = useSessionStore((s) => s.sessionId);

  useOnlineFlowGuard("select");
  useOnlineStepSync("select");

  useEffect(() => {
    void loadFramesForSelectedLayout();
  }, [loadFramesForSelectedLayout]);

  const layoutPending =
    layoutsLoading || (Boolean(selectedLayoutId) && layouts.length === 0);

  if (!layout) {
    return (
      <PhotoboothLayout title={t("title")}>
        {layoutPending ? (
          <PhotoboothSectionLoading message={t("loading")} />
        ) : (
          <p className="text-muted-foreground">{t("missingLayout")}</p>
        )}
      </PhotoboothLayout>
    );
  }

  const showFramesLoading = framesLoading && frames.length === 0;

  return (
    <PhotoboothLayout>
      {showFramesLoading ? (
        <PhotoboothSectionLoading message={t("loading")} />
      ) : (
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
          router.push(getPhotoboothStepRoute("preview", sessionId));
        }}
      />
      )}
    </PhotoboothLayout>
  );
}
