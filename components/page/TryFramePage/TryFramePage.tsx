"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { FramePicker } from "@/components/module/photobooth/FramePicker";
import { Button } from "@/components/ui/Button";
import {
  usePhotoboothActions,
  useTryFlowGuard,
  useTryStepSync,
} from "@/features/photobooth/hooks";
import { useFrameStore } from "@/features/photobooth/stores";

export function TryFramePage() {
  const t = useTranslations("TryFrame");
  const router = useRouter();
  const { loadFramesForSelectedLayout, selectFrame, confirmFrame, busy } =
    usePhotoboothActions();
  const frames = useFrameStore((s) => s.frames);
  const selectedFrameId = useFrameStore((s) => s.selectedFrameId);

  useTryFlowGuard("frame");
  useTryStepSync("frame");

  useEffect(() => {
    void loadFramesForSelectedLayout();
  }, [loadFramesForSelectedLayout]);

  return (
    <PhotoboothLayout title={t("title")} subtitle={t("subtitle")}>
      <FramePicker
        frames={frames}
        selectedId={selectedFrameId}
        onSelect={selectFrame}
      />
      <div className="flex justify-end">
        <Button
          variant="solid"
          color="primary"
          radius="lg"
          disabled={!selectedFrameId || busy}
          onClick={() => {
            confirmFrame();
            router.push("/try/select");
          }}
        >
          {t("continue")}
        </Button>
      </div>
    </PhotoboothLayout>
  );
}
