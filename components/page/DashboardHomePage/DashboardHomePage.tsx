"use client";

import { Link } from "@/i18n/navigation";
import { Camera, Frame, LayoutTemplate, Users } from "lucide-react";
import { filterMenuByRole } from "@/config/dashboard/menu.config";
import { ROUTES } from "@/constants/route";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/queries";
import { getUserDisplayName } from "@/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export function DashboardHomePage() {
  const { user, role } = useAuth();
  const { data: stats } = useDashboardStats();
  const items = filterMenuByRole(role).filter(
    (item) => item.href !== ROUTES.DASHBOARD.ROOT,
  );
  const displayName = getUserDisplayName(user) || "Admin";

  const statCards = [
    {
      title: "Sesi Hari Ini",
      value: stats?.total_sessions_today ?? "-",
      icon: Camera,
      description: "Total sesi foto berlangsung hari ini",
    },
    {
      title: "Frame Aktif",
      value: stats?.active_frames_count ?? "-",
      icon: Frame,
      description: "Jumlah frame aktif di sistem",
    },
    {
      title: "Layout Aktif",
      value: stats?.active_layouts_count ?? "-",
      icon: LayoutTemplate,
      description: "Jumlah layout aktif di sistem",
    },
    {
      title: "User Aktif",
      value: stats?.active_users_count ?? "-",
      icon: Users,
      description: "Jumlah user terdaftar di sistem",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Halo, {displayName}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Ringkasan aktivitas dan menu kelola photobooth.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="text-muted-foreground size-4" />
              </CardHeader>
              <div className="px-6 pt-0 pb-6">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground text-xs">
                  {stat.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="font-display text-lg font-bold">
          Navigasi Quick Access
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="h-full transition-transform hover:-translate-y-0.5">
                  <CardHeader>
                    <div className="bg-primary/10 text-primary mb-2 flex size-10 items-center justify-center rounded-xl">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>Buka halaman {item.title}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
