"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { filterMenuByRole } from "@/config/dashboard/menu.config";
import { ROUTES } from "@/constants/route";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/libs/cn";
import { APP_NAME } from "@/libs/constants";

export function DashboardSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const { role } = useAuth();
  const pathname = usePathname();
  const items = filterMenuByRole(role);

  return (
    <aside
      className={cn(
        "border-border bg-background flex h-full w-64 flex-col border-r-2",
        className,
      )}
    >
      <div className="border-border flex h-14 items-center border-b-2 px-4">
        <Link
          href={ROUTES.DASHBOARD.ROOT}
          className="font-display text-lg font-bold tracking-tight"
          onClick={onNavigate}
        >
          {APP_NAME}
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === ROUTES.DASHBOARD.ROOT
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
