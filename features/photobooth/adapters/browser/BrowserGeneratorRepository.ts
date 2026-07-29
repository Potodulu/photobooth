import type { GeneratedResult } from "@/features/photobooth/domain";
import type { GeneratorRepository } from "@/features/photobooth/repositories";
import {
  STORES,
  idbGet,
  idbPut,
  isIndexedDbAvailable,
  localStorageGet,
  localStorageSet,
} from "./storage";

export class BrowserGeneratorRepository implements GeneratorRepository {
  async saveResult(
    result: GeneratedResult,
    blobs: Blob[],
  ): Promise<GeneratedResult> {
    if (await isIndexedDbAvailable()) {
      await idbPut(STORES.results, result);
      await Promise.all(
        result.outputKeys.map((key, index) =>
          idbPut(STORES.blobs, blobs[index], key),
        ),
      );
      return result;
    }

    localStorageSet(`result:${result.id}`, result);
    await Promise.all(
      result.outputKeys.map(async (key, index) => {
        const blob = blobs[index];
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });
        localStorageSet(`blob:${key}`, dataUrl);
      }),
    );
    return result;
  }

  async getResult(id: string): Promise<GeneratedResult | null> {
    if (await isIndexedDbAvailable()) {
      return (await idbGet<GeneratedResult>(STORES.results, id)) ?? null;
    }
    return localStorageGet<GeneratedResult>(`result:${id}`);
  }

  async getResultBlob(key: string): Promise<Blob | null> {
    if (await isIndexedDbAvailable()) {
      return (await idbGet<Blob>(STORES.blobs, key)) ?? null;
    }
    const dataUrl = localStorageGet<string>(`blob:${key}`);
    if (!dataUrl) return null;
    const response = await fetch(dataUrl);
    return response.blob();
  }
}
