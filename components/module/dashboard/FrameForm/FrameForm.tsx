"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FrameAssetKind } from "@/constants/apiRoute";
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
import type { FrameDto } from "@/types";

const frameFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  supported_layouts: z.string().optional(),
  background_color: z.string().min(1, "Background color wajib diisi"),
  border_color: z.string().optional(),
  border_width: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]),
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
    supported_layouts: (frame?.supported_layouts ?? []).join(", "),
    background_color: frame?.background_color ?? "#ffffff",
    border_color: frame?.border_color ?? "",
    border_width: frame?.border_width != null ? String(frame.border_width) : "",
    status: frame?.status ?? "draft",
  };
}

export function parseFrameFormValues(values: FrameFormValues) {
  return {
    name: values.name,
    supported_layouts: values.supported_layouts
      ? values.supported_layouts
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    background_color: values.background_color,
    border_color: values.border_color || null,
    border_width: values.border_width ? Number(values.border_width) : null,
    status: values.status,
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
  submitLabel = "Simpan",
  onSubmit,
  error,
}: FrameFormProps) {
  const [assets, setAssets] = React.useState<FrameAssetFiles>({});

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
        <ApiErrorAlert error={error} />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Nama frame" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supported_layouts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supported layouts</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Pisahkan layout ID dengan koma</FormDescription>
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
                <FormLabel>Background color</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Border color</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Border width</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">draft</SelectItem>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="archived">archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium">Assets</p>
          {ASSET_KINDS.map((kind) => (
            <div key={kind} className="space-y-2">
              <p className="text-sm font-medium capitalize">{kind}</p>
              <FileUpload
                value={assets[kind] ?? null}
                onChange={(file) =>
                  setAssets((prev) => ({ ...prev, [kind]: file }))
                }
                accept={{ "image/*": [] }}
                placeholder={`Upload ${kind}`}
              />
              <AssetPreview
                assetId={assetIdForKind(initial, kind)}
                alt={`${kind} preview`}
              />
            </div>
          ))}
        </div>

        <Button type="submit" loading={form.formState.isSubmitting}>
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
