import {
  createId,
  MAX_CAPTURE_TAKES,
  type CaptureSet,
} from "@/features/photobooth/domain";
import { captureService } from "@/features/photobooth/services/api";
import {
  useCaptureStore,
  useLayoutStore,
  useSessionStore,
} from "@/features/photobooth/stores";

export async function takePhoto(video: HTMLVideoElement) {
  const captureStore = useCaptureStore.getState();
  if (captureStore.captures.length >= captureStore.maxTakes) {
    throw new Error(`Maximum ${MAX_CAPTURE_TAKES} captures reached`);
  }

  captureStore.setCapturing(true);
  try {
    const { capture, blob } = await captureService.captureFromVideo(video);
    const objectUrl = URL.createObjectURL(blob);
    captureStore.addCapture(capture, objectUrl);
    return capture;
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
