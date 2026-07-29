import { browserFrameRepository } from "@/features/photobooth/adapters/browser";
import type { Frame } from "@/features/photobooth/domain";

/** Today: browser repo. Later: HTTP endpoints. */
export const frameService = {
  list(): Promise<Frame[]> {
    return browserFrameRepository.list();
  },
  getById(id: string): Promise<Frame | null> {
    return browserFrameRepository.getById(id);
  },
  listForLayout(layoutId: string): Promise<Frame[]> {
    return browserFrameRepository.listForLayout(layoutId);
  },
};
