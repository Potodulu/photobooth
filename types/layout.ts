export type LayoutStatusDto = "draft" | "active" | "inactive";

export type SizeDto = {
  width: number;
  height: number;
};

export type PaddingDto = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type BackgroundDto = {
  color?: string;
};

export type LayoutSlotDto = {
  id: string;
  slot_key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  display_order: number;
};

export type SlotInput = {
  id?: string;
  slot_key: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  display_order?: number;
};

export type LayoutDto = {
  id: string;
  name: string;
  type: string;
  preview_asset_id?: string | null;
  paper_size?: string | null;
  dpi: number;
  canvas_size: SizeDto;
  slots: LayoutSlotDto[];
  padding: PaddingDto;
  background: BackgroundDto;
  aspect_ratio?: string | null;
  output_size: SizeDto;
  compatible_frame_ids: string[];
  status: LayoutStatusDto;
  created_at?: string;
  updated_at?: string;
};

export type CreateLayoutPayload = {
  name: string;
  type?: string;
  paper_size?: string | null;
  dpi?: number;
  aspect_ratio?: string | null;
  status?: LayoutStatusDto;
  canvas_size?: SizeDto;
  padding?: PaddingDto;
  background?: BackgroundDto;
  output_size?: SizeDto;
  compatible_frame_ids?: string[];
  slots?: SlotInput[];
};

export type UpdateLayoutPayload = Partial<CreateLayoutPayload>;
