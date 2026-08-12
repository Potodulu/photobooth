import type { AuthTokens } from "@/types";

const ACCESS_TOKEN_KEY = "potodulu.access_token";
const REFRESH_TOKEN_KEY = "potodulu.refresh_token";
const EXPIRES_AT_KEY = "potodulu.expires_at";

export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export const tokenStorage = {
  get(): StoredTokens | null {
    if (!canUseStorage()) return null;

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const expiresAtRaw = localStorage.getItem(EXPIRES_AT_KEY);

    if (!accessToken || !refreshToken || !expiresAtRaw) return null;

    const expiresAt = Number(expiresAtRaw);
    if (!Number.isFinite(expiresAt)) return null;

    return { accessToken, refreshToken, expiresAt };
  },

  set(tokens: AuthTokens): StoredTokens {
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    const stored: StoredTokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
    };

    if (canUseStorage()) {
      localStorage.setItem(ACCESS_TOKEN_KEY, stored.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, stored.refreshToken);
      localStorage.setItem(EXPIRES_AT_KEY, String(stored.expiresAt));
    }

    return stored;
  },

  clear(): void {
    if (!canUseStorage()) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  },

  isExpiringSoon(bufferMs = 60_000): boolean {
    const stored = this.get();
    if (!stored) return true;
    return Date.now() >= stored.expiresAt - bufferMs;
  },
};
