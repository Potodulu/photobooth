export type ProfileDto = {
  id: string;
  user_id: string;
  full_name: string;
  email?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type UpdateProfilePayload = {
  full_name?: string;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
};
