"use client";

import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/libs/cn";

export function PhotoboothSectionLoading({
  message = "Memuat...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-80 flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <Spinner />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
