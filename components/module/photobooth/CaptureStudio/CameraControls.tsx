"use client";

import { FlipHorizontal, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  COUNTDOWN_OPTIONS,
  type CountdownSeconds,
} from "@/features/photobooth/domain";
import { cn } from "@/libs/cn";

type CameraControlsProps = {
  landscape: boolean;
  busy: boolean;
  mirrorEnabled: boolean;
  countdownSeconds: CountdownSeconds;
  canCapture: boolean;
  canContinue: boolean;
  latestThumbUrl: string | null;
  captureCount: number;
  maxTakes: number;
  orientationLocked: boolean;
  lockHint: string;
  mirrorLabel: string;
  timerLabel: string;
  timerOptionLabel: (seconds: number) => string;
  galleryLabel: string;
  captureLabel: string;
  continueLabel: string;
  onMirrorToggle: () => void;
  onCountdownChange: (seconds: number) => void;
  onOpenGallery: () => void;
  onCapture: () => void;
  onContinue: () => void;
};

export function CameraControls({
  landscape,
  busy,
  mirrorEnabled,
  countdownSeconds,
  canCapture,
  canContinue,
  latestThumbUrl,
  captureCount,
  maxTakes,
  orientationLocked,
  lockHint,
  mirrorLabel,
  timerLabel,
  timerOptionLabel,
  galleryLabel,
  captureLabel,
  continueLabel,
  onMirrorToggle,
  onCountdownChange,
  onOpenGallery,
  onCapture,
  onContinue,
}: CameraControlsProps) {
  const secondaryBtn =
    "bg-background/80 text-foreground hover:bg-background size-11 shrink-0 rounded-full border-0 shadow-sm backdrop-blur-sm";

  const continueChip =
    canContinue && !busy ? (
      <Button
        type="button"
        variant="solid"
        color="primary"
        radius="full"
        size="sm"
        className="shadow-md"
        onClick={onContinue}
      >
        {continueLabel}
      </Button>
    ) : null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 flex flex-col items-center justify-center",
        // Both orientations: vertical rail on the trailing edge
        "inset-y-0 right-0 w-[min(28%,11rem)] px-3",
      )}
      style={{
        paddingRight: "max(0.5rem, env(safe-area-inset-right))",
        paddingBottom: landscape
          ? undefined
          : "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {orientationLocked ? (
        <p className="mb-2 rounded-full bg-black/50 px-3 py-1 text-center text-xs font-medium text-white">
          {lockHint}
        </p>
      ) : null}

      {/* Order top→bottom: mirror, timer, shutter, gallery, Lanjut */}
      <div
        className={cn(
          "pointer-events-auto flex flex-col items-center",
          landscape ? "gap-3" : "gap-2.5",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(secondaryBtn, mirrorEnabled && "ring-primary ring-2")}
          disabled={busy}
          aria-label={mirrorLabel}
          aria-pressed={mirrorEnabled}
          onClick={onMirrorToggle}
        >
          <FlipHorizontal className="size-5" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className={cn(secondaryBtn, "w-auto gap-1 px-3")}
              disabled={busy}
              aria-label={timerLabel}
            >
              <Timer className="size-5" />
              <span className="text-xs font-bold">{countdownSeconds}s</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-2"
            align="center"
            side={landscape ? "left" : "top"}
          >
            <div className="flex gap-1" role="group" aria-label={timerLabel}>
              {COUNTDOWN_OPTIONS.map((seconds) => (
                <Button
                  key={seconds}
                  type="button"
                  size="sm"
                  radius="full"
                  variant={countdownSeconds === seconds ? "solid" : "outline"}
                  color={countdownSeconds === seconds ? "primary" : "neutral"}
                  disabled={busy}
                  aria-pressed={countdownSeconds === seconds}
                  onClick={() => onCountdownChange(seconds)}
                >
                  {timerOptionLabel(seconds)}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <button
          type="button"
          disabled={!canCapture || busy}
          aria-label={captureLabel}
          onClick={onCapture}
          className={cn(
            "border-background relative flex size-16 shrink-0 items-center justify-center rounded-full border-4 bg-white shadow-lg transition active:scale-95 disabled:opacity-40",
            landscape && "size-14",
          )}
        >
          <span
            className={cn(
              "bg-primary rounded-full",
              landscape ? "size-10" : "size-12",
            )}
          />
        </button>

        <Button
          type="button"
          variant="ghost"
          className={cn(secondaryBtn, "relative w-auto overflow-visible p-0")}
          disabled={captureCount === 0}
          aria-label={galleryLabel}
          onClick={onOpenGallery}
        >
          {latestThumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={latestThumbUrl}
              alt=""
              className="size-11 rounded-full object-cover"
            />
          ) : (
            <span className="bg-muted size-11 rounded-full" />
          )}
          <span className="bg-primary text-primary-foreground absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
            {captureCount}
          </span>
          <span className="sr-only">
            {captureCount} / {maxTakes}
          </span>
        </Button>

        {continueChip}
      </div>
    </div>
  );
}
