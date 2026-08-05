import { API_ROUTES } from "@/constants/apiRoute";
import { ROUTES } from "@/constants/route";
import { getApiV1BaseUrl } from "@/libs/config/env";
import type { AuthTokens } from "@/types";
import { ApiError, toApiError } from "./errors";
import { throwIfErrorEnvelope, unwrapEnvelope } from "./envelope";
import type { ApiErrorBody } from "./types";
import { tokenStorage } from "./tokenStorage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Skip 401 refresh retry (used internally for refresh itself). */
  skipRefresh?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

function buildUrl(path: string): string {
  const base = getApiV1BaseUrl();
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function createRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  const current = window.location.pathname + window.location.search;
  const loginUrl = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(current)}`;
  if (!window.location.pathname.endsWith(ROUTES.LOGIN)) {
    window.location.assign(loginUrl);
  }
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status === 204) return null;
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text ? text : null;
}

function extractTokens(
  payload: AuthTokens | { tokens: AuthTokens },
): AuthTokens {
  if (payload && typeof payload === "object" && "tokens" in payload) {
    return payload.tokens;
  }
  return payload as AuthTokens;
}

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const stored = tokenStorage.get();
    if (!stored?.refreshToken) return false;

    try {
      const response = await fetch(buildUrl(API_ROUTES.AUTH.REFRESH), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Request-ID": createRequestId(),
        },
        body: JSON.stringify({ refresh_token: stored.refreshToken }),
      });

      const parsed = await parseBody(response);

      if (!response.ok) {
        tokenStorage.clear();
        return false;
      }

      const data = unwrapEnvelope<AuthTokens | { tokens: AuthTokens }>(
        parsed,
        response.status,
      );
      tokenStorage.set(extractTokens(data));
      return true;
    } catch {
      tokenStorage.clear();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function ensureFreshToken(): Promise<void> {
  const stored = tokenStorage.get();
  if (!stored) return;
  if (!tokenStorage.isExpiringSoon()) return;
  await refreshAccessToken();
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = true,
    headers = {},
    signal,
    skipRefresh = false,
  } = options;

  if (auth && !skipRefresh) {
    await ensureFreshToken();
  }

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    "X-Request-ID": createRequestId(),
    ...headers,
  };

  let requestBody: BodyInit | undefined;
  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined && body !== null) {
    requestHeaders["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  if (auth) {
    const stored = tokenStorage.get();
    if (stored?.accessToken) {
      requestHeaders.Authorization = `Bearer ${stored.accessToken}`;
    }
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: requestHeaders,
    body: requestBody,
    signal,
  });

  if (response.status === 401 && auth && !skipRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, { ...options, skipRefresh: true });
    }
    tokenStorage.clear();
    onUnauthorized?.();
    redirectToLogin();
    throw new ApiError(
      "Sesi habis. Yuk login lagi.",
      401,
      null,
      "UNAUTHORIZED",
    );
  }

  const parsed = await parseBody(response);

  if (!response.ok) {
    throwIfErrorEnvelope(parsed, response.status);
  }

  return unwrapEnvelope<T>(parsed, response.status);
}

export const apiClient = {
  get<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...options, method: "GET" });
  },

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return request<T>(path, { ...options, method: "POST", body });
  },

  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return request<T>(path, { ...options, method: "PUT", body });
  },

  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return request<T>(path, { ...options, method: "PATCH", body });
  },

  delete<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...options, method: "DELETE" });
  },

  async download(path: string): Promise<Blob> {
    await ensureFreshToken();
    const stored = tokenStorage.get();
    const headers: Record<string, string> = {
      Accept: "*/*",
      "X-Request-ID": createRequestId(),
    };
    if (stored?.accessToken) {
      headers.Authorization = `Bearer ${stored.accessToken}`;
    }

    const response = await fetch(buildUrl(path), { headers });
    if (!response.ok) {
      const parsed = await parseBody(response);
      throw toApiError(response.status, (parsed as ApiErrorBody) ?? null);
    }
    return response.blob();
  },
};

export { ApiError } from "./errors";
