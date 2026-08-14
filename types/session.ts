export type SessionVisibility = "private" | "public" | "unlisted";
export type SessionRetentionPolicy = "guest" | "registered" | "premium";
export type SessionStatus =
  "pending" | "active" | "finished" | "expired" | "cancelled";

export type SessionDto = {
  id: string;
  short_code: string;
  user_id?: string | null;
  guest_email?: string | null;
  status: SessionStatus;
  visibility: SessionVisibility;
  expires_at: string;
  retention_until: string;
  retention_policy: SessionRetentionPolicy;
  started_at?: string | null;
  finished_at?: string | null;
  metadata?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CreateSessionPayload = {
  guest_email?: string;
  visibility?: SessionVisibility;
  expires_in_minutes?: number;
  retention_policy?: SessionRetentionPolicy;
  metadata?: Record<string, unknown>;
  settings?: Record<string, unknown>;
};

export type SessionAssetType = "session_asset" | "session_result";

export type SessionAssetDto = {
  id: string;
  type: SessionAssetType;
  session_id: string;
  storage_provider?: string;
  path?: string;
  filename: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  status?: string;
  storage_status: string;
  public_url: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
};

export type GalleryResponseDto = {
  session: SessionDto;
  assets: SessionAssetDto[];
  results: SessionAssetDto[];
};
