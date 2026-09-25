import { layoutService as backendLayoutService } from "@/services/layout";
import { browserLayoutRepository } from "@/features/photobooth/adapters/browser";
import type { Layout, LayoutSlot } from "@/features/photobooth/domain";
import type { LayoutDto } from "@/types";

function localPreviewKey(slotCount: number): string {
  if (slotCount === 2) return "layouts/photostrip-2-slot.svg";
  if (slotCount === 3) return "layouts/photostrip-3-slot.svg";
  return "layouts/photostrip-4-slot.svg";
}

function mapDtoToLayout(dto: LayoutDto): Layout {
  const slots: LayoutSlot[] = (dto.slots || []).map((slot, index) => ({
    id: slot.id || slot.slotKey || slot.slot_key || `slot-${index + 1}`,
    x: slot.x,
    y: slot.y,
    width: slot.width,
    height: slot.height,
  }));

  const canvasSize = dto.canvas_size || dto.canvasSize || { width: 1200, height: 1800 };
  const outputSize = dto.output_size || dto.outputSize || canvasSize;
  const paperSize =
    typeof dto.paper_size === "object" && dto.paper_size !== null
      ? dto.paper_size
      : dto.paperSize || undefined;

  const previewAssetId = dto.preview_asset_id || dto.previewAssetId || undefined;
  const previewUrl = localPreviewKey(slots.length);

  const padding = typeof dto.padding === "number" ? dto.padding : (dto.padding?.top ?? 20);
  const background = typeof dto.background === "string" ? dto.background : (dto.background?.color ?? "#ffffff");

  return {
    id: dto.id,
    name: dto.name,
    type: dto.type === "paper" ? "paper" : "digital",
    preview: previewUrl,
    canvasSize,
    slots,
    aspectRatio: dto.aspect_ratio || dto.aspectRatio || "2:3",
    outputSize,
    padding,
    background,
    compatibleFrameIds: dto.compatible_frame_ids || dto.compatibleFrameIds || [],
    paperSize,
    dpi: dto.dpi,
    previewAssetId,
  };
}

export const layoutService = {
  async list(): Promise<Layout[]> {
    try {
      const response = await backendLayoutService.list({ per_page: 100 });
      if (response.data && response.data.length > 0) {
        return response.data.map(mapDtoToLayout);
      }
    } catch (err) {
      console.warn("Failed to fetch layouts from backend, falling back to local defaults:", err);
    }
    return browserLayoutRepository.list();
  },

  async getById(id: string): Promise<Layout | null> {
    try {
      const dto = await backendLayoutService.get(id);
      if (dto) return mapDtoToLayout(dto);
    } catch (err) {
      console.warn(`Failed to fetch layout ${id} from backend, checking local defaults:`, err);
    }
    return browserLayoutRepository.getById(id);
  },
};
