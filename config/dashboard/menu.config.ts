import {
  Frame,
  LayoutTemplate,
  LayoutDashboard,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/route";
import { ROLES } from "@/config/dashboard/roles";
import type { RoleCode } from "@/types";

export type DashboardMenuItem = {
  title: string;
  icon: LucideIcon;
  href: string;
  roles: RoleCode[];
};

export const dashboardMenuConfig: DashboardMenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: ROUTES.DASHBOARD.ROOT,
    roles: [ROLES.ADMIN],
  },
  {
    title: "Layouts",
    icon: LayoutTemplate,
    href: ROUTES.DASHBOARD.LAYOUTS,
    roles: [ROLES.ADMIN],
  },
  {
    title: "Frames",
    icon: Frame,
    href: ROUTES.DASHBOARD.FRAMES,
    roles: [ROLES.ADMIN],
  },
  {
    title: "Profile",
    icon: UserRound,
    href: ROUTES.DASHBOARD.PROFILE,
    roles: [ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.USER],
  },
];

export function filterMenuByRole(role: RoleCode | null): DashboardMenuItem[] {
  if (!role) return [];
  return dashboardMenuConfig.filter((item) => item.roles.includes(role));
}
