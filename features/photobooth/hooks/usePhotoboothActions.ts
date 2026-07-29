"use client";

import { useCallback, useState } from "react";
import {
  cancelGuestSession,
  confirmFrame,
  confirmPhotoSelection,
  downloadResultZip,
  generatePreview,
  loadFramesForSelectedLayout,
  loadLayouts,
  persistCaptureSet,
  prepareTryEntry,
  retakeLastPhoto,
  selectFrame,
  selectLayout,
  startGuestSession,
  takePhoto,
  assignCaptureToSlot,
  clearSlotAssignment,
  autoFillSlots,
} from "@/features/photobooth/application";

export function usePhotoboothActions() {
  const [busy, setBusy] = useState(false);

  const run = useCallback(async <T>(fn: () => Promise<T>) => {
    setBusy(true);
    try {
      return await fn();
    } finally {
      setBusy(false);
    }
  }, []);

  const startGuestSessionAction = useCallback(
    () => run(startGuestSession),
    [run],
  );
  const cancelGuestSessionAction = useCallback(
    () => run(cancelGuestSession),
    [run],
  );
  const prepareTryEntryAction = useCallback(() => run(prepareTryEntry), [run]);
  const loadLayoutsAction = useCallback(() => run(loadLayouts), [run]);
  const takePhotoAction = useCallback(
    (video: HTMLVideoElement) => run(() => takePhoto(video)),
    [run],
  );
  const retakeLastPhotoAction = useCallback(() => run(retakeLastPhoto), [run]);
  const persistCaptureSetAction = useCallback(
    () => run(persistCaptureSet),
    [run],
  );
  const loadFramesAction = useCallback(
    () => run(loadFramesForSelectedLayout),
    [run],
  );
  const generatePreviewAction = useCallback(() => run(generatePreview), [run]);
  const downloadResultZipAction = useCallback(
    () => run(downloadResultZip),
    [run],
  );

  return {
    busy,
    startGuestSession: startGuestSessionAction,
    cancelGuestSession: cancelGuestSessionAction,
    prepareTryEntry: prepareTryEntryAction,
    loadLayouts: loadLayoutsAction,
    selectLayout,
    takePhoto: takePhotoAction,
    retakeLastPhoto: retakeLastPhotoAction,
    persistCaptureSet: persistCaptureSetAction,
    loadFramesForSelectedLayout: loadFramesAction,
    selectFrame,
    confirmFrame,
    assignCaptureToSlot,
    clearSlotAssignment,
    autoFillSlots,
    confirmPhotoSelection,
    generatePreview: generatePreviewAction,
    downloadResultZip: downloadResultZipAction,
  };
}
