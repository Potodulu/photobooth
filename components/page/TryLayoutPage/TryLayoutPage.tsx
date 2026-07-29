"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { LayoutPicker } from "@/components/module/photobooth/LayoutPicker";
import { Button } from "@/components/ui/Button";
import {
  usePhotoboothActions,
  useTryFlowGuard,
  useTryStepSync,
} from "@/features/photobooth/hooks";
import { useLayoutStore } from "@/features/photobooth/stores";

export function TryLayoutPage() {
  const t = useTranslations("TryLayout");
  const router = useRouter();
  const { loadLayouts, selectLayout, busy } = usePhotoboothActions();
  const layouts = useLayoutStore((s) => s.layouts);
  const selectedLayoutId = useLayoutStore((s) => s.selectedLayoutId);

  useTryFlowGuard("layout");
  useTryStepSync("layout");

  useEffect(() => {
    void loadLayouts();
  }, [loadLayouts]);

  const handleContinue = () => {
    if (!selectedLayoutId) return;
    selectLayout(selectedLayoutId);
    router.push("/try/camera");
  };

  return (
    <PhotoboothLayout title={t("title")} subtitle={t("subtitle")}>
      <LayoutPicker
        layouts={layouts}
        selectedId={selectedLayoutId}
        onSelect={(id) => useLayoutStore.getState().selectLayout(id)}
      />
      <div className="flex justify-end">
        <Button
          variant="solid"
          color="primary"
          radius="lg"
          disabled={!selectedLayoutId || busy}
          onClick={handleContinue}
        >
          {t("continue")}
        </Button>
      </div>
    </PhotoboothLayout>
  );
}
