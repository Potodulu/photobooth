"use client";

import * as React from "react";
import { setUnauthorizedHandler } from "@/libs/api";
import { tokenStorage } from "@/libs/api";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";

const REFRESH_CHECK_INTERVAL_MS = 30_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const clear = useAuthStore((s) => s.clear);
  const status = useAuthStore((s) => s.status);

  React.useEffect(() => {
    setUnauthorizedHandler(() => {
      clear();
    });
    void hydrate();
    return () => setUnauthorizedHandler(null);
  }, [hydrate, clear]);

  React.useEffect(() => {
    if (status !== "authenticated") return;

    const tick = async () => {
      if (!tokenStorage.isExpiringSoon()) return;
      try {
        await authService.refresh();
      } catch {
        clear();
      }
    };

    const id = window.setInterval(() => {
      void tick();
    }, REFRESH_CHECK_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [status, clear]);

  return <>{children}</>;
}
