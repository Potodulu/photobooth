"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { ResultPreview } from "@/components/module/photobooth/ResultPreview";
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
import type { PreviewAsset } from "@/features/photobooth/application/generateOutput";

export function TryPreviewPage() {
  const t = useTranslations("TryPreview");
  const tSelect = useTranslations("TrySelect");
  const router = useRouter();
  const { generatePreview, downloadAsset, collectPreviewAssets, busy } =
    usePhotoboothActions();
  const previewLiveUrl = useGeneratorStore((s) => s.previewLiveUrl);
  const isGenerating = useGeneratorStore((s) => s.isGenerating);
  const generateError = useGeneratorStore((s) => s.error);
  const pngOutput = useGeneratorStore((s) => s.pngOutput);
  const gifOutput = useGeneratorStore((s) => s.gifOutput);
  const liveOutput = useGeneratorStore((s) => s.liveOutput);
  const selectedLayoutId = useLayoutStore((s) => s.selectedLayoutId);
  const layouts = useLayoutStore((s) => s.layouts);
  const selectedFrameId = useFrameStore((s) => s.selectedFrameId);
  const frames = useFrameStore((s) => s.frames);
  const filterId = useCaptureStore((s) => s.filterId);

  const layout = layouts.find((item) => item.id === selectedLayoutId);
  const frame = frames.find((item) => item.id === selectedFrameId);

  const [loadedAssets, setLoadedAssets] = useState<{
    png: NonNullable<typeof pngOutput>;
    gif: NonNullable<typeof gifOutput>;
    live: NonNullable<typeof liveOutput>;
    assets: PreviewAsset[];
  } | null>(null);

  const outputsReady = Boolean(pngOutput && gifOutput && liveOutput);
  const assetsMatch =
    outputsReady &&
    loadedAssets?.png === pngOutput &&
    loadedAssets?.gif === gifOutput &&
    loadedAssets?.live === liveOutput;
  const assets = assetsMatch ? loadedAssets.assets : [];
  const assetsLoading = outputsReady && !assetsMatch;

  useTryFlowGuard("preview");
  useTryStepSync("preview");

  useEffect(() => {
    if (!previewLiveUrl && !isGenerating) {
      void generatePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pngOutput || !gifOutput || !liveOutput) return;
    let cancelled = false;
    void collectPreviewAssets().then((next) => {
      if (!cancelled) {
        setLoadedAssets({
          png: pngOutput,
          gif: gifOutput,
          live: liveOutput,
          assets: next,
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pngOutput, gifOutput, liveOutput, collectPreviewAssets]);

  return (
    <PhotoboothLayout title={t("title")} subtitle={t("subtitle")}>
      <ResultPreview
        previewLiveUrl={previewLiveUrl}
        layoutName={layout?.name ?? "—"}
        frameName={frame?.name ?? "—"}
        filterName={tSelect(`filter.${filterId}`)}
        isGenerating={isGenerating || busy}
        error={generateError}
        assets={assets}
        assetsLoading={assetsLoading}
        onGenerate={() => void generatePreview()}
        onDownloadAsset={(asset) => {
          downloadAsset(asset.blob, asset.fileName);
        }}
        onRestart={() => {
          router.push(ROUTES.ONLINE.ROOT);
        }}
        // ZIP download intentionally disabled — use per-asset downloads
        // onDownload={async () => {
        //   await downloadResultZip();
        //   router.push("/");
        // }}
      />
    </PhotoboothLayout>
  );
}
