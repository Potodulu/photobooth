"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

type ResultPreviewProps = {
  previewLiveUrl: string | null;
  layoutName: string;
  frameName: string;
  filterName: string;
  isGenerating: boolean;
  downloadProgress: number;
  onGenerate: () => void;
  onDownload: () => void;
};

export function ResultPreview({
  previewLiveUrl,
  layoutName,
  frameName,
  filterName,
  isGenerating,
  downloadProgress,
  onGenerate,
  onDownload,
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
        ) : (
          <Button
            variant="solid"
            color="accent"
            radius="lg"
            onClick={onDownload}
          >
            {t("download")}
            {downloadProgress > 0 && downloadProgress < 100
              ? ` (${downloadProgress}%)`
              : ""}
          </Button>
        )}
      </div>
    </div>
  );
}
