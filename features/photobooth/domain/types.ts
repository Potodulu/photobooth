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
  preview: string;
  canvasSize: Size;
  slots: LayoutSlot[];
  aspectRatio: string;
  outputSize: Size;
  padding: number;
  background: string;
  compatibleFrameIds: string[];
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

export type Capture = {
  id: string;
  blobKey: string;
  width: number;
  height: number;
  createdAt: string;
  mimeType: string;
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
};

export type CompositeInput = {
  layout: Layout;
  frame: Frame | null;
  slotImages: Array<{ slotId: string; image: CanvasImageSource }>;
};

export type DownloadManifest = {
  layoutId: string;
  frameId: string | null;
  createdAt: string;
  version: string;
};

export const PHOTOBOOTH_MANIFEST_VERSION = "1.0.0";
export const MAX_CAPTURE_TAKES = 10;
