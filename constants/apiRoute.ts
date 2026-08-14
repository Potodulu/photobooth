export type FrameAssetKind = "preview" | "overlay" | "mask" | "thumbnail";

export const API_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    ME: "/users/me",
  },
  PROFILES: {
    ME: "/profiles/me",
    UPDATE_EMAIL: "/profiles/me/email",
    CHANGE_PASSWORD: "/profiles/me/password",
  },
  USER_ACCESS: {
    LIST: "/users",
    CREATE: "/users",
    byId: (id: string) => `/users/${id}` as const,
    inactivate: (id: string) => `/users/${id}/inactivate` as const,
  },
  ROLES: {
    LIST: "/roles",
    CREATE: "/roles",
    byId: (id: string) => `/roles/${id}` as const,
  },
  LAYOUTS: {
    LIST: "/layouts",
    byId: (id: string) => `/layouts/${id}` as const,
    preview: (id: string) => `/layouts/${id}/preview` as const,
  },
  FRAMES: {
    LIST: "/frames",
    byId: (id: string) => `/frames/${id}` as const,
    asset: (id: string, kind: FrameAssetKind) =>
      `/frames/${id}/assets/${kind}` as const,
    downloadOverlay: (id: string) => `/frames/${id}/download/overlay` as const,
  },
  SESSIONS: {
    CREATE: "/sessions",
    byId: (id: string) => `/sessions/${id}` as const,
    byCode: (code: string) => `/sessions/code/${code}` as const,
  },
  UPLOADS: {
    assets: (sessionId: string) =>
      `/uploads/sessions/${sessionId}/assets` as const,
    results: (sessionId: string) =>
      `/uploads/sessions/${sessionId}/results` as const,
  },
  GALLERY: {
    bySessionId: (sessionId: string) => `/gallery/${sessionId}` as const,
  },
  ASSETS: {
    byId: (id: string) => `/assets/${id}` as const,
    download: (id: string) => `/assets/${id}/download` as const,
  },
} as const;
