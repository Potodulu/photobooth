import type { Capture, CaptureSet } from "@/features/photobooth/domain";
import type { CaptureRepository } from "@/features/photobooth/repositories";
import {
  STORES,
  idbDelete,
  idbGet,
  idbPut,
  isIndexedDbAvailable,
  localStorageGet,
  localStorageSet,
} from "./storage";

async function blobToDataUrl(blob: Blob): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export class BrowserCaptureRepository implements CaptureRepository {
  async saveCapture(
    capture: Capture,
    blob: Blob,
    videoBlob?: Blob | null,
  ): Promise<Capture> {
    if (await isIndexedDbAvailable()) {
      await idbPut(STORES.captures, capture);
      await idbPut(STORES.blobs, blob, capture.blobKey);
      if (videoBlob && capture.videoBlobKey) {
        await idbPut(STORES.blobs, videoBlob, capture.videoBlobKey);
      }
      return capture;
    }

    localStorageSet(`capture:${capture.id}`, capture);
    localStorageSet(`blob:${capture.blobKey}`, await blobToDataUrl(blob));
    if (videoBlob && capture.videoBlobKey) {
      localStorageSet(
        `blob:${capture.videoBlobKey}`,
        await blobToDataUrl(videoBlob),
      );
    }
    return capture;
  }

  async getCapture(id: string): Promise<Capture | null> {
    if (await isIndexedDbAvailable()) {
      return (await idbGet<Capture>(STORES.captures, id)) ?? null;
    }
    return localStorageGet<Capture>(`capture:${id}`);
  }

  async getCaptureBlob(blobKey: string): Promise<Blob | null> {
    if (await isIndexedDbAvailable()) {
      const blob = await idbGet<Blob>(STORES.blobs, blobKey);
      return blob ?? null;
    }

    const dataUrl = localStorageGet<string>(`blob:${blobKey}`);
    if (!dataUrl) return null;
    const response = await fetch(dataUrl);
    return response.blob();
  }

  async listCaptures(ids: string[]): Promise<Capture[]> {
    const captures = await Promise.all(ids.map((id) => this.getCapture(id)));
    return captures.filter((item): item is Capture => item !== null);
  }

  async deleteCapture(id: string): Promise<void> {
    const capture = await this.getCapture(id);
    if (!capture) return;

    if (await isIndexedDbAvailable()) {
      await idbDelete(STORES.captures, id);
      await idbDelete(STORES.blobs, capture.blobKey);
      if (capture.videoBlobKey) {
        await idbDelete(STORES.blobs, capture.videoBlobKey);
      }
      return;
    }

    try {
      localStorage.removeItem(`photobooth-demo:capture:${id}`);
      localStorage.removeItem(`photobooth-demo:blob:${capture.blobKey}`);
      if (capture.videoBlobKey) {
        localStorage.removeItem(`photobooth-demo:blob:${capture.videoBlobKey}`);
      }
    } catch {
      // ignore
    }
  }

  async saveCaptureSet(set: CaptureSet): Promise<CaptureSet> {
    if (await isIndexedDbAvailable()) {
      await idbPut(STORES.captureSets, set);
      return set;
    }
    localStorageSet(`captureSet:${set.id}`, set);
    return set;
  }

  async getCaptureSet(id: string): Promise<CaptureSet | null> {
    if (await isIndexedDbAvailable()) {
      return (await idbGet<CaptureSet>(STORES.captureSets, id)) ?? null;
    }
    return localStorageGet<CaptureSet>(`captureSet:${id}`);
  }
}
