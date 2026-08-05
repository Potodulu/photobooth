export type RoleCode = "admin" | "contributor" | "user";

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

export type AuthUserProfile = {
  user_id: string;
  full_name: string;
  created_at?: string;
  updated_at?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role_id?: string;
  role_code: RoleCode;
  status?: string;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
  profile?: AuthUserProfile | null;
};

export function getUserDisplayName(
  user: Pick<AuthUser, "email" | "profile"> | null | undefined,
): string {
  return user?.profile?.full_name?.trim() || user?.email || "";
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  full_name: string;
};

export type AuthResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type AuthStatus = "idle" | "loading" | "authenticated" | "guest";

export type AuthSession = {
  user: AuthUser | null;
  role: RoleCode | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  status: AuthStatus;
};
