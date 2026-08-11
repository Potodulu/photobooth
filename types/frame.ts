export type FrameStatusDto = "active" | "inactive" | "draft";

export type FrameDto = {
  id: string;
  owner_user_id: string;
  layout_id?: string | null;
  name: string;
  preview_asset_id?: string | null;
  overlay_asset_id?: string | null;
  mask_asset_id?: string | null;
  thumbnail_asset_id?: string | null;
  background_color?: string | null;
  border_color?: string | null;
  border_width?: number | null;
  status: FrameStatusDto;
  created_at?: string;
  updated_at?: string;
};

export type CreateFramePayload = {
  name: string;
  layout_id?: string;
  background_color?: string;
  border_color?: string;
  border_width?: number;
  status?: FrameStatusDto;
};

export type UpdateFramePayload = Partial<{
  name: string;
  layout_id: string | null;
  background_color: string | null;
  border_color: string | null;
  border_width: number;
  status: FrameStatusDto;
}>;
