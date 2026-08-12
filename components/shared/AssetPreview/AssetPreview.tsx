"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { assetService } from "@/services/asset";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/libs/cn";

async function resolveAssetUrl(assetId: string): Promise<string> {
  const asset = await assetService.get(assetId);
  if (asset.url) return asset.url;
  return assetService.getObjectUrl(assetId);
}

export function AssetPreview({
  assetId,
  alt = "Asset preview",
  className,
}: {
  assetId?: string | null;
  alt?: string;
  className?: string;
}) {
  const query = useQuery({
    queryKey: ["asset-preview", assetId],
    queryFn: () => resolveAssetUrl(assetId!),
    enabled: Boolean(assetId),
    staleTime: 60_000,
  });

  React.useEffect(() => {
    const url = query.data;
    if (!url || url.startsWith("http") || url.startsWith("data:")) return;
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [query.data]);

  if (!assetId) {
    return (
      <div
        className={cn(
          "bg-muted text-muted-foreground flex h-32 items-center justify-center rounded-xl border-2 border-dashed text-sm",
          className,
        )}
      >
        Belum ada asset
      </div>
    );
  }

  if (query.isLoading) {
    return <Skeleton className={cn("h-32 w-full rounded-xl", className)} />;
  }

  if (query.isError || !query.data) {
    return (
      <div
        className={cn(
          "bg-muted text-muted-foreground flex h-32 items-center justify-center rounded-xl border-2 text-sm",
          className,
        )}
      >
        Gagal memuat asset
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={query.data}
      alt={alt}
      className={cn(
        "border-border bg-background h-32 w-full rounded-xl border-2 object-contain",
        className,
      )}
    />
  );
}
