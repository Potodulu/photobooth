"use client";

import * as React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, FileJson, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { AssetPreview } from "@/components/shared/AssetPreview";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
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
import type { CreateLayoutPayload, LayoutDto } from "@/types";

const slotSchema = z.object({
  id: z.string().optional(),
  slot_key: z.string().min(1, "Slot key wajib diisi"),
  x: z.coerce.number().min(0).optional(),
  y: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
  display_order: z.coerce.number().min(0).optional(),
});

const layoutFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(200),
  type: z.enum(["paper", "digital"]),
  paper_width_in: z.coerce.number().min(0).optional(),
  paper_height_in: z.coerce.number().min(0).optional(),
  dpi: z.coerce.number().min(1).max(1200).optional(),
  aspect_ratio: z.string().max(32).optional(),
  status: z.enum(["draft", "active", "inactive"]),
  canvas_width: z.coerce.number().min(0).optional(),
  canvas_height: z.coerce.number().min(0).optional(),
  output_width: z.coerce.number().min(0).optional(),
  output_height: z.coerce.number().min(0).optional(),
  padding_mode: z.enum(["all", "detailed"]),
  padding_all: z.coerce.number().min(0).optional(),
  padding_top: z.coerce.number().min(0).optional(),
  padding_right: z.coerce.number().min(0).optional(),
  padding_bottom: z.coerce.number().min(0).optional(),
  padding_left: z.coerce.number().min(0).optional(),
  background_color: z.string().optional(),
  slots: z.array(slotSchema).optional(),
});

export type LayoutFormValues = z.infer<typeof layoutFormSchema>;

const LAYOUT_TEMPLATE_JSON = {
  name: "Photostrip 4 Slots",
  type: "paper",
  paperSize: {
    widthIn: 4.0,
    heightIn: 6.0,
  },
  dpi: 300,
  canvasSize: {
    width: 1200,
    height: 1800,
  },
  slots: [
    {
      slotKey: "slot-1",
      x: 50,
      y: 50,
      width: 1100,
      height: 380,
      displayOrder: 1,
    },
  ],
  padding: 20,
  background: "#FFFFFF",
  aspectRatio: "2:3",
  outputSize: {
    width: 1200,
    height: 1800,
  },
  status: "active",
};

export function layoutDtoToFormValues(
  layout?: LayoutDto | null,
): LayoutFormValues {
  let pMode: "all" | "detailed" = "all";
  let pAll = 0;
  let pTop = 0;
  let pRight = 0;
  let pBottom = 0;
  let pLeft = 0;

  if (typeof layout?.padding === "number") {
    pMode = "all";
    pAll = layout.padding;
    pTop = layout.padding;
    pRight = layout.padding;
    pBottom = layout.padding;
    pLeft = layout.padding;
  } else if (typeof layout?.padding === "object" && layout.padding !== null) {
    pTop = layout.padding.top ?? 0;
    pRight = layout.padding.right ?? 0;
    pBottom = layout.padding.bottom ?? 0;
    pLeft = layout.padding.left ?? 0;
    if (pTop === pRight && pRight === pBottom && pBottom === pLeft) {
      pMode = "all";
      pAll = pTop;
    } else {
      pMode = "detailed";
    }
  }

  let paperWidth = 4.0;
  let paperHeight = 6.0;
  const paperSizeObj = layout?.paperSize || layout?.paper_size;
  if (typeof paperSizeObj === "object" && paperSizeObj !== null) {
    const pObj = paperSizeObj as Record<string, unknown>;
    paperWidth = Number(pObj.widthIn ?? pObj.width ?? 4.0);
    paperHeight = Number(pObj.heightIn ?? pObj.height ?? 6.0);
  }

  let bgColor = "#FFFFFF";
  if (typeof layout?.background === "string") {
    bgColor = layout.background;
  } else if (
    typeof layout?.background === "object" &&
    layout?.background !== null
  ) {
    bgColor = layout.background.color ?? "#FFFFFF";
  }

  const canvasWidth =
    layout?.canvasSize?.width ?? layout?.canvas_size?.width ?? 1200;
  const canvasHeight =
    layout?.canvasSize?.height ?? layout?.canvas_size?.height ?? 1800;
  const outputWidth =
    layout?.outputSize?.width ?? layout?.output_size?.width ?? 1200;
  const outputHeight =
    layout?.outputSize?.height ?? layout?.output_size?.height ?? 1800;

  return {
    name: layout?.name ?? "",
    type: layout?.type === "digital" ? "digital" : "paper",
    paper_width_in: paperWidth,
    paper_height_in: paperHeight,
    dpi: layout?.dpi ?? 300,
    aspect_ratio: layout?.aspectRatio ?? layout?.aspect_ratio ?? "2:3",
    status: layout?.status ?? "active",
    canvas_width: canvasWidth,
    canvas_height: canvasHeight,
    output_width: outputWidth,
    output_height: outputHeight,
    padding_mode: pMode,
    padding_all: pAll,
    padding_top: pTop,
    padding_right: pRight,
    padding_bottom: pBottom,
    padding_left: pLeft,
    background_color: bgColor,
    slots:
      layout?.slots?.map((s) => ({
        id: s.id,
        slot_key: s.slotKey ?? s.slot_key ?? "slot-1",
        x: s.x,
        y: s.y,
        width: s.width,
        height: s.height,
        display_order: s.displayOrder ?? s.display_order ?? 1,
      })) ?? [],
  };
}

export function parseLayoutFormValues(
  values: LayoutFormValues,
): CreateLayoutPayload {
  const isPaper = values.type === "paper";

  const paddingVal =
    values.padding_mode === "all"
      ? (values.padding_all ?? 0)
      : {
          top: values.padding_top ?? 0,
          right: values.padding_right ?? 0,
          bottom: values.padding_bottom ?? 0,
          left: values.padding_left ?? 0,
        };

  const slotsPayload = values.slots?.map((s) => ({
    id: s.id || undefined,
    slotKey: s.slot_key,
    slot_key: s.slot_key,
    x: s.x ?? 0,
    y: s.y ?? 0,
    width: s.width ?? 0,
    height: s.height ?? 0,
    displayOrder: s.display_order ?? 1,
    display_order: s.display_order ?? 1,
  }));

  return {
    name: values.name,
    type: values.type,
    paperSize: isPaper
      ? {
          widthIn: values.paper_width_in ?? 4.0,
          heightIn: values.paper_height_in ?? 6.0,
        }
      : undefined,
    dpi: isPaper ? values.dpi : undefined,
    canvasSize: {
      width: values.canvas_width ?? 0,
      height: values.canvas_height ?? 0,
    },
    outputSize: {
      width: values.output_width ?? 0,
      height: values.output_height ?? 0,
    },
    padding: paddingVal,
    background: { color: values.background_color || undefined },
    aspectRatio: values.aspect_ratio || undefined,
    slots: slotsPayload,
    status: values.status,
  };
}

function parseImportedJsonToFormValues(raw: unknown): LayoutFormValues {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("JSON harus berupa objek valid.");
  }
  const obj = raw as Record<string, unknown>;

  const paperObj = (obj.paperSize || obj.paper_size || {}) as Record<
    string,
    unknown
  >;
  const canvasObj = (obj.canvasSize || obj.canvas_size || {}) as Record<
    string,
    unknown
  >;
  const outputObj = (obj.outputSize || obj.output_size || {}) as Record<
    string,
    unknown
  >;

  let pMode: "all" | "detailed" = "all";
  let pAll = 0;
  let pTop = 0;
  let pRight = 0;
  let pBottom = 0;
  let pLeft = 0;

  if (typeof obj.padding === "number") {
    pMode = "all";
    pAll = obj.padding;
    pTop = obj.padding;
    pRight = obj.padding;
    pBottom = obj.padding;
    pLeft = obj.padding;
  } else if (typeof obj.padding === "object" && obj.padding !== null) {
    pMode = "detailed";
    const p = obj.padding as Record<string, unknown>;
    pTop = Number(p.top ?? 0);
    pRight = Number(p.right ?? 0);
    pBottom = Number(p.bottom ?? 0);
    pLeft = Number(p.left ?? 0);
    if (pTop === pRight && pRight === pBottom && pBottom === pLeft) {
      pMode = "all";
      pAll = pTop;
    }
  }

  let bgColor = "#FFFFFF";
  if (typeof obj.background === "string") {
    bgColor = obj.background;
  } else if (typeof obj.background === "object" && obj.background !== null) {
    const bg = obj.background as Record<string, unknown>;
    bgColor = String(bg.color ?? "#FFFFFF");
  }

  const typeVal =
    String(obj.type ?? "paper") === "digital" ? "digital" : "paper";
  const statusStr = String(obj.status ?? "active");
  const validStatus =
    statusStr === "draft" || statusStr === "inactive" ? statusStr : "active";

  const candidate: LayoutFormValues = {
    name: String(obj.name ?? ""),
    type: typeVal,
    paper_width_in: Number(paperObj.widthIn ?? paperObj.width ?? 4.0),
    paper_height_in: Number(paperObj.heightIn ?? paperObj.height ?? 6.0),
    dpi: Number(obj.dpi ?? 300),
    aspect_ratio: String(obj.aspectRatio ?? obj.aspect_ratio ?? "2:3"),
    status: validStatus,
    canvas_width: Number(canvasObj.width ?? obj.canvas_width ?? 1200),
    canvas_height: Number(canvasObj.height ?? obj.canvas_height ?? 1800),
    output_width: Number(outputObj.width ?? obj.output_width ?? 1200),
    output_height: Number(outputObj.height ?? obj.output_height ?? 1800),
    padding_mode: pMode,
    padding_all: pAll,
    padding_top: pTop,
    padding_right: pRight,
    padding_bottom: pBottom,
    padding_left: pLeft,
    background_color: bgColor,
    slots: Array.isArray(obj.slots)
      ? obj.slots.map((sItem: unknown) => {
          const s = (
            typeof sItem === "object" && sItem !== null ? sItem : {}
          ) as Record<string, unknown>;
          return {
            id: s.id ? String(s.id) : undefined,
            slot_key: String(s.slotKey ?? s.slot_key ?? "slot-1"),
            x: Number(s.x ?? 0),
            y: Number(s.y ?? 0),
            width: Number(s.width ?? 0),
            height: Number(s.height ?? 0),
            display_order: Number(s.displayOrder ?? s.display_order ?? 1),
          };
        })
      : [],
  };

  return layoutFormSchema.parse(candidate);
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
  submitLabel,
  onSubmit,
  error,
}: LayoutFormProps) {
  const t = useTranslations("LayoutForm");
  const [previewFile, setPreviewFile] = React.useState<File | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [importJsonFile, setImportJsonFile] = React.useState<File | null>(null);
  const [importError, setImportError] = React.useState<string | null>(null);

  const form = useForm<LayoutFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- z.number() vs Input type="number" string mismatch; runtime coercion is correct
    resolver: zodResolver(layoutFormSchema) as any,
    defaultValues: layoutDtoToFormValues(initial),
  });

  const layoutType = useWatch({ control: form.control, name: "type" });
  const paddingMode = useWatch({ control: form.control, name: "padding_mode" });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "slots",
  });

  const submit = form.handleSubmit(async (values) => {
    await onSubmit(values, previewFile);
  });

  const handleDownloadTemplate = () => {
    const jsonStr = JSON.stringify(LAYOUT_TEMPLATE_JSON, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "layout-setting-template.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveImportedJson = async () => {
    if (!importJsonFile) {
      setImportError(t("importModal.selectFileError"));
      return;
    }
    try {
      setImportError(null);
      const text = await importJsonFile.text();
      const parsed = JSON.parse(text);
      const validatedValues = parseImportedJsonToFormValues(parsed);
      form.reset(validatedValues);
      setIsImportModalOpen(false);
      setImportJsonFile(null);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const msg = err.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        setImportError(t("importModal.invalidFormat", { msg }));
      } else if (err instanceof Error) {
        setImportError(err.message || t("importModal.readError"));
      } else {
        setImportError(t("importModal.readError"));
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setImportError(null);
              setImportJsonFile(null);
              setIsImportModalOpen(true);
            }}
          >
            <FileJson className="mr-2 size-4" />
            {t("importJson")}
          </Button>
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("typeLabel")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("typePlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="paper">paper</SelectItem>
                    <SelectItem value="digital">digital</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t("typeDescription")}</FormDescription>
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

        {/* Paper Size & DPI (Conditional: type === "paper") */}
        {layoutType === "paper" ? (
          <fieldset className="border-border space-y-3 rounded-lg border p-4">
            <legend className="px-2 text-sm font-medium">
              {t("paperSettingsTitle")}
            </legend>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="paper_width_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paperWidthLabel")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paper_height_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paperHeightLabel")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dpiLabel")}</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={1200} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
        ) : null}

        {/* Canvas & Output Size */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Canvas Size */}
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">
              {t("canvasSizeTitle")}
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="canvas_width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("widthLabel")}</FormLabel>
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
                    <FormLabel>{t("heightLabel")}</FormLabel>
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
            <legend className="text-sm font-medium">
              {t("outputSizeTitle")}
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="output_width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("widthLabel")}</FormLabel>
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
                    <FormLabel>{t("heightLabel")}</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="aspect_ratio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("aspectRatioLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("aspectRatioPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        {/* Padding Section with Mode Toggle */}
        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-medium">{t("paddingTitle")}</legend>
            <FormField
              control={form.control}
              name="padding_mode"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-medium">
                    {t("paddingModeLabel")}
                  </span>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("paddingModeAll")}</SelectItem>
                      <SelectItem value="detailed">
                        {t("paddingModeDetailed")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          {paddingMode === "all" ? (
            <FormField
              control={form.control}
              name="padding_all"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("paddingAllLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder={t("paddingAllPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("paddingAllDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="padding_top"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paddingTopLabel")}</FormLabel>
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
                    <FormLabel>{t("paddingRightLabel")}</FormLabel>
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
                    <FormLabel>{t("paddingBottomLabel")}</FormLabel>
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
                    <FormLabel>{t("paddingLeftLabel")}</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </fieldset>

        {/* Slots */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">{t("slotsTitle")}</legend>
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="border-border bg-card space-y-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">
                  {t("slotLabel", { index: index + 1 })}
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
                      <FormLabel>{t("slotKeyLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("slotKeyPlaceholder", {
                            index: index + 1,
                          })}
                          {...field}
                        />
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
                      <FormLabel>{t("xLabel")}</FormLabel>
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
                      <FormLabel>{t("yLabel")}</FormLabel>
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
                      <FormLabel>{t("slotWidthLabel")}</FormLabel>
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
                      <FormLabel>{t("slotHeightLabel")}</FormLabel>
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
                      <FormLabel>{t("orderLabel")}</FormLabel>
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
                slot_key: `slot-${fields.length + 1}`,
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                display_order: fields.length + 1,
              })
            }
          >
            <Plus className="mr-2 size-4" />
            {t("addSlot")}
          </Button>
        </fieldset>

        {/* Preview Image */}
        <div className="space-y-2">
          <p className="text-sm font-medium">{t("previewImageTitle")}</p>
          <FileUpload
            value={previewFile}
            onChange={setPreviewFile}
            accept={{ "image/*": [] }}
            placeholder={t("previewImagePlaceholder")}
          />
          {initial?.preview_asset_id || initial?.previewAssetId ? (
            <AssetPreview
              assetId={(initial.previewAssetId || initial.preview_asset_id)!}
              alt="Layout preview"
              className="mt-3"
            />
          ) : null}
        </div>

        <Button type="submit" loading={form.formState.isSubmitting}>
          {submitLabel || t("submitLabel")}
        </Button>

        {/* Modal Import Settings JSON */}
        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("importModal.title")}</DialogTitle>
              <DialogDescription>
                {t("importModal.description")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                <span className="text-sm font-medium">
                  {t("importModal.downloadTitle")}
                </span>
                <Button
                  type="button"
                  variant="soft"
                  color="secondary"
                  size="sm"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="mr-1.5 size-4" />
                  {t("importModal.downloadButton")}
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {t("importModal.uploadTitle")}
                </p>
                <FileUpload
                  value={importJsonFile}
                  onChange={setImportJsonFile}
                  accept={{ "application/json": [".json"] }}
                  placeholder={t("importModal.uploadPlaceholder")}
                />
              </div>

              {importError ? (
                <p className="text-destructive text-sm font-medium">
                  {importError}
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsImportModalOpen(false)}
              >
                {t("importModal.cancel")}
              </Button>
              <Button type="button" onClick={handleSaveImportedJson}>
                {t("importModal.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
