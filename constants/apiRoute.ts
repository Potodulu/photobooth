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
  ASSETS: {
    byId: (id: string) => `/assets/${id}` as const,
    download: (id: string) => `/assets/${id}/download` as const,
  },
} as const;
