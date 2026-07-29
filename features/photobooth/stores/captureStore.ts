import { create } from "zustand";
import { MAX_CAPTURE_TAKES, type Capture } from "@/features/photobooth/domain";

type CaptureState = {
  captures: Capture[];
  objectUrls: Record<string, string>;
  activeCaptureSetId: string | null;
  maxTakes: number;
  isCapturing: boolean;
  addCapture: (capture: Capture, objectUrl: string) => void;
  removeCapture: (id: string) => void;
  setCaptureSetId: (id: string | null) => void;
  setCapturing: (isCapturing: boolean) => void;
  reset: () => void;
};

export const useCaptureStore = create<CaptureState>((set, get) => ({
  captures: [],
  objectUrls: {},
  activeCaptureSetId: null,
  maxTakes: MAX_CAPTURE_TAKES,
  isCapturing: false,
  addCapture: (capture, objectUrl) => {
    const { captures, maxTakes, objectUrls } = get();
    if (captures.length >= maxTakes) return;
    set({
      captures: [...captures, capture],
      objectUrls: { ...objectUrls, [capture.id]: objectUrl },
    });
  },
  removeCapture: (id) => {
    const { captures, objectUrls } = get();
    const url = objectUrls[id];
    if (url) URL.revokeObjectURL(url);
    const nextUrls = { ...objectUrls };
    delete nextUrls[id];
    set({
      captures: captures.filter((item) => item.id !== id),
      objectUrls: nextUrls,
    });
  },
  setCaptureSetId: (activeCaptureSetId) => set({ activeCaptureSetId }),
  setCapturing: (isCapturing) => set({ isCapturing }),
  reset: () => {
    const { objectUrls } = get();
    Object.values(objectUrls).forEach((url) => URL.revokeObjectURL(url));
    set({
      captures: [],
      objectUrls: {},
      activeCaptureSetId: null,
      isCapturing: false,
    });
  },
}));
