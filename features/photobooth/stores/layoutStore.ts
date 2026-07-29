import { create } from "zustand";
import type { Layout } from "@/features/photobooth/domain";

type LayoutState = {
  layouts: Layout[];
  selectedLayoutId: string | null;
  isLoading: boolean;
  error: string | null;
  setLayouts: (layouts: Layout[]) => void;
  selectLayout: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  layouts: [],
  selectedLayoutId: null,
  isLoading: false,
  error: null,
  setLayouts: (layouts) => set({ layouts }),
  selectLayout: (selectedLayoutId) => set({ selectedLayoutId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      layouts: [],
      selectedLayoutId: null,
      isLoading: false,
      error: null,
    }),
}));
