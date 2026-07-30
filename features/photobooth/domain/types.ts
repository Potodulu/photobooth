export type Size = {
  width: number;
  height: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LayoutSlot = {
  id: string;
} & Rect;

export type LayoutType = "digital" | "paper";

export type PaperSize = {
  widthIn: number;
  heightIn: number;
};

export type StoragePolicy = "browser-temporary" | "server-persistent";

export type Experience = {
  id: string;
  slug: string;
  name: string;
  defaultLayoutId: string;
  storagePolicy: StoragePolicy;
  description?: string;
};

export type Layout = {
  id: string;
  name: string;
  type: LayoutType;
  preview: string;
  canvasSize: Size;
  slots: LayoutSlot[];
  aspectRatio: string;
  outputSize: Size;
  padding: number;
  background: string;
  compatibleFrameIds: string[];
  paperSize?: PaperSize;
  dpi?: number;
};

export type Frame = {
  id: string;
  name: string;
  supportedLayoutIds: string[];
  preview: string;
  overlay: string | null;
  mask: string | null;
  thumbnail: string;
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
};

export type PhotoFilterId =
  | "none"
  | "grayscale"
  | "sepia"
  | "contrast"
  | "brightness"
  | "saturate"
  | "warm"
  | "cool"
  | "fade"
  | "mono-high";

export type Capture = {
  id: string;
  blobKey: string;
  videoBlobKey?: string | null;
  width: number;
  height: number;
  createdAt: string;
  mimeType: string;
  durationMs?: number;
};

export type CaptureSet = {
  id: string;
  experienceId: string;
  layoutId: string;
  captureIds: string[];
  maxTakes: number;
  createdAt: string;
};

export type SlotAssignment = {
  slotId: string;
  captureId: string;
};

export type GeneratedResult = {
  id: string;
  layoutId: string;
  frameId: string | null;
  filterId: PhotoFilterId;
  slotAssignments: SlotAssignment[];
  outputKeys: string[];
  createdAt: string;
  version: string;
};

export type OutputFormat = "png" | "jpeg" | "gif" | "live-photo" | "video";

export type GeneratedBlob = {
  blob: Blob;
  mimeType: string;
  extension: string;
  format: OutputFormat;
  fileName?: string;
};

export type CompositeInput = {
  layout: Layout;
  frame: Frame | null;
  slotImages: Array<{ slotId: string; image: CanvasImageSource }>;
  filterId?: PhotoFilterId;
  overlayImage?: CanvasImageSource | null;
};

export type DownloadManifest = {
  layoutId: string;
  frameId: string | null;
  filterId: PhotoFilterId;
  formats: Array<"png" | "gif" | "mp4">;
  createdAt: string;
  version: string;
  retentionNote: string;
};

export const PHOTOBOOTH_MANIFEST_VERSION = "1.1.0";
export const MAX_CAPTURE_TAKES = 10;
export const COUNTDOWN_OPTIONS = [3, 5, 10] as const;
export type CountdownSeconds = (typeof COUNTDOWN_OPTIONS)[number];
export const DEFAULT_COUNTDOWN_SECONDS: CountdownSeconds = 5;
export const RECORD_DURATION_MS = 10_000;
export const FLASH_DURATION_MS = 450;
export const STORAGE_TTL_MS = 24 * 60 * 60 * 1000;

export const PHOTO_FILTERS: Array<{
  id: PhotoFilterId;
  css: string;
}> = [
  { id: "none", css: "none" },
  { id: "grayscale", css: "grayscale(1)" },
  { id: "sepia", css: "sepia(0.85)" },
  { id: "contrast", css: "contrast(1.35)" },
  { id: "brightness", css: "brightness(1.2)" },
  { id: "saturate", css: "saturate(1.6)" },
  { id: "warm", css: "sepia(0.35) saturate(1.3) brightness(1.05)" },
  { id: "cool", css: "hue-rotate(195deg) saturate(1.1)" },
  { id: "fade", css: "contrast(0.85) brightness(1.1) saturate(0.75)" },
  { id: "mono-high", css: "grayscale(1) contrast(1.4) brightness(1.05)" },
];

export function getFilterCss(filterId: PhotoFilterId = "none"): string {
  return PHOTO_FILTERS.find((item) => item.id === filterId)?.css ?? "none";
}
