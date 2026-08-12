import {
  browserCaptureRepository,
  browserCameraAdapter,
  captureFrameFromVideo,
  ClipRecorder,
  createMirroredStream,
} from "@/features/photobooth/adapters/browser";
import {
  createId,
  type Capture,
  type CaptureOrientation,
  type CaptureSet,
} from "@/features/photobooth/domain";

/** Today: browser repo. Later: HTTP endpoints. */
export const captureService = {
  createClipRecorder(): ClipRecorder {
    return new ClipRecorder();
  },

  getCameraStream(video?: HTMLVideoElement): MediaStream | null {
    const fromAdapter = browserCameraAdapter.getStream();
    if (fromAdapter) return fromAdapter;
    if (video?.srcObject instanceof MediaStream) return video.srcObject;
    return null;
  },

  captureStill(video: HTMLVideoElement, options?: { mirrored?: boolean }) {
    return captureFrameFromVideo(video, options);
  },

  createMirroredStream(video: HTMLVideoElement, fps?: number) {
    return createMirroredStream(video, fps);
  },

  async saveCapture(params: {
    still: Blob;
    width: number;
    height: number;
    videoBlob: Blob | null;
    durationMs?: number;
    captureOrientation?: CaptureOrientation;
  }): Promise<{ capture: Capture; blob: Blob; videoBlob: Blob | null }> {
    const id = createId();
    const videoBlobKey = params.videoBlob ? `capture-video-${id}` : null;
    const capture: Capture = {
      id,
      blobKey: `capture-blob-${id}`,
      videoBlobKey,
      width: params.width,
      height: params.height,
      createdAt: new Date().toISOString(),
      mimeType: params.still.type || "image/jpeg",
      durationMs: params.videoBlob ? params.durationMs : undefined,
      captureOrientation: params.captureOrientation,
    };
    await browserCaptureRepository.saveCapture(
      capture,
      params.still,
      params.videoBlob,
    );
    return {
      capture,
      blob: params.still,
      videoBlob: params.videoBlob,
    };
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
