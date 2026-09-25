"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { PhotoboothLayout } from "@/components/layout/PhotoboothLayout";
import { ResultPreview } from "@/components/module/photobooth/ResultPreview";
import { galleryService } from "@/services/gallery";
import { PhotoboothSectionLoading } from "@/components/shared/PhotoboothSectionLoading";
import type { PreviewAsset } from "@/features/photobooth/application/generateOutput";

type OnlineGalleryPageProps = {
  sessionId: string;
};

export function OnlineGalleryPage({ sessionId }: OnlineGalleryPageProps) {
  const t = useTranslations("OnlinePreview");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["gallery", sessionId],
    queryFn: () => galleryService.getBySessionId(sessionId),
    enabled: Boolean(sessionId),
  });

  const sessionAssets: PreviewAsset[] = [];

  if (data) {
    (data.results ?? []).forEach((item) => {
      const isGif = item.mime.includes("gif") || item.filename.endsWith(".gif");
      const isMp4 = item.mime.includes("video") || item.filename.endsWith(".mp4");
      const kind = isMp4 ? "mp4" : isGif ? "gif" : "png";
      const labelKey = isMp4 ? "assetLive" : isGif ? "assetGif" : "assetPng";

      sessionAssets.push({
        id: item.id,
        kind,
        fileName: item.filename,
        blob: new Blob(), // Not used directly for online gallery links
        previewUrl: item.public_url,
        labelKey,
      });
    });

    (data.assets ?? []).forEach((item, index) => {
      const isVideo = item.mime.includes("video") || item.filename.includes("clip");
      sessionAssets.push({
        id: item.id,
        kind: isVideo ? "raw-video" : "raw-photo",
        fileName: item.filename,
        blob: new Blob(),
        previewUrl: item.public_url,
        labelKey: isVideo ? "assetRawVideo" : "assetRawPhoto",
        labelParams: { index: index + 1 },
      });
    });
  }

  const resultsList = data?.results ?? [];
  const assetsList = data?.assets ?? [];
  const mainResult = resultsList[0] || assetsList[0];
  const previewLiveUrl = mainResult?.public_url ?? null;

  return (
    <PhotoboothLayout title={t("title")} subtitle={t("subtitle")}>
      {isLoading ? (
        <PhotoboothSectionLoading message={t("assetsLoading")} />
      ) : isError ? (
        <div className="flex min-h-80 items-center justify-center p-8 text-center">
          <p className="text-destructive max-w-md text-sm">
            {error instanceof Error ? error.message : t("empty")}
          </p>
        </div>
      ) : (
        <ResultPreview
          previewLiveUrl={previewLiveUrl}
          layoutName="Gallery Session"
          frameName="Photo Experience"
          filterName="Original"
          isGenerating={false}
          assets={sessionAssets}
          assetsLoading={false}
          showRestartButton={false}
          sessionId={sessionId}
          onGenerate={() => {}}
          onDownloadAsset={(asset) => {
            if (asset.previewUrl) {
              window.open(asset.previewUrl, "_blank");
            }
          }}
        />
      )}
    </PhotoboothLayout>
  );
}
