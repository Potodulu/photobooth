import { create } from "zustand";
import type {
  GeneratedBlob,
  GeneratedResult,
  SlotAssignment,
} from "@/features/photobooth/domain";

type GeneratorState = {
  slotAssignments: SlotAssignment[];
  previewUrl: string | null;
  previewGifUrl: string | null;
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
  setPreviewGifUrl: (previewGifUrl: string | null) => void;
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

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  slotAssignments: [],
  previewUrl: null,
  previewGifUrl: null,
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
    set({ slotAssignments: [...rest, { slotId, captureId }] });
  },
  clearSlot: (slotId) =>
    set({
      slotAssignments: get().slotAssignments.filter(
        (item) => item.slotId !== slotId,
      ),
    }),
  setPreviewGifUrl: (previewGifUrl) => {
    const prev = get().previewGifUrl;
    if (prev && prev !== previewGifUrl) URL.revokeObjectURL(prev);
    set({ previewGifUrl, previewUrl: previewGifUrl });
  },
  setOutputs: ({ png, gif, live }) =>
    set({ pngOutput: png, gifOutput: gif, liveOutput: live }),
  setResult: (result) => set({ result }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setDownloadProgress: (downloadProgress) => set({ downloadProgress }),
  setError: (error) => set({ error }),
  reset: () => {
    const prev = get().previewGifUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      slotAssignments: [],
      previewUrl: null,
      previewGifUrl: null,
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
