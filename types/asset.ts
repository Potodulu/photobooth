export type AssetDto = {
  id: string;
  kind?: string | null;
  mime_type?: string | null;
  url?: string | null;
  filename?: string | null;
  size_bytes?: number | null;
  created_at?: string;
};
