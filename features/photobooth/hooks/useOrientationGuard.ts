"use client";

import { useSyncExternalStore } from "react";
import {
  getOrientationState,
  getServerOrientationState,
  subscribeOrientation,
} from "@/features/photobooth/adapters/browser/orientation";

export function useOrientationGuard() {
  return useSyncExternalStore(
    subscribeOrientation,
    getOrientationState,
    getServerOrientationState,
  );
}
