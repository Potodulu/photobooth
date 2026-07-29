"use client";

import { useTranslations } from "next-intl";
import type {
  Capture,
  Layout,
  SlotAssignment,
} from "@/features/photobooth/domain";
import { cn } from "@/libs/cn";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type PhotoPickerProps = {
  layout: Layout;
  captures: Capture[];
  objectUrls: Record<string, string>;
  assignments: SlotAssignment[];
  onAssign: (slotId: string, captureId: string) => void;
  onClear: (slotId: string) => void;
  onAutoFill: () => void;
  onConfirm: () => void;
};

export function PhotoPicker({
  layout,
  captures,
  objectUrls,
  assignments,
  onAssign,
  onClear,
  onAutoFill,
  onConfirm,
}: PhotoPickerProps) {
  const t = useTranslations("TrySelect");
  const assignedIds = new Set(assignments.map((item) => item.captureId));
  const activeSlot =
    layout.slots.find(
      (slot) => !assignments.some((item) => item.slotId === slot.id),
    ) ?? layout.slots[0];
  const complete = assignments.length === layout.slots.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="soft" color="primary" radius="full">
          {t("progress", {
            current: assignments.length,
            total: layout.slots.length,
          })}
        </Badge>
        <div className="flex gap-2">
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

      <div className="grid gap-3 sm:grid-cols-2">
        {layout.slots.map((slot) => {
          const assignment = assignments.find(
            (item) => item.slotId === slot.id,
          );
          const isActive = activeSlot?.id === slot.id;
          return (
            <div
              key={slot.id}
              className={cn(
                "border-border rounded-[var(--radius-xl)] border-2 p-3",
                isActive && "ring-foreground ring-2 ring-offset-2",
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
                    onClick={() => onClear(slot.id)}
                  >
                    {t("clear")}
                  </Button>
                ) : null}
              </div>
              <div className="border-border bg-muted/30 aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] border-2">
                {assignment ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={objectUrls[assignment.captureId]}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
                    {t("emptySlot")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold">{t("pickHint")}</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {captures.map((capture) => {
            const used = assignedIds.has(capture.id);
            return (
              <button
                key={capture.id}
                type="button"
                disabled={used || !activeSlot}
                onClick={() =>
                  activeSlot && onAssign(activeSlot.id, capture.id)
                }
                className={cn(
                  "border-border aspect-square overflow-hidden rounded-[var(--radius-md)] border-2",
                  used && "opacity-40",
                  !used && "hover:shadow-neo-sm",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={objectUrls[capture.id]}
                  alt=""
                  className="size-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
