"use client";

import { Link } from "@/i18n/navigation";
import { filterMenuByRole } from "@/config/dashboard/menu.config";
import { ROUTES } from "@/constants/route";
import { useAuth } from "@/hooks/useAuth";
import { getUserDisplayName } from "@/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export function DashboardHomePage() {
  const { user, role } = useAuth();
  const items = filterMenuByRole(role).filter(
    (item) => item.href !== ROUTES.DASHBOARD.ROOT,
  );
  const displayName = getUserDisplayName(user) || "Admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Halo, {displayName}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Siap kelola layout dan frame buat pengalaman foto yang seru.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
