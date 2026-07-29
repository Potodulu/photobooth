import { layoutService } from "@/features/photobooth/services/api";
import { useLayoutStore, useSessionStore } from "@/features/photobooth/stores";

export async function loadLayouts() {
  const store = useLayoutStore.getState();
  store.setLoading(true);
  store.setError(null);
  try {
    const layouts = await layoutService.list();
    store.setLayouts(layouts);
    return layouts;
  } catch (error) {
    store.setError(
      error instanceof Error ? error.message : "Failed to load layouts",
    );
    throw error;
  } finally {
    store.setLoading(false);
  }
}

export function selectLayout(layoutId: string) {
  useLayoutStore.getState().selectLayout(layoutId);
  useSessionStore.getState().setStep("camera");
}
