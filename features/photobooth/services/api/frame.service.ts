import { frameService as backendFrameService } from "@/services/frame";
import { browserFrameRepository } from "@/features/photobooth/adapters/browser";
import type { Frame } from "@/features/photobooth/domain";
import type { FrameDto } from "@/types";

function mapDtoToFrame(dto: FrameDto): Frame {
  return {
    id: dto.id,
    name: dto.name,
    supportedLayoutIds: dto.layout_id ? [dto.layout_id] : [],
    preview: dto.preview_asset_id
      ? backendFrameService.downloadOverlayPath(dto.id)
      : "/assets/photobooth/frames/cute-pastel.svg",
    overlay: dto.overlay_asset_id
      ? backendFrameService.downloadOverlayPath(dto.id)
      : null,
    mask: dto.mask_asset_id
      ? backendFrameService.downloadOverlayPath(dto.id)
      : null,
    thumbnail: dto.thumbnail_asset_id
      ? backendFrameService.downloadOverlayPath(dto.id)
      : "/assets/photobooth/frames/cute-pastel.svg",
    backgroundColor: dto.background_color || "#ffffff",
    borderColor: dto.border_color || undefined,
    borderWidth: dto.border_width || undefined,
  };
}

export const frameService = {
  async list(): Promise<Frame[]> {
    try {
      const response = await backendFrameService.list({ per_page: 100 });
      if (response.data && response.data.length > 0) {
        return response.data.map(mapDtoToFrame);
      }
    } catch (err) {
      console.warn("Failed to fetch frames from backend API, falling back to local defaults:", err);
    }
    return browserFrameRepository.list();
  },

  async getById(id: string): Promise<Frame | null> {
    try {
      const dto = await backendFrameService.get(id);
      if (dto) return mapDtoToFrame(dto);
    } catch (err) {
      console.warn(`Failed to fetch frame ${id} from backend API, checking local defaults:`, err);
    }
    return browserFrameRepository.getById(id);
  },

  async listForLayout(layoutId: string): Promise<Frame[]> {
    const all = await this.list();
    const filtered = all.filter(
      (frame) =>
        frame.supportedLayoutIds.length === 0 ||
        frame.supportedLayoutIds.includes(layoutId),
    );
    return filtered.length > 0 ? filtered : browserFrameRepository.listForLayout(layoutId);
  },
};
