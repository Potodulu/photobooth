"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useAuth } from "@/hooks/useAuth";
import { PageLoading } from "@/components/shared/PageLoading";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace(ROUTES.DASHBOARD.ROOT);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <PageLoading message="Memeriksa sesi..." />;
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
