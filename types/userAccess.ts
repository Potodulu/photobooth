import type { RoleCode } from "./auth";

export type UserStatus = "active" | "inactive";

export type UserAccountDto = {
  id: string;
  email: string;
  full_name: string;
  role: RoleCode;
  status: UserStatus;
  avatar_url?: string | null;
  phone?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateUserPayload = {
  email: string;
  password: string;
  full_name: string;
  role: RoleCode;
  phone?: string;
};

export type UpdateUserPayload = {
  full_name?: string;
  email?: string;
  password?: string;
  phone?: string;
  status?: UserStatus;
};
