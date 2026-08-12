"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { ApiError, parseApiErrorMessage } from "@/libs/api";

export function ApiErrorAlert({
  error,
  title = "Gagal",
}: {
  error: unknown;
  title?: string;
}) {
  if (!error) return null;

  const message =
    error instanceof ApiError
      ? parseApiErrorMessage(error.body, error.message)
      : error instanceof Error
        ? error.message
        : "Terjadi kesalahan. Coba lagi ya.";

  return (
    <Alert color="destructive" variant="soft">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
