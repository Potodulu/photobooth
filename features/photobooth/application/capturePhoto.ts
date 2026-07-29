import {
  createId,
  MAX_CAPTURE_TAKES,
  RECORD_DURATION_MS,
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
    // Still first, then 10s video — update recording countdown while recording
    const durationMs = RECORD_DURATION_MS;
    captureStore.setRecording(true, Math.ceil(durationMs / 1000));

    const countdownTimer = window.setInterval(() => {
      const current = useCaptureStore.getState().recordingRemaining;
      if (current === null) return;
      if (current <= 1) {
        useCaptureStore.getState().setRecording(true, 0);
        return;
      }
      useCaptureStore.getState().setRecording(true, current - 1);
    }, 1000);

    try {
      const { capture, blob, videoBlob } =
        await captureService.captureFromVideo(video, {
          recordVideo: true,
          durationMs,
        });
      const objectUrl = URL.createObjectURL(blob);
      const videoUrl = videoBlob ? URL.createObjectURL(videoBlob) : null;
      captureStore.addCapture(capture, objectUrl, videoUrl);
      return capture;
    } finally {
      window.clearInterval(countdownTimer);
      captureStore.setRecording(false, null);
    }
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
