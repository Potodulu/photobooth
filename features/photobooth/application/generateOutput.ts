import {
  PHOTOBOOTH_MANIFEST_VERSION,
  createId,
  type DownloadManifest,
  type GeneratedResult,
} from "@/features/photobooth/domain";
import {
  GifOutputGenerator,
  LivePhotoOutputGenerator,
  PngOutputGenerator,
} from "@/features/photobooth/engine";
import {
  buildResultZip,
  triggerBrowserDownload,
} from "@/features/photobooth/adapters/browser/zip";
import { tryResolvePhotoboothAsset } from "@/features/photobooth/assets";
import {
  captureService,
  generatorService,
} from "@/features/photobooth/services/api";
import {
  useCaptureStore,
  useFrameStore,
  useGeneratorStore,
  useLayoutStore,
} from "@/features/photobooth/stores";
import { purgeAfterDownloadOrCancel } from "./retention";

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = url;
  });
}

async function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.onloadedmetadata = () => resolve(video);
    video.onerror = () => reject(new Error("Failed to load video"));
    video.src = url;
  });
}

export async function generatePreview() {
  const layoutStore = useLayoutStore.getState();
  const frameStore = useFrameStore.getState();
  const captureStore = useCaptureStore.getState();
  const generatorStore = useGeneratorStore.getState();

  const layout = layoutStore.layouts.find(
    (item) => item.id === layoutStore.selectedLayoutId,
  );
  if (!layout) throw new Error("Layout not selected");

  const frame =
    frameStore.frames.find((item) => item.id === frameStore.selectedFrameId) ??
    null;

  generatorStore.setGenerating(true);
  generatorStore.setError(null);

  try {
    const slotImages = await Promise.all(
      generatorStore.slotAssignments.map(async (assignment) => {
        let url = captureStore.objectUrls[assignment.captureId];
        if (!url) {
          const capture = captureStore.captures.find(
            (item) => item.id === assignment.captureId,
          );
          if (!capture) throw new Error("Capture missing");
          const blob = await captureService.getCaptureBlob(capture.blobKey);
          if (!blob) throw new Error("Capture blob missing");
          url = URL.createObjectURL(blob);
        }
        return { slotId: assignment.slotId, image: await loadImage(url) };
      }),
    );

    const slotVideos = await Promise.all(
      generatorStore.slotAssignments.map(async (assignment) => {
        let url = captureStore.videoUrls[assignment.captureId];
        if (!url) {
          const capture = captureStore.captures.find(
            (item) => item.id === assignment.captureId,
          );
          if (capture?.videoBlobKey) {
            const blob = await captureService.getCaptureBlob(
              capture.videoBlobKey,
            );
            if (blob) url = URL.createObjectURL(blob);
          }
        }
        if (!url) return { slotId: assignment.slotId, video: null };
        try {
          return {
            slotId: assignment.slotId,
            video: await loadVideo(url),
          };
        } catch {
          return { slotId: assignment.slotId, video: null };
        }
      }),
    );

    const overlayKey = frame?.overlay;
    const overlayUrl = tryResolvePhotoboothAsset(overlayKey);
    // ponytail: SVG drawn onto canvas taints it in Chromium — overlay must be raster (PNG).
    let overlayImage: HTMLImageElement | null = null;
    if (overlayUrl) {
      try {
        overlayImage = await loadImage(overlayUrl);
      } catch {
        overlayImage = null;
      }
    }

    const compositeBase = {
      layout,
      frame,
      slotImages,
      filterId: captureStore.filterId,
      overlayImage,
    };

    const pngGen = new PngOutputGenerator();
    const gifGen = new GifOutputGenerator();
    const liveGen = new LivePhotoOutputGenerator();

    // GIF needs sequential video seeks — run after loading videos
    const gif = await gifGen.generate({
      ...compositeBase,
      filterId: "none",
      slotVideos,
    });

    const [png, live] = await Promise.all([
      pngGen.generate(compositeBase),
      liveGen.generate({
        ...compositeBase,
        filterId: "none",
        slotVideos,
      }),
    ]);

    const resultId = createId();
    const keys = [`png-${resultId}`, `gif-${resultId}`, `live-${resultId}`];
    const result: GeneratedResult = {
      id: resultId,
      layoutId: layout.id,
      frameId: frame?.id ?? null,
      filterId: captureStore.filterId,
      slotAssignments: generatorStore.slotAssignments,
      outputKeys: keys,
      createdAt: new Date().toISOString(),
      version: PHOTOBOOTH_MANIFEST_VERSION,
    };

    await generatorService.saveResult(result, [png.blob, gif.blob, live.blob]);
    generatorStore.setResult(result);
    generatorStore.setOutputs({ png, gif, live });
    generatorStore.setPreviewLiveUrl(URL.createObjectURL(live.blob));
    return { result, png, gif, live };
  } catch (error) {
    generatorStore.setError(
      error instanceof Error ? error.message : "Generation failed",
    );
  } finally {
    generatorStore.setGenerating(false);
  }
}

export async function downloadResultZip() {
  const generatorStore = useGeneratorStore.getState();
  const captureStore = useCaptureStore.getState();
  const result = generatorStore.result;
  const { pngOutput, gifOutput, liveOutput } = generatorStore;
  if (!result || !pngOutput || !gifOutput || !liveOutput) {
    throw new Error("No result to download");
  }

  generatorStore.setDownloadProgress(10);

  const rawPhotos = await Promise.all(
    captureStore.captures.map(async (capture, index) => {
      const blob =
        (await captureService.getCaptureBlob(capture.blobKey)) ??
        (captureStore.objectUrls[capture.id]
          ? await fetch(captureStore.objectUrls[capture.id]).then((r) =>
              r.blob(),
            )
          : null);
      if (!blob) throw new Error("Raw photo missing");
      const ext = capture.mimeType.includes("png") ? "png" : "jpg";
      return {
        blob,
        fileName: `photo-${String(index + 1).padStart(2, "0")}.${ext}`,
      };
    }),
  );

  generatorStore.setDownloadProgress(45);

  const manifest: DownloadManifest = {
    layoutId: result.layoutId,
    frameId: result.frameId,
    filterId: result.filterId,
    formats: ["png", "gif", "mp4"],
    createdAt: result.createdAt,
    version: result.version,
    retentionNote:
      "Browser temporary storage. Cleared after download and when revisiting /try.",
  };

  const zipBlob = await buildResultZip({
    outputs: [pngOutput, gifOutput, liveOutput],
    rawPhotos,
    manifest,
  });

  generatorStore.setDownloadProgress(90);
  triggerBrowserDownload(zipBlob, `potodulu-${result.id.slice(0, 8)}.zip`);
  generatorStore.setDownloadProgress(100);
  await purgeAfterDownloadOrCancel();
}
