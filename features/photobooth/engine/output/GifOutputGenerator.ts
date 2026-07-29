import { GIFEncoder, quantize, applyPalette } from "gifenc";
import type {
  CompositeInput,
  GeneratedBlob,
  OutputFormat,
} from "@/features/photobooth/domain";
import { composeToCanvas, type OutputGenerator } from "./OutputGenerator";

/** GIF with frame, no photo filter. */
export class GifOutputGenerator implements OutputGenerator {
  readonly format: OutputFormat = "gif";

  async generate(input: CompositeInput): Promise<GeneratedBlob> {
    const base = composeToCanvas(
      { ...input, filterId: "none" },
      { applyFilter: false },
    );
    const scale = 0.45;
    const width = Math.max(1, Math.round(base.width * scale));
    const height = Math.max(1, Math.round(base.height * scale));
    const frameCount = 10;
    const gif = GIFEncoder();

    for (let i = 0; i < frameCount; i += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unsupported");

      // Mild zoom pulse for motion without filter
      const zoom = 1 + (i % 2 === 0 ? 0.02 : 0);
      const dw = width * zoom;
      const dh = height * zoom;
      ctx.drawImage(base, (width - dw) / 2, (height - dh) / 2, dw, dh);

      const imageData = ctx.getImageData(0, 0, width, height);
      const palette = quantize(imageData.data, 256);
      const index = applyPalette(imageData.data, palette);
      gif.writeFrame(index, width, height, {
        palette,
        delay: 12,
      });
    }

    gif.finish();
    const bytes = gif.bytes();
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "image/gif" });

    return {
      blob,
      mimeType: "image/gif",
      extension: "gif",
      format: this.format,
      fileName: "photobooth.gif",
    };
  }
}
