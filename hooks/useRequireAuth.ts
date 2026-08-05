"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useAuth } from "@/hooks/useAuth";

export function useRequireAuth() {
  const { isAuthenticated, isLoading, user, role, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`${ROUTES.LOGIN}?redirect=${redirect}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return { isAuthenticated, isLoading, user, role, status };
}
