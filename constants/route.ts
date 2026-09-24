export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  MAINTENANCE: "/maintenance",
  GUEST: {
    ROOT: "/guest",
    LAYOUT: "/guest/layout",
    CAMERA: "/guest/camera",
    SELECT: "/guest/select",
    PREVIEW: "/guest/preview",
  },
  ONLINE: {
    ROOT: "/online",
    LAYOUT: (sessionId: string) => `/online/${sessionId}/layout` as const,
    CAMERA: (sessionId: string) => `/online/${sessionId}/camera` as const,
    SELECT: (sessionId: string) => `/online/${sessionId}/select` as const,
    PREVIEW: (sessionId: string) => `/online/${sessionId}/preview` as const,
    GALLERY: (sessionId: string) => `/online/${sessionId}/gallery` as const,
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    LAYOUTS: "/dashboard/layouts",
    LAYOUTS_NEW: "/dashboard/layouts/new",
    layoutDetail: (id: string) => `/dashboard/layouts/${id}` as const,
    layoutEdit: (id: string) => `/dashboard/layouts/${id}/edit` as const,
    FRAMES: "/dashboard/frames",
    FRAMES_NEW: "/dashboard/frames/new",
    frameDetail: (id: string) => `/dashboard/frames/${id}` as const,
    frameEdit: (id: string) => `/dashboard/frames/${id}/edit` as const,
    PROFILE: "/dashboard/profile",
    USER_ACCESS: "/dashboard/user-access",
    ROLES: "/dashboard/roles",
  },
} as const;

export type AppRoute =
  | typeof ROUTES.HOME
  | typeof ROUTES.LOGIN
  | typeof ROUTES.REGISTER
  | typeof ROUTES.MAINTENANCE
  | (typeof ROUTES.GUEST)[keyof typeof ROUTES.GUEST]
  | typeof ROUTES.ONLINE.ROOT
  | ReturnType<typeof ROUTES.ONLINE.LAYOUT>
  | ReturnType<typeof ROUTES.ONLINE.CAMERA>
  | ReturnType<typeof ROUTES.ONLINE.SELECT>
  | ReturnType<typeof ROUTES.ONLINE.PREVIEW>
  | ReturnType<typeof ROUTES.ONLINE.GALLERY>
  | typeof ROUTES.DASHBOARD.ROOT
  | typeof ROUTES.DASHBOARD.LAYOUTS
  | typeof ROUTES.DASHBOARD.LAYOUTS_NEW
  | typeof ROUTES.DASHBOARD.FRAMES
  | typeof ROUTES.DASHBOARD.FRAMES_NEW
  | typeof ROUTES.DASHBOARD.PROFILE
  | typeof ROUTES.DASHBOARD.USER_ACCESS
  | typeof ROUTES.DASHBOARD.ROLES;

export type PhotoboothStep =
  | "warning"
  | "layout"
  | "camera"
  | "select"
  | "preview"
  | "gallery";

export function getPhotoboothStepRoute(
  step: PhotoboothStep,
  sessionId?: string | null,
): string {
  if (sessionId) {
    switch (step) {
      case "warning":
        return ROUTES.ONLINE.ROOT;
      case "layout":
        return ROUTES.ONLINE.LAYOUT(sessionId);
      case "camera":
        return ROUTES.ONLINE.CAMERA(sessionId);
      case "select":
        return ROUTES.ONLINE.SELECT(sessionId);
      case "preview":
        return ROUTES.ONLINE.PREVIEW(sessionId);
      case "gallery":
        return ROUTES.ONLINE.GALLERY(sessionId);
    }
  }

  switch (step) {
    case "warning":
      return ROUTES.GUEST.ROOT;
    case "layout":
      return ROUTES.GUEST.LAYOUT;
    case "camera":
      return ROUTES.GUEST.CAMERA;
    case "select":
      return ROUTES.GUEST.SELECT;
    case "preview":
      return ROUTES.GUEST.PREVIEW;
    case "gallery":
      return ROUTES.GUEST.PREVIEW;
  }
}
