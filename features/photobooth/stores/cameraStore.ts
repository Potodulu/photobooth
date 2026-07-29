import { create } from "zustand";

export type CameraPermission = "idle" | "prompting" | "granted" | "denied";

type CameraState = {
  permission: CameraPermission;
  facingMode: "user" | "environment";
  isStreaming: boolean;
  error: string | null;
  setPermission: (permission: CameraPermission) => void;
  setFacingMode: (facingMode: "user" | "environment") => void;
  setStreaming: (isStreaming: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useCameraStore = create<CameraState>((set) => ({
  permission: "idle",
  facingMode: "user",
  isStreaming: false,
  error: null,
  setPermission: (permission) => set({ permission }),
  setFacingMode: (facingMode) => set({ facingMode }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      permission: "idle",
      facingMode: "user",
      isStreaming: false,
      error: null,
    }),
}));
