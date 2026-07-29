import { browserGeneratorRepository } from "@/features/photobooth/adapters/browser";
import type { GeneratedResult } from "@/features/photobooth/domain";

/** Today: browser repo. Later: HTTP endpoints. */
export const generatorService = {
  saveResult(result: GeneratedResult, blobs: Blob[]): Promise<GeneratedResult> {
    return browserGeneratorRepository.saveResult(result, blobs);
  },
  getResult(id: string): Promise<GeneratedResult | null> {
    return browserGeneratorRepository.getResult(id);
  },
  getResultBlob(key: string): Promise<Blob | null> {
    return browserGeneratorRepository.getResultBlob(key);
  },
};
