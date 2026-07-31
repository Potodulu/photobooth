import { create } from "zustand";

export type TryStep = "warning" | "layout" | "camera" | "select" | "preview";

type SessionState = {
  experienceId: string | null;
  step: TryStep;
  acceptedStorageWarning: boolean;
  acceptStorageWarning: () => void;
  setExperienceId: (id: string) => void;
  setStep: (step: TryStep) => void;
  resetSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  experienceId: null,
  step: "warning",
  acceptedStorageWarning: false,
  acceptStorageWarning: () =>
    set({ acceptedStorageWarning: true, step: "layout" }),
  setExperienceId: (experienceId) => set({ experienceId }),
  setStep: (step) => set({ step }),
  resetSession: () =>
    set({
      experienceId: null,
      step: "warning",
      acceptedStorageWarning: false,
    }),
}));
