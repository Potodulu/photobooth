"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/Textarea";
import type { CreateLayoutPayload, LayoutDto } from "@/types";

const layoutFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(200),
  type: z.string().max(64).optional(),
  paper_size: z.string().optional(),
  dpi: z.string().optional(),
  aspect_ratio: z.string().max(32).optional(),
  status: z.enum(["draft", "active", "inactive"]),
  canvas_size_json: z.string().optional(),
  padding_json: z.string().optional(),
  background_json: z.string().optional(),
  output_size_json: z.string().optional(),
  slots_json: z.string().optional(),
  compatible_frame_ids: z.string().optional(),
});

export type LayoutFormValues = z.infer<typeof layoutFormSchema>;

function safeJson(value: unknown, fallback: string): string {
  try {
    return JSON.stringify(value ?? JSON.parse(fallback), null, 2);
  } catch {
    return fallback;
  }
}

export function layoutDtoToFormValues(
  layout?: LayoutDto | null,
): LayoutFormValues {
  return {
    name: layout?.name ?? "",
    type: layout?.type ?? "strip",
    paper_size: layout?.paper_size ?? "",
    dpi: layout?.dpi != null ? String(layout.dpi) : "300",
    aspect_ratio: layout?.aspect_ratio ?? "",
    status: layout?.status ?? "active",
    canvas_size_json: safeJson(layout?.canvas_size, "{}"),
    padding_json: safeJson(layout?.padding, "{}"),
    background_json: safeJson(layout?.background, "{}"),
    output_size_json: safeJson(layout?.output_size, "{}"),
    slots_json: safeJson(layout?.slots, "[]"),
    compatible_frame_ids: (layout?.compatible_frame_ids ?? []).join(", "),
  };
}

export function parseLayoutFormValues(
  values: LayoutFormValues,
): CreateLayoutPayload {
  return {
    name: values.name,
    type: values.type || undefined,
    paper_size: values.paper_size || undefined,
    dpi: values.dpi ? Number(values.dpi) : undefined,
    aspect_ratio: values.aspect_ratio || undefined,
    status: values.status,
    canvas_size: values.canvas_size_json?.trim()
      ? JSON.parse(values.canvas_size_json)
      : undefined,
    padding: values.padding_json?.trim()
      ? JSON.parse(values.padding_json)
      : undefined,
    background: values.background_json?.trim()
      ? JSON.parse(values.background_json)
      : undefined,
    output_size: values.output_size_json?.trim()
      ? JSON.parse(values.output_size_json)
      : undefined,
    slots: values.slots_json?.trim()
      ? JSON.parse(values.slots_json)
      : undefined,
    compatible_frame_ids: values.compatible_frame_ids
      ? values.compatible_frame_ids
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  };
}

type LayoutFormProps = {
  initial?: LayoutDto | null;
  submitLabel?: string;
  onSubmit: (
    values: LayoutFormValues,
    previewFile: File | null,
  ) => Promise<void>;
  error?: unknown;
};

export function LayoutForm({
  initial,
  submitLabel = "Simpan",
  onSubmit,
  error,
}: LayoutFormProps) {
  const [previewFile, setPreviewFile] = React.useState<File | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm<LayoutFormValues>({
    resolver: zodResolver(layoutFormSchema),
    defaultValues: layoutDtoToFormValues(initial),
  });

  const submit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      parseLayoutFormValues(values);
    } catch {
      setFormError("JSON tidak valid. Cek lagi ya.");
      return;
    }
    await onSubmit(values, previewFile);
  });

  return (
    <Form {...form}>
      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5">
        <ApiErrorAlert error={error} />
        {formError ? <ApiErrorAlert error={new Error(formError)} /> : null}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Nama layout" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="strip" {...field} />
                </FormControl>
                <FormDescription>Misal: strip, grid, collage</FormDescription>
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
                    <SelectItem value="inactive">inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="dpi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DPI</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={1200} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paper_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper size</FormLabel>
                <FormControl>
                  <Input placeholder="4x6" {...field} />
                </FormControl>
                <FormDescription>Misal: 4x6, A4</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aspect_ratio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aspect ratio</FormLabel>
                <FormControl>
                  <Input placeholder="2:3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="canvas_size_json"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Canvas size (JSON)</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormDescription>
                {"{"}&#34;width&#34;:1200,&#34;height&#34;:1800{"}"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="output_size_json"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Output size (JSON)</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="padding_json"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Padding (JSON)</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormDescription>
                {"{"}
                &#34;top&#34;:20,&#34;right&#34;:20,&#34;bottom&#34;:20,&#34;left&#34;:20
                {"}"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="background_json"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background (JSON)</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormDescription>
                {"{"}&#34;color&#34;:&#34;#FFFFFF&#34;{"}"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slots_json"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slots (JSON)</FormLabel>
              <FormControl>
                <Textarea rows={6} {...field} />
              </FormControl>
              <FormDescription>
                Array of {"{"} slot_key, x, y, width, height, display_order{" "}
                {"}"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="compatible_frame_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compatible frame IDs</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Pisahkan dengan koma</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium">Preview image</p>
          <FileUpload
            value={previewFile}
            onChange={setPreviewFile}
            accept={{ "image/*": [] }}
            placeholder="Upload preview layout"
          />
          {initial?.preview_asset_id ? (
            <AssetPreview
              assetId={initial.preview_asset_id}
              alt="Layout preview"
              className="mt-3"
            />
          ) : null}
        </div>

        <Button type="submit" loading={form.formState.isSubmitting}>
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
