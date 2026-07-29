"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { ResultPreview } from "@/components/module/photobooth/ResultPreview";
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

export function TryPreviewPage() {
  const t = useTranslations("TryPreview");
  const tCamera = useTranslations("TryCamera");
  const router = useRouter();
  const { generatePreview, downloadResultZip, busy } = usePhotoboothActions();
  const previewGifUrl = useGeneratorStore((s) => s.previewGifUrl);
  const isGenerating = useGeneratorStore((s) => s.isGenerating);
  const downloadProgress = useGeneratorStore((s) => s.downloadProgress);
  const selectedLayoutId = useLayoutStore((s) => s.selectedLayoutId);
  const layouts = useLayoutStore((s) => s.layouts);
  const selectedFrameId = useFrameStore((s) => s.selectedFrameId);
  const frames = useFrameStore((s) => s.frames);
  const filterId = useCaptureStore((s) => s.filterId);

  const layout = layouts.find((item) => item.id === selectedLayoutId);
  const frame = frames.find((item) => item.id === selectedFrameId);

  useTryFlowGuard("preview");
  useTryStepSync("preview");

  useEffect(() => {
    if (!previewGifUrl && !isGenerating) {
      void generatePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PhotoboothLayout title={t("title")} subtitle={t("subtitle")}>
      <ResultPreview
        previewGifUrl={previewGifUrl}
        layoutName={layout?.name ?? "—"}
        frameName={frame?.name ?? "—"}
        filterName={tCamera(`filter.${filterId}`)}
        isGenerating={isGenerating || busy}
        downloadProgress={downloadProgress}
        onGenerate={() => void generatePreview()}
        onDownload={async () => {
          await downloadResultZip();
          router.push("/");
        }}
      />
    </PhotoboothLayout>
  );
}
