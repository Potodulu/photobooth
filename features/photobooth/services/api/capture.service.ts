import {
  browserCaptureRepository,
  browserCameraAdapter,
  captureFrameFromVideo,
  recordClip,
} from "@/features/photobooth/adapters/browser";
import {
  createId,
  RECORD_DURATION_MS,
  type Capture,
  type CaptureSet,
} from "@/features/photobooth/domain";

/** Today: browser repo. Later: HTTP endpoints. */
export const captureService = {
  async captureFromVideo(
    video: HTMLVideoElement,
    options?: { recordVideo?: boolean; durationMs?: number },
  ): Promise<{ capture: Capture; blob: Blob; videoBlob: Blob | null }> {
    const { blob, width, height } = await captureFrameFromVideo(video);
    const id = createId();
    const durationMs = options?.durationMs ?? RECORD_DURATION_MS;
    let videoBlob: Blob | null = null;
    let videoBlobKey: string | null = null;

    if (options?.recordVideo !== false) {
      const stream = browserCameraAdapter.getStream() ?? video.srcObject;
      if (stream instanceof MediaStream) {
        const recorded = await recordClip(stream, durationMs);
        videoBlob = recorded.blob;
        videoBlobKey = `capture-video-${id}`;
      }
    }

    const capture: Capture = {
      id,
      blobKey: `capture-blob-${id}`,
      videoBlobKey,
      width,
      height,
      createdAt: new Date().toISOString(),
      mimeType: blob.type || "image/jpeg",
      durationMs: videoBlob ? durationMs : undefined,
    };
    await browserCaptureRepository.saveCapture(capture, blob, videoBlob);
    return { capture, blob, videoBlob };
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
