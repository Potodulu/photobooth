"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import type { FrameAssetKind } from "@/constants/apiRoute";
import { useCreateFrame, useUploadFrameAsset } from "@/hooks/queries";
import {
  FrameForm,
  parseFrameFormValues,
  type FrameAssetFiles,
  type FrameFormValues,
} from "@/components/module/dashboard/FrameForm";
import { toast } from "@/components/ui/Toast";
import { ApiError, parseApiErrorMessage } from "@/libs/api";

export function FrameCreatePage() {
  const router = useRouter();
  const createMutation = useCreateFrame();
  const uploadMutation = useUploadFrameAsset();
  const [error, setError] = React.useState<unknown>(null);

  const handleSubmit = async (
    values: FrameFormValues,
    assets: FrameAssetFiles,
  ) => {
    setError(null);
    try {
      const payload = parseFrameFormValues(values);
      const created = await createMutation.mutateAsync(payload);

      const kinds = Object.keys(assets) as FrameAssetKind[];
      for (const kind of kinds) {
        const file = assets[kind];
        if (file) {
          await uploadMutation.mutateAsync({
            id: created.id,
            kind,
            file,
          });
        }
      }

      toast.success("Frame berhasil dibuat.");
      router.push(ROUTES.DASHBOARD.FRAMES);
    } catch (err) {
      setError(err);
      toast.error(
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : "Gagal membuat frame.",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Buat frame</h1>
        <p className="text-muted-foreground text-sm">
          Isi detail frame dan upload asset.
        </p>
      </div>
      <FrameForm
        submitLabel="Buat frame"
        onSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
}
