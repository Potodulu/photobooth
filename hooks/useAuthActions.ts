"use client";

import { useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useAuthStore } from "@/stores/authStore";
import type { LoginPayload, RegisterPayload } from "@/types";

export function useAuthActions() {
  const router = useRouter();
  const loginAction = useAuthStore((s) => s.login);
  const registerAction = useAuthStore((s) => s.register);
  const logoutAction = useAuthStore((s) => s.logout);

  const login = useCallback(
    async (payload: LoginPayload, redirectTo?: string) => {
      await loginAction(payload);
      router.replace(redirectTo || ROUTES.DASHBOARD.ROOT);
    },
    [loginAction, router],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await registerAction(payload);
      router.replace(ROUTES.DASHBOARD.ROOT);
    },
    [registerAction, router],
  );

  const logout = useCallback(async () => {
    await logoutAction();
    router.replace(ROUTES.LOGIN);
  }, [logoutAction, router]);

  return { login, register, logout };
}
