import JSZip from "jszip";
import type {
  DownloadManifest,
  GeneratedBlob,
} from "@/features/photobooth/domain";

export async function buildResultZip(params: {
  outputs: GeneratedBlob[];
  manifest: DownloadManifest;
  baseName?: string;
}): Promise<Blob> {
  const zip = new JSZip();
  const baseName = params.baseName ?? "potodulu-result";

  params.outputs.forEach((output, index) => {
    const name =
      params.outputs.length === 1
        ? `${baseName}.${output.extension}`
        : `${baseName}-${index + 1}.${output.extension}`;
    zip.file(name, output.blob);
  });

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
