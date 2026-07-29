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

export class BrowserCaptureRepository implements CaptureRepository {
  async saveCapture(capture: Capture, blob: Blob): Promise<Capture> {
    if (await isIndexedDbAvailable()) {
      await idbPut(STORES.captures, capture);
      await idbPut(STORES.blobs, blob, capture.blobKey);
      return capture;
    }

    // ponytail: localStorage fallback loses binary fidelity via base64; upgrade = IDB only
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    localStorageSet(`capture:${capture.id}`, capture);
    localStorageSet(`blob:${capture.blobKey}`, dataUrl);
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
      return;
    }

    try {
      localStorage.removeItem(`photobooth-demo:capture:${id}`);
      localStorage.removeItem(`photobooth-demo:blob:${capture.blobKey}`);
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
