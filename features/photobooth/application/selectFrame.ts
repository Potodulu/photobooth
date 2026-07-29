import { frameService } from "@/features/photobooth/services/api";
import {
  useFrameStore,
  useLayoutStore,
  useSessionStore,
} from "@/features/photobooth/stores";

export async function loadFramesForSelectedLayout() {
  const layoutId = useLayoutStore.getState().selectedLayoutId;
  const store = useFrameStore.getState();
  if (!layoutId) {
    store.setFrames([]);
    return [];
  }

  store.setLoading(true);
  store.setError(null);
  try {
    const frames = await frameService.listForLayout(layoutId);
    store.setFrames(frames);
    if (!store.selectedFrameId && frames[0]) {
      store.selectFrame(frames[0].id);
    }
    return frames;
  } catch (error) {
    store.setError(
      error instanceof Error ? error.message : "Failed to load frames",
    );
    throw error;
  } finally {
    store.setLoading(false);
  }
}

export function selectFrame(frameId: string) {
  useFrameStore.getState().selectFrame(frameId);
}

export function confirmFrame() {
  useSessionStore.getState().setStep("select");
}
