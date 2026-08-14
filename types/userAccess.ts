import type { RoleCode } from "./auth";

export type UserStatus = "active" | "inactive";

export type UserProfileDto = {
  user_id: string;
  full_name: string;
  username?: string | null;
  avatar_asset_id?: string | null;
  phone?: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type UserAccountDto = {
  id: string;
  email: string;
  role_id?: string;
  role_code: RoleCode;
  email_verified_at?: string | null;
  last_login_at?: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  profile?: UserProfileDto | null;
};

export type CreateUserPayload = {
  full_name: string;
  email: string;
  password: string;
  role_code: RoleCode;
  phone?: string;
};

export type UpdateUserPayload = {
  full_name?: string;
  email?: string;
  password?: string;
  role_code?: RoleCode;
  phone?: string;
  status?: UserStatus;
};
