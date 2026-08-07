"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { AssetPreview } from "@/components/shared/AssetPreview";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
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
import { useFrames } from "@/hooks/queries";
import type { CreateLayoutPayload, LayoutDto } from "@/types";

const slotSchema = z.object({
  slot_key: z.string().min(1, "Slot key wajib diisi"),
  x: z.number().min(0).optional(),
  y: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  display_order: z.number().min(0).optional(),
});

const layoutFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(200),
  type: z.string().max(64).optional(),
  paper_size: z.string().optional(),
  dpi: z.number().min(1).max(1200).optional(),
  aspect_ratio: z.string().max(32).optional(),
  status: z.enum(["draft", "active", "inactive"]),
  canvas_width: z.number().min(0).optional(),
  canvas_height: z.number().min(0).optional(),
  output_width: z.number().min(0).optional(),
  output_height: z.number().min(0).optional(),
  padding_top: z.number().min(0).optional(),
  padding_right: z.number().min(0).optional(),
  padding_bottom: z.number().min(0).optional(),
  padding_left: z.number().min(0).optional(),
  background_color: z.string().optional(),
  slots: z.array(slotSchema).optional(),
  compatible_frame_ids: z.array(z.string()).optional(),
});

export type LayoutFormValues = z.infer<typeof layoutFormSchema>;

export function layoutDtoToFormValues(
  layout?: LayoutDto | null,
): LayoutFormValues {
  return {
    name: layout?.name ?? "",
    type: layout?.type ?? "strip",
    paper_size: layout?.paper_size ?? "",
    dpi: layout?.dpi ?? 300,
    aspect_ratio: layout?.aspect_ratio ?? "",
    status: layout?.status ?? "active",
    canvas_width: layout?.canvas_size?.width ?? 0,
    canvas_height: layout?.canvas_size?.height ?? 0,
    output_width: layout?.output_size?.width ?? 0,
    output_height: layout?.output_size?.height ?? 0,
    padding_top: layout?.padding?.top ?? 0,
    padding_right: layout?.padding?.right ?? 0,
    padding_bottom: layout?.padding?.bottom ?? 0,
    padding_left: layout?.padding?.left ?? 0,
    background_color: layout?.background?.color ?? "#FFFFFF",
    slots:
      layout?.slots?.map((s) => ({
        slot_key: s.slot_key,
        x: s.x,
        y: s.y,
        width: s.width,
        height: s.height,
        display_order: s.display_order,
      })) ?? [],
    compatible_frame_ids: layout?.compatible_frame_ids ?? [],
  };
}

export function parseLayoutFormValues(
  values: LayoutFormValues,
): CreateLayoutPayload {
  return {
    name: values.name,
    type: values.type || undefined,
    paper_size: values.paper_size || undefined,
    dpi: values.dpi || undefined,
    aspect_ratio: values.aspect_ratio || undefined,
    status: values.status,
    canvas_size:
      values.canvas_width || values.canvas_height
        ? { width: values.canvas_width ?? 0, height: values.canvas_height ?? 0 }
        : undefined,
    output_size:
      values.output_width || values.output_height
        ? { width: values.output_width ?? 0, height: values.output_height ?? 0 }
        : undefined,
    padding: {
      top: values.padding_top ?? 0,
      right: values.padding_right ?? 0,
      bottom: values.padding_bottom ?? 0,
      left: values.padding_left ?? 0,
    },
    background: { color: values.background_color || undefined },
    slots: values.slots,
    compatible_frame_ids: values.compatible_frame_ids ?? [],
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
  const { data: framesData } = useFrames();

  const form = useForm<LayoutFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- z.number() vs Input type="number" string mismatch; runtime coercion is correct
    resolver: zodResolver(layoutFormSchema) as any,
    defaultValues: layoutDtoToFormValues(initial),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "slots",
  });

  const submit = form.handleSubmit(async (values) => {
    await onSubmit(values, previewFile);
  });

  const frames = framesData?.data ?? [];

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

        {/* Canvas Size */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Canvas size</legend>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="canvas_width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canvas_height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        {/* Output Size */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Output size</legend>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="output_width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="output_height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        {/* Padding */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Padding</legend>
          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="padding_top"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="padding_right"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Right</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="padding_bottom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bottom</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="padding_left"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Left</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        {/* Background */}
        <FormField
          control={form.control}
          name="background_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background color</FormLabel>
              <FormControl>
                <Input placeholder="#FFFFFF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slots */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Slots</legend>
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="border-border bg-card space-y-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">
                  Slot {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  color="destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name={`slots.${index}.slot_key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slot key</FormLabel>
                      <FormControl>
                        <Input placeholder={`photo_${index + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`slots.${index}.x`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>X</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`slots.${index}.y`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Y</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`slots.${index}.width`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`slots.${index}.height`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`slots.${index}.display_order`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                slot_key: `photo_${fields.length + 1}`,
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                display_order: fields.length + 1,
              })
            }
          >
            <Plus className="mr-2 size-4" />
            Tambah slot
          </Button>
        </fieldset>

        {/* Compatible Frames */}
        <FormField
          control={form.control}
          name="compatible_frame_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compatible frames</FormLabel>
              {frames.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {frames.map((frame) => {
                    const checked = field.value?.includes(frame.id) ?? false;
                    return (
                      <label
                        key={frame.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            const current = field.value ?? [];
                            field.onChange(
                              v
                                ? [...current, frame.id]
                                : current.filter((id) => id !== frame.id),
                            );
                          }}
                        />
                        {frame.name}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Belum ada frame.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preview Image */}
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
