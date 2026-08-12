import { create } from "zustand";
import { tokenStorage } from "@/libs/api";
import { authService } from "@/services/auth";
import type {
  AuthStatus,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  RoleCode,
} from "@/types";

type AuthState = {
  user: AuthUser | null;
  role: RoleCode | null;
  status: AuthStatus;
  setUser: (user: AuthUser | null) => void;
  setStatus: (status: AuthStatus) => void;
  clear: () => void;
  hydrate: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  status: "idle",

  setUser: (user) =>
    set({
      user,
      role: user?.role_code ?? null,
      status: user ? "authenticated" : "guest",
    }),

  setStatus: (status) => set({ status }),

  clear: () => {
    tokenStorage.clear();
    set({ user: null, role: null, status: "guest" });
  },

  hydrate: async () => {
    set({ status: "loading" });
    const stored = tokenStorage.get();

    if (!stored) {
      set({ user: null, role: null, status: "guest" });
      return;
    }

    try {
      if (tokenStorage.isExpiringSoon()) {
        await authService.refresh();
      }
      const user = await authService.getMe();
      set({
        user,
        role: user.role_code,
        status: "authenticated",
      });
    } catch {
      tokenStorage.clear();
      set({ user: null, role: null, status: "guest" });
    }
  },

  login: async (payload) => {
    set({ status: "loading" });
    try {
      const { user } = await authService.login(payload);
      const me = await authService.getMe().catch(() => user);
      set({
        user: me,
        role: me.role_code,
        status: "authenticated",
      });
      return me;
    } catch (error) {
      set({ user: null, role: null, status: "guest" });
      throw error;
    }
  },

  register: async (payload) => {
    set({ status: "loading" });
    try {
      const { user } = await authService.register(payload);
      const me = await authService.getMe().catch(() => user);
      set({
        user: me,
        role: me.role_code,
        status: "authenticated",
      });
      return me;
    } catch (error) {
      set({ user: null, role: null, status: "guest" });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, role: null, status: "guest" });
    }
  },
}));
