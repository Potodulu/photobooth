import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import {
  RECORD_DURATION_MS,
  type CompositeInput,
  type GeneratedBlob,
  type OutputFormat,
} from "@/features/photobooth/domain";
import {
  composeToCanvas,
  drawBackground,
  drawCover,
  drawFrameOverlay,
  type OutputGenerator,
} from "./OutputGenerator";

type LiveInput = CompositeInput & {
  slotVideos?: Array<{ slotId: string; video: HTMLVideoElement | null }>;
  durationMs?: number;
};

async function encodeWithMp4Muxer(
  canvas: HTMLCanvasElement,
  drawFrame: (timeMs: number) => void,
  durationMs: number,
  fps = 10,
): Promise<Blob> {
  const width = canvas.width;
  const height = canvas.height;
  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: {
      codec: "avc",
      width,
      height,
    },
    fastStart: "in-memory",
  });

  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (error) => {
      throw error;
    },
  });

  encoder.configure({
    codec: "avc1.42001f",
    width,
    height,
    bitrate: 2_000_000,
    framerate: fps,
  });

  const frameInterval = 1000 / fps;
  const totalFrames = Math.max(1, Math.round(durationMs / frameInterval));

  for (let i = 0; i < totalFrames; i += 1) {
    const timeMs = i * frameInterval;
    drawFrame(timeMs);
    const frame = new VideoFrame(canvas, {
      timestamp: timeMs * 1000,
    });
    encoder.encode(frame, { keyFrame: i % 10 === 0 });
    frame.close();
  }

  await encoder.flush();
  muxer.finalize();
  return new Blob([target.buffer], { type: "video/mp4" });
}

async function encodeWithMediaRecorder(
  canvas: HTMLCanvasElement,
  drawFrame: (timeMs: number) => void,
  durationMs: number,
  fps = 10,
): Promise<Blob | null> {
  const stream = canvas.captureStream(fps);
  const mimeCandidates = ["video/mp4;codecs=avc1", "video/mp4"];
  const mimeType = mimeCandidates.find(
    (mime) =>
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(mime),
  );
  if (!mimeType) return null;

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, { mimeType });
  const done = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onerror = () => reject(new Error("MP4 recording failed"));
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/mp4" }));
  });

  recorder.start(100);
  const frameInterval = 1000 / fps;
  const started = performance.now();

  await new Promise<void>((resolve) => {
    const tick = () => {
      const elapsed = performance.now() - started;
      if (elapsed >= durationMs) {
        resolve();
        return;
      }
      drawFrame(elapsed);
      window.setTimeout(tick, frameInterval);
    };
    tick();
  });

  recorder.stop();
  return done;
}

/** Live-photo MP4 with frame, no photo filter. */
export class LivePhotoOutputGenerator implements OutputGenerator {
  readonly format: OutputFormat = "live-photo";

  async generate(input: LiveInput): Promise<GeneratedBlob> {
    const videos = input.slotVideos ?? [];
    let clipDurationMs = 0;
    for (const item of videos) {
      if (item.video && Number.isFinite(item.video.duration)) {
        clipDurationMs = Math.max(clipDurationMs, item.video.duration * 1000);
      }
    }
    const durationMs =
      clipDurationMs > 0
        ? clipDurationMs
        : (input.durationMs ?? RECORD_DURATION_MS);
    const layout = input.layout;
    const frame = input.frame;
    const { width, height } = layout.outputSize;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unsupported");

    for (const item of videos) {
      if (item.video) {
        item.video.currentTime = 0;
        await item.video.play().catch(() => undefined);
      }
    }

    const drawFrame = (timeMs: number) => {
      drawBackground(ctx, layout, frame);
      for (const slot of layout.slots) {
        const videoEntry = videos.find((item) => item.slotId === slot.id);
        const imageEntry = input.slotImages.find(
          (item) => item.slotId === slot.id,
        );
        const source =
          videoEntry?.video && videoEntry.video.readyState >= 2
            ? videoEntry.video
            : imageEntry?.image;
        if (!source) continue;
        if (videoEntry?.video && videoEntry.video.duration) {
          const t = (timeMs / 1000) % videoEntry.video.duration;
          if (Math.abs(videoEntry.video.currentTime - t) > 0.12) {
            videoEntry.video.currentTime = t;
          }
        }
        drawCover(
          ctx,
          source,
          slot.x,
          slot.y,
          slot.width,
          slot.height,
          imageEntry?.panX ?? 0,
          imageEntry?.panY ?? 0,
        );
      }
      drawFrameOverlay(ctx, width, height, frame, input.overlayImage);
    };

    // Seed first frame
    drawFrame(0);

    let blob: Blob | null = null;
    if (typeof VideoEncoder !== "undefined") {
      try {
        blob = await encodeWithMp4Muxer(canvas, drawFrame, durationMs);
      } catch {
        blob = null;
      }
    }
    if (!blob) {
      blob = await encodeWithMediaRecorder(canvas, drawFrame, durationMs);
    }
    if (!blob) {
      // Last resort: single-frame “video” still exported as mp4 via muxer stills fail —
      // fall back to PNG-wrapped is not allowed; throw clear error
      const still = composeToCanvas(
        { ...input, filterId: "none" },
        { applyFilter: false },
      );
      // Encode 1s of still frames if possible
      if (typeof VideoEncoder !== "undefined") {
        blob = await encodeWithMp4Muxer(still, () => undefined, 1000, 5);
      } else {
        throw new Error("MP4 export unsupported in this browser");
      }
    }

    for (const item of videos) {
      item.video?.pause();
    }

    return {
      blob,
      mimeType: "video/mp4",
      extension: "mp4",
      format: this.format,
      fileName: "live-photo.mp4",
    };
  }
}
