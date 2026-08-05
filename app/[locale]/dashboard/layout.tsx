import type { ReactNode } from "react";
import { AuthGuard } from "@/components/module/auth/AuthGuard";
import { RoleGuard } from "@/components/module/auth/RoleGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ROLES } from "@/config/dashboard/roles";

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <RoleGuard roles={[ROLES.ADMIN]}>
        <DashboardLayout>{children}</DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
