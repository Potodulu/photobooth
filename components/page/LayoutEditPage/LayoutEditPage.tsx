"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import {
  useLayout,
  useUpdateLayout,
  useUploadLayoutPreview,
} from "@/hooks/queries";
import {
  LayoutForm,
  parseLayoutFormValues,
  type LayoutFormValues,
} from "@/components/module/dashboard/LayoutForm";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { toast } from "@/components/ui/Toast";
import { ApiError, parseApiErrorMessage } from "@/libs/api";

export function LayoutEditPage({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, error: loadError } = useLayout(id);
  const updateMutation = useUpdateLayout();
  const uploadMutation = useUploadLayoutPreview();
  const [error, setError] = React.useState<unknown>(null);

  const handleSubmit = async (
    values: LayoutFormValues,
    previewFile: File | null,
  ) => {
    setError(null);
    try {
      const payload = parseLayoutFormValues(values);
      await updateMutation.mutateAsync({ id, data: payload });
      if (previewFile) {
        await uploadMutation.mutateAsync({ id, file: previewFile });
      }
      toast.success("Layout berhasil disimpan.");
      router.push(ROUTES.DASHBOARD.LAYOUTS);
    } catch (err) {
      setError(err);
      toast.error(
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : "Gagal menyimpan layout.",
      );
    }
  };

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (loadError || !data) {
    return (
      <ApiErrorAlert error={loadError ?? new Error("Layout tidak ditemukan")} />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Edit layout</h1>
        <p className="text-muted-foreground text-sm">{data.name}</p>
      </div>
      <LayoutForm
        key={data.id}
        initial={data}
        submitLabel="Simpan perubahan"
        onSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
}
