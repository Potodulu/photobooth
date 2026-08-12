export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  MAINTENANCE: "/maintenance",
  TRY: {
    ROOT: "/try",
    LAYOUT: "/try/layout",
    CAMERA: "/try/camera",
    SELECT: "/try/select",
    PREVIEW: "/try/preview",
    FRAME: "/try/frame",
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
  },
} as const;

export type AppRoute =
  | typeof ROUTES.HOME
  | typeof ROUTES.LOGIN
  | typeof ROUTES.REGISTER
  | typeof ROUTES.MAINTENANCE
  | (typeof ROUTES.TRY)[keyof typeof ROUTES.TRY]
  | typeof ROUTES.DASHBOARD.ROOT
  | typeof ROUTES.DASHBOARD.LAYOUTS
  | typeof ROUTES.DASHBOARD.LAYOUTS_NEW
  | typeof ROUTES.DASHBOARD.FRAMES
  | typeof ROUTES.DASHBOARD.FRAMES_NEW
  | typeof ROUTES.DASHBOARD.PROFILE;
