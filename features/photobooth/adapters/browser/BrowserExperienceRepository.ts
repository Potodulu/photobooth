import type { Experience } from "@/features/photobooth/domain";
import type { ExperienceRepository } from "@/features/photobooth/repositories";
import experiencesJson from "@/features/photobooth/metadata/experiences.json";

const experiences = experiencesJson as Experience[];

export class BrowserExperienceRepository implements ExperienceRepository {
  async list(): Promise<Experience[]> {
    return experiences;
  }

  async getById(id: string): Promise<Experience | null> {
    return experiences.find((item) => item.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Experience | null> {
    return experiences.find((item) => item.slug === slug) ?? null;
  }
}
