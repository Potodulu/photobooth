"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useCreateLayout, useUploadLayoutPreview } from "@/hooks/queries";
import {
  LayoutForm,
  parseLayoutFormValues,
  type LayoutFormValues,
} from "@/components/module/dashboard/LayoutForm";
import { toast } from "@/components/ui/Toast";
import { ApiError, parseApiErrorMessage } from "@/libs/api";

export function LayoutCreatePage() {
  const router = useRouter();
  const createMutation = useCreateLayout();
  const uploadMutation = useUploadLayoutPreview();
  const [error, setError] = React.useState<unknown>(null);

  const handleSubmit = async (
    values: LayoutFormValues,
    previewFile: File | null,
  ) => {
    setError(null);
    try {
      const payload = parseLayoutFormValues(values);
      const created = await createMutation.mutateAsync(payload);
      if (previewFile) {
        await uploadMutation.mutateAsync({ id: created.id, file: previewFile });
      }
      toast.success("Layout berhasil dibuat.");
      router.push(ROUTES.DASHBOARD.LAYOUTS);
    } catch (err) {
      setError(err);
      toast.error(
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : "Gagal membuat layout.",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Buat layout</h1>
        <p className="text-muted-foreground text-sm">Isi detail layout baru.</p>
      </div>
      <LayoutForm
        submitLabel="Buat layout"
        onSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
}
