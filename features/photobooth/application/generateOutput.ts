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
  useSessionStore,
} from "@/features/photobooth/stores";
import {
  apiClient,
  isPublicCatalogApiPath,
  resolveApiV1RelativePath,
} from "@/libs/api";
import { uploadService } from "@/services/upload";
import { purgeAfterDownloadOrCancel } from "./retention";

type LoadedCanvasImage = {
  image: HTMLImageElement;
  release?: () => void;
};

let previewGenerationSeq = 0;

function isSvgBlob(blob: Blob): boolean {
  return blob.type.includes("svg");
}

async function prepareSvgBlob(blob: Blob): Promise<Blob> {
  let svg = await blob.text();
  if (!svg.includes("xmlns=")) {
    svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const rootTagMatch = svg.match(/<svg\b([^>]*)>/i);
  if (rootTagMatch) {
    const rootAttrs = rootTagMatch[1];
    const hasWidth = /\bwidth\s*=/i.test(rootAttrs);
    const hasHeight = /\bheight\s*=/i.test(rootAttrs);
    if (!hasWidth || !hasHeight) {
      const viewBoxMatch = rootAttrs.match(/\bviewBox\s*=\s*["']([^"']+)["']/i);
      if (viewBoxMatch) {
        const parts = viewBoxMatch[1].trim().split(/[\s,]+/);
        if (parts.length === 4) {
          const [, , vbWidth, vbHeight] = parts;
          let newAttrs = rootAttrs;
          if (!hasWidth) newAttrs += ` width="${vbWidth}"`;
          if (!hasHeight) newAttrs += ` height="${vbHeight}"`;
          svg = svg.replace(rootTagMatch[0], `<svg${newAttrs}>`);
        }
      }
    }
  }
  return new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
}

async function loadImageElement(
  src: string,
  crossOrigin?: "anonymous",
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (crossOrigin) image.crossOrigin = crossOrigin;
    image.onload = async () => {
      try {
        if ("decode" in image) {
          await image.decode();
        }
      } catch {
        // Ignore decode errors if image.onload has already resolved
      }
      resolve(image);
    };
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = src;
  });
}

async function downloadApiImageBlob(apiPath: string): Promise<Blob> {
  if (isPublicCatalogApiPath(apiPath)) {
    return apiClient.download(apiPath, { auth: false });
  }
  return apiClient.download(apiPath);
}

/** Load images for canvas compose without tainting (CORS-safe). */
async function loadCanvasImage(url: string): Promise<LoadedCanvasImage> {
  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return { image: await loadImageElement(url) };
  }

  const apiPath =
    url.startsWith("http://") || url.startsWith("https://")
      ? resolveApiV1RelativePath(url)
      : url.startsWith("/")
        ? url
        : null;
  if (apiPath) {
    const blob = await downloadApiImageBlob(apiPath);
    const finalBlob = isSvgBlob(blob) ? await prepareSvgBlob(blob) : blob;
    const objectUrl = URL.createObjectURL(finalBlob);
    try {
      const image = await loadImageElement(objectUrl);
      return { image, release: () => URL.revokeObjectURL(objectUrl) };
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      throw error;
    }
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const response = await fetch(url, { mode: "cors", credentials: "omit" });
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      const finalBlob = isSvgBlob(blob) ? await prepareSvgBlob(blob) : blob;
      const objectUrl = URL.createObjectURL(finalBlob);
      try {
        const image = await loadImageElement(objectUrl);
        return { image, release: () => URL.revokeObjectURL(objectUrl) };
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        throw error;
      }
    } catch {
      const image = await loadImageElement(url, "anonymous");
      return { image };
    }
  }

  return { image: await loadImageElement(url) };
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

function isCurrentPreviewGeneration(runId: number) {
  return runId === previewGenerationSeq;
}

export async function generatePreview() {
  const generatorStore = useGeneratorStore.getState();
  if (generatorStore.isGenerating) return;

  const runId = ++previewGenerationSeq;

  const layoutStore = useLayoutStore.getState();
  const frameStore = useFrameStore.getState();
  const captureStore = useCaptureStore.getState();

  const layout = layoutStore.layouts.find(
    (item) => item.id === layoutStore.selectedLayoutId,
  );
  if (!layout) throw new Error("Layout not selected");

  const frame =
    frameStore.frames.find((item) => item.id === frameStore.selectedFrameId) ??
    null;

  generatorStore.setGenerating(true);
  generatorStore.setError(null);

  const releaseCanvasResources: Array<() => void> = [];

  try {
    const overlayKey = frame?.overlay;
    const overlayUrl = tryResolvePhotoboothAsset(overlayKey);
    let overlayImage: HTMLImageElement | null = null;
    if (overlayUrl) {
      try {
        const loaded = await loadCanvasImage(overlayUrl);
        overlayImage = loaded.image;
        if (loaded.release) releaseCanvasResources.push(loaded.release);
      } catch (error) {
        console.warn("Failed to load frame overlay for preview:", error);
        generatorStore.setError(
          error instanceof Error ? error.message : "Frame overlay failed to load",
        );
      }
    }

    if (!isCurrentPreviewGeneration(runId)) return;

    const slotImages = await Promise.all(
      generatorStore.slotAssignments.map(async (assignment) => {
        let url = captureStore.objectUrls[assignment.captureId];
        let tempCaptureUrl: string | null = null;
        if (!url) {
          const capture = captureStore.captures.find(
            (item) => item.id === assignment.captureId,
          );
          if (!capture) throw new Error("Capture missing");
          const blob = await captureService.getCaptureBlob(capture.blobKey);
          if (!blob) throw new Error("Capture blob missing");
          tempCaptureUrl = URL.createObjectURL(blob);
          url = tempCaptureUrl;
        }
        const loaded = await loadCanvasImage(url);
        if (loaded.release) releaseCanvasResources.push(loaded.release);
        if (tempCaptureUrl) {
          releaseCanvasResources.push(() =>
            URL.revokeObjectURL(tempCaptureUrl!),
          );
        }
        return {
          slotId: assignment.slotId,
          image: loaded.image,
          panX: assignment.panX ?? 0,
          panY: assignment.panY ?? 0,
        };
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

    if (!isCurrentPreviewGeneration(runId)) return;

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

    if (!isCurrentPreviewGeneration(runId)) return;

    generatorStore.setError(null);
    await generatorService.saveResult(result, [png.blob, gif.blob, live.blob]);
    generatorStore.setResult(result);
    generatorStore.setOutputs({ png, gif, live });
    generatorStore.setPreviewLiveUrl(URL.createObjectURL(live.blob));

    // Upload assets & results to Backend API if sessionId exists
    const sessionId = useSessionStore.getState().sessionId;
    if (sessionId) {
      generatorStore.setUploading(true);
      void (async () => {
        try {
          // 1. Upload raw photo assets & video clips
          for (let index = 0; index < captureStore.captures.length; index += 1) {
            const capture = captureStore.captures[index];
            const blob =
              (await captureService.getCaptureBlob(capture.blobKey)) ??
              (captureStore.objectUrls[capture.id]
                ? await fetch(captureStore.objectUrls[capture.id]).then((r) =>
                    r.blob(),
                  )
                : null);
            if (blob) {
              const ext = capture.mimeType.includes("png") ? "png" : "jpg";
              const file = new File(
                [blob],
                `webcam_shot_${index + 1}.${ext}`,
                { type: blob.type || "image/jpeg" },
              );
              await uploadService.uploadAsset(sessionId, file);
            }

            if (capture.videoBlobKey) {
              const videoBlob =
                (await captureService.getCaptureBlob(capture.videoBlobKey)) ??
                (captureStore.videoUrls[capture.id]
                  ? await fetch(captureStore.videoUrls[capture.id]).then((r) =>
                      r.blob(),
                    )
                  : null);
              if (videoBlob && videoBlob.size > 0) {
                const ext = videoBlob.type.includes("mp4") ? "mp4" : "webm";
                const videoFile = new File(
                  [videoBlob],
                  `webcam_clip_${index + 1}.${ext}`,
                  { type: videoBlob.type || "video/webm" },
                );
                await uploadService.uploadAsset(sessionId, videoFile);
              }
            }
          }

          // 2. Upload composite results (PNG photostrip, GIF, Live Photo MP4)
          const pngFile = new File([png.blob], "photostrip_result.png", {
            type: "image/png",
          });
          await uploadService.uploadResult(sessionId, pngFile);

          if (gif?.blob) {
            const gifFile = new File([gif.blob], "photostrip_result.gif", {
              type: "image/gif",
            });
            await uploadService.uploadResult(sessionId, gifFile);
          }

          if (live?.blob) {
            const liveFile = new File([live.blob], "livephoto_result.mp4", {
              type: "video/mp4",
            });
            await uploadService.uploadResult(sessionId, liveFile);
          }
        } catch (uploadError) {
          console.error("Failed to upload assets to backend:", uploadError);
        } finally {
          generatorStore.setUploading(false);
        }
      })();
    }

    return { result, png, gif, live };
  } catch (error) {
    generatorStore.setError(
      error instanceof Error ? error.message : "Generation failed",
    );
  } finally {
    for (const release of releaseCanvasResources) {
      release();
    }
    if (isCurrentPreviewGeneration(runId)) {
      generatorStore.setGenerating(false);
    }
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
      "Browser temporary storage. Cleared after download and when revisiting /online.",
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

export type PreviewAsset = {
  id: string;
  kind: "png" | "gif" | "mp4" | "raw-photo" | "raw-video";
  labelKey: string;
  labelParams?: Record<string, string | number>;
  fileName: string;
  blob: Blob;
  previewUrl?: string | null;
};

export function downloadAsset(blob: Blob, fileName: string) {
  triggerBrowserDownload(blob, fileName);
}

export async function collectPreviewAssets(): Promise<PreviewAsset[]> {
  const generatorStore = useGeneratorStore.getState();
  const captureStore = useCaptureStore.getState();
  const { pngOutput, gifOutput, liveOutput } = generatorStore;
  const assets: PreviewAsset[] = [];

  if (pngOutput) {
    assets.push({
      id: "composed-png",
      kind: "png",
      labelKey: "assetPng",
      fileName: pngOutput.fileName ?? "photobooth.png",
      blob: pngOutput.blob,
      previewUrl: URL.createObjectURL(pngOutput.blob),
    });
  }
  if (gifOutput) {
    assets.push({
      id: "composed-gif",
      kind: "gif",
      labelKey: "assetGif",
      fileName: gifOutput.fileName ?? "photobooth.gif",
      blob: gifOutput.blob,
      previewUrl: URL.createObjectURL(gifOutput.blob),
    });
  }
  if (liveOutput) {
    assets.push({
      id: "composed-live",
      kind: "mp4",
      labelKey: "assetLive",
      fileName: liveOutput.fileName ?? "live-photo.mp4",
      blob: liveOutput.blob,
      previewUrl: generatorStore.previewLiveUrl,
    });
  }

  for (let index = 0; index < captureStore.captures.length; index += 1) {
    const capture = captureStore.captures[index];
    const n = String(index + 1).padStart(2, "0");
    const photoBlob =
      (await captureService.getCaptureBlob(capture.blobKey)) ??
      (captureStore.objectUrls[capture.id]
        ? await fetch(captureStore.objectUrls[capture.id]).then((r) => r.blob())
        : null);
    if (photoBlob) {
      const ext = capture.mimeType.includes("png") ? "png" : "jpg";
      assets.push({
        id: `raw-photo-${capture.id}`,
        kind: "raw-photo",
        labelKey: "assetRawPhoto",
        labelParams: { index: index + 1 },
        fileName: `photo-${n}.${ext}`,
        blob: photoBlob,
        previewUrl:
          captureStore.objectUrls[capture.id] ?? URL.createObjectURL(photoBlob),
      });
    }

    if (capture.videoBlobKey) {
      const videoBlob =
        (await captureService.getCaptureBlob(capture.videoBlobKey)) ??
        (captureStore.videoUrls[capture.id]
          ? await fetch(captureStore.videoUrls[capture.id]).then((r) =>
              r.blob(),
            )
          : null);
      if (videoBlob && videoBlob.size > 0) {
        const ext = videoBlob.type.includes("mp4") ? "mp4" : "webm";
        assets.push({
          id: `raw-video-${capture.id}`,
          kind: "raw-video",
          labelKey: "assetRawVideo",
          labelParams: { index: index + 1 },
          fileName: `video-${n}.${ext}`,
          blob: videoBlob,
          previewUrl:
            captureStore.videoUrls[capture.id] ??
            URL.createObjectURL(videoBlob),
        });
      }
    }
  }

  return assets;
}
