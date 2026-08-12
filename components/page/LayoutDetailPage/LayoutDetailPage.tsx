"use client";

import type * as React from "react";
import { Pencil } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useLayout } from "@/hooks/queries";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { AssetPreview } from "@/components/shared/AssetPreview";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { LayoutDto, PaddingValue, SizeDto } from "@/types";

function formatSize(size?: SizeDto | null) {
  if (!size) return "—";
  return `${size.width} × ${size.height}`;
}

function formatPaperSize(layout: LayoutDto) {
  const paper = layout.paperSize ?? layout.paper_size;
  if (!paper) return "—";
  if (typeof paper === "string") return paper;
  return `${paper.widthIn} × ${paper.heightIn} in`;
}

function formatPadding(padding?: PaddingValue | null) {
  if (padding == null) return "—";
  if (typeof padding === "number") return String(padding);
  return `T${padding.top} R${padding.right} B${padding.bottom} L${padding.left}`;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="text-muted-foreground w-40 shrink-0 text-sm">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

function ColorSwatch({ color }: { color?: string | null }) {
  if (!color) return <span>—</span>;
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

export function LayoutDetailPage({ id }: { id: string }) {
  const { data, isLoading, error } = useLayout(id);

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (error || !data) {
    return (
      <ApiErrorAlert error={error ?? new Error("Layout tidak ditemukan")} />
    );
  }

  const canvas = data.canvasSize ?? data.canvas_size;
  const output = data.outputSize ?? data.output_size;
  const aspect = data.aspectRatio ?? data.aspect_ratio;
  const previewId = data.previewAssetId ?? data.preview_asset_id;
  const background =
    typeof data.background === "string"
      ? data.background
      : data.background?.color;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Detail layout</h1>
          <p className="text-muted-foreground text-sm">{data.name}</p>
        </div>
        <Button asChild>
          <Link href={ROUTES.DASHBOARD.layoutEdit(data.id)}>
            <Pencil className="mr-2 size-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <DetailRow label="Nama">{data.name}</DetailRow>
              <DetailRow label="Type">{data.type}</DetailRow>
              <DetailRow label="Status">
                <Badge variant="soft">{data.status}</Badge>
              </DetailRow>
              <DetailRow label="Aspect">{aspect || "—"}</DetailRow>
              <DetailRow label="DPI">{data.dpi ?? "—"}</DetailRow>
              <DetailRow label="Paper size">{formatPaperSize(data)}</DetailRow>
              <DetailRow label="Canvas">{formatSize(canvas)}</DetailRow>
              <DetailRow label="Output">{formatSize(output)}</DetailRow>
              <DetailRow label="Slots">{data.slots?.length ?? 0}</DetailRow>
              <DetailRow label="Padding">
                {formatPadding(data.padding)}
              </DetailRow>
              <DetailRow label="Background">
                <ColorSwatch color={background} />
              </DetailRow>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetPreview
              assetId={previewId}
              alt={`Preview ${data.name}`}
              className="h-48"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
