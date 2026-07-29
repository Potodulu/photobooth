import type {
  Capture,
  CaptureSet,
  Experience,
  Frame,
  GeneratedResult,
  Layout,
} from "@/features/photobooth/domain";

export interface ExperienceRepository {
  list(): Promise<Experience[]>;
  getById(id: string): Promise<Experience | null>;
  getBySlug(slug: string): Promise<Experience | null>;
}

export interface LayoutRepository {
  list(): Promise<Layout[]>;
  getById(id: string): Promise<Layout | null>;
}

export interface FrameRepository {
  list(): Promise<Frame[]>;
  getById(id: string): Promise<Frame | null>;
  listForLayout(layoutId: string): Promise<Frame[]>;
}

export interface CaptureRepository {
  saveCapture(
    capture: Capture,
    blob: Blob,
    videoBlob?: Blob | null,
  ): Promise<Capture>;
  getCapture(id: string): Promise<Capture | null>;
  getCaptureBlob(blobKey: string): Promise<Blob | null>;
  listCaptures(ids: string[]): Promise<Capture[]>;
  deleteCapture(id: string): Promise<void>;
  saveCaptureSet(set: CaptureSet): Promise<CaptureSet>;
  getCaptureSet(id: string): Promise<CaptureSet | null>;
}

export interface GeneratorRepository {
  saveResult(result: GeneratedResult, blobs: Blob[]): Promise<GeneratedResult>;
  getResult(id: string): Promise<GeneratedResult | null>;
  getResultBlob(key: string): Promise<Blob | null>;
}
