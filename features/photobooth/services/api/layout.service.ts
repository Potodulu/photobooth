import { browserLayoutRepository } from "@/features/photobooth/adapters/browser";
import type { Layout } from "@/features/photobooth/domain";

/** Today: browser repo. Later: HTTP endpoints. */
export const layoutService = {
  list(): Promise<Layout[]> {
    return browserLayoutRepository.list();
  },
  getById(id: string): Promise<Layout | null> {
    return browserLayoutRepository.getById(id);
  },
};
