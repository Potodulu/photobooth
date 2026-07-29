import JSZip from "jszip";
import type {
  DownloadManifest,
  GeneratedBlob,
} from "@/features/photobooth/domain";

export async function buildResultZip(params: {
  outputs: GeneratedBlob[];
  rawPhotos?: Array<{ blob: Blob; fileName: string }>;
  manifest: DownloadManifest;
}): Promise<Blob> {
  const zip = new JSZip();

  for (const output of params.outputs) {
    const name = output.fileName ?? `output.${output.extension}`;
    zip.file(name, output.blob);
  }

  if (params.rawPhotos?.length) {
    const rawFolder = zip.folder("raw");
    params.rawPhotos.forEach((photo) => {
      rawFolder?.file(photo.fileName, photo.blob);
    });
  }

  zip.file("manifest.json", JSON.stringify(params.manifest, null, 2));
  return zip.generateAsync({ type: "blob" });
}

export function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
