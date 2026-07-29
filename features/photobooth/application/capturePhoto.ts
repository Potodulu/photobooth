import {
  COUNTDOWN_SECONDS,
  FLASH_DURATION_MS,
  MAX_CAPTURE_TAKES,
  createId,
  type CaptureSet,
} from "@/features/photobooth/domain";
import { captureService } from "@/features/photobooth/services/api";
import {
  useCaptureStore,
  useLayoutStore,
  useSessionStore,
} from "@/features/photobooth/stores";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type TakePhotoHooks = {
  onCountdown: (value: number | null) => void;
  onFlash: (active: boolean) => void;
};

/** Record during countdown, flash, then still — one 10s window. */
export async function takePhoto(
  video: HTMLVideoElement,
  hooks: TakePhotoHooks,
) {
  const captureStore = useCaptureStore.getState();
  if (captureStore.captures.length >= captureStore.maxTakes) {
    throw new Error(`Maximum ${MAX_CAPTURE_TAKES} captures reached`);
  }

  const stream = captureService.getCameraStream(video);
  if (!stream) {
    throw new Error("Camera stream unavailable");
  }

  captureStore.setCapturing(true);
  const recorder = captureService.createClipRecorder();

  try {
    recorder.start(stream);
    captureStore.setRecording(true, COUNTDOWN_SECONDS);

    for (let value = COUNTDOWN_SECONDS; value >= 1; value -= 1) {
      hooks.onCountdown(value);
      captureStore.setRecording(true, value);
      await sleep(1000);
    }
    hooks.onCountdown(null);

    hooks.onFlash(true);
    await sleep(FLASH_DURATION_MS);

    const still = await captureService.captureStill(video);
    const recorded = await recorder.stop();

    hooks.onFlash(false);
    captureStore.setRecording(false, null);

    const videoBlob = recorded.blob.size > 0 ? recorded.blob : null;
    const { capture, blob } = await captureService.saveCapture({
      still: still.blob,
      width: still.width,
      height: still.height,
      videoBlob,
      durationMs: recorded.durationMs,
    });

    const objectUrl = URL.createObjectURL(blob);
    const videoUrl = videoBlob ? URL.createObjectURL(videoBlob) : null;
    captureStore.addCapture(capture, objectUrl, videoUrl);
    return capture;
  } catch (error) {
    hooks.onFlash(false);
    hooks.onCountdown(null);
    captureStore.setRecording(false, null);
    try {
      await recorder.stop();
    } catch {
      // ignore stop errors after failure
    }
    throw error;
  } finally {
    captureStore.setCapturing(false);
  }
}

export async function retakeLastPhoto() {
  const captureStore = useCaptureStore.getState();
  const last = captureStore.captures.at(-1);
  if (!last) return;
  await captureService.deleteCapture(last.id);
  captureStore.removeCapture(last.id);
}

export async function persistCaptureSet() {
  const session = useSessionStore.getState();
  const layout = useLayoutStore.getState();
  const captureStore = useCaptureStore.getState();

  if (!session.experienceId || !layout.selectedLayoutId) {
    throw new Error("Session incomplete");
  }

  const set: CaptureSet = {
    id: captureStore.activeCaptureSetId ?? createId(),
    experienceId: session.experienceId,
    layoutId: layout.selectedLayoutId,
    captureIds: captureStore.captures.map((item) => item.id),
    maxTakes: MAX_CAPTURE_TAKES,
    createdAt: new Date().toISOString(),
  };

  await captureService.saveCaptureSet(set);
  captureStore.setCaptureSetId(set.id);
  session.setStep("frame");
  return set;
}
