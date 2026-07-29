import type {
  CompositeInput,
  Frame,
  GeneratedBlob,
  Layout,
  OutputFormat,
} from "@/features/photobooth/domain";

export interface OutputGenerator {
  readonly format: OutputFormat;
  generate(input: CompositeInput): Promise<GeneratedBlob>;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
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

  const scale = Math.max(dw / iw, dh / ih);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;

  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}

export function composeToCanvas(input: CompositeInput): HTMLCanvasElement {
  const { layout, frame, slotImages } = input;
  const { width, height } = layout.outputSize;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas unsupported");
  }

  drawBackground(ctx, layout, frame);
  for (const slot of layout.slots) {
    const entry = slotImages.find((item) => item.slotId === slot.id);
    if (!entry) continue;
    drawCover(ctx, entry.image, slot.x, slot.y, slot.width, slot.height);
  }
  drawFrameOverlay(ctx, width, height, frame);
  return canvas;
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  frame: Frame | null,
) {
  const { width, height } = layout.outputSize;
  ctx.fillStyle = frame?.backgroundColor ?? layout.background;
  ctx.fillRect(0, 0, width, height);
}

function drawFrameOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: Frame | null,
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

  // Future: load frame.overlay image when assets exist
}

export class PngOutputGenerator implements OutputGenerator {
  readonly format: OutputFormat = "png";

  async generate(input: CompositeInput): Promise<GeneratedBlob> {
    const canvas = composeToCanvas(input);
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
    };
  }
}

export function getDefaultOutputGenerator(): OutputGenerator {
  return new PngOutputGenerator();
}
