import {
  purgeAllDemoStorage,
  purgeExpired,
} from "@/features/photobooth/adapters/browser/retention";
import {
  useCameraStore,
  useCaptureStore,
  useFrameStore,
  useGeneratorStore,
  useLayoutStore,
  useSessionStore,
} from "@/features/photobooth/stores";

export async function resetClientSessionState() {
  useLayoutStore.getState().reset();
  useFrameStore.getState().reset();
  useCaptureStore.getState().reset();
  useGeneratorStore.getState().reset();
  useCameraStore.getState().reset();
  useSessionStore.getState().resetSession();
}

/** Fresh /online visit: drop expired then wipe all demo storage. */
export async function prepareTryEntry() {
  await purgeExpired();
  await purgeAllDemoStorage();
  await resetClientSessionState();
}

export async function purgeAfterDownloadOrCancel() {
  await purgeAllDemoStorage();
  await resetClientSessionState();
}
