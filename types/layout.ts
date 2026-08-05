export type LayoutTypeDto = "digital" | "paper";

export type LayoutStatusDto = "draft" | "active" | "archived";

export type SizeDto = {
  width: number;
  height: number;
};

export type PaperSizeDto = {
  width_in: number;
  height_in: number;
};

export type LayoutSlotDto = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LayoutDto = {
  id: string;
  name: string;
  type: LayoutTypeDto;
  paper_size?: PaperSizeDto | null;
  dpi?: number | null;
  canvas_size: SizeDto;
  slots: LayoutSlotDto[];
  padding: number;
  background: string;
  aspect_ratio: string;
  output_size: SizeDto;
  compatible_frame_ids: string[];
  status: LayoutStatusDto;
  preview_asset_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CreateLayoutPayload = {
  name: string;
  type: LayoutTypeDto;
  paper_size?: PaperSizeDto | null;
  dpi?: number | null;
  canvas_size: SizeDto;
  slots: LayoutSlotDto[];
  padding: number;
  background: string;
  aspect_ratio: string;
  output_size: SizeDto;
  compatible_frame_ids: string[];
  status: LayoutStatusDto;
};

export type UpdateLayoutPayload = Partial<CreateLayoutPayload>;
