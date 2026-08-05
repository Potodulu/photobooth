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
import type { LayoutDto } from "@/types";

const layoutFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  type: z.enum(["digital", "paper"]),
  paper_size_json: z.string().optional(),
  dpi: z.string().optional(),
  canvas_size_json: z.string().min(1, "Canvas size wajib diisi"),
  slots_json: z.string().min(1, "Slots wajib diisi"),
  padding: z.string().min(1, "Padding wajib diisi"),
  background: z.string().min(1, "Background wajib diisi"),
  aspect_ratio: z.string().min(1, "Aspect ratio wajib diisi"),
  output_size_json: z.string().min(1, "Output size wajib diisi"),
  compatible_frame_ids: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]),
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
    type: layout?.type ?? "digital",
    paper_size_json: layout?.paper_size
      ? safeJson(layout.paper_size, "null")
      : "",
    dpi: layout?.dpi != null ? String(layout.dpi) : "",
    canvas_size_json: safeJson(
      layout?.canvas_size,
      '{"width":1080,"height":1920}',
    ),
    slots_json: safeJson(layout?.slots, "[]"),
    padding: layout?.padding != null ? String(layout.padding) : "0",
    background: layout?.background ?? "#ffffff",
    aspect_ratio: layout?.aspect_ratio ?? "9:16",
    output_size_json: safeJson(
      layout?.output_size,
      '{"width":1080,"height":1920}',
    ),
    compatible_frame_ids: (layout?.compatible_frame_ids ?? []).join(", "),
    status: layout?.status ?? "draft",
  };
}

export function parseLayoutFormValues(values: LayoutFormValues) {
  const canvas_size = JSON.parse(values.canvas_size_json) as {
    width: number;
    height: number;
  };
  const output_size = JSON.parse(values.output_size_json) as {
    width: number;
    height: number;
  };
  const slots = JSON.parse(values.slots_json) as LayoutDto["slots"];
  const paper_size = values.paper_size_json?.trim()
    ? (JSON.parse(values.paper_size_json) as LayoutDto["paper_size"])
    : null;

  return {
    name: values.name,
    type: values.type,
    paper_size,
    dpi: values.dpi ? Number(values.dpi) : null,
    canvas_size,
    slots,
    padding: Number(values.padding),
    background: values.background,
    aspect_ratio: values.aspect_ratio,
    output_size,
    compatible_frame_ids: values.compatible_frame_ids
      ? values.compatible_frame_ids
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    status: values.status,
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="digital">digital</SelectItem>
                    <SelectItem value="paper">paper</SelectItem>
                  </SelectContent>
                </Select>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dpi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DPI</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Opsional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="padding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Padding</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="background"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paper_size_json"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paper size (JSON)</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormDescription>
                Contoh: {"{"}&quot;width_in&quot;:4,&quot;height_in&quot;:6{"}"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="canvas_size_json"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Canvas size (JSON)</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
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
                <Textarea rows={3} {...field} />
              </FormControl>
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
