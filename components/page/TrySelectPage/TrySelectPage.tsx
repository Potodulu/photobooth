"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { PhotoPicker } from "@/components/module/photobooth/PhotoPicker";
import {
  usePhotoboothActions,
  useTryFlowGuard,
  useTryStepSync,
} from "@/features/photobooth/hooks";
import {
  useCaptureStore,
  useGeneratorStore,
  useLayoutStore,
} from "@/features/photobooth/stores";

export function TrySelectPage() {
  const t = useTranslations("TrySelect");
  const router = useRouter();
  const {
    assignCaptureToSlot,
    clearSlotAssignment,
    autoFillSlots,
    confirmPhotoSelection,
  } = usePhotoboothActions();
  const selectedLayoutId = useLayoutStore((s) => s.selectedLayoutId);
  const layouts = useLayoutStore((s) => s.layouts);
  const layout = layouts.find((item) => item.id === selectedLayoutId);
  const captures = useCaptureStore((s) => s.captures);
  const objectUrls = useCaptureStore((s) => s.objectUrls);
  const filterId = useCaptureStore((s) => s.filterId);
  const setFilterId = useCaptureStore((s) => s.setFilterId);
  const assignments = useGeneratorStore((s) => s.slotAssignments);

  useTryFlowGuard("select");
  useTryStepSync("select");

  if (!layout) {
    return (
      <PhotoboothLayout title={t("title")}>
        <p className="text-muted-foreground">{t("missingLayout")}</p>
      </PhotoboothLayout>
    );
  }

  return (
    <PhotoboothLayout title={t("title")} subtitle={t("subtitle")}>
      <PhotoPicker
        layout={layout}
        captures={captures}
        objectUrls={objectUrls}
        assignments={assignments}
        filterId={filterId}
        onFilterChange={setFilterId}
        onAssign={assignCaptureToSlot}
        onClear={clearSlotAssignment}
        onAutoFill={() => autoFillSlots(captures.map((item) => item.id))}
        onConfirm={() => {
          confirmPhotoSelection();
          router.push("/try/preview");
        }}
      />
    </PhotoboothLayout>
  );
}
