import type { Frame } from "@/features/photobooth/domain";
import type { FrameRepository } from "@/features/photobooth/repositories";
import framesJson from "@/features/photobooth/metadata/frames.json";

const frames = framesJson as Frame[];

export class BrowserFrameRepository implements FrameRepository {
  async list(): Promise<Frame[]> {
    return frames;
  }

  async getById(id: string): Promise<Frame | null> {
    return frames.find((item) => item.id === id) ?? null;
  }

  async listForLayout(layoutId: string): Promise<Frame[]> {
    return frames.filter((frame) =>
      frame.supportedLayoutIds.includes(layoutId),
    );
  }
}
