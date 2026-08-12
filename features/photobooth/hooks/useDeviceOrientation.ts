"use client";

import { useSyncExternalStore } from "react";
import {
  getOrientationState,
  getServerOrientationState,
  subscribeOrientation,
} from "@/features/photobooth/adapters/browser/orientation";

export function useDeviceOrientation() {
  return useSyncExternalStore(
    subscribeOrientation,
    getOrientationState,
    getServerOrientationState,
  );
}

/** @deprecated Prefer useDeviceOrientation — alias kept for existing imports. */
export function useOrientationGuard() {
  return useDeviceOrientation();
}
