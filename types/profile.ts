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

export type UpdateEmailPayload = {
  email: string;
  current_password?: string;
};

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
};
