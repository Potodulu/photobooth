"use client";

import * as React from "react";
import { hasRole } from "@/config/dashboard/roles";
import { useAuth } from "@/hooks/useAuth";
import type { RoleCode } from "@/types";
import { PageLoading } from "@/components/shared/PageLoading";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type RoleGuardProps = {
  roles: RoleCode[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
  const { role, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <PageLoading message="Memeriksa akses..." />;
  }

  if (!isAuthenticated || !hasRole(role, roles)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Akses ditolak</CardTitle>
            <CardDescription>
              Kamu belum punya izin buat buka halaman ini. Hubungi admin kalau
              ini keliru ya.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
