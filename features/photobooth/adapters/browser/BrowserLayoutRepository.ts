import type {
  Layout,
  LayoutType,
  PaperSize,
  Size,
} from "@/features/photobooth/domain";
import { PRINT_DPI, paperSizeToPixels } from "@/features/photobooth/domain";
import type { LayoutRepository } from "@/features/photobooth/repositories";
import layoutsJson from "@/features/photobooth/metadata/layouts.json";

type RawLayout = Omit<Layout, "type" | "paperSize" | "dpi"> & {
  type?: LayoutType;
  paperSize?: PaperSize;
  dpi?: number;
};

function normalizeLayout(raw: RawLayout): Layout {
  const type: LayoutType = raw.type ?? "digital";
  const dpi = raw.dpi ?? PRINT_DPI;

  if (type === "paper" && raw.paperSize) {
    const size: Size = paperSizeToPixels(raw.paperSize, dpi);
    return {
      ...raw,
      type,
      dpi,
      paperSize: raw.paperSize,
      canvasSize: size,
      outputSize: size,
    };
  }

  return {
    ...raw,
    type,
    dpi: raw.dpi,
    paperSize: raw.paperSize,
  };
}

const layouts = (layoutsJson as RawLayout[]).map(normalizeLayout);

export class BrowserLayoutRepository implements LayoutRepository {
  async list(): Promise<Layout[]> {
    return layouts;
  }

  async getById(id: string): Promise<Layout | null> {
    return layouts.find((item) => item.id === id) ?? null;
  }
}
