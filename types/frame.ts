export type FrameStatusDto = "draft" | "active" | "archived";

export type FrameDto = {
  id: string;
  name: string;
  supported_layouts: string[];
  background_color: string;
  border_color?: string | null;
  border_width?: number | null;
  status: FrameStatusDto;
  preview_asset_id?: string | null;
  overlay_asset_id?: string | null;
  mask_asset_id?: string | null;
  thumbnail_asset_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CreateFramePayload = {
  name: string;
  supported_layouts: string[];
  background_color: string;
  border_color?: string | null;
  border_width?: number | null;
  status: FrameStatusDto;
};

export type UpdateFramePayload = Partial<CreateFramePayload>;
