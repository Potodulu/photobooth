import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient, tokenStorage } from "@/libs/api";
import type {
  AuthResponse,
  AuthTokens,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/types";

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>(
      API_ROUTES.AUTH.REGISTER,
      payload,
      { auth: false },
    );
    tokenStorage.set(data.tokens);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      payload,
      { auth: false },
    );
    tokenStorage.set(data.tokens);
    return data;
  },

  async refresh(): Promise<AuthTokens | null> {
    const stored = tokenStorage.get();
    if (!stored?.refreshToken) return null;

    const data = await apiClient.post<AuthTokens | { tokens: AuthTokens }>(
      API_ROUTES.AUTH.REFRESH,
      { refresh_token: stored.refreshToken },
      { auth: false, skipRefresh: true },
    );

    const tokens =
      data && typeof data === "object" && "tokens" in data
        ? data.tokens
        : (data as AuthTokens);
    tokenStorage.set(tokens);
    return tokens;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ROUTES.AUTH.LOGOUT, undefined, {
        skipRefresh: true,
      });
    } catch {
      // Best-effort: always clear local session.
    } finally {
      tokenStorage.clear();
    }
  },

  async getMe(): Promise<AuthUser> {
    return apiClient.get<AuthUser>(API_ROUTES.USERS.ME);
  },
};
