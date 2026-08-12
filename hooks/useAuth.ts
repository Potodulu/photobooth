"use client";

import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const status = useAuthStore((s) => s.status);
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "idle" || status === "loading";

  return { user, role, status, isAuthenticated, isLoading };
}
