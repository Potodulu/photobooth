import type {
  CompositeInput,
  Frame,
  GeneratedBlob,
  Layout,
  OutputFormat,
  PhotoFilterId,
} from "@/features/photobooth/domain";
import { getFilterCss } from "@/features/photobooth/domain";

export interface OutputGenerator {
  readonly format: OutputFormat;
  generate(input: CompositeInput): Promise<GeneratedBlob>;
}

export function drawCover(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  panX = 0,
  panY = 0,
) {
  const iw =
    "videoWidth" in image && (image as HTMLVideoElement).videoWidth
      ? (image as HTMLVideoElement).videoWidth
      : "naturalWidth" in image
        ? (image as HTMLImageElement).naturalWidth ||
          (image as HTMLImageElement).width
        : (image as HTMLCanvasElement).width;
  const ih =
    "videoHeight" in image && (image as HTMLVideoElement).videoHeight
      ? (image as HTMLVideoElement).videoHeight
      : "naturalHeight" in image
        ? (image as HTMLImageElement).naturalHeight ||
          (image as HTMLImageElement).height
        : (image as HTMLCanvasElement).height;

  if (!iw || !ih) return;

  const scale = Math.max(dw / iw, dh / ih);
  const sw = dw / scale;
  const sh = dh / scale;
  const clampedX = Math.max(-1, Math.min(1, panX));
  const clampedY = Math.max(-1, Math.min(1, panY));
  const maxPanX = iw - sw;
  const maxPanY = ih - sh;
  const sx = maxPanX * (0.5 + clampedX * 0.5);
  const sy = maxPanY * (0.5 + clampedY * 0.5);

  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  frame: Frame | null,
) {
  const { width, height } = layout.outputSize;
  ctx.fillStyle = frame?.backgroundColor ?? layout.background;
  ctx.fillRect(0, 0, width, height);
}

export function drawFrameOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: Frame | null,
  overlayImage?: CanvasImageSource | null,
) {
  if (!frame) return;

  const borderWidth = frame.borderWidth ?? 0;
  if (borderWidth > 0) {
    ctx.strokeStyle = frame.borderColor ?? "#1a1a1a";
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(
      borderWidth / 2,
      borderWidth / 2,
      width - borderWidth,
      height - borderWidth,
    );
  }

  if (overlayImage) {
    ctx.drawImage(overlayImage, 0, 0, width, height);
  }
}

export function composeToCanvas(
  input: CompositeInput,
  options?: { applyFilter?: boolean },
): HTMLCanvasElement {
  const { layout, frame, slotImages, filterId, overlayImage } = input;
  const { width, height } = layout.outputSize;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas unsupported");
  }

  drawBackground(ctx, layout, frame);

  const useFilter =
    options?.applyFilter !== false && filterId && filterId !== "none";
  if (useFilter) {
    ctx.filter = getFilterCss(filterId as PhotoFilterId);
  }
  for (const slot of layout.slots) {
    const entry = slotImages.find((item) => item.slotId === slot.id);
    if (!entry) continue;
    drawCover(
      ctx,
      entry.image,
      slot.x,
      slot.y,
      slot.width,
      slot.height,
      entry.panX ?? 0,
      entry.panY ?? 0,
    );
  }
  ctx.filter = "none";
  drawFrameOverlay(ctx, width, height, frame, overlayImage);
  return canvas;
}

export class PngOutputGenerator implements OutputGenerator {
  readonly format: OutputFormat = "png";

  async generate(input: CompositeInput): Promise<GeneratedBlob> {
    const canvas = composeToCanvas(input, { applyFilter: true });
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (!result) {
          reject(new Error("PNG export failed"));
          return;
        }
        resolve(result);
      }, "image/png");
    });

    return {
      blob,
      mimeType: "image/png",
      extension: "png",
      format: this.format,
      fileName: "photobooth.png",
    };
  }
}

export function getDefaultOutputGenerator(): OutputGenerator {
  return new PngOutputGenerator();
}
