export type LayoutStatusDto = "draft" | "active" | "inactive";

export type SizeDto = {
  width: number;
  height: number;
};

export type PaperSizeDto = {
  widthIn: number;
  heightIn: number;
};

export type PaddingDto = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type PaddingValue = number | PaddingDto;

export type BackgroundDto = {
  color?: string;
};

export type BackgroundValue = string | BackgroundDto;

export type LayoutSlotDto = {
  id: string;
  slot_key?: string;
  slotKey?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  display_order?: number;
  displayOrder?: number;
};

export type SlotInput = {
  id?: string;
  slotKey?: string;
  slot_key?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  displayOrder?: number;
  display_order?: number;
};

export type LayoutDto = {
  id: string;
  name: string;
  type: "paper" | "digital" | string;
  preview_asset_id?: string | null;
  previewAssetId?: string | null;
  paperSize?: PaperSizeDto | null;
  paper_size?: PaperSizeDto | string | null;
  dpi?: number;
  canvasSize?: SizeDto;
  canvas_size?: SizeDto;
  slots: LayoutSlotDto[];
  padding: PaddingValue;
  background: BackgroundValue;
  aspectRatio?: string | null;
  aspect_ratio?: string | null;
  outputSize?: SizeDto;
  output_size?: SizeDto;
  compatibleFrameIds?: string[];
  compatible_frame_ids?: string[];
  status: LayoutStatusDto;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

export type CreateLayoutPayload = {
  name: string;
  type: "paper" | "digital" | string;
  paperSize?: PaperSizeDto;
  paper_size?: PaperSizeDto | string;
  dpi?: number;
  canvasSize?: SizeDto;
  canvas_size?: SizeDto;
  slots?: SlotInput[];
  padding?: PaddingValue;
  background?: BackgroundValue;
  aspectRatio?: string;
  aspect_ratio?: string;
  outputSize?: SizeDto;
  output_size?: SizeDto;
  status?: LayoutStatusDto;
};

export type UpdateLayoutPayload = Partial<CreateLayoutPayload>;
