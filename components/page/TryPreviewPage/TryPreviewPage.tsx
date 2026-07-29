"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { ResultPreview } from "@/components/module/photobooth/ResultPreview";
import {
  usePhotoboothActions,
  useTryFlowGuard,
  useTryStepSync,
} from "@/features/photobooth/hooks";
import {
  useFrameStore,
  useGeneratorStore,
  useLayoutStore,
} from "@/features/photobooth/stores";

export function TryPreviewPage() {
  const t = useTranslations("TryPreview");
  const { generatePreview, downloadResultZip, busy } = usePhotoboothActions();
  const previewUrl = useGeneratorStore((s) => s.previewUrl);
  const isGenerating = useGeneratorStore((s) => s.isGenerating);
  const downloadProgress = useGeneratorStore((s) => s.downloadProgress);
  const selectedLayoutId = useLayoutStore((s) => s.selectedLayoutId);
  const layouts = useLayoutStore((s) => s.layouts);
  const selectedFrameId = useFrameStore((s) => s.selectedFrameId);
  const frames = useFrameStore((s) => s.frames);

  const layout = layouts.find((item) => item.id === selectedLayoutId);
  const frame = frames.find((item) => item.id === selectedFrameId);

  useTryFlowGuard("preview");
  useTryStepSync("preview");

  useEffect(() => {
    if (!previewUrl && !isGenerating) {
      void generatePreview();
    }
    // intentionally once on mount when empty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PhotoboothLayout title={t("title")} subtitle={t("subtitle")}>
      <ResultPreview
        previewUrl={previewUrl}
        layoutName={layout?.name ?? "—"}
        frameName={frame?.name ?? "—"}
        isGenerating={isGenerating || busy}
        downloadProgress={downloadProgress}
        onGenerate={() => void generatePreview()}
        onDownload={() => void downloadResultZip()}
      />
    </PhotoboothLayout>
  );
}
