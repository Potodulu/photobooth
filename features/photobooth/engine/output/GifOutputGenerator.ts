import { GIFEncoder, quantize, applyPalette } from "gifenc";
import type {
  CompositeInput,
  GeneratedBlob,
  OutputFormat,
} from "@/features/photobooth/domain";
import { composeToCanvas, type OutputGenerator } from "./OutputGenerator";

export type GifCompositeInput = CompositeInput & {
  slotVideos?: Array<{ slotId: string; video: HTMLVideoElement | null }>;
  sampleCount?: number;
};

function waitForVideoFrame(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const onReady = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        video.removeEventListener("loadeddata", onReady);
        video.removeEventListener("seeked", onReady);
        resolve();
      }
    };
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("seeked", onReady);
  });
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  const target = Math.min(
    Math.max(0, time),
    Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.05) : time,
  );

  if (Math.abs(video.currentTime - target) < 0.02) {
    return waitForVideoFrame(video);
  }

  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      void waitForVideoFrame(video).then(resolve);
    };
    video.addEventListener("seeked", onSeeked);
    video.currentTime = target;
  });
}

/** GIF from raw video frame samples + layout frame (no photo filter). */
export class GifOutputGenerator implements OutputGenerator {
  readonly format: OutputFormat = "gif";

  async generate(input: GifCompositeInput): Promise<GeneratedBlob> {
    const sampleCount = input.sampleCount ?? 10;
    const slotVideos = input.slotVideos ?? [];
    const scale = 0.45;
    const width = Math.max(
      1,
      Math.round(input.layout.outputSize.width * scale),
    );
    const height = Math.max(
      1,
      Math.round(input.layout.outputSize.height * scale),
    );
    const gif = GIFEncoder();

    // Determine sample duration from first available video
    let duration = 0;
    for (const entry of slotVideos) {
      if (entry.video && Number.isFinite(entry.video.duration)) {
        duration = Math.max(duration, entry.video.duration);
      }
    }
    if (duration <= 0) duration = 1;

    for (const entry of slotVideos) {
      if (entry.video) await seekVideo(entry.video, 0);
    }

    for (let i = 0; i < sampleCount; i += 1) {
      const t =
        sampleCount === 1
          ? 0
          : (i / (sampleCount - 1)) * Math.max(0, duration - 0.05);

      const slotImages = await Promise.all(
        input.layout.slots.map(async (slot) => {
          const videoEntry = slotVideos.find((item) => item.slotId === slot.id);
          const stillEntry = input.slotImages.find(
            (item) => item.slotId === slot.id,
          );
          if (videoEntry?.video) {
            if (i === 0 && stillEntry?.image) {
              return {
                slotId: slot.id,
                image: stillEntry.image,
                panX: stillEntry.panX ?? 0,
                panY: stillEntry.panY ?? 0,
              };
            }
            await seekVideo(videoEntry.video, t);
            return {
              slotId: slot.id,
              image: videoEntry.video as CanvasImageSource,
              panX: stillEntry?.panX ?? 0,
              panY: stillEntry?.panY ?? 0,
            };
          }
          if (stillEntry) {
            return {
              slotId: slot.id,
              image: stillEntry.image,
              panX: stillEntry.panX ?? 0,
              panY: stillEntry.panY ?? 0,
            };
          }
          return { slotId: slot.id, image: document.createElement("canvas") };
        }),
      );

      const composed = composeToCanvas(
        {
          layout: input.layout,
          frame: input.frame,
          slotImages,
          filterId: "none",
          overlayImage: input.overlayImage,
        },
        { applyFilter: false },
      );

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unsupported");
      ctx.drawImage(composed, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const palette = quantize(imageData.data, 256);
      const index = applyPalette(imageData.data, palette);
      gif.writeFrame(index, width, height, {
        palette,
        delay: 10,
      });
    }

    gif.finish();
    const bytes = gif.bytes();
    const blob = new Blob([Uint8Array.from(bytes)], { type: "image/gif" });

    return {
      blob,
      mimeType: "image/gif",
      extension: "gif",
      format: this.format,
      fileName: "photobooth.gif",
    };
  }
}
