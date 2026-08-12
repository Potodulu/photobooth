"use client";

import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useFrame, useLayouts } from "@/hooks/queries";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { AssetPreview } from "@/components/shared/AssetPreview";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="text-muted-foreground w-40 shrink-0 text-sm">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

function ColorSwatch({
  color,
  emptyLabel,
}: {
  color?: string | null;
  emptyLabel: string;
}) {
  if (!color) return <span>{emptyLabel}</span>;
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="border-border size-4 rounded border"
        style={{ backgroundColor: color }}
      />
      {color}
    </span>
  );
}

export function FrameDetailPage({ id }: { id: string }) {
  const t = useTranslations("FrameDetailPage");
  const { data, isLoading, error } = useFrame(id);
  const { data: layoutsData } = useLayouts({ per_page: 100 });

  const layoutId = data?.layout_id;
  const layoutName = layoutId
    ? ((layoutsData?.data ?? []).find((layout) => layout.id === layoutId)
        ?.name ?? layoutId.slice(0, 8))
    : null;

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (error || !data) {
    return <ApiErrorAlert error={error ?? new Error(t("notFound"))} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{data.name}</p>
        </div>
        <Button asChild>
          <Link href={ROUTES.DASHBOARD.frameEdit(data.id)}>
            <Pencil className="mr-2 size-4" />
            {t("edit")}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("infoTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <DetailRow label={t("name")}>{data.name}</DetailRow>
              <DetailRow label={t("status")}>
                <Badge variant="soft">{data.status}</Badge>
              </DetailRow>
              <DetailRow label={t("layout")}>
                {layoutName ?? t("layoutNone")}
              </DetailRow>
              <DetailRow label={t("background")}>
                <ColorSwatch
                  color={data.background_color}
                  emptyLabel={t("layoutNone")}
                />
              </DetailRow>
              <DetailRow label={t("borderColor")}>
                <ColorSwatch
                  color={data.border_color}
                  emptyLabel={t("layoutNone")}
                />
              </DetailRow>
              <DetailRow label={t("borderWidth")}>
                {data.border_width ?? t("layoutNone")}
              </DetailRow>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("assetsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-sm">{t("preview")}</p>
              <AssetPreview
                assetId={data.preview_asset_id}
                alt={`${data.name} preview`}
                className="h-36"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-sm">{t("overlay")}</p>
              <AssetPreview
                assetId={data.overlay_asset_id}
                alt={`${data.name} overlay`}
                className="h-36"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-sm">{t("mask")}</p>
              <AssetPreview
                assetId={data.mask_asset_id}
                alt={`${data.name} mask`}
                className="h-36"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-sm">{t("thumbnail")}</p>
              <AssetPreview
                assetId={data.thumbnail_asset_id}
                alt={`${data.name} thumbnail`}
                className="h-36"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
