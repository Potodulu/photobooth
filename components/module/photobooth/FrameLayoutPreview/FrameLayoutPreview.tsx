"use client";

import { useCallback, useRef } from "react";
import {
  getFilterCss,
  type Frame,
  type Layout,
  type PhotoFilterId,
  type SlotAssignment,
} from "@/features/photobooth/domain";
import { tryResolvePhotoboothAsset } from "@/features/photobooth/assets";
import { cn } from "@/libs/cn";

type FrameLayoutPreviewProps = {
  layout: Layout;
  frame: Frame | null;
  objectUrls: Record<string, string>;
  assignments: SlotAssignment[];
  filterId: PhotoFilterId;
  activeSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  onPanChange: (slotId: string, panX: number, panY: number) => void;
  onClearSlot?: (slotId: string) => void;
};

export function FrameLayoutPreview({
  layout,
  frame,
  objectUrls,
  assignments,
  filterId,
  activeSlotId,
  onSelectSlot,
  onPanChange,
  onClearSlot,
}: FrameLayoutPreviewProps) {
  const { width: outputWidth, height: outputHeight } = layout.outputSize;
  const filterCss = getFilterCss(filterId);
  const overlayUrl = frame?.overlay
    ? tryResolvePhotoboothAsset(frame.overlay)
    : null;
  const panRef = useRef<{
    slotId: string;
    startX: number;
    startY: number;
    originPanX: number;
    originPanY: number;
    slotWidth: number;
    slotHeight: number;
  } | null>(null);

  const handlePointerDown = useCallback(
    (
      event: React.PointerEvent,
      slotId: string,
      slotWidth: number,
      slotHeight: number,
    ) => {
      const assignment = assignments.find((item) => item.slotId === slotId);
      if (!assignment) return;
      onSelectSlot(slotId);
      if (activeSlotId !== slotId) return;

      event.currentTarget.setPointerCapture(event.pointerId);
      panRef.current = {
        slotId,
        startX: event.clientX,
        startY: event.clientY,
        originPanX: assignment.panX ?? 0,
        originPanY: assignment.panY ?? 0,
        slotWidth,
        slotHeight,
      };
    },
    [activeSlotId, assignments, onSelectSlot],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      const pan = panRef.current;
      if (!pan) return;
      const dx = event.clientX - pan.startX;
      const dy = event.clientY - pan.startY;
      // Dragging image content: opposite of finger move feels natural for cover pan
      const nextX = pan.originPanX - (dx / Math.max(pan.slotWidth, 1)) * 2;
      const nextY = pan.originPanY - (dy / Math.max(pan.slotHeight, 1)) * 2;
      onPanChange(pan.slotId, nextX, nextY);
    },
    [onPanChange],
  );

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    if (panRef.current) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // ignore if already released
      }
      panRef.current = null;
    }
  }, []);

  // Width from max-height × aspect so the box doesn't collapse (slots are absolute).
  const maxPreviewHeight = "calc(100dvh - 8rem)";

  return (
    <div
      className="border-border shadow-neo-md relative max-w-full overflow-hidden rounded-[var(--radius-xl)] border-2"
      style={{
        aspectRatio: `${outputWidth} / ${outputHeight}`,
        width: `min(100%, calc(${maxPreviewHeight} * ${outputWidth} / ${outputHeight}))`,
        maxHeight: maxPreviewHeight,
        backgroundColor: frame?.backgroundColor ?? layout.background,
      }}
    >
      {layout.slots.map((slot) => {
        const assignment = assignments.find((item) => item.slotId === slot.id);
        const isActive = activeSlotId === slot.id;
        const panX = assignment?.panX ?? 0;
        const panY = assignment?.panY ?? 0;
        const left = (slot.x / outputWidth) * 100;
        const top = (slot.y / outputHeight) * 100;
        const width = (slot.width / outputWidth) * 100;
        const height = (slot.height / outputHeight) * 100;

        return (
          <div
            key={slot.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectSlot(slot.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                onSelectSlot(slot.id);
              }
            }}
            onPointerDown={(event) => {
              if (!assignment) {
                onSelectSlot(slot.id);
                return;
              }
              handlePointerDown(event, slot.id, slot.width, slot.height);
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={cn(
              "absolute touch-none overflow-hidden",
              isActive && "ring-foreground z-10 ring-2 ring-offset-1",
              assignment && isActive && "cursor-grab active:cursor-grabbing",
            )}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            {assignment ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={objectUrls[assignment.captureId]}
                alt=""
                draggable={false}
                className="pointer-events-none size-full object-cover select-none"
                style={{
                  filter: filterCss,
                  objectPosition: `calc(50% + ${panX * 50}%) calc(50% + ${panY * 50}%)`,
                }}
              />
            ) : (
              <div className="bg-muted/40 text-muted-foreground flex size-full items-center justify-center text-xs">
                {slot.id}
              </div>
            )}
            {assignment && onClearSlot && isActive ? (
              <button
                type="button"
                className="bg-background/90 absolute top-1 right-1 z-30 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
                onPointerUp={(event) => {
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  onClearSlot(slot.id);
                }}
              >
                ✕
              </button>
            ) : null}
          </div>
        );
      })}

      {overlayUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={overlayUrl}
          alt=""
          className="pointer-events-none absolute inset-0 z-20 size-full object-fill"
        />
      ) : frame?.borderWidth ? (
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            boxShadow: `inset 0 0 0 ${Math.max(2, (frame.borderWidth / outputWidth) * 100)}% ${frame.borderColor ?? "#1a1a1a"}`,
          }}
        />
      ) : null}
    </div>
  );
}
