import { create } from "zustand";
import {
  COUNTDOWN_OPTIONS,
  DEFAULT_COUNTDOWN_SECONDS,
  MAX_CAPTURE_TAKES,
  type Capture,
  type CountdownSeconds,
  type PhotoFilterId,
} from "@/features/photobooth/domain";

type CaptureState = {
  captures: Capture[];
  objectUrls: Record<string, string>;
  videoUrls: Record<string, string>;
  activeCaptureSetId: string | null;
  maxTakes: number;
  countdownSeconds: CountdownSeconds;
  isCapturing: boolean;
  isRecording: boolean;
  recordingRemaining: number | null;
  filterId: PhotoFilterId;
  addCapture: (
    capture: Capture,
    objectUrl: string,
    videoUrl?: string | null,
  ) => void;
  removeCapture: (id: string) => void;
  setCaptureSetId: (id: string | null) => void;
  setCountdownSeconds: (seconds: number) => void;
  setCapturing: (isCapturing: boolean) => void;
  setRecording: (isRecording: boolean, remaining?: number | null) => void;
  setFilterId: (filterId: PhotoFilterId) => void;
  reset: () => void;
};

export const useCaptureStore = create<CaptureState>((set, get) => ({
  captures: [],
  objectUrls: {},
  videoUrls: {},
  activeCaptureSetId: null,
  maxTakes: MAX_CAPTURE_TAKES,
  countdownSeconds: DEFAULT_COUNTDOWN_SECONDS,
  isCapturing: false,
  isRecording: false,
  recordingRemaining: null,
  filterId: "none",
  addCapture: (capture, objectUrl, videoUrl) => {
    const { captures, maxTakes, objectUrls, videoUrls } = get();
    if (captures.length >= maxTakes) return;
    set({
      captures: [...captures, capture],
      objectUrls: { ...objectUrls, [capture.id]: objectUrl },
      videoUrls: videoUrl
        ? { ...videoUrls, [capture.id]: videoUrl }
        : videoUrls,
    });
  },
  removeCapture: (id) => {
    const { captures, objectUrls, videoUrls } = get();
    const url = objectUrls[id];
    const videoUrl = videoUrls[id];
    if (url) URL.revokeObjectURL(url);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const nextUrls = { ...objectUrls };
    const nextVideos = { ...videoUrls };
    delete nextUrls[id];
    delete nextVideos[id];
    set({
      captures: captures.filter((item) => item.id !== id),
      objectUrls: nextUrls,
      videoUrls: nextVideos,
    });
  },
  setCaptureSetId: (activeCaptureSetId) => set({ activeCaptureSetId }),
  setCountdownSeconds: (seconds) => {
    if (!(COUNTDOWN_OPTIONS as readonly number[]).includes(seconds)) return;
    set({ countdownSeconds: seconds as CountdownSeconds });
  },
  setCapturing: (isCapturing) => set({ isCapturing }),
  setRecording: (isRecording, remaining = null) =>
    set({ isRecording, recordingRemaining: remaining }),
  setFilterId: (filterId) => set({ filterId }),
  reset: () => {
    const { objectUrls, videoUrls } = get();
    Object.values(objectUrls).forEach((url) => URL.revokeObjectURL(url));
    Object.values(videoUrls).forEach((url) => URL.revokeObjectURL(url));
    set({
      captures: [],
      objectUrls: {},
      videoUrls: {},
      activeCaptureSetId: null,
      countdownSeconds: DEFAULT_COUNTDOWN_SECONDS,
      isCapturing: false,
      isRecording: false,
      recordingRemaining: null,
      filterId: "none",
    });
  },
}));
