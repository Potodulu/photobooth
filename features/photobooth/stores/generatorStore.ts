import { create } from "zustand";
import type {
  GeneratedBlob,
  GeneratedResult,
  SlotAssignment,
} from "@/features/photobooth/domain";

type GeneratorState = {
  slotAssignments: SlotAssignment[];
  previewLiveUrl: string | null;
  pngOutput: GeneratedBlob | null;
  gifOutput: GeneratedBlob | null;
  liveOutput: GeneratedBlob | null;
  result: GeneratedResult | null;
  isGenerating: boolean;
  downloadProgress: number;
  error: string | null;
  setSlotAssignments: (slotAssignments: SlotAssignment[]) => void;
  assignSlot: (slotId: string, captureId: string) => void;
  clearSlot: (slotId: string) => void;
  updateSlotPan: (slotId: string, panX: number, panY: number) => void;
  setPreviewLiveUrl: (previewLiveUrl: string | null) => void;
  setOutputs: (outputs: {
    png: GeneratedBlob;
    gif: GeneratedBlob;
    live: GeneratedBlob;
  }) => void;
  setResult: (result: GeneratedResult | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setDownloadProgress: (downloadProgress: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

function clampPan(value: number) {
  return Math.max(-1, Math.min(1, value));
}

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  slotAssignments: [],
  previewLiveUrl: null,
  pngOutput: null,
  gifOutput: null,
  liveOutput: null,
  result: null,
  isGenerating: false,
  downloadProgress: 0,
  error: null,
  setSlotAssignments: (slotAssignments) => set({ slotAssignments }),
  assignSlot: (slotId, captureId) => {
    const rest = get().slotAssignments.filter((item) => item.slotId !== slotId);
    set({
      slotAssignments: [...rest, { slotId, captureId, panX: 0, panY: 0 }],
    });
  },
  clearSlot: (slotId) =>
    set({
      slotAssignments: get().slotAssignments.filter(
        (item) => item.slotId !== slotId,
      ),
    }),
  updateSlotPan: (slotId, panX, panY) => {
    set({
      slotAssignments: get().slotAssignments.map((item) =>
        item.slotId === slotId
          ? { ...item, panX: clampPan(panX), panY: clampPan(panY) }
          : item,
      ),
    });
  },
  setPreviewLiveUrl: (previewLiveUrl) => {
    const prev = get().previewLiveUrl;
    if (prev && prev !== previewLiveUrl) URL.revokeObjectURL(prev);
    set({ previewLiveUrl });
  },
  setOutputs: ({ png, gif, live }) =>
    set({ pngOutput: png, gifOutput: gif, liveOutput: live }),
  setResult: (result) => set({ result }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setDownloadProgress: (downloadProgress) => set({ downloadProgress }),
  setError: (error) => set({ error }),
  reset: () => {
    const prev = get().previewLiveUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      slotAssignments: [],
      previewLiveUrl: null,
      pngOutput: null,
      gifOutput: null,
      liveOutput: null,
      result: null,
      isGenerating: false,
      downloadProgress: 0,
      error: null,
    });
  },
}));
