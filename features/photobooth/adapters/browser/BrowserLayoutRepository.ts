import type { Layout } from "@/features/photobooth/domain";
import type { LayoutRepository } from "@/features/photobooth/repositories";
import layoutsJson from "@/features/photobooth/metadata/layouts.json";

const layouts = layoutsJson as Layout[];

export class BrowserLayoutRepository implements LayoutRepository {
  async list(): Promise<Layout[]> {
    return layouts;
  }

  async getById(id: string): Promise<Layout | null> {
    return layouts.find((item) => item.id === id) ?? null;
  }
}
