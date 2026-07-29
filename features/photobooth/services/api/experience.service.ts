import { browserExperienceRepository } from "@/features/photobooth/adapters/browser";
import type { Experience } from "@/features/photobooth/domain";

/** Today: browser repo. Later: HTTP endpoints. */
export const experienceService = {
  list(): Promise<Experience[]> {
    return browserExperienceRepository.list();
  },
  getById(id: string): Promise<Experience | null> {
    return browserExperienceRepository.getById(id);
  },
  getBySlug(slug: string): Promise<Experience | null> {
    return browserExperienceRepository.getBySlug(slug);
  },
};
