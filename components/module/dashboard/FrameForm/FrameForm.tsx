"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { FrameAssetKind } from "@/constants/apiRoute";
import { useLayouts } from "@/hooks/queries";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { AssetPreview } from "@/components/shared/AssetPreview";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { CreateFramePayload, FrameDto, UpdateFramePayload } from "@/types";

const LAYOUT_NONE = "__none__";

const frameFormSchema = z.object({
  name: z.string().min(1).max(200),
  layout_id: z.string().optional(),
  background_color: z.string().max(32).optional(),
  border_color: z.string().max(32).optional(),
  border_width: z.string().optional(),
  status: z.enum(["draft", "active", "inactive"]),
});

export type FrameFormValues = z.infer<typeof frameFormSchema>;

export type FrameAssetFiles = Partial<Record<FrameAssetKind, File | null>>;

const ASSET_KINDS: FrameAssetKind[] = [
  "preview",
  "overlay",
  "mask",
  "thumbnail",
];

export function frameDtoToFormValues(frame?: FrameDto | null): FrameFormValues {
  return {
    name: frame?.name ?? "",
    layout_id: frame?.layout_id ?? LAYOUT_NONE,
    background_color: frame?.background_color ?? "",
    border_color: frame?.border_color ?? "",
    border_width:
      frame?.border_width != null ? String(frame.border_width) : "0",
    status: frame?.status ?? "active",
  };
}

export function parseFrameFormValues(
  values: FrameFormValues,
): CreateFramePayload {
  const payload: CreateFramePayload = {
    name: values.name,
    border_width: values.border_width ? Number(values.border_width) : 0,
    status: values.status,
  };
  if (values.layout_id && values.layout_id !== LAYOUT_NONE) {
    payload.layout_id = values.layout_id;
  }
  if (values.background_color) {
    payload.background_color = values.background_color;
  }
  if (values.border_color) {
    payload.border_color = values.border_color;
  }
  return payload;
}

export function parseFrameFormUpdateValues(
  values: FrameFormValues,
): UpdateFramePayload {
  return {
    ...parseFrameFormValues(values),
    layout_id:
      values.layout_id && values.layout_id !== LAYOUT_NONE
        ? values.layout_id
        : null,
    background_color: values.background_color || null,
    border_color: values.border_color || null,
  };
}

function assetIdForKind(
  frame: FrameDto | null | undefined,
  kind: FrameAssetKind,
) {
  if (!frame) return null;
  switch (kind) {
    case "preview":
      return frame.preview_asset_id;
    case "overlay":
      return frame.overlay_asset_id;
    case "mask":
      return frame.mask_asset_id;
    case "thumbnail":
      return frame.thumbnail_asset_id;
  }
}

type FrameFormProps = {
  initial?: FrameDto | null;
  submitLabel?: string;
  onSubmit: (values: FrameFormValues, assets: FrameAssetFiles) => Promise<void>;
  error?: unknown;
};

export function FrameForm({
  initial,
  submitLabel,
  onSubmit,
  error,
}: FrameFormProps) {
  const t = useTranslations("FrameForm");
  const [assets, setAssets] = React.useState<FrameAssetFiles>({});
  const { data: layoutsData } = useLayouts({ per_page: 100 });
  const layouts = layoutsData?.data ?? [];

  const form = useForm<FrameFormValues>({
    resolver: zodResolver(frameFormSchema),
    defaultValues: frameDtoToFormValues(initial),
  });

  const submit = form.handleSubmit(async (values) => {
    await onSubmit(values, assets);
  });

  return (
    <Form {...form}>
      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5">
        <h3 className="text-lg font-semibold">{t("title")}</h3>

        <ApiErrorAlert error={error} />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("nameLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("namePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="layout_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("layoutLabel")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("layoutPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={LAYOUT_NONE}>{t("layoutNone")}</SelectItem>
                  {layouts.map((layout) => (
                    <SelectItem key={layout.id} value={layout.id}>
                      {layout.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>{t("layoutDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="background_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("backgroundColorLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("backgroundColorPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="border_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("borderColorLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("borderColorPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="border_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("borderWidthLabel")}</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("statusLabel")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("statusPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">draft</SelectItem>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="inactive">inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium">{t("assetsTitle")}</p>
          {ASSET_KINDS.map((kind) => (
            <div key={kind} className="space-y-2">
              <p className="text-sm font-medium capitalize">
                {t("assetLabel", { kind })}
              </p>
              <FileUpload
                value={assets[kind] ?? null}
                onChange={(file) =>
                  setAssets((prev) => ({ ...prev, [kind]: file }))
                }
                accept={{ "image/*": [] }}
                placeholder={t("assetPlaceholder", { kind })}
              />
              <AssetPreview
                assetId={assetIdForKind(initial, kind)}
                alt={`${kind} preview`}
              />
            </div>
          ))}
        </div>

        <Button type="submit" loading={form.formState.isSubmitting}>
          {submitLabel || t("submitLabel")}
        </Button>
      </form>
    </Form>
  );
}
