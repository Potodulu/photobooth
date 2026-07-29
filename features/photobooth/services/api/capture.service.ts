import {
  browserCaptureRepository,
  captureFrameFromVideo,
} from "@/features/photobooth/adapters/browser";
import {
  createId,
  type Capture,
  type CaptureSet,
} from "@/features/photobooth/domain";

/** Today: browser repo. Later: HTTP endpoints. */
export const captureService = {
  async captureFromVideo(
    video: HTMLVideoElement,
  ): Promise<{ capture: Capture; blob: Blob }> {
    const { blob, width, height } = await captureFrameFromVideo(video);
    const id = createId();
    const capture: Capture = {
      id,
      blobKey: `capture-blob-${id}`,
      width,
      height,
      createdAt: new Date().toISOString(),
      mimeType: blob.type || "image/jpeg",
    };
    await browserCaptureRepository.saveCapture(capture, blob);
    return { capture, blob };
  },

  getCapture(id: string): Promise<Capture | null> {
    return browserCaptureRepository.getCapture(id);
  },

  getCaptureBlob(blobKey: string): Promise<Blob | null> {
    return browserCaptureRepository.getCaptureBlob(blobKey);
  },

  listCaptures(ids: string[]): Promise<Capture[]> {
    return browserCaptureRepository.listCaptures(ids);
  },

  deleteCapture(id: string): Promise<void> {
    return browserCaptureRepository.deleteCapture(id);
  },

  saveCaptureSet(set: CaptureSet): Promise<CaptureSet> {
    return browserCaptureRepository.saveCaptureSet(set);
  },

  getCaptureSet(id: string): Promise<CaptureSet | null> {
    return browserCaptureRepository.getCaptureSet(id);
  },
};
