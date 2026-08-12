import {
  FLASH_DURATION_MS,
  MAX_CAPTURE_TAKES,
  createId,
  type CaptureOrientation,
  type CaptureSet,
} from "@/features/photobooth/domain";
import { getOrientationState } from "@/features/photobooth/adapters/browser/orientation";
import { captureService } from "@/features/photobooth/services/api";
import {
  useCameraStore,
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
  onCaptureOrientationFrozen?: (frozen: CaptureOrientation) => void;
};

/** Record during countdown, flash, then still — clip length follows countdown. */
export async function takePhoto(
  video: HTMLVideoElement,
  hooks: TakePhotoHooks,
) {
  const captureStore = useCaptureStore.getState();
  if (captureStore.captures.length >= captureStore.maxTakes) {
    throw new Error(`Maximum ${MAX_CAPTURE_TAKES} captures reached`);
  }

  const cameraStream = captureService.getCameraStream(video);
  if (!cameraStream) {
    throw new Error("Camera stream unavailable");
  }

  const mirrored = useCameraStore.getState().mirrorEnabled;
  const orientation = getOrientationState();
  const frozenOrientation: CaptureOrientation = {
    deviceOrientation: orientation.orientation,
    angle: orientation.angle,
    mirrored,
  };
  hooks.onCaptureOrientationFrozen?.(frozenOrientation);

  const seconds = captureStore.countdownSeconds;
  captureStore.setCapturing(true);
  const recorder = captureService.createClipRecorder();
  // ponytail: RAF canvas mirror stream — upgrade to OffscreenCanvas worker if perf hurts
  const mirroredSource = mirrored
    ? captureService.createMirroredStream(video)
    : null;

  try {
    recorder.start(mirroredSource?.stream ?? cameraStream);
    captureStore.setRecording(true, seconds);

    for (let value = seconds; value >= 1; value -= 1) {
      hooks.onCountdown(value);
      captureStore.setRecording(true, value);
      await sleep(1000);
    }
    hooks.onCountdown(null);

    hooks.onFlash(true);
    await sleep(FLASH_DURATION_MS);

    const still = await captureService.captureStill(video, { mirrored });
    const recorded = await recorder.stop();
    mirroredSource?.stop();

    hooks.onFlash(false);
    captureStore.setRecording(false, null);

    const videoBlob = recorded.blob.size > 0 ? recorded.blob : null;
    const { capture, blob } = await captureService.saveCapture({
      still: still.blob,
      width: still.width,
      height: still.height,
      videoBlob,
      durationMs: recorded.durationMs,
      captureOrientation: frozenOrientation,
    });

    const objectUrl = URL.createObjectURL(blob);
    const videoUrl = videoBlob ? URL.createObjectURL(videoBlob) : null;
    captureStore.addCapture(capture, objectUrl, videoUrl);
    return capture;
  } catch (error) {
    hooks.onFlash(false);
    hooks.onCountdown(null);
    captureStore.setRecording(false, null);
    mirroredSource?.stop();
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
  session.setStep("select");
  return set;
}
