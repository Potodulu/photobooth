import {
  PHOTOBOOTH_MANIFEST_VERSION,
  createId,
  type DownloadManifest,
  type GeneratedResult,
} from "@/features/photobooth/domain";
import { getDefaultOutputGenerator } from "@/features/photobooth/engine";
import {
  buildResultZip,
  triggerBrowserDownload,
} from "@/features/photobooth/adapters/browser/zip";
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

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = url;
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
        const url = captureStore.objectUrls[assignment.captureId];
        if (!url) {
          const capture = captureStore.captures.find(
            (item) => item.id === assignment.captureId,
          );
          if (!capture) throw new Error("Capture missing");
          const blob = await captureService.getCaptureBlob(capture.blobKey);
          if (!blob) throw new Error("Capture blob missing");
          const objectUrl = URL.createObjectURL(blob);
          return {
            slotId: assignment.slotId,
            image: await loadImage(objectUrl),
            objectUrl,
          };
        }
        return { slotId: assignment.slotId, image: await loadImage(url) };
      }),
    );

    const generator = getDefaultOutputGenerator();
    const output = await generator.generate({
      layout,
      frame,
      slotImages: slotImages.map(({ slotId, image }) => ({ slotId, image })),
    });

    const outputKey = `output-${createId()}`;
    const result: GeneratedResult = {
      id: createId(),
      layoutId: layout.id,
      frameId: frame?.id ?? null,
      slotAssignments: generatorStore.slotAssignments,
      outputKeys: [outputKey],
      createdAt: new Date().toISOString(),
      version: PHOTOBOOTH_MANIFEST_VERSION,
    };

    await generatorService.saveResult(result, [output.blob]);
    const previewUrl = URL.createObjectURL(output.blob);
    generatorStore.setResult(result);
    generatorStore.setPreviewUrl(previewUrl);
    return { result, output };
  } catch (error) {
    generatorStore.setError(
      error instanceof Error ? error.message : "Generation failed",
    );
    throw error;
  } finally {
    generatorStore.setGenerating(false);
  }
}

export async function downloadResultZip() {
  const generatorStore = useGeneratorStore.getState();
  const result = generatorStore.result;
  if (!result) throw new Error("No result to download");

  generatorStore.setDownloadProgress(10);

  const blobs = await Promise.all(
    result.outputKeys.map(async (key) => {
      const blob = await generatorService.getResultBlob(key);
      if (!blob) throw new Error("Result blob missing");
      return blob;
    }),
  );

  generatorStore.setDownloadProgress(50);

  const manifest: DownloadManifest = {
    layoutId: result.layoutId,
    frameId: result.frameId,
    createdAt: result.createdAt,
    version: result.version,
  };

  const zipBlob = await buildResultZip({
    outputs: blobs.map((blob) => ({
      blob,
      mimeType: blob.type || "image/png",
      extension: "png",
      format: "png" as const,
    })),
    manifest,
    baseName: "potodulu-photobooth",
  });

  generatorStore.setDownloadProgress(90);
  triggerBrowserDownload(zipBlob, `potodulu-${result.id.slice(0, 8)}.zip`);
  generatorStore.setDownloadProgress(100);
}
