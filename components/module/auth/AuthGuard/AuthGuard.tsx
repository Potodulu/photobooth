"use client";

import * as React from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useAuth } from "@/hooks/useAuth";
import { PageLoading } from "@/components/shared/PageLoading";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(
        `${ROUTES.LOGIN}?redirect=${encodeURIComponent(pathname)}`,
      );
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return <PageLoading message="Menyiapkan dashboard..." />;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
