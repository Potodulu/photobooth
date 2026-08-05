"use client";

import { Menu } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import {
  Breadcrumb,
  type BreadcrumbItem,
} from "@/components/shared/Breadcrumb";
import { UserMenu } from "@/components/module/dashboard/UserMenu";
import { Button } from "@/components/ui/Button";

const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  layouts: "Layouts",
  frames: "Frames",
  profile: "Profile",
  new: "Buat baru",
  edit: "Edit",
};

function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  // strip locale if present (en)
  const withoutLocale =
    segments[0] === "en" || segments[0] === "id" ? segments.slice(1) : segments;

  const items: BreadcrumbItem[] = [];
  let acc = "";

  for (let i = 0; i < withoutLocale.length; i++) {
    const seg = withoutLocale[i]!;
    acc += `/${seg}`;
    const isIdLike = /^[0-9a-f-]{8,}$/i.test(seg);
    const label = isIdLike ? "Detail" : (LABEL_MAP[seg] ?? seg);

    items.push({
      label,
      href: i < withoutLocale.length - 1 ? acc : undefined,
    });
  }

  if (items.length === 0) {
    return [{ label: "Dashboard", href: ROUTES.DASHBOARD.ROOT }];
  }

  return items;
}

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <header className="border-border flex h-14 items-center justify-between gap-3 border-b-2 px-4">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Buka menu"
        >
          <Menu className="size-5" />
        </Button>
        <Breadcrumb items={breadcrumbs} />
      </div>
      <UserMenu />
    </header>
  );
}
