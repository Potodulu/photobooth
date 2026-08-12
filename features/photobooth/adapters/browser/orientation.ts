import type { DeviceOrientation } from "@/features/photobooth/domain";

export type { DeviceOrientation };

export type OrientationState = {
  orientation: DeviceOrientation;
  angle: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isMobile: boolean;
  /** Always false — forced rotate gate removed. Kept for backward compat. */
  isBlocked: boolean;
};

const ORIENTATION_DEBOUNCE_MS = 120;

/** Phone-sized touch devices; tablets (768px+ short edge) are excluded. */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const minScreen = Math.min(window.screen.width, window.screen.height);
  const touch = window.matchMedia("(pointer: coarse)").matches;
  return touch && minScreen <= 767;
}

/**
 * Pure resolver for device orientation.
 * Prefer screen.orientation type/angle; fall back to viewport aspect.
 */
export function resolveDeviceOrientation(input: {
  type?: string | null;
  angle?: number | null;
  viewportWidth: number;
  viewportHeight: number;
}): { orientation: DeviceOrientation; angle: number } {
  const angle =
    typeof input.angle === "number" && Number.isFinite(input.angle)
      ? ((input.angle % 360) + 360) % 360
      : null;

  const type = input.type ?? null;
  if (type?.startsWith("portrait")) {
    return { orientation: "portrait", angle: angle ?? 0 };
  }
  if (type === "landscape-primary") {
    return {
      orientation: angle === 270 ? "landscape-right" : "landscape-left",
      angle: angle ?? 90,
    };
  }
  if (type === "landscape-secondary") {
    return {
      orientation: angle === 90 ? "landscape-left" : "landscape-right",
      angle: angle ?? 270,
    };
  }
  if (type?.startsWith("landscape")) {
    if (angle === 270) {
      return { orientation: "landscape-right", angle };
    }
    return { orientation: "landscape-left", angle: angle ?? 90 };
  }

  if (angle === 90) return { orientation: "landscape-left", angle };
  if (angle === 270) return { orientation: "landscape-right", angle };
  if (angle === 0 || angle === 180) {
    return { orientation: "portrait", angle: angle ?? 0 };
  }

  const isPortraitViewport = input.viewportHeight >= input.viewportWidth;
  return {
    orientation: isPortraitViewport ? "portrait" : "landscape-left",
    angle: angle ?? (isPortraitViewport ? 0 : 90),
  };
}

export function isPortraitOrientation(): boolean {
  if (typeof window === "undefined") return false;
  return readLiveOrientation().isPortrait;
}

function readLiveOrientation(): OrientationState {
  const screenOrientation = window.screen.orientation;
  const resolved = resolveDeviceOrientation({
    type: screenOrientation?.type,
    angle: screenOrientation?.angle,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  });
  const isPortrait = resolved.orientation === "portrait";
  return {
    orientation: resolved.orientation,
    angle: resolved.angle,
    isPortrait,
    isLandscape: !isPortrait,
    isMobile: isMobileDevice(),
    isBlocked: false,
  };
}

const SERVER_ORIENTATION_STATE: OrientationState = {
  orientation: "landscape-left",
  angle: 90,
  isPortrait: false,
  isLandscape: true,
  isMobile: false,
  isBlocked: false,
};

let cachedSnapshot: OrientationState = SERVER_ORIENTATION_STATE;

function sameOrientationState(a: OrientationState, b: OrientationState) {
  return (
    a.orientation === b.orientation &&
    a.angle === b.angle &&
    a.isPortrait === b.isPortrait &&
    a.isLandscape === b.isLandscape &&
    a.isMobile === b.isMobile &&
    a.isBlocked === b.isBlocked
  );
}

function refreshOrientationSnapshot(): OrientationState {
  if (typeof window === "undefined") return SERVER_ORIENTATION_STATE;
  const next = readLiveOrientation();
  if (sameOrientationState(cachedSnapshot, next)) return cachedSnapshot;
  cachedSnapshot = next;
  return cachedSnapshot;
}

export function getOrientationState(): OrientationState {
  return refreshOrientationSnapshot();
}

const listeners = new Set<() => void>();
let listenerCount = 0;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function notifyOrientationListeners() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    refreshOrientationSnapshot();
    listeners.forEach((listener) => listener());
  }, ORIENTATION_DEBOUNCE_MS);
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

  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

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
