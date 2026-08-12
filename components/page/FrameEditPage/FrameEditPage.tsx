"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import type { FrameAssetKind } from "@/constants/apiRoute";
import { useFrame, useUpdateFrame, useUploadFrameAsset } from "@/hooks/queries";
import {
  FrameForm,
  parseFrameFormUpdateValues,
  type FrameAssetFiles,
  type FrameFormValues,
} from "@/components/module/dashboard/FrameForm";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { toast } from "@/components/ui/Toast";
import { ApiError, parseApiErrorMessage } from "@/libs/api";

export function FrameEditPage({ id }: { id: string }) {
  const t = useTranslations("FrameEditPage");
  const router = useRouter();
  const { data, isLoading, error: loadError } = useFrame(id);
  const updateMutation = useUpdateFrame();
  const uploadMutation = useUploadFrameAsset();
  const [error, setError] = React.useState<unknown>(null);

  const handleSubmit = async (
    values: FrameFormValues,
    assets: FrameAssetFiles,
  ) => {
    setError(null);
    try {
      const payload = parseFrameFormUpdateValues(values);
      await updateMutation.mutateAsync({ id, data: payload });

      const kinds = Object.keys(assets) as FrameAssetKind[];
      for (const kind of kinds) {
        const file = assets[kind];
        if (file) {
          await uploadMutation.mutateAsync({ id, kind, file });
        }
      }

      toast.success(t("success"));
      router.push(ROUTES.DASHBOARD.FRAMES);
    } catch (err) {
      setError(err);
      toast.error(
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : t("error"),
      );
    }
  };

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (loadError || !data) {
    return <ApiErrorAlert error={loadError ?? new Error(t("notFound"))} />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{data.name}</p>
      </div>
      <FrameForm
        key={data.id}
        initial={data}
        submitLabel={t("submitLabel")}
        onSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
}
