"use client";

import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/libs/cn";

export function PageLoading({
  message = "Memuat...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center gap-3 p-6",
        className,
      )}
    >
      <Spinner size="xl" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
