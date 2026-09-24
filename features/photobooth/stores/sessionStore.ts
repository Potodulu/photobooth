import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { sessionService } from "@/services/session";
import type { SessionDto } from "@/types";

export type OnlineStep =
  | "warning"
  | "layout"
  | "camera"
  | "select"
  | "preview"
  | "gallery";

type SessionState = {
  sessionId: string | null;
  sessionCode: string | null;
  experienceId: string | null;
  step: OnlineStep;
  acceptedStorageWarning: boolean;
  isInitializing: boolean;
  acceptStorageWarning: () => void;
  setExperienceId: (id: string) => void;
  setStep: (step: OnlineStep) => void;
  setSession: (session: SessionDto) => void;
  setSessionId: (id: string | null) => void;
  initOnlineSession: () => Promise<string | null>;
  resetSession: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      sessionCode: null,
      experienceId: null,
      step: "warning",
      acceptedStorageWarning: false,
      isInitializing: false,
      acceptStorageWarning: () =>
        set({ acceptedStorageWarning: true, step: "layout" }),
      setExperienceId: (experienceId) => set({ experienceId }),
      setStep: (step) => set({ step }),
      setSession: (session: SessionDto) =>
        set({
          sessionId: session.id,
          sessionCode: session.short_code,
        }),
      setSessionId: (sessionId: string | null) => set({ sessionId }),
      initOnlineSession: async () => {
        const { sessionId, isInitializing } = get();
        if (sessionId) {
          return sessionId;
        }
        if (isInitializing) {
          return null;
        }
        set({ isInitializing: true });
        try {
          const session = await sessionService.create({
            visibility: "public",
            expires_in_minutes: 60,
          });
          set({
            sessionId: session.id,
            sessionCode: session.short_code,
            isInitializing: false,
          });
          return session.id;
        } catch (error) {
          console.error("Failed to create online session:", error);
          set({ isInitializing: false });
          return null;
        }
      },
      resetSession: () =>
        set({
          sessionId: null,
          sessionCode: null,
          experienceId: null,
          step: "warning",
          acceptedStorageWarning: false,
          isInitializing: false,
        }),
    }),
    {
      name: "potodulu-online-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionCode: state.sessionCode,
        acceptedStorageWarning: state.acceptedStorageWarning,
        step: state.step,
      }),
    },
  ),
);
