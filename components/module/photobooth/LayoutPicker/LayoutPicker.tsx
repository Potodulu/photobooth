"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { Layout, LayoutType } from "@/features/photobooth/domain";
import { resolvePhotoboothAsset } from "@/features/photobooth/assets";
import { tokenStorage } from "@/libs/api";
import { cn } from "@/libs/cn";
import { assetService } from "@/services/asset";
import { Badge } from "@/components/ui/Badge";

async function resolveAssetUrl(assetId: string): Promise<string> {
  const asset = await assetService.get(assetId);
  if (asset.url) return asset.url;
  return assetService.getObjectUrl(assetId);
}

function LayoutPreviewImage({ layout }: { layout: Layout }) {
  const fallbackSrc = resolvePhotoboothAsset(layout.preview);
  const assetId = layout.previewAssetId;
  const hasToken = Boolean(tokenStorage.get()?.accessToken);

  const query = useQuery({
    queryKey: ["layout-preview", assetId],
    queryFn: () => resolveAssetUrl(assetId!),
    enabled: Boolean(assetId) && hasToken,
    staleTime: 60_000,
    retry: false,
  });

  useEffect(() => {
    const url = query.data;
    if (!url || url.startsWith("http") || url.startsWith("data:")) return;
    return () => URL.revokeObjectURL(url);
  }, [query.data]);

  if (query.data) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={query.data}
        alt={layout.name}
        className="absolute inset-0 size-full object-contain p-3"
      />
    );
  }

  return (
    <Image
      src={fallbackSrc}
      alt={layout.name}
      fill
      className="object-contain p-3"
      unoptimized
    />
  );
}

type LayoutPickerProps = {
  layouts: Layout[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function LayoutPicker({
  layouts,
  selectedId,
  onSelect,
}: LayoutPickerProps) {
  const t = useTranslations("OnlineLayout");
  const [typeFilter, setTypeFilter] = useState<LayoutType>("paper");

  const filtered = layouts.filter((layout) => layout.type === typeFilter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(["paper", "digital"] as const).map((type) => {
          const active = typeFilter === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={cn(
                "border-border rounded-[var(--radius-lg)] border-2 px-4 py-2 text-sm font-semibold transition",
                active
                  ? "bg-primary/20 ring-foreground ring-2 ring-offset-2"
                  : "bg-card hover:bg-muted/40",
              )}
            >
              {type === "paper" ? t("typePaper") : t("typeDigital")}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {filtered.map((layout) => {
          const selected = layout.id === selectedId;
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => onSelect(layout.id)}
              className={cn(
                "border-border bg-card shadow-neo-sm hover:shadow-neo-md flex flex-col gap-3 rounded-[var(--radius-xl)] border-2 p-4 text-left transition",
                selected &&
                  "bg-primary/20 ring-foreground ring-2 ring-offset-2",
              )}
            >
              <div className="border-border relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)] border-2 bg-white">
                <LayoutPreviewImage layout={layout} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-col">
                  <span className="font-display font-bold">{layout.name}</span>
                  {layout.type === "paper" && layout.paperSize ? (
                    <span className="text-muted-foreground text-xs">
                      {t("paperSize", {
                        width: layout.paperSize.widthIn,
                        height: layout.paperSize.heightIn,
                      })}
                    </span>
                  ) : null}
                </div>
                <Badge variant="soft" color="neutral" radius="full" size="sm">
                  {layout.slots.length}
                </Badge>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("emptyType")}</p>
      ) : null}
    </div>
  );
}
