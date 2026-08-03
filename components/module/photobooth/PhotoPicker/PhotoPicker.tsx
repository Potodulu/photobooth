"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/Toast";
import {
  PHOTO_FILTERS,
  getFilterCss,
  type Capture,
  type Frame,
  type Layout,
  type PhotoFilterId,
  type SlotAssignment,
} from "@/features/photobooth/domain";
import { FrameLayoutPreview } from "@/components/module/photobooth/FrameLayoutPreview";
import { FramePicker } from "@/components/module/photobooth/FramePicker";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/libs/cn";

// ponytail: re-enable HTML5 drag-assign when needed
const DRAG_ASSIGN_ENABLED = false;

type PhotoPickerProps = {
  title: string;
  subtitle: string;
  layout: Layout;
  frames: Frame[];
  selectedFrameId: string | null;
  captures: Capture[];
  objectUrls: Record<string, string>;
  assignments: SlotAssignment[];
  filterId: PhotoFilterId;
  onFilterChange: (id: PhotoFilterId) => void;
  onSelectFrame: (id: string) => void;
  onAssign: (slotId: string, captureId: string) => void;
  onClear: (slotId: string) => void;
  onPanChange: (slotId: string, panX: number, panY: number) => void;
  onAutoFill: () => void;
  onReset: () => void;
  onConfirm: () => void;
};

export function PhotoPicker({
  title,
  subtitle,
  layout,
  frames,
  selectedFrameId,
  captures,
  objectUrls,
  assignments,
  filterId,
  onFilterChange,
  onSelectFrame,
  onAssign,
  onClear,
  onPanChange,
  onAutoFill,
  onReset,
  onConfirm,
}: PhotoPickerProps) {
  const t = useTranslations("TrySelect");
  const firstEmpty =
    layout.slots.find(
      (slot) => !assignments.some((item) => item.slotId === slot.id),
    ) ?? null;
  const [activeSlotId, setActiveSlotId] = useState<string | null>(
    firstEmpty?.id ?? layout.slots[0]?.id ?? null,
  );
  const [dragOverSlotId, setDragOverSlotId] = useState<string | null>(null);
  const filterCss = getFilterCss(filterId);

  const complete = assignments.length === layout.slots.length;
  const activeSlotIdResolved =
    activeSlotId ?? firstEmpty?.id ?? layout.slots[0]?.id ?? null;
  const selectedFrame =
    frames.find((item) => item.id === selectedFrameId) ?? frames[0] ?? null;

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      <aside className="order-2 flex flex-col gap-5 lg:order-1">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="soft" color="primary" radius="full">
            {t("progress", {
              current: assignments.length,
              total: layout.slots.length,
            })}
          </Badge>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              color="neutral"
              radius="lg"
              onClick={onReset}
            >
              {t("reset")}
            </Button>
            <Button
              variant="outline"
              color="neutral"
              radius="lg"
              onClick={onAutoFill}
            >
              {t("autoFill")}
            </Button>
            <Button
              variant="solid"
              color="primary"
              radius="lg"
              disabled={!complete}
              onClick={onConfirm}
            >
              {t("continue")}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">{t("frames")}</p>
          <FramePicker
            frames={frames}
            selectedId={selectedFrameId}
            onSelect={onSelectFrame}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">{t("filters")}</p>
          <p className="text-muted-foreground text-xs">{t("filtersHint")}</p>
          <div className="flex flex-wrap gap-2">
            {PHOTO_FILTERS.map((filter) => (
              <Button
                key={filter.id}
                type="button"
                size="sm"
                radius="full"
                variant={filterId === filter.id ? "solid" : "outline"}
                color={filterId === filter.id ? "primary" : "neutral"}
                onClick={() => onFilterChange(filter.id)}
              >
                {t(`filter.${filter.id}`)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold">{t("pickHint")}</p>
          <p className="text-muted-foreground mb-3 text-xs">
            {t("repositionHint")}
          </p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {captures.map((capture) => (
              <button
                key={capture.id}
                type="button"
                draggable={DRAG_ASSIGN_ENABLED}
                onDragStart={(event) => {
                  if (!DRAG_ASSIGN_ENABLED) return;
                  event.dataTransfer.setData("text/capture-id", capture.id);
                  event.dataTransfer.effectAllowed = "copy";
                }}
                onClick={() => {
                  if (!activeSlotIdResolved) return;
                  onAssign(activeSlotIdResolved, capture.id);
                }}
                className={cn(
                  "border-border hover:shadow-neo-sm size-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] border-2",
                  DRAG_ASSIGN_ENABLED && "cursor-grab active:cursor-grabbing",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={objectUrls[capture.id]}
                  alt=""
                  className="size-full object-cover"
                  style={{ filter: filterCss }}
                />
              </button>
            ))}
          </div>
        </div>

        {DRAG_ASSIGN_ENABLED ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {layout.slots.map((slot) => {
              const assignment = assignments.find(
                (item) => item.slotId === slot.id,
              );
              const isActive = activeSlotIdResolved === slot.id;
              const isEmpty = !assignment;
              return (
                <div
                  key={slot.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveSlotId(slot.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      setActiveSlotId(slot.id);
                    }
                  }}
                  onDragOver={(event) => {
                    if (!DRAG_ASSIGN_ENABLED) return;
                    event.preventDefault();
                    setDragOverSlotId(slot.id);
                  }}
                  onDragLeave={() => setDragOverSlotId(null)}
                  onDrop={(event) => {
                    if (!DRAG_ASSIGN_ENABLED) return;
                    event.preventDefault();
                    setDragOverSlotId(null);
                    const captureId =
                      event.dataTransfer.getData("text/capture-id");
                    if (!captureId) return;
                    if (!isEmpty) {
                      toast.error(t("slotOccupied"));
                      return;
                    }
                    onAssign(slot.id, captureId);
                    setActiveSlotId(slot.id);
                  }}
                  className={cn(
                    "border-border rounded-[var(--radius-xl)] border-2 p-3 text-left",
                    isActive && "ring-foreground ring-2 ring-offset-2",
                    dragOverSlotId === slot.id && isEmpty && "bg-primary/20",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-display text-sm font-bold">
                      {slot.id}
                    </span>
                    {assignment ? (
                      <Button
                        variant="ghost"
                        color="neutral"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          onClear(slot.id);
                        }}
                      >
                        {t("clear")}
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </aside>

      <section className="order-1 flex w-full justify-center lg:sticky lg:top-4 lg:order-2 lg:justify-end">
        <FrameLayoutPreview
          layout={layout}
          frame={selectedFrame}
          objectUrls={objectUrls}
          assignments={assignments}
          filterId={filterId}
          activeSlotId={activeSlotIdResolved}
          onSelectSlot={setActiveSlotId}
          onPanChange={onPanChange}
          onClearSlot={onClear}
        />
      </section>
    </div>
  );
}
