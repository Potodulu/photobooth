export type OrientationState = {
  isPortrait: boolean;
  isMobile: boolean;
  isBlocked: boolean;
};

/** Phone-sized touch devices; tablets (768px+ short edge) are excluded. */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const minScreen = Math.min(window.screen.width, window.screen.height);
  const touch = window.matchMedia("(pointer: coarse)").matches;
  return touch && minScreen <= 767;
}

export function isPortraitOrientation(): boolean {
  if (typeof window === "undefined") return false;
  const type = window.screen.orientation?.type;
  if (type) {
    return type.startsWith("portrait");
  }
  return window.innerHeight > window.innerWidth;
}

const SERVER_ORIENTATION_STATE: OrientationState = {
  isPortrait: false,
  isMobile: false,
  isBlocked: false,
};

let cachedSnapshot: OrientationState = SERVER_ORIENTATION_STATE;

function refreshOrientationSnapshot(): OrientationState {
  const isMobile = isMobileDevice();
  const isPortrait = isPortraitOrientation();
  const isBlocked = isMobile && isPortrait;

  if (
    cachedSnapshot.isPortrait === isPortrait &&
    cachedSnapshot.isMobile === isMobile &&
    cachedSnapshot.isBlocked === isBlocked
  ) {
    return cachedSnapshot;
  }

  cachedSnapshot = { isPortrait, isMobile, isBlocked };
  return cachedSnapshot;
}

export function getOrientationState(): OrientationState {
  return refreshOrientationSnapshot();
}

const listeners = new Set<() => void>();
let listenerCount = 0;

function notifyOrientationListeners() {
  refreshOrientationSnapshot();
  listeners.forEach((listener) => listener());
}

function attachOrientationListeners() {
  if (typeof window === "undefined") return;

  window.screen.orientation?.addEventListener(
    "change",
    notifyOrientationListeners,
  );
  window.addEventListener("resize", notifyOrientationListeners);
  window.addEventListener("orientationchange", notifyOrientationListeners);
  window
    .matchMedia("(pointer: coarse)")
    .addEventListener("change", notifyOrientationListeners);
}

function detachOrientationListeners() {
  if (typeof window === "undefined") return;

  window.screen.orientation?.removeEventListener(
    "change",
    notifyOrientationListeners,
  );
  window.removeEventListener("resize", notifyOrientationListeners);
  window.removeEventListener("orientationchange", notifyOrientationListeners);
  window
    .matchMedia("(pointer: coarse)")
    .removeEventListener("change", notifyOrientationListeners);
}

export function subscribeOrientation(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  if (listenerCount === 0) attachOrientationListeners();
  listenerCount += 1;
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    listenerCount -= 1;
    if (listenerCount === 0) detachOrientationListeners();
  };
}

export function getServerOrientationState(): OrientationState {
  return SERVER_ORIENTATION_STATE;
}
