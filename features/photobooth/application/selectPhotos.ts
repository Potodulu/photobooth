import type { SlotAssignment } from "@/features/photobooth/domain";
import {
  useGeneratorStore,
  useLayoutStore,
  useSessionStore,
} from "@/features/photobooth/stores";

export function assignCaptureToSlot(slotId: string, captureId: string) {
  useGeneratorStore.getState().assignSlot(slotId, captureId);
}

export function clearSlotAssignment(slotId: string) {
  useGeneratorStore.getState().clearSlot(slotId);
}

export function resetSlotAssignments() {
  useGeneratorStore.getState().setSlotAssignments([]);
}

export function updateSlotPan(slotId: string, panX: number, panY: number) {
  useGeneratorStore.getState().updateSlotPan(slotId, panX, panY);
}

export function autoFillSlots(captureIds: string[]) {
  const layoutId = useLayoutStore.getState().selectedLayoutId;
  const layout = useLayoutStore
    .getState()
    .layouts.find((item) => item.id === layoutId);
  if (!layout || captureIds.length === 0) return;

  const assignments: SlotAssignment[] = layout.slots.map((slot, index) => ({
    slotId: slot.id,
    captureId: captureIds[index % captureIds.length],
    panX: 0,
    panY: 0,
  }));

  useGeneratorStore.getState().setSlotAssignments(assignments);
}

export function confirmPhotoSelection() {
  const layoutId = useLayoutStore.getState().selectedLayoutId;
  const layout = useLayoutStore
    .getState()
    .layouts.find((item) => item.id === layoutId);
  const assignments = useGeneratorStore.getState().slotAssignments;

  if (!layout) {
    throw new Error("Layout not selected");
  }
  if (assignments.length !== layout.slots.length) {
    throw new Error(`Select exactly ${layout.slots.length} photos`);
  }

  useSessionStore.getState().setStep("preview");
}
