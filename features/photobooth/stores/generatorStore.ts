import { create } from "zustand";
import type {
  GeneratedResult,
  SlotAssignment,
} from "@/features/photobooth/domain";

type GeneratorState = {
  slotAssignments: SlotAssignment[];
  previewUrl: string | null;
  result: GeneratedResult | null;
  isGenerating: boolean;
  downloadProgress: number;
  error: string | null;
  setSlotAssignments: (slotAssignments: SlotAssignment[]) => void;
  assignSlot: (slotId: string, captureId: string) => void;
  clearSlot: (slotId: string) => void;
  setPreviewUrl: (previewUrl: string | null) => void;
  setResult: (result: GeneratedResult | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setDownloadProgress: (downloadProgress: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  slotAssignments: [],
  previewUrl: null,
  result: null,
  isGenerating: false,
  downloadProgress: 0,
  error: null,
  setSlotAssignments: (slotAssignments) => set({ slotAssignments }),
  assignSlot: (slotId, captureId) => {
    const rest = get().slotAssignments.filter((item) => item.slotId !== slotId);
    set({ slotAssignments: [...rest, { slotId, captureId }] });
  },
  clearSlot: (slotId) =>
    set({
      slotAssignments: get().slotAssignments.filter(
        (item) => item.slotId !== slotId,
      ),
    }),
  setPreviewUrl: (previewUrl) => {
    const prev = get().previewUrl;
    if (prev && prev !== previewUrl) URL.revokeObjectURL(prev);
    set({ previewUrl });
  },
  setResult: (result) => set({ result }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setDownloadProgress: (downloadProgress) => set({ downloadProgress }),
  setError: (error) => set({ error }),
  reset: () => {
    const prev = get().previewUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      slotAssignments: [],
      previewUrl: null,
      result: null,
      isGenerating: false,
      downloadProgress: 0,
      error: null,
    });
  },
}));
