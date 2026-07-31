"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import type { PreviewAsset } from "@/features/photobooth/application/generateOutput";

type ResultPreviewProps = {
  previewLiveUrl: string | null;
  layoutName: string;
  frameName: string;
  filterName: string;
  isGenerating: boolean;
  error?: string | null;
  assets: PreviewAsset[];
  assetsLoading: boolean;
  onGenerate: () => void;
  onDownloadAsset: (asset: PreviewAsset) => void;
  onRestart: () => void;
};

export function ResultPreview({
  previewLiveUrl,
  layoutName,
  frameName,
  filterName,
  isGenerating,
  error = null,
  assets,
  assetsLoading,
  onGenerate,
  onDownloadAsset,
  onRestart,
}: ResultPreviewProps) {
  const t = useTranslations("TryPreview");

  return (
    <div className="flex flex-col gap-6">
      <div className="border-border bg-card shadow-neo-md overflow-hidden rounded-[var(--radius-xl)] border-2">
        {previewLiveUrl ? (
          <video
            src={previewLiveUrl}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="mx-auto max-h-[70vh] w-auto"
            aria-label={t("previewAlt")}
          />
        ) : (
          <div className="text-muted-foreground flex min-h-80 items-center justify-center p-8 text-center">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3">
                <Spinner />
                <p>{t("generating")}</p>
              </div>
            ) : error ? (
              <p className="text-destructive max-w-md text-sm">{error}</p>
            ) : (
              <p>{t("empty")}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="soft" color="primary" radius="full">
          {t("layoutLabel", { name: layoutName })}
        </Badge>
        <Badge variant="soft" color="secondary" radius="full">
          {t("frameLabel", { name: frameName })}
        </Badge>
        <Badge variant="soft" color="accent" radius="full">
          {t("filterLabel", { name: filterName })}
        </Badge>
        <Badge variant="outline" color="neutral" radius="full">
          {t("livePreviewBadge")}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-3">
        {!previewLiveUrl ? (
          <Button
            variant="solid"
            color="primary"
            radius="lg"
            loading={isGenerating}
            onClick={onGenerate}
          >
            {t("generate")}
          </Button>
        ) : null}
        <Button
          variant="outline"
          color="neutral"
          radius="lg"
          onClick={onRestart}
        >
          {t("restart")}
        </Button>
      </div>

      {/* ZIP download disabled — per-asset download instead
      <Button onClick={onDownloadZip}>{t("download")}</Button>
      */}

      {previewLiveUrl ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold">{t("assetsTitle")}</p>
          {assetsLoading ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Spinner />
              <span>{t("assetsLoading")}</span>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {assets.map((asset) => (
                <li
                  key={asset.id}
                  className="border-border bg-card flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border-2 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {asset.kind === "mp4" || asset.kind === "raw-video" ? (
                      asset.previewUrl ? (
                        <video
                          src={asset.previewUrl}
                          muted
                          playsInline
                          className="border-border size-14 shrink-0 rounded border object-cover"
                        />
                      ) : (
                        <div className="bg-muted size-14 shrink-0 rounded" />
                      )
                    ) : asset.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={asset.previewUrl}
                        alt=""
                        className="border-border size-14 shrink-0 rounded border object-cover"
                      />
                    ) : (
                      <div className="bg-muted size-14 shrink-0 rounded" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {t(asset.labelKey, asset.labelParams)}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {asset.fileName}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="solid"
                    color="accent"
                    radius="lg"
                    size="sm"
                    onClick={() => onDownloadAsset(asset)}
                  >
                    {t("downloadAsset")}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
