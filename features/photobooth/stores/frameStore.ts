import { create } from "zustand";
import type { Frame } from "@/features/photobooth/domain";

type FrameState = {
  frames: Frame[];
  selectedFrameId: string | null;
  isLoading: boolean;
  error: string | null;
  setFrames: (frames: Frame[]) => void;
  selectFrame: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useFrameStore = create<FrameState>((set) => ({
  frames: [],
  selectedFrameId: null,
  isLoading: false,
  error: null,
  setFrames: (frames) => set({ frames }),
  selectFrame: (selectedFrameId) => set({ selectedFrameId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      frames: [],
      selectedFrameId: null,
      isLoading: false,
      error: null,
    }),
}));
